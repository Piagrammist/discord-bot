import { REST, Routes, Collection, SlashCommandBuilder } from 'discord.js'
import * as path from 'node:path'
import * as fs from 'node:fs'

export interface Command {
    data: SlashCommandBuilder
    execute: Function
}

/*export interface Event {
    name: string
    once?: boolean
    execute: Function
}*/

export function collectCommands() {
    const commands = new Collection<string, Command>()
    const foldersPath = path.join(__dirname, 'commands')
    const commandFolders = fs.readdirSync(foldersPath)

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder)
        const commandFiles = fs
            .readdirSync(commandsPath)
            .filter(file => file.endsWith('.ts') || file.endsWith('.js'))

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            const command = require(filePath)?.default

            if (!('data' in command && 'execute' in command)) {
                console.log(
                    `[WARN] The command at "${filePath}" is missing a required \`data\` or \`execute\` property.`
                )
                continue
            }

            commands.set(command.data.name, command)
        }
    }
    return commands
}

export async function registerCommands(
    token: string,
    clientId: string,
    commands: Array<Command>
) {
    if (commands.length === 0) {
        console.log('[WARN] No commands available to register.')
        return
    }

    const rest = new REST().setToken(token)
    try {
        console.log(
            `[INFO] Started refreshing ${commands.length} application (/) commands.`
        )
        const data = await rest.put(Routes.applicationCommands(clientId), {
            body: commands.map(c => c.data.toJSON()),
        })
        console.log(
            // @ts-ignore
            `[INFO] Successfully reloaded ${data.length} application (/) commands.`
        )
    } catch (error) {
        console.error(error)
    }
}

export function* collectEvents() {
    const eventsPath = path.join(__dirname, 'events')
    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith('.ts') || file.endsWith('.js'))

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file)
        const event = require(filePath)?.default

        if (!('name' in event && 'execute' in event)) {
            console.log(
                `[WARN] The event at "${filePath}" is missing a required \`name\` or \`execute\` property.`
            )
            continue
        }

        yield event
    }
}
