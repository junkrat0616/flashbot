const Command = require('../../classes/Command')
const ClientError = require('../../classes/ClientError')

class DeactivateCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'deactivate',
      aliases: ['deact', '비활성화', 'ㅇㄷㅁㅊ샾ㅁㅅㄷ', 'ㅇㄷㅁㅊㅅ', 'qlghkftjdghk'],
      description: 'commands.deactivate.DESC:Deactivate this bot on the server',
      group: 'activation',
      userPerms: ['ADMINISTRATOR'],
      guildOnly: true,
      requireDB: true
    })
  }

  async run (client, msg, args, locale) {
    if (!await client.db.isRegisteredGuild(msg.guild.id)) return Command.pleaseRegisterGuild(this, msg, locale)

    const t = client.locale.t
    let result, done = false

    const mcFilter = (msg, author) => {
      if (author === msg.author.id) {
        if (msg.content.toLowerCase() !== 'yes' && msg.content.toLowerCase() !== 'no') return false
        else if (msg.content.toLowerCase() === 'yes') result = true
        else if (msg.content.toLowerCase() === 'no') result = false
        return true
      } else return false
    }

    const rcFilter = (reaction, user) => {
      if (user.id === msg.author.id) {
        if (reaction.emoji.name !== '✅' && reaction.emoji.name !== '❌') return false
        else if (reaction.emoji.name === '✅') result = true
        else if (reaction.emoji.name === '❌') result = false
        return true
      } else return false
    }

    const botMsg = await msg.channel.send(t('commands.deactivate.title', locale) + '\n\n' +
      t('commands.deactivate.content', locale) + '\n\n' +
      t('commands.deactivate.confirm', locale)
    )

    try {
      await botMsg.react('✅')
      await botMsg.react('❌')
    } catch (err) {
      await msg.channel.send(t('commands.deactivate.reactFail', locale, t('perms.ADD_REACTION', locale))
      )
    }

    const pend = (c) => {
      if(done) return

      if (c.size > 0 && result) {
        this.agree(msg, locale)
      } else {
        this.deny(msg, locale)
      }

      done = true
    }

    // Message Collector
    const mc = msg.channel.awaitMessages((m) => mcFilter(m, msg.author.id), { time: 15000, max: 1 }).then(pend)

    // Reaction Collector
    const rc = botMsg.awaitReactions(rcFilter, { time: 15000, max: 1 }).then(pend)
  }

  async agree (msg, locale) {
    // Deactivation

    // DB
    const db = this._client.db
    switch (db.type) {
      case 'mysql':
      case 'pg':
        await this.dbHandle(msg, locale)
        break
      case 'json':
        if (db.obj.guild[msg.guild.id] == null) db.obj.guild[msg.guild.id] = { activated: false }
        else db.obj.guild[msg.guild.id].activated = false
    }

    // Done!
    this._client.logger.log('Command / Deactivate', `[Bot Deactivation] ${msg.author.tag} (${msg.member.nickname}) deactivated the bot in ${msg.guild.name}`)
    await msg.channel.send(this._client.locale.t('commands.deactivate.agree', locale))
  }

  async deny (msg, locale) {
    await msg.channel.send(this._client.locale.t('commands.deactivate.deny', locale))
  }

  async dbHandle (msg, locale) {
    const db = msg.client.db
    const guildID = msg.guild.id

    try {
      const dbData = await db.knex('guilds').select('id').where('id', guildID)
      if (dbData.length < 1) {
        await db.knex('guilds').insert({
          id: guildID,
          locale: 'en_US',
          activated: false
        })
      } else await db.knex('guilds').where('id', guildID).update({ activated: false })
    } catch (err) {
      throw new ClientError('Cannot connect to the database. Please wait a few minutes and try again.').report(msg, locale)
    }
  }
}

module.exports = DeactivateCommand
