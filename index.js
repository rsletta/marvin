require('dotenv').config();;
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, meaning_of_life } = require('./config/config.json');

const token = process.env.TOKEN;

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

global.__basedir = __dirname;

// Read available commands from files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // Adds command to commandd collection, with command name as key
    bot.commands.set(command.name, command);
}

// Log when started and ready
bot.on('ready', () => {
    console.log('Bleep bloop. Marvin is reporting for duty. ')
})

bot.on('message', message => {
    // Just ignore everything not relevant
    if (!message.content.startsWith(prefix) || message.author.bot) return;  
    
    // Prepare message for handling
	const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!bot.commands.has(commandName)) {
        if (commandName === meaning_of_life) {
            message.channel.send('You have found the answer to the ultimate question of life, the universe and everything! 🤖');
            return;
        } 
        message.reply('I don\'t know how to do that! 😢');
    } else {
        const command = bot.commands.get(commandName);

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command! 😢');
        }
    }
});

bot.login(token);