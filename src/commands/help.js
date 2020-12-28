const { prefix } = require('../config')

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute: (message, args) => {
		const replyMessage = []
		const { commands } = message.client

		if (!args.length) {
			// return the list of all available commands
			replyMessage.push('Here\'s a list of all my commands:')
			replyMessage.push(commands.map(command => `\`${command.name}\``).join('\n'))
			replyMessage.push(`You can send \`${prefix}help [command name]\` to get info on a specific command!`)
		} else {
			// return the description of the specified command
			const commandName = args[0].toLowerCase()
			const command = commands.get(commandName)

			if (!command)
				return message.reply('that\'s not a valid command!')

			replyMessage.push(`**Name:** ${command.name}`)

			if (command.description)
				replyMessage.push(`**Description:** ${command.description}`)

			replyMessage.push(`**Usage:** \`${prefix}${command.name}${command.usage ? ' ' + command.usage : ''}\``)

			replyMessage.push(`**Command cooldown:** ${command.cooldown || 3} second(s)`)
		}

		message.channel.send(replyMessage, { split: true })
	}
}
