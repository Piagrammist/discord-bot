import { REST, Routes, Collection, SlashCommandBuilder } from 'discord.js'
import { globIterateSync } from 'glob'
import { join } from 'node:path'

interface Command {
    data: SlashCommandBuilder
    execute: Function
}

function* iterPlugins(
    root: string,
    validator: (plugin: object) => boolean,
    reason: string
) {
    const it = globIterateSync(['**/*.ts', '**/*.js'], {
        cwd: root,
        absolute: true,
    })
    for (const pluginPath of it) {
        const content = require(pluginPath)?.default
        if (!validator(content)) {
            console.log(`[WARN] Skipping "${pluginPath}" due to ${reason}`)
        }
        yield {
            path: pluginPath,
            content,
        }
    }
}

export const commands = {
    collect() {
        const commands = new Collection<string, Command>()
        const it = iterPlugins(
            join(__dirname, 'commands'),
            c => 'data' in c && 'execute' in c,
            'missing a required `data` or `execute` property.'
        )
        for (const command of it) {
            commands.set(command.content.data.name, command.content)
        }
        return commands
    },
    async register(
        token: string,
        clientId: string,
        commands: Collection<string, Command>
    ) {
        if (commands.size === 0) {
            console.log('[WARN] No commands available to register.')
            return
        }

        const rest = new REST().setToken(token)
        try {
            console.log(
                `[INFO] Started refreshing ${commands.size} application (/) commands.`
            )
            const data = await rest.put(Routes.applicationCommands(clientId), {
                body: [...commands.values()].map(c => c.data.toJSON()),
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

export const messageHandlers = {
    collect() {
        const handlers = []
        const cwd = join(__dirname, 'message-handlers')
        const it = iterPlugins(
            cwd,
            h => typeof h === 'function',
            'the handler file not exporting a default function'
        )
        for (const handler of it) {
            handlers.push(
                /* Name of the handler for Map objects */
                // handler.path
                //     .replace(cwd, '')
                //     .replace(/\.[tj]s/i, '')
                //     .replaceAll(/[\\\/]/g, '-'),
                handler.content
            )
        }
        return handlers
    },
}

export const events = {
    *iter() {
        const it = iterPlugins(
            join(__dirname, 'events'),
            e => 'name' in e && 'execute' in e,
            'missing a required `name` or `execute` property.'
        )
        for (const event of it) {
            yield event.content
        }
    },
}
