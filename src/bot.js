require('dotenv').config()
const { Client } = require('discord.js')

const client = new Client()
const PREFIX = '$'

client.on('ready', () => {
	console.log(`${client.user.tag} has logged in`)
})

client.on('message', message => {
	console.log(`[${message.author.tag}]: ${message.content}`)
	
	if (message.author.bot) return
	
	if (message.content.startsWith(PREFIX)) {
		const [ cmdName, ...args ] = message.content
			.trim()
			.substring(PREFIX.length)
			.split(/\s+/)

		try {
			switch(cmdName) {
				case 'kick':
					if (args.length === 0) throw 'Please specify a user.'
					const toKick = message.guild.members.cache.get(args[0])
					if (!toKick) throw 'User not found.'
					console.log(toKick)
					break
			}
		} catch (error) {
			message.reply(error)
		}
	}
})

client.login(process.env.DISCORD_BOT_TOKEN)
