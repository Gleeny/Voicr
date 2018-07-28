
<div style="background:white url(https://i.imgur.com/QiCG7sd.png) repeat fixed;">
<div align="center">
  
[![Discord Bots](https://discordbots.org/api/widget/status/472842075310653447.svg)](https://discordbots.org/bot/472842075310653447) [![Discord Bots](https://discordbots.org/api/widget/servers/472842075310653447.svg)](https://discordbots.org/bot/472842075310653447) [![Discord Bots](https://discordbots.org/api/widget/upvotes/472842075310653447.svg)](https://discordbots.org/bot/472842075310653447) [![Discord Bots](https://discordbots.org/api/widget/lib/472842075310653447.svg)](https://discordbots.org/bot/472842075310653447) [![Discord Bots](https://discordbots.org/api/widget/owner/472842075310653447.svg)](https://discordbots.org/bot/472842075310653447)

</div>

**Voicr** is a simple voice channel role system and can be set up in 2 simple steps, explained.
1. Add the bot using [this](https://discordapp.com/oauth2/authorize?client_id=472842075310653447&permissions=268438528&scope=bot) link.
2. Make a voice channel (for example Main Voice)
3. Make a role (for example Connected to Main Voice)
5. (Following the example) Type `v!enable Main Voice | Connected to Main Voice`.

That's it!
** **
<big>Purpose</big>

There are currently one main purpose with extras:
- Guild administrators can restrict users in a voice channel to a text channel. What the bot does is it gives you a role when you're not deafened in an enabled voice channel. If you make a text channel and allow that role to talk in there, you've just made a text channel for the voice channel.
- It will not flood the chat if they're not in the voice channel.
- You can set it up however you want. Maybe you wanteveryone to see the channel, but only the one in the voice channel to type in it? That's fine!

** **
<big>Commands</big>

| Command & Usage                                                    | Description                                           | Permissions    |
|:-------------------------------------------------------------------|:------------------------------------------------------|:---------------|
| `v!enable <voice channel NAME or ID> \| <role NAME, MENTION or ID>` | Enable a voice channel so whenever a user joins it, it will give the role. | `MANAGE_GUILD` |
| `v!disable <voice channel NAME or ID>`                             | Undo the enable-command. | `MANAGE_GUILD` |
| `v!info`                                                           | Get information about the bot. |

** **
<big>Permissions</big>

If you're super pecky about giving bots permissions, read this:
- Read Messages
	- A basic permission that you should allow everyone to have. It requires to read the counting channel to see if there are any messages that are not part of the counting. It also requires to look for commands.
- Send Messages
	- Another basic permission. It requires to respond to the commands.
- Manage Roles
	- It needs to give the role out to the user. Duh.

If you want to, you can make these permissions only work in the counting channel. 

** **
<big>Vote for us</big>

To support us free, please vote on our bot at these bot sites:
- [DiscordBots.org](https://discordbots.org/bot/472842075310653447/vote) (main bot site)

I don't like money donations, but votes would mean a lot :)

** **
<big>Keep in mind!</big>

- You need to be undeafened to have the role.
- The only information we store in our systems are:
	- The voice channel ID
	- The role ID
	- Global voice channels (for the activity of the bot)
- By using our bot you also agree that changes can be made and downtime can occour.

Any other questions can go to our [support server](https://discord.gg/JbHX5U3).
