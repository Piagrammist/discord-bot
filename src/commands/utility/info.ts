import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides information about the users or the server.')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Receive information about a user.')
                .addUserOption(option =>
                    option.setName('target').setDescription('The user')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Receive information about the current server.')
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        let data
        if (interaction.options.getSubcommand() === 'user') {
            const target = interaction.options.getUser('target')
            data = target ?? interaction.user
        } else if (interaction.options.getSubcommand() === 'server') {
            data = interaction.guild
        }
        await interaction.reply('```json\n' + JSON.stringify(data, null, 2) + '\n```')
    },
}
