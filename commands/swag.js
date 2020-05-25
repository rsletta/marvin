const swag = require('../lib/swaglib');

module.exports = {
    name: 'swag',
    description: 'Start Discord raffle',
    execute(message, args) {
        if(message.member.roles.find(r => r.name === "admin")) {
            if (args && args[0] === 'start') {
                swag.start(message, args);
            } else if (args && args[0] === 'stop') {
                swag.stop(message, args);
            } else {
                message.channel.send(`Start or stop? You need to tell me. 🤷‍♂️`);
            }
            
        } else {
            message.channel.send(`Computer says no.`);
        }
        
    }
}