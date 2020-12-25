const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')
const { prefix, token } = require('./config')

const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandDir = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command)
}

client.on('ready', () => {
	console.log(`${client.user.tag} has logged in`)
})

client.on('message', message => {
	console.log(`[${message.author.tag}]: ${message.content}`)

	if (!message.content.startsWith(prefix) || message.author.bot)
		return

	const [ command, ...args ] = message.content
		.slice(prefix.length)
		.trim()
		.split(/\s+/)

	if (!client.commands.has(command))
		return message.channel.send('Command not found.')

	try {
		client.commands
			.get(command.toLowerCase())
			.execute(message, args)
	} catch (error) {
		console.error(error)
		message.reply('there was an error trying to execute that command!')
	}
})

client.login(token)
