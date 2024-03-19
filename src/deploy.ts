import { REST, Routes, Collection, SlashCommandBuilder } from 'discord.js'
import { globIterateSync } from 'glob'
import { join } from 'node:path'

interface Command {
    data: SlashCommandBuilder
    execute: Function
}

export const commands = {
    collect() {
        const commands = new Collection<string, Command>()
        const cwd = join(__dirname, 'commands')
        const scripts = globIterateSync('**/*.ts', { cwd, absolute: true })

        for (const scriptPath of scripts) {
            const command = require(scriptPath)?.default
            if (!('data' in command && 'execute' in command)) {
                console.log(
                    `[WARN] The command at "${scriptPath}" is missing a required \`data\` or \`execute\` property.`
                )
                continue
            }
            commands.set(command.data.name, command)
        }
        return commands
    },
    async register(token: string, clientId: string, commands: Array<Command>) {
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
    },
}

export const events = {
    *iter() {
        const cwd = join(__dirname, 'events')
        const events = globIterateSync('**/*.ts', { cwd, absolute: true })

        for (const eventPath of events) {
            const event = require(eventPath)?.default
            if (!('name' in event && 'execute' in event)) {
                console.log(
                    `[WARN] The event at "${eventPath}" is missing a required \`name\` or \`execute\` property.`
                )
                continue
            }
            yield event
        }
    },
}
