/**
 * @name serverinfo.js
 * @description 서버 정보 보여주는 명령어
 */

const { MessageEmbed } = require('discord.js')
const moment = require('moment-timezone')
const Command = require('../../classes/Command')

class ServerInfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'serverinfo',
      aliases: ['server-info', '서버정보', 'ㄴㄷㄱㅍㄷ갸ㅜ래', 'ㄴㄷㄱㅍㄷㄱ-ㅑㅜ래', 'tjqjwjdqh'],
      description: 'commands.serverinfo.DESC:Shows current server infomation.',
      group: 'info',
      guildOnly: true
    })
  }

  async run (client, msg, _query, locale) {
    const t = client.locale.t

    let data
    const guild = msg.guild
    const useEmbed = msg.channel.permissionsFor(client.user).has('EMBED_LINKS')

    const users = await guild.members.fetch()
    const userCount = users.filter((m) => !m.user.bot).size
    const botCount = guild.memberCount - userCount
    const textChannelCount = guild.channels.cache.filter((c) => c.type === 'text').size
    const voiceChannelCount = guild.channels.cache.filter((c) => c.type === 'voice').size

    const createdAt = moment(guild.createdAt).tz('Asia/Seoul').format(t('commands.serverinfo.createdAt.value', locale))

    if (useEmbed) {
      data = new MessageEmbed()
        .setTitle(t('commands.serverinfo.title', locale, guild.name))
        .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
        .addField(':desktop: ' + t('commands.serverinfo.name', locale), guild.name, true)
        .addField(':id: ' + t('commands.serverinfo.id', locale), guild.id, true)
        .addField(':bust_in_silhouette: ' + t('commands.serverinfo.owner', locale), '<@' + guild.owner.id + '> ' + guild.owner.user.tag + ' (' + guild.owner.id + ')')
        .addField(':map: ' + t('commands.serverinfo.region', locale), t('regions.' + guild.region, locale) + ' (' + guild.region + ')')
        .addField(':busts_in_silhouette: ' + t('commands.serverinfo.memberCount.title', locale), t('commands.serverinfo.memberCount.value', locale, guild.memberCount))
        .addField(':adult: ' + t('commands.serverinfo.userCount.title', locale), t('commands.serverinfo.userCount.value', locale, userCount), true)
        .addField(':robot: ' + t('commands.serverinfo.botCount.title', locale), t('commands.serverinfo.botCount.value', locale, botCount), true)
        .addField(':tv: ' + t('commands.serverinfo.channelCount.title', locale), t('commands.serverinfo.channelCount.value', locale, guild.channels.cache.size))
        .addField(':keyboard: ' + t('commands.serverinfo.textChannelCount.title', locale), t('commands.serverinfo.textChannelCount.value', locale, textChannelCount), true)
        .addField(':microphone2: ' + t('commands.serverinfo.voiceChannelCount.title', locale), t('commands.serverinfo.voiceChannelCount.value', locale, voiceChannelCount), true)
        .addField(':birthday: ' + t('commands.serverinfo.createdAt.title', locale), createdAt)
    }

    return msg.channel.send(data)
  }
}

module.exports = ServerInfoCommand
