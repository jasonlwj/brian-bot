const { Polly } = require('@aws-sdk/client-polly')
const { getSynthesizeSpeechUrl } = require('@aws-sdk/polly-request-presigner')

const pollyClient = new Polly({ apiVersion: '2016-06-10', region: 'ap-southeast-2' })

module.exports = {
	name: 'tts',
	description: 'TTS',
	aliases: ['say', 'speak'],
	args: true,
	usage: '<text>',
	execute: async (message, args) => {
		const { voice } = message.member
		const speechString = args.join(' ')
		const speechParams = {
			OutputFormat: 'ogg_vorbis',
			Text: speechString,
			VoiceId: 'Brian',
			Engine: 'standard',
			LanguageCode: 'en-GB',
			TextType: 'text'
		}

		if (!voice.channel) {
			return message.reply('you need to be connected to a voice channel first!')
		}

		if (message.content.length > 255) {
			return message.reply('you have exceeded the character limit of 255.')
		}

		const audioUrl = await getSynthesizeSpeechUrl({
			client: pollyClient,
			params: speechParams
		})

		const connection = await voice.channel.join()
		const dispatcher = connection.play(audioUrl)

		dispatcher.on('finish', () => voice.channel.leave())
		dispatcher.on('error', () => {
			voice.channel.leave()
			console.error
		})
	}
}