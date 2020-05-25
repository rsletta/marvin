const swag = require('../lib/rafflelib');

module.exports = {
    name: 'raffle',
    description: 'Start Discord raffle',
    execute(message, args) {
  /*       if (message.author.username === 'NabheetMadan') {
            message.channel.send(`Nice try ${message.author}. Computer says no.`);
            return;
        } */
        if(message.member.roles.find(r => r.name === "admin") && (message.channel.id === '680539979667341510' || message.channel.id === '679820723040288796')) {
            if (args && args[0] === 'start') {
                swag.start(message, args);
            } else if (args && args[0] === 'stop') {
                swag.stop(message, args);
            } else if (args && args[0] === 'winnercount') {
                swag.winnercount(message, args);
            } else {
                message.channel.send(`Start or stop? You need to tell me. 🤷‍♂️`);
            }
            
        } else {
            message.channel.send(`Computer says no.`);
        }
        
    }
}