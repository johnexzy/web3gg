import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed } from "discord.js";
import { CommandList } from "./_CommandList";

export const Commands: ICommand = {
  data: new SlashCommandBuilder()
    .setName("commands")
    .setDescription("Displays all Web3Bot commands"),

  async execute(interaction) {
    try {
      const embed = new MessageEmbed()
        .setTitle("Web3Bot")
        .setDescription("All registered slash commands\n\n")
        .setFooter({text: "Powered by AfroLabs"})
        .setAuthor({
          name: "Web3Bot",
          iconURL: process.env.ICON_URL,
          url: process.env.WEBSITE,
        })

        .addFields(
          ...CommandList.map((command, i) => ({
            name:
              "\n\n" +
              (i + 1) +
              ")." +
              "\t" +
              inlineCode(`/${command.data.name}`) +
              "\n\t",
            value: "  " + command.data.description+"\n \n",
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
