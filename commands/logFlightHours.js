const { SlashCommandBuilder, EmbedBuilder,ActionRow,ButtonStyle,ButtonBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logflighthours')
    .setDescription('Log flight hours for a session')
    .addStringOption(option =>
      option
        .setName('username')
        .setDescription('Your username')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('host_username')
        .setDescription('Host username')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('hours_mins')
        .setDescription('Hours and minutes flown (e.g., 1h 30m)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const username = interaction.options.getString('username');
    const hostUsername = interaction.options.getString('host_username');
    const hoursMins = interaction.options.getString('hours_mins');

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Flight Hours Submission')
      .setDescription('New flight hours submission pending approval')
      .addFields(
        { name: 'User', value: username, inline: true },
        { name: 'Host', value: hostUsername, inline: true },
        { name: 'Duration', value: hoursMins, inline: true },
        { name: 'Submitted By', value: `<@${interaction.user.id}>`, inline: false }
      )
      .setTimestamp();

      const row = new ActionRow().addComponents(
        new ButtonBuilder()
          .setCustomId(`approve_hours_${interaction.user.id}_${hoursMins}`)
            .setLabel('Approve')
            .setStyle('Success'),
        new ButtonBuilder()
          .setCustomId(`reject_hours_${interaction.user.id}_${hoursMins}`)
            .setLabel('Reject')
            .setStyle('Danger')
      );

    try {
      const channel = await interaction.client.channels.fetch('1490374114928623626');
      await channel.send({ embeds: [embed], components: [row] });

      await interaction.reply({
        content: `✅ Your flight hours submission has been sent for approval!\n**Username:** ${username}\n**Host:** ${hostUsername}\n**Duration:** ${hoursMins}`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Error sending submission:', error);
      await interaction.reply({
        content: '❌ Error sending submission. Please try again later.',
        ephemeral: true
      });
    }
  }
};
