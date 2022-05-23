import { SlashCommandBuilder } from "@discordjs/builders";
import { ICommand } from "../types/types";
export const Ping: ICommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
