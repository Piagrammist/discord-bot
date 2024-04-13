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
        const breakpoint = (await interaction.fetchReply()).id
        count ??= 100

        let result
        let deleted = 0
        const channel = interaction.channel as TextChannel
        while (true) {
            try {
                result = await channel.bulkDelete(
                    await channel.messages.fetch({
                        limit: count,
                        before: breakpoint,
                    })
                )
            } catch (error) {
                console.error(error)
                await interaction.editReply(
                    'There was an error while executing this command!'
                )
            }
            deleted += result?.size ?? 0
            if ((result?.size ?? 0) < 100) break
        }

        await interaction.editReply(
            deleted > 0
                ? `Successfully deleted ${deleted} messages.`
                : 'No message found to delete!'
        )
    },
}
