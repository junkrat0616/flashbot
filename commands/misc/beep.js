/**
 * @name beep.js
 * @description beep - boop
 */

var i18n = require('i18n')

const Command = require('../../classes/Command')

class BeepCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'beep',
      description: 'boop'
    })
  }

  async run (client, msg, _args, locale) {
    return await msg.channel.send(client.locale.t('commands.beep.reply:boop', locale))
  }
}

module.exports = BeepCommand
