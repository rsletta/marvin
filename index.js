const Discord = require('discord.js');
const Dotenv = require('dotenv');
Dotenv.config();

const token = process.env.TOKEN;

const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('Bleep bloop. Marvin is reporting for duty.')
})

bot.login(token);