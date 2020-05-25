var fs = require('fs');

let config = {
    interval: {},
    userlist: [],
    channel: {},
    guild: {},
    timer: 15000
}

let sequence = function (channel, userlist, guild) {
    config.channel = channel;
    config.userlist = userlist;
    config.guild = guild;
    
    var interval = setInterval(function () {
        // Draw winner
        var winnerIndex = Math.floor(Math.random() * Math.floor(config.userlist.length))
        var winner = config.userlist[winnerIndex]; 
        // Save winner to winner list
        var data = fs.readFileSync(__basedir + '/no_track/winners.json', 'utf8')
        var winnerlist =  JSON.parse(data);
        winnerlist.push({timestamp: new Date(), winner: winner});
        let savefile = JSON.stringify(winnerlist);
        fs.writeFileSync(__basedir + '/no_track/winners.json',savefile, 'utf8');
    
        // Remove winner from user list
        config.userlist.splice(winnerIndex, 1);

        // Write new user list to disk, in case of crash
        let newUserlist = JSON.stringify(config.userlist);
        fs.writeFileSync(__basedir + '/no_track/userlist.json', newUserlist, 'utf8');           
        if (config.channel.id === "680539979667341510") {
            config.channel.send(`Bleep bloop. Testing testing. 🎫 And the winner is ${winner.name}! 🎉`); 
        } else {
            // This is live - send to the lounge
            //this.channel.send(`Bleep bloop. Can you guess what time it is? It's raffletime! 🎫 And the winner is ${guild.member(winner.id)}! 🎉`); 
        }

    }.bind(this), config.timer);  
    config.channel.send(`Bleep bloop. Timer started for ${config.timer} millisecond. Or ${config.timer/1000/60} minutes, as normal people would say.`); 
    return interval;
}

let loadUsers = async function (channel, guild) {
    let userlist = require('../no_track/userlist.json')
    if (userlist.length === 0) {
        channel.send(`No users in list. Loading from server.`); 
        userlist = await guild.members.map((m) => {
            if(m.roles.find(r => r.name === "bot")) {
                console.log(`${m.user.username} is a bot, and can't win!`)
            }  else {
                return {id: m.user.id, username: m.user.username, name: m.user.name}
            }    
        })
        .filter(x => { return x !== undefined});
        var savefile = JSON.stringify(userlist);
        fs.writeFileSync(__basedir + '/no_track/userlist.json',savefile, 'utf8');
        console.log(userlist);
    } 

    return userlist
}
    

module.exports = {
  async start(message, args) {
    const guild = message.guild;
    const channel = message.channel;
    channel.send(`Hello ${message.author.username}. Let's do this!`); 

    channel.send(`Loading users...`); 
    let userlist = await loadUsers(channel, guild);
    console.log(userlist)
    channel.send(`Users loaded. Starting sequence.`); 
    config.interval = sequence(channel,userlist, guild);
  },
  stop: function (message, args) {
    const channel = message.channel;
    console.log(`After ${config.interval}`)
    clearInterval(config.interval);
    channel.send(`Timer cleared.`); 
    console.log(`After ${this.interval}`)
  }  
}