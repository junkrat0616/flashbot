const ping = require('./ping');
const _eval = require('./eval');
const args_info = require('./args-info');
const help = require('./help')

module.exports = {
    eval: _eval,
    ping: ping,
    args_info: args_info,
    help: help
};