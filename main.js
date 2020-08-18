const https = require('https');

const fetch = require('node-fetch');
const {Client, MessageAttachment, DMChannel} = require('discord.js');

const client = new Client();
const riotUrlEventData = "https://127.0.0.1:2999/liveclientdata/eventdata"
const riotUrlPlayerList = "https://127.0.0.1:2999/liveclientdata/playerlist"

const token = require("./token.js");
const { resolve } = require('path');

// setup an agent to make unsecure calls with locally
const unsecureAgent = new https.Agent({
    rejectUnauthorized: false
})

let songDispatcher;
let voiceConnection;

// Global state
let eventNumber = 0;

client.on('ready', () => {
    console.log('Starting...');
});

client.on('message', async msg => {
    if(msg.content === '!oof') {
        const attatchment = new MessageAttachment('./media/damage.gif');
        msg.reply('OOF', attatchment);
    } else if (msg.channel.name === 'fun-facts'){
        // fun facts moderation
        var message = msg.content.trim().toLowerCase();
        if(!message.startsWith("fun fact:")){
            msg.delete({'reason': 'Not a fun fact!'});
            var dmChannel = new DMChannel(client, {'recipient': msg.author})
            dmChannel.send("test");
        }
    } else if (msg.content === '!join') {
        if(!msg.guild) return;

        if (msg.member.voice.channel) {
            voiceConnection = await msg.member.voice.channel.join();
            WatchaSay();
        }
        else {
            message.reply('You need to join a voice channel first!');
        }
    } else if(msg.content === "!leave") {
        voiceConnection.disconnect();
    }

})

function PlaySong(voiceConnection) {

}

function FindRespawnValue() {

    try {
        return new Promise((resolve, reject) => {
            fetch(riotUrlPlayerList, {
                agent: unsecureAgent
            })
                .then( res => {
                    if(!res.ok) {
                        throw new Error('League game not detected.')
                    }
                    return res.json()
                } )
                .then( players => {
                    for (var i = 0; i < players.length; i++ ) {
                        if (players[i].summonerName === "Via Dominus") {
                            resolve(players[i].respawnTimer.toString());
                        }
                    }
                    reject("Couldn't find respawn value");
                })
                .catch(error => {
                    console.log(error.code);
                });
        });
    } catch (error) {
        console.log(error);
    }
}

client.login(token);
setInterval(function() {
    try {
        let promise = FindRespawnValue();
        promise.then(value => console.log(value));
    } catch (error) {
        console.log(error);
    }
}, 1000);
