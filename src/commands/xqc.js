const { join } = require('path')
const fs = require('fs')

module.exports = {
	name: 'xqc',
	description: 'Summon Mr. Cow into the voice channel.',
	execute: async message => {
		const { voice } = message.member
		const soundDir = fs.readdirSync(join(__dirname, '../sounds'))
		const soundFiles = soundDir.filter(file => file.endsWith('.mp3'))

		if (!voice.channel) {
			return message.reply('you need to be connected to a voice channel first!')
		}

		const connection = await voice.channel.join()
		const sound = join(__dirname, '..', 'sounds', soundFiles[Math.floor(Math.random() * soundFiles.length)])
		const dispatcher = connection.play(sound)

		dispatcher.on('finish', () => voice.channel.leave())
		dispatcher.on('error', console.error)
	}
}
