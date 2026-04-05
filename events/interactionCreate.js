const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Events = require("../schemas/events");
const Users = require("../schemas/users");	

const Devs =["582279365912559631","1087024962914766898"]

module.exports = {
	name: "interactionCreate",
	async execute(interaction, client) {
const command = client.commands.get(interaction.commandName);

if (interaction.isButton()) {
  const [action, eventId] = interaction.customId.split("_");

  if (interaction.user.bot) return interaction.reply({ content: 'Bots cannot interact with this button', ephemeral: true});
  if (eventId === "hours" || eventId === "hours") {
	const userId = interaction.customId.split("-")[1];
	const user = await Users.findOne({ DiscordID: userId });
	if (!user) {
	  return interaction.reply({ content: "User not found.", ephemeral: true });
	}
	if (action === "approve") {
	  // Handle approval logic, e.g., update user's flight hours, notify user, etc.
	// input validation for hoursMins convert from string format (e.g., "1h 30m") to total hours in decimal format (e.g., 1.5)
	const hoursMins = interaction.customId.split("-")[2];
	const hoursMatch = hoursMins.match(/(\d+)h/);
	  user.Flighthours += hoursMatch ? parseInt(hoursMatch[1]) : 0;
	const minsMatch = hoursMins.match(/(\d+)m/);
	  user.Flighthours += minsMatch ? parseInt(minsMatch[1]) / 60 : 0;
	await user.save();
	await interaction.reply({ content: `✅ Flight hours approved for ${user.Username}. Total flight hours: ${user.Flighthours.toFixed(2)}\n **By:** <@${interaction.user.id}>` });
	// Optionally, notify the user about the approval
	const embed = new EmbedBuilder()
		.setTitle('Flight Hours Approved')
		.setDescription(`Your flight hours submission has been approved!\n\n**Approved Hours:** ${hoursMins}\n**Total Flight Hours:** ${user.Flighthours.toFixed(2)}\n **By:** <@${interaction.user.id}>`)
		.setColor('Green')
		.setFooter({ text: 'VTOL VR ATC Bot' })
		.setTimestamp();
	var userToNotify = await client.users.fetch(user.DiscordID);
	if (userToNotify) {
		await userToNotify.send({ embeds: [embed] });
	}
	
	} else if (action === "reject") {

		var embedreject = new EmbedBuilder()
		.setTitle('Flight Hours Rejected')
		.setDescription(`Your flight hours submission has been rejected.\n\n**Submitted Hours:** ${interaction.customId.split("-")[2]}\n **By:** <@${interaction.user.id}>`)
		.setColor('Red')
		.setFooter({ text: 'VTOL VR ATC Bot' })
		.setTimestamp();
	await interaction.reply({ content: `❌ Flight hours rejected for ${user.Username}.\n **By:** <@${interaction.user.id}>`, ephemeral: true });
	// Optionally, notify the user about the rejection
	  var userToNotify = await client.users.fetch(user.DiscordID);
	if (userToNotify) {
		await userToNotify.send({ embeds: [embedreject] });
	}
	}
	  return;
  }
  if (action === "join") {
	const event = await Events.findById(eventId);
	if (!event) {
		return interaction.reply({ content: "Event not found.", ephemeral: true });
	}
	if (event.attendees.some(attendee => attendee.id === interaction.user.id)) {
		return interaction.reply({ content: "You have already joined this event.", ephemeral: true });
	}
	event.attendees.push({ id: interaction.user.id, username: interaction.user.tag });
	await event.save();
	const channel = await client.channels.fetch("1462570082793160867");
	const message = await channel.messages.fetch(event.messageId);
	const Event = EmbedBuilder.from(message.embeds[0])
	.spliceFields(5, 1, { name: "Attendees", value: event.attendees.map(a => a.username).join("\n") || "No attendees yet", inline: false })
	.setFooter({ text: `${event.attendees.length} attendees` });
	message.edit({ embeds: [Event] });

	const embed = new EmbedBuilder()
		.setTitle(`Joined Event: ${event.name}`)
		.setDescription(`You have successfully joined the event "${event.name}".\n\n**Host:** ${event.hostName}\n**Date:** ${new Date(event.startTime).toLocaleString()}`)
		.setColor("Green")
		.setFooter({ text: "VTOL VR ATC Bot" })
		.setTimestamp().setColor("#87cefa");
		

	return interaction.user.send({ embeds: [embed], ephemeral: true });
	  } else if (action === "leave") {
	const event = await Events.findById(eventId);
	if (!event) {
		return interaction.reply({ content: "Event not found.", ephemeral: true });
	}
	event.attendees = event.attendees.filter(attendee => attendee.id !== interaction.user.id);
	await event.save();
	const channel = await client.channels.fetch("1462570082793160867");
	const message = await channel.messages.fetch(event.messageId);
	const Event = EmbedBuilder.from(message.embeds[0])
	.spliceFields(5, 1, { name: "Attendees", value: event.attendees.map(a => a.username).join("\n") || "No attendees yet", inline: false })
	.setFooter({ text: `${event.attendees.length} attendees` });
	message.edit({ embeds: [Event] });

      
	const embed = new EmbedBuilder()

		.setTitle(`Left Event: ${event.name}`)
		.setDescription(`You have left the event "${event.name}".\n\n**Host:** ${event.hostName}\n**Date:** ${new Date(event.startTime).toLocaleString()}`)
		.setColor("Red")
		.setFooter({ text: "VTOL VR ATC Bot" })
		.setTimestamp()
		.setColor("#87cefa");
	return interaction.user.send({ embeds: [embed], ephemeral: true });
	  }
	}
	  
if (!interaction.isCommand()) return;
if (!command) return;

if (interaction.user.bot) return interaction.reply({ content: 'Bots cannot use this command', ephemeral: true});
if( command.DevOnly && !Devs.includes(interaction.user.id.toString())) return interaction.reply({ content: 'Are you a spriggull brain or what? you are not allowed to use this command'});








 try{  
await command.execute(interaction, client);
 } catch (error) {
console.error(error);
return interaction.followUp({ content: 'There was an error while executing this command!\n' + error, ephemeral: true });

}
}}
