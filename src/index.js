const Discord = require('discord.js')
const { prefix, token } = require('./config')

const client = new Discord.Client()
client.commands = new Discord.Collection()

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

	console.log(command)
	console.log(args)

	switch (command.toLowerCase()) {
	case 'ping': {
		message.channel.send('Pong.')
		break
	} case 'server': {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`)
		break
	} case 'user-info': {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`)
		break
	} case 'kick': {
		if (!message.mentions.users.size)
			return message.reply('you need to tag a user in order to kick them.')

		const taggedUser = message.mentions.users.first()
		console.log(taggedUser)
		message.channel.send(`You wanted to kick: ${taggedUser.username}\nToo bad I don't know how to do that.`)
		break
	} case 'avatar': {
		if (!message.mentions.users.size)
			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`)

		break
	}
	default:
		message.channel.send('Command not found!')
	}
})

client.login(token)
