import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed, MessageActionRow, MessageButton, GuildMemberRoleManager } from "discord.js";
import WalletBuilder from "../common/wallet";
import UserWallet from "../controllers/Wallets";
import Cowry from "../common/token";
const user_wallet = new UserWallet();

export const MigrateToken: ICommand = {
  data: new SlashCommandBuilder()
  .setName("migrate")
  .setDescription(`Migrate ${inlineCode("COWRY")} onchain. (10% fee applies)`)

  .addNumberOption((option) =>
    option
      .setName("amount")
      .setDescription("The amount of cowries to send, 10% fee applies")
      .setRequired(true)
  )
  .addUserOption((option) =>
    option
      .setName("to")
      .setDescription("Migrate Cowries to this user")
      .setRequired(true)
  ),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const admin_role = interaction.guild!.roles.cache.find(
        (r) => r.name === "ADMIN"
      );
      if (!admin_role) {
        return
      }
      if (!(interaction.member!.roles as GuildMemberRoleManager).cache.has(admin_role.id)) {
        await interaction.editReply({
          content: `Only members with ${admin_role.toString()} role should use this command`,
        });
        return;
      }

      const to = interaction.options.getUser("to", true);
      const amount = interaction.options.getNumber("amount", true) * 0.9;
      const user_pkey = await user_wallet.fromIdGetKey(to.id);
      if (user_pkey) {
        const wallet = new WalletBuilder().importFromPrivateKey(user_pkey);
        const tx = await (new Cowry()).interact(wallet.address, amount.toString());
        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setURL(`https://rinkeby.etherscan.io/tx/${tx.hash}`)
            .setLabel("View transaction on etherscan")
            .setStyle("LINK")
        );

        const embed = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle(`☑️Migrated ${amount} ${inlineCode("COWRY")} to ${to.tag}`)
          .setDescription(
            `10% of ${amount / 0.9} was deducted as a migration fee`
          ).setFooter({text: "Powered by AfroLabs"});
        // await wait(4000);
        await interaction.editReply({
          embeds: [embed],
          components: [row],
        });
      } else {
        await interaction.editReply({
          content: `${to.toString()} use ${inlineCode(
            "/create-wallet"
          )} to create or import a wallet `,
        });
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error while executing this command!"
      });
    }
  },
};
