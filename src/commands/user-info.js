module.exports = {
	name: 'user-info',
	description: 'Returns info of user who sent the command.',
	execute: message => message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`)
}
