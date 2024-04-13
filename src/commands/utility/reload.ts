import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import * as deploy from '../../deploy'

export default {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription("Reload robot's commands."),
    async execute(interaction: ChatInputCommandInteraction) {
        // @ts-ignore
        interaction.client.commands = deploy.commands.collect()
        // @ts-ignore
        interaction.client.messageHandlers = deploy.messageHandlers.collect()
        await interaction.reply('Robot reloaded successfully!')
    },
}
