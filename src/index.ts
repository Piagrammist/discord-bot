import { Client, Events, GatewayIntentBits } from 'discord.js'
import * as deploy from './deploy'
import * as conf from '../config.json'

const client: any = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

client.commands = deploy.commands.collect()
client.messageHandlers = deploy.messageHandlers.collect()

for (const event of deploy.events.iter()) {
    if (event.name === Events.InteractionCreate && client.commands.size === 0) continue
    if (event.name === Events.MessageCreate && client.messageHandlers.size === 0) continue

    if (event?.once) {
        client.once(event.name, event.execute)
    } else {
        client.on(event.name, event.execute)
    }
}

;(async () => {
    await deploy.commands.register(conf.token, conf.clientId, client.commands)
})()
client.login(conf.token)
