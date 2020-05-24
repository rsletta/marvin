const swag = require('../lib/swaglib');

module.exports = {
    name: 'swag',
    description: 'Start Discord raffle',
    execute(message, args) {
        if(message.member.roles.find(r => r.name === "admin")) {
            swag.start(message, args);
        } else {
            message.channel.send(`Computer says no.`);
        }
        
    }
}