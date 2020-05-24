var fs = require('fs');

let sequence = {
    userList: [],
    channel: {},
    guild: {},
    start: function (channel, userlist, guild) {
        this.channel = channel;
        this.userList = userlist;
        this.guild = guild;
        setInterval(function () {
            // Draw winner
            var winnerIndex = Math.floor(Math.random() * Math.floor(this.userList.length))
            var winner = this.userList[winnerIndex];// {id: '263657383840972802',username: 'rsletta'} // 
            // Save winner to winner list
            var data = fs.readFileSync(__basedir + '/no_track/winners.json', 'utf8')
            var winnerlist =  JSON.parse(data);
            winnerlist.push({timestamp: new Date(), winner: winner});
            let savefile = JSON.stringify(winnerlist);
            fs.writeFileSync(__basedir + '/no_track/winners.json',savefile, 'utf8');
       
            // Remove winner from user list
            console.log(this.userList)
            this.userList.splice(winnerIndex, 1);
            console.log(this.userList)
            // Write new user list to disk, in case of crash
            let newUserlist = JSON.stringify(this.userList);
            fs.writeFileSync(__basedir + '/no_track/userlist.json', newUserlist, 'utf8');           
            console.log(winner,guild.member(winner.id))
            //this.channel.send(`Bleep bloop. Can you guess what time it is? It's raffletime! 🎫 And the winner is ${guild.member(winner.id)}! 🎉`); 
        }.bind(this),10000, "seq");       
    }
}

module.exports = {
  async start(message, args) {
    const guild = message.guild;
    const channel = message.channel;
    channel.send(`Hello ${message.author.username}. Let's do this!`); 

    channel.send(`Loading users...`); 
    let userlist = require('../no_track/userlist.json')
    if (userlist.length === 0) {
        channel.send(`No users in list. Loading from server.`); 
        userlist = await guild.members.map((m) => {
            if(m.roles.find(r => r.name === "bot")) {
                console.log(`${m.user.username} is a bot, and can't win!`)
            }  else {
                return {id: m.user.id, username: m.user.username}
            }    
        })
        .filter(x => { return x !== undefined});
        var savefile = JSON.stringify(userlist);
        fs.writeFileSync(__basedir + '/no_track/userlist.json',savefile, 'utf8');
        console.log(userlist);
        channel.send(`Users loaded. Starting sequence.`); 
        sequence.start(channel,userlist, guild);
    } else {
        channel.send(`Users loaded. Starting sequence.`); 
        sequence.start(channel,userlist, guild);
    }
  }
}