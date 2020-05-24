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
            var winner = {id: '263657383840972802',username: 'rsletta'} // this.userList[winnerIndex];
            // Save winner to winner list
            fs.readFile(__basedir + '/no_track/winners.json', 'utf8', function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    var winnerlist =  JSON.parse(data);
                    winnerlist.push({timestamp: new Date(), winner: winner});
                    let savefile = JSON.stringify(winnerlist);
                    fs.writeFile(__basedir + '/no_track/winners.json',savefile, 'utf8', function () {

                    });
                }

            })
            // Remove winner from user list
            this.userList.slice(winnerIndex, 1);
            // Write new user list to disk, in case of crash
            let newUserlist = JSON.stringify(this.userList);
            fs.writeFile(__basedir + '/no_track/userlist.json', newUserlist, 'utf8', function () {

            });           

            this.channel.send(`Bleep bloop. Can you guess what time it is? It's raffletime! 🎫 And the winner is ${guild.member(winner.id)}! 🎉`); 
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
    if (userlist.length !== guild.members.length) {
        channel.send(`No users in list. Loading from server.`); 
        userlist = await guild.members.map((m) => {return {id: m.user.id, username: m.user.username}});
        var savefile = JSON.stringify(userlist);
        fs.writeFile(__basedir + '/no_track/userlist.json',savefile, 'utf8', function () {

        });
        console.log(userlist);
        channel.send(`Users loaded. Starting sequence.`); 
        sequence.start(channel,userlist, guild);
    } else {
        channel.send(`Users loaded. Starting sequence.`); 
        sequence.start(channel,userlist, guild);
    }
  }
}