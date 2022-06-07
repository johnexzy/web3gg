import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed } from "discord.js";
import { CommandList } from "./_CommandList";

export const Commands: ICommand = {
  data: new SlashCommandBuilder()
    .setName("commands")
    .setDescription("Display all commands"),

  async execute(interaction) {
    try {
      const embed = new MessageEmbed()
        .setTitle("Web3Bot")
        .setDescription("All registered slash commands\n\n")
        .setAuthor({
          name: "web3bot",
          iconURL: "https://i.imgur.com/jP0MDWk.png",
          url: "https://web3bot.gg",
        })

        .addFields(
          ...CommandList.map((command, i) => ({
            name: i + 1 + ").\t " + command.data.description,
            value:
              "\t\t " +
              inlineCode(`/${command.data.name}`) +
              "\n\n\n\n",
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
