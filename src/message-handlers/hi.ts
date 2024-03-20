import { Message } from 'discord.js'

export default async (message: Message) => {
    if (message.content === 'hi') {
        await message.reply('Hiya! ^^')
    }
}
