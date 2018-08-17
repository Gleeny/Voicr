const Discord = require('discord.js');
const fs = require('fs');
const DBL = require('dblapi.js');
const Listcord = require('listcord');

const client = new Discord.Client({ disableEveryone: true })
const dbl = new DBL(require('./_TOKEN.js').DBL_TOKEN, client)
const listcord = new Listcord.Client(require('./_TOKEN.js').LISTCORD_TOKEN)

const settings = JSON.parse(fs.readFileSync('./settings.json'))

client.on('ready', () => {
    console.log("Ready!")

    client.user.setActivity("v!info (" + voiceRoleGlobalCount() + " voice channels) [" + (client.shard.id == 0 ? "1" : client.shard.id) + "/" + client.shard.count + "]", { type: "WATCHING" })
    
    setInterval(() => {
        client.user.setActivity("v!info (" + voiceRoleGlobalCount() + " voice channels) [" + (client.shard.id == 0 ? "1" : client.shard.id) + "/" + client.shard.count + "]", { type: "WATCHING" })
    }, 60000)

    postStats(client)
    setInterval(() => { postStats(client) }, 900000)
})

async function postStats(client) {
    dbl.postStats(client.guilds.size, client.shard.id, client.shard.count).then().catch(console.log);
    const counts = await client.shard.broadcastEval('this.guilds.size')
    listcord.postStats(client.user.id, counts.reduce((prev, val) => prev + val, 0), client.shard.count).then().catch(console.log);
}

client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newChannel = newMember.voiceChannel;
    let oldChannel = oldMember.voiceChannel;

    let newChannelID = newChannel ? newChannel.id : "0";
    let oldChannelID = oldChannel ? oldChannel.id : "0";

    let newVoiceRoleID = getVoiceRole(newChannelID);
    let oldVoiceRoleID = getVoiceRole(oldChannelID);

    let newVoiceRole = newMember.guild.roles.get(newVoiceRoleID);
    let oldVoiceRole = oldMember.guild.roles.get(oldVoiceRoleID);

    if (oldVoiceRole && !newVoiceRole) oldMember.removeRole(oldVoiceRole, "Left " + oldChannel.name);
    if (oldVoiceRole && newVoiceRole && newMember.deaf == oldMember.deaf && oldMember.deaf == false && (oldVoiceRole != newVoiceRole)) { oldMember.removeRole(oldVoiceRole, "Moved from " + oldChannel.name + " to " + newChannel.name); newMember.addRole(newVoiceRole, "Moved from " + oldChannel.name + " to " + newChannel.name); }
    if (!oldVoiceRole && newVoiceRole && !newMember.deaf) newMember.addRole(newVoiceRole, "Joined " + newChannel.name);
    if (oldChannelID == newChannelID && newMember.deaf && !oldMember.deaf) newMember.removeRole(oldVoiceRole, "Deafened");
    if (oldChannelID == newChannelID && !newMember.deaf && oldMember.deaf) newMember.addRole(newVoiceRole, "Undeafened");
})

client.on('message', async message => {
    let content = message.content;

    if (message.author.bot) return;
    
    if (!message.guild) return;

    if (content.startsWith("v!enable")) { let format = "`v!enable <voice channel NAME or ID> | <role NAME, MENTION or ID>`"
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(":x: You don't have permission!")
        let args = content.split(" ").slice(1).join(" ").split(" | ");
        console.log(args)
        if (args[0].length < 1) return message.channel.send(":x: No channel specified. Please use the following format: "  + format);
        if (args.length < 2) return message.channel.send(":x: No role specified. Please use the following format: "  + format);
        let voiceChannel = message.guild.channels.find('name', args[0]);
        if (!voiceChannel) voiceChannel = message.guild.channels.get(args[0])
        if (!voiceChannel) return message.channel.send(":x: Channel does not exist. Please use the following format: "  + format)
        if (voiceChannel.type != "voice") return message.channel.send(":x: That is not a voice channel. Please use the following format: "  + format)

        let role = message.guild.roles.find('name', args[1]);
        if (!role) role = message.guild.roles.get(args[1]);
        if (!role) role = message.guild.roles.get(args[1].replace("<@&", "").replace(">", ""))
        if (!role) return message.channel.send(":x: Role does not exist. Please use the following format: "  + format)

        saveVoiceRole(voiceChannel.id, role.id)
        return message.channel.send(":white_check_mark: I will now give all members that enter " + voiceChannel.name + " the " + role.name + "-role.")
    } else if (content.startsWith("v!disable")) { let format = "`v!disable <voice channel NAME or ID>`"
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(":x: You don't have permission!")
        let args = content.split(" ").slice(1).join(" ");
        if (args.length < 1) return message.channel.send(":x: No channel specified. Please use the following format: "  + format);
        let voiceChannel = message.guild.channels.find('name', args);
        if (!voiceChannel) voiceChannel = message.guild.channels.get(args)
        if (!voiceChannel) return message.channel.send(":x: Channel does not exist. Please use the following format: "  + format)
        if (voiceChannel.type != "voice") return message.channel.send(":x: That is not a voice channel. Please use the following format: "  + format)

        saveVoiceRole(voiceChannel.id, undefined);
        return message.channel.send(":white_check_mark: I will no longer give a role to a member that enters " + voiceChannel.name);
    }
});

function saveVoiceRole(voice, role) {
    let file = JSON.parse(fs.readFileSync('./_voiceRoles.json'))
    file[voice] = role;

    fs.writeFileSync('./_voiceRoles.json', JSON.stringify(file))
}

function getVoiceRole(voice) {
    let file = JSON.parse(fs.readFileSync('./_voiceRoles.json'))
    return file[voice];
}

function voiceRoleGlobalCount() {
    let file = JSON.parse(fs.readFileSync('./_voiceRoles.json'))
    return Object.keys(file).length;
}

require('../debug.js').load(client, { dbl, listcord }); // debugging
require('../help.js').load(client, settings, dbl, listcord) // help command
// They are imported because they're used on all my bots.

client.login(require("./_TOKEN.js").TOKEN)