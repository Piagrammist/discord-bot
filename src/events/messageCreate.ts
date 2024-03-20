import { Events, Message } from 'discord.js'

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        try {
            // @ts-ignore
            for (const handler of message.client.messageHandlers) {
                await handler(message)
            }
        } catch (error) {
            console.error(error)
            await message.reply('There was an error while executing this command!')
        }
    },
}
