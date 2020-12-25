require('dotenv').config()

const prefix = process.env.PREFIX
const token = process.env.DISCORD_BOT_TOKEN

module.exports = {
	prefix,
	token
}
