const fs = require('fs-extra');
const path = require('path');
const { hasPermission } = require('../func/permissions');
const { checkCooldown } = require('../func/cooldown');
const { log } = require('../logger/logger');
const { getLang } = require('../func/getLang');
const config = require('../config/config.json');

const loadCommands = () => {
  const commands = new Map();
  const commandPath = path.join(__dirname, '../modules/commands');
  const files = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
  for (const file of files) {
    try {
      const command = require(path.join(commandPath, file));
      commands.set(command.config.name, command);
      log('info', getLang('logger.messages.commandLoaded', { name: command.config.name }));
    } catch (error) {
      log('error', getLang('logger.messages.commandError', { file: file, error: error.message }));
    }
  }
  return commands;
};

const handleCommand = async ({ message, args, event, api, Users, Threads, commands }) => {
  try {
    
    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName) || Array.from(commands.values()).find(cmd => cmd.config.aliases?.includes(commandName));
    if (!command) return;


    const userData = Users.get(event.senderID);
    if (userData && userData.isBanned) {
      return api.sendMessage(getLang('messages.userBanned'), event.threadID);
    }

    
    if (global.client.config.adminOnlyMode && !hasPermission(event.senderID, { adminOnly: true })) {
      return api.sendMessage(getLang('permissions.errors.adminOnlyMode'), event.threadID);
    }

    if (!hasPermission(event.senderID, command.config, await api.getThreadInfo(event.threadID))) {
      return api.sendMessage(getLang('permissions.errors.noPermission'), event.threadID);
    }

    if (global.client.config.features.cooldown && !checkCooldown(event.senderID, command.config.name, command.config.countDown)) {
      return api.sendMessage(
        getLang('cooldown.wait', { time: command.config.countDown }), 
        event.threadID
      );
    }

    await command.onStart({ message, args: args.slice(1), event, api, Users, Threads, config: global.client.config });
    log('info', `تم تنفيذ الأمر: ${command.config.name} بواسطة المستخدم ${event.senderID}`);
  } catch (error) {
    log('error', getLang('errors.general', { error: error.message }));
    api.sendMessage(getLang('commands.error'), event.threadID);
  }
};

module.exports = { loadCommands, handleCommand };
