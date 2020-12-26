const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')
const { prefix, token } = require('./config')

// initialise the Discord client
const client = new Discord.Client()

// will contain commands that can be issued to the bot
client.commands = new Discord.Collection()

// will contain cooldowns for each command
const cooldowns = new Discord.Collection()

// obtain the command files from ./commands
const commandDir = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
	cooldowns.set(command.name, new Discord.Collection())
}

// when the client is ready to start working
client.on('ready', () => {
	console.log(`${client.user.tag} has logged in`)
})

// when a message is sent by a user
client.on('message', message => {
	// log the message to the console
	console.log(`[${message.author.tag}]: ${message.content}`)

	// exit if the message...
	// ...isn't a command i.e. doesn't start with the prefix
	// ...was sent by a bot
	if (!message.content.startsWith(prefix) || message.author.bot)
		return

	// separate the command into the command name, and an array of any provided arguments
	const [ commandName, ...args ] = message.content
		.slice(prefix.length)
		.trim()
		.split(/\s+/)

	// exit if the command doesn't exist
	if (!client.commands.has(commandName))
		return message.channel.send('Command not found.')

	// retrieve the desired command object
	const command = client.commands.get(commandName.toLowerCase())

	// exit if...
	// ...the invoked command requires args
	// ...no arguments were supplied in the sent message
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`

		if (command.usage)
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``

		return message.channel.send(reply)
	}

	const now = Date.now()
	const timestamps = cooldowns.get(command.name)
	const cooldownAmount = (command.cooldown || 3) * 1000

	// exit if the command being issued is on cooldown for the current user
	if (timestamps.has(message.author.id)) {
		// calculate when the command can be used again by the current user
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before issuing the \`${command.name}\` command.`)
		}
	}

	// execute the command
	try {
		command.execute(message, args)
		timestamps.set(message.author.id, now)
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
	} catch (error) {
		console.error(error)
		message.reply('there was an error trying to execute that command!')
	}
})

// login to establish a websocket connection to Discord
client.login(token)
