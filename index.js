const Discord = require('discord.js');
const { prefix, meaning_of_life } = require('./config/config.json');
const Dotenv = require('dotenv');
Dotenv.config();

const token = process.env.TOKEN;

const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('Bleep bloop. Marvin is reporting for duty. ')
})

bot.on('message', message => {
    
});

bot.login(token);