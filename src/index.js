const fs = require('fs')
const path = require('path')
const Discord = require('discord.js')
const { prefix, token } = require('./config')

// initialise the Discord client
const client = new Discord.Client()

// will contain commands that can be issued to the bot
client.commands = new Discord.Collection()

// will contain cooldowns for each command
client.cooldowns = new Discord.Collection()

// obtain the command files from ./commands
const commandDir = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	client.commands.set(command.name, command)
	client.cooldowns.set(command.name, new Discord.Collection())
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
	// ...or was sent by a bot
	if (!message.content.startsWith(prefix) || message.author.bot)
		return

	// separate the command into the command name, and an array of any provided arguments
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/\s+/)
	const commandName = args.shift().toLowerCase()

	// retrieve the desired command object (or look for aliases)
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

	// exit if the command doesn't exist
	if (!command)
		return message.channel.send('Command not found.')

	// exit if author doesn't have the required permissions to issue the command
	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author)

		if (!authorPerms || !authorPerms.has(command.permissions))
			return message.channel.reply('you don\'t have the permissions to use this command!')
	}

	// exit if...
	// ...the invoked command requires args
	// ...and no arguments were supplied in the sent message
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`

		if (command.usage)
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``

		return message.channel.send(reply)
	}

	// calculate cooldowns for the obtained command
	const now = Date.now()
	const timestamps = client.cooldowns.get(command.name)
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
