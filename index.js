
/*
Main bot script
Make sure settings.json exists in root dir.
*/
const Discord = require('discord.js');
const token = require('./settings.json').disc_token;
const request = require('request');
const bot = new Discord.Client();
const API_KEY = require('./settings.json').youtube_api_key;

var query;
var videoId;
var link;
var uri;
var titel;

bot.on("ready", () => {
    console.log("Bot is online.");
});

bot.on("message", msg => {
    var msgText = msg.content;
    console.log(msgText);
    if (msgText.charAt(0) == "/") {
        var msgArray = msgText.split(" ");

        if (msgArray[0] =="/meOnline") {
            msg.reply("Yes, you are Online!", {tts:true});
            console.log("Sent message: 'You are online'");
        }

        if (msgArray[0] == "/help") {
            msg.channel.sendMessage("```⸻⸻⸻ • /help • ⸻⸻⸻\n\n/yt [query]    ⸻ Searches YouTube\n\n/r/[subreddit] ⸻ Links to a subreddit\n\n/wiki [query]  ⸻ Searches Wikipedia```")
        }
        if (msgArray[0] =="/bot") {
            msg.channel.sendMessage("Online");
            console.log("Debug: Sent message: 'Online'.");
        }
        if (msgArray[0].includes("/r/")) {
            msg.channel.sendMessage(`https://www.reddit.com${msgArray[0]}`)
        }
        if (msgArray[0] == "/yt") {
            msgArray.shift();
            var query = msgArray.join(" ");
            console.log(query);
            var uri = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&&q=${query}%7C&regionCode=SE&type=video&key=${API_KEY}`;
            request({uri: uri, method: "GET"},
                function(error, response, body) {
                    var bodyJ = JSON.parse(body);
                    try {
                        var j = bodyJ.items[0].id.videoId;
                        var videoId = String(j);
                        var link = "https://www.youtube.com/watch?v=" + videoId;
                        console.log(link);
                        msg.channel.sendMessage(link);
                    }
                    catch(err) {
                        console.log("error: " + err);
                        msg.reply("Invalid query, try again.");
                    }

            });
        }
        if (msgArray[0] == "/wiki") {
            msgArray.shift();
            var query = msgArray.join(" ");
            console.log(query);
            var uri = `https://sv.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${query}`;
            request({uri: uri, method: "GET"},
              function(error, response, body) {
                var bodyJ = JSON.parse(body);
                try {
                  var titel = bodyJ.query.search[0].title.replace(" ", "_");
                  msg.channel.sendMessage(`https://sv.wikipedia.org/wiki/${titel}`);
                }
                catch(err) {
                  console.log(err);
                  msg.reply("Invalid query, try again.");
                }
            });
        }
      }
});


bot.login(token);
