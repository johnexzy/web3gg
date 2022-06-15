import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed } from "discord.js";

import UserWallet from "../controllers/Wallets";
const user_wallet = new UserWallet();

export const ExportKey: ICommand = {
  data: new SlashCommandBuilder()
    .setName("export-private-key")
    .setDescription("recover private key")
    .addStringOption((options) =>
      options
        .setName("passowrd")
        .setDescription("wallet's password")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const user = interaction.user;
      const password = interaction.options.getString("password", true);

      const pVerify = await user_wallet.passwordVerify(user.id, password);

      const wallet_key = await user_wallet.fromIdGetKey(user.id);
      if (!wallet_key) {
        const embed = new MessageEmbed()
          .setColor("RED")
          .addFields({
            name: "No wallet initialized",
            value: `use ${inlineCode(
              "/create-wallet"
            )} to create a new wallet or import existing wallet`,
          })
          .setFooter({ text: "Powered by Afro Apes" });
        await interaction.editReply({ embeds: [embed] });
        return;
      }
      if (pVerify == 1) {
        await interaction.editReply({
          content: `${wallet_key}`,
        });
        return;
      }
      if (pVerify == 0) {
        const embed = new MessageEmbed()
          .setColor("RED")
          .addFields({
            name: "Incorrect Password",
            value: `use ${inlineCode(
              "/reset-password"
            )} to reset password with private key`,
          })
          .setFooter({ text: "Powered by Afro Apes" });
        await interaction.editReply({ embeds: [embed] });
        return;
      }
      // const embed = new MessageEmbed().addField('wallet', )
      // await wait(4000);
    } catch (error) {
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  },
};
