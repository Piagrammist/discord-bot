import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Check bot's activity."),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Pong!')
    },
}
