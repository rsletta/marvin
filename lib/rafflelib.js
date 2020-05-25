var fs = require('fs');

let config = {
    started: false,
    interval: {},
    userlist: [],
    channel: {},
    guild: {},
    timer: 15000,
    winnercount: 0,
    totalprizes: 0,
    prizes: []
}

let sequence = function () {
        var interval = setInterval(function () {    
        // Draw winner
        var winnerIndex = Math.floor(Math.random() * Math.floor(config.userlist.length - 1));
        var prizeIndex = Math.floor(Math.random() * Math.floor(config.prizes.length - 1));
        var winner = config.userlist[winnerIndex]; 
        var prize = config.prizes[prizeIndex];
        // Save winner to winner list
        var data = fs.readFileSync(__basedir + '/no_track/winners.json', 'utf8')
        var winnerlist =  JSON.parse(data);
        winnerlist.push({timestamp: new Date(), winner: winner, prize: prize});
        // add to winnercount
        config.winnercount = config.winnercount + 1;
        let savefile = JSON.stringify(winnerlist);
        fs.writeFileSync(__basedir + '/no_track/winners.json',savefile, 'utf8');
    
        // Remove winner from user list
        config.userlist.splice(winnerIndex, 1);
        // Write new user list to disk, in case of crash
        let newUserlist = JSON.stringify(config.userlist);
        fs.writeFileSync(__basedir + '/no_track/userlist.json', newUserlist, 'utf8');    
        
        // Remove prize from prize list
        config.prizes.splice(prizeIndex,1);
        // Write new prize list to disk
        let newPrizes = JSON.stringify(config.prizes);
        fs.writeFileSync(__basedir + '/no_track/prizes.json', newPrizes, 'utf8');    

        if (config.channel.id === "680539979667341510") {
            config.channel.send(`Bleep bloop. Testing testing. 🎫 The prize this time is ${prize.prize} from ${prize.from}. And the winner is ${winner.name ? winner.name : winner.username}! 🎉`); 
        } else {
            // This is live - send to the lounge
            //this.channel.send(`Bleep bloop. Can you guess what time it is? It's raffletime! 🎫 And the winner is ${guild.member(winner.id)}! 🎉`); 
        }

        // Break if this was the last prize
        console.log(config.winnercount,config.totalprizes)
        if (config.winnercount === config.totalprizes) {
            console.log('No more prizes. Ending the show.')
            clearInterval(config.interval);
            config.started = false;
            config.channel.send(`No more prizes. Raffle stopped.`); 
            return;
        }    
    }.bind(this), config.timer);  
    config.channel.send(`Bleep bloop. Timer started for ${config.timer} millisecond. Or ${config.timer/1000/60} minutes, as normal people would say.`); 
    return interval;
}

let loadUsers = async function () {
    let userlist = require('../no_track/userlist.json')
    if (userlist.length === 0) {
        config.channel.send(`No users in list. Loading from server.`); 
        userlist = await config.guild.members.map((m) => {
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
    if (config.started) {
        config.channel.send(`Already started.`); 
        return;
    }
    config.started = true;
    config.channel = message.channel;
    config.guild = message.guild;
    config.channel.send(`Hello ${message.author.username}. Let's do this!`); 
    config.channel.send(`Loading users...`); 

    // Set winnercount
    let winnerlist = require('../no_track/winners.json')
    console.log('Winners:' + winnerlist.length)
    config.winnercount = 0 //Reset winner count each time, since prizes gets removed, and winners saved. winnerlist.length;

    // Load prizes
    let prizes = require('../no_track/prizes.json');
    config.totalprizes = prizes.length;
    console.log(config.prizes)
    config.prizes = prizes;

    // Load users
    let userlist = await loadUsers();
    config.userlist = userlist;
    console.log(config.userlist)

    // Start the show
    config.channel.send(`Users loaded. Starting sequence.`); 
    config.interval = sequence();
  },
  stop: function (message, args) {
    const channel = message.channel;
    if (!config.started) {
        channel.send(`You must start it first.`); 
        return;
    }
    console.log(`After ${config.interval}`)
    clearInterval(config.interval);
    channel.send(`Raffle stopped.`); 
    config.started = false;
    console.log(`After ${this.interval}`)
    config.started = false;
  },
  winnercount: function (message, args) {
    const channel = message.channel;
    if (!config.started) {
        channel.send(`You must start it first.`); 
        return;
    }
    channel.send(`Winner count: ${config.winnercount}`); 
  }  
}