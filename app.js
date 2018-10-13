const Discord = require('discord.js');
const fs = require('fs');
const DBL = require('dblapi.js');
const BLAPI = require("blapi")

const client = new Discord.Client({ disableEveryone: true })
const dbl = new DBL(process.env.DISCORDBOTS_ORG_TOKEN, client)

const settings = JSON.parse(fs.readFileSync('./settings.json'))
const database = require("./database.js")

const globalCode = require("require-from-url/sync")("https://gleeny.github.io/files/global-bot.js"); // includes commands that are not part of the bot concept, ex. ping, help, eval. Also includes advanced logging, BLAPI keys and more.

client.on('ready', () => {
    
  updateActivity();
  setInterval(() => {
    updateActivity();
  }, 60000)
    
  BLAPI.handle(client, globalCode.blapiKeys, 1);
})

async function updateActivity() {
  let count = await getChannelCount();
  client.user.setActivity("v!info (" + count + " voice channels) [" + (client.shard.id == 0 ? "1" : client.shard.id) + "/" + client.shard.count + "]", { type: "WATCHING" })
}

client.on('voiceStateUpdate', async (oldMember, newMember) => { try {
    let newChannel = newMember.voiceChannel;
    let oldChannel = oldMember.voiceChannel;

    let newChannelID = newChannel ? newChannel.id : "0";
    let oldChannelID = oldChannel ? oldChannel.id : "0";
  
    let newVoice = await getChannel(newChannelID);
    let oldVoice = await getChannel(oldChannelID);

    let newVoiceRole = newMember.guild.roles.get(newVoice.roleid);
    let oldVoiceRole = oldMember.guild.roles.get(oldVoice.roleid);

    if (oldVoiceRole && !newVoiceRole) oldMember.removeRole(oldVoiceRole, "Left " + oldChannel.name);
    if (oldVoiceRole && newVoiceRole && newMember.deaf == oldMember.deaf && oldMember.deaf == false && (oldVoiceRole != newVoiceRole)) { oldMember.removeRole(oldVoiceRole, "Moved from " + oldChannel.name + " to " + newChannel.name); newMember.addRole(newVoiceRole, "Moved from " + oldChannel.name + " to " + newChannel.name); }
    if (!oldVoiceRole && newVoiceRole && !newMember.deaf) newMember.addRole(newVoiceRole, "Joined " + newChannel.name);
    if (oldChannelID == newChannelID && newMember.deaf && !oldMember.deaf) newMember.removeRole(oldVoiceRole, "Deafened");
    if (oldChannelID == newChannelID && !newMember.deaf && oldMember.deaf) newMember.addRole(newVoiceRole, "Undeafened");
} catch(e) {} })

client.on('message', async message => {
    let content = message.content;

    if (message.author.bot) return;
    
    if (!message.guild) if (globalCode) return globalCode.command(client, settings, dbl, message); else return;

    if (content.startsWith("v!enable")) { let format = "`v!enable <voice channel NAME or ID> | <role NAME, MENTION or ID>`"
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(":x: You don't have permission!")
        let args = content.split(" ").slice(1).join(" ").split(" | ");
        console.log(args)
        if (args[0].length < 1) return message.channel.send(":x: No channel specified. Please use the following format: "  + format);
        if (args.length < 2) return message.channel.send(":x: No role specified. Please use the following format: "  + format);
        let voiceChannel = message.guild.channels.find(ch => ch.name == args[0]);
        if (!voiceChannel) voiceChannel = message.guild.channels.get(args[0])
        if (!voiceChannel) return message.channel.send(":x: Channel does not exist. Please use the following format: "  + format)
        if (voiceChannel.type != "voice") return message.channel.send(":x: That is not a voice channel. Please use the following format: "  + format)

        let role = message.guild.roles.find(r => r.name == args[1]);
        if (!role) role = message.guild.roles.get(args[1]);
        if (!role) role = message.guild.roles.get(args[1].replace("<@&", "").replace(">", ""))
        if (!role) return message.channel.send(":x: Role does not exist. Please use the following format: "  + format)

        let voice = await getChannel(voiceChannel.id);
        voice.roleid = role.id;
        voice.save().then(() => {
          return message.channel.send(":white_check_mark: I will now give all members that enter " + voiceChannel.name + " the " + role.name + "-role.")
        }).catch(() => {
          return message.channel.send(":x: Something went wrong while trying to save to the database.")
        });
    } else if (content.startsWith("v!disable")) { let format = "`v!disable <voice channel NAME or ID>`"
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(":x: You don't have permission!")
        let args = content.split(" ").slice(1).join(" ");
        if (args.length < 1) return message.channel.send(":x: No channel specified. Please use the following format: "  + format);
        let voiceChannel = message.guild.channels.find(ch => ch.name ==  args);
        if (!voiceChannel) voiceChannel = message.guild.channels.get(args)
        if (!voiceChannel) return message.channel.send(":x: Channel does not exist. Please use the following format: "  + format)
        if (voiceChannel.type != "voice") return message.channel.send(":x: That is not a voice channel. Please use the following format: "  + format)

        let voice = await getChannel(voiceChannel.id);
        voice.roleid = "";
        voice.save().then(() => {
          return message.channel.send(":white_check_mark: I will no longer give members role upon joining " + voiceChannel.name + ".")
        }).catch(() => {
          return message.channel.send(":x: Something went wrong while trying to save to the database.")
        });
    }
    
    return globalCode.command(client, settings, dbl, message);
});

async function getChannel(channelid) {
  return new Promise(function(resolve, reject) {
    database.getChannel(channelid).then(resolve).catch(reject);
  });
}

async function getChannelCount() {
  return new Promise(function(resolve, reject) {
    database.getChannelCount().then(resolve).catch(reject);
  });
}

client.login(process.env.DISCORD_TOKEN)

globalCode.logging(client)