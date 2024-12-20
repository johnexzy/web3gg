import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed } from "discord.js";

import UserWallet from "../controllers/Wallets";
const user_wallet = new UserWallet();

export const Address: ICommand = {
  data: new SlashCommandBuilder()
    .setName("address")
    .setDescription("Replies with user's address"),
    // .addUserOption((options) =>
    //   options
    //     .setName("user")
    //     .setDescription("user's wallet")
    //     .setRequired(false)
    // ),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const user = interaction.user;

      const wallet_address = await user_wallet.fromIdGetAddress(user.id);
      if (!wallet_address) {
        const embed = new MessageEmbed().setColor("RED").addFields({
          name: "No wallet initialized",
          value: `use ${inlineCode(
            "/create-wallet"
          )} to create a new wallet or import existing wallet`,
        }).setFooter({text: "Powered by AfroLabs"});
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      // const embed = new MessageEmbed().addField('wallet', )
      // await wait(4000);
      await interaction.editReply({
        content: `${wallet_address}`,
      });
    } catch (error) {
      await interaction.editReply({
        content: "There was an error while executing this command!"
      });
    }
  }
    
};
