# brian-bot

BrianBot is a Discord bot built using [discordjs](https://github.com/discordjs/discord.js/). It emulates the "Brian" text-to-speech voice used by many popular streamers on Twitch. This bot makes use of the Amazon Polly service to convert user-supplied text into audio containing the synthesized speech.

## Usage
`!help`
- List all commands or info about a specific command.

`!tts <text>`
- Convert the supplied text into synthesized speech, and play it in a voice channel.
- **Note:** Requires the user issuing the command to be connected to a voice channel, in which the bot will join so that it can play the audio.
- **Note:** There is a character limit of 255 for the user-supplied text.
