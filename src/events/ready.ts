import { Client, Events } from 'discord.js'

export default {
    name: Events.ClientReady,
    once: true,
    execute(c: Client) {
        // @ts-ignore
        console.log(`[INFO] Robot ready! Logged in as \`${c.user.username}\`.`)
    },
}
