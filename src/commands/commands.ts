import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed } from "discord.js";
import { CommandList } from "./_CommandList";

export const Commands: ICommand = {
  data: new SlashCommandBuilder()
    .setName("commands")
    .setDescription("All slash commands and info"),

  async execute(interaction) {
    try {
      const embed = new MessageEmbed()
        .setTitle("Available commands")
        .setDescription("All registered slash commands\n")
        .setAuthor({ name: 'web3bot', iconURL: 'https://i.imgur.com/jP0MDWk.png', url: 'https://web3bot.gg' })
        
        .addFields(
          ...CommandList.map((command) => ({
            name: command.data.description,
            value: inlineCode(`/${command.data.name}`)+"\n\n",
          }))
        );
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
