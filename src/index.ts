import { Client, GatewayIntentBits } from 'discord.js'
import { token, clientId } from '../config.json'
import * as deploy from './deploy'

const client: any = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

client.commands = deploy.commands.collect()
;(async () => {
    await deploy.commands.register(token, clientId, [...client.commands.values()])
})()

for (const event of deploy.events.iter()) {
    if (event?.once) {
        client.once(event.name, event.execute)
    } else {
        client.on(event.name, event.execute)
    }
}

client.login(token)
