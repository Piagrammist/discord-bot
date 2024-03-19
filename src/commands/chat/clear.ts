import { SlashCommandBuilder, ChatInputCommandInteraction, TextChannel } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete messages from the current channel.')
        .setDMPermission(false)
        .addIntegerOption(option =>
            option
                .setName('count')
                .setDescription('The number of messages to delete.')
                .setMinValue(2)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        let count = interaction.options.getInteger('count')
        await interaction.reply(`Deleting ${count ?? 'all'} messages...`)
        const breakpoint = (parseInt((await interaction.fetchReply()).id) - 1).toString()
        count ??= 100

        let deleted = 0
        const channel = interaction.channel as TextChannel
        while (true) {
            const result = await channel.bulkDelete(
                await channel.messages.fetch({ limit: count, before: breakpoint, cache: false })
            )
            deleted += result.size
            if (result.size < 100) {
                break
            }
        }

        await interaction.editReply(`Successfully deleted ${deleted} messages.`)
    },
}
