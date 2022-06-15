import { Client } from "discord.js";
import { IntentOptions } from "./configs/intentOption";
import { onInteraction } from "./events/onInteraction";
import sequelize from "./core/sequelize";
import { CommandList } from "./commands/_CommandList";
import { ICommand } from "./types/types";
import { onReady } from "./events/onReady";

(async () => {
  const web3gg: Client<boolean> = new Client({ intents: IntentOptions });
  const commands: Map<string, ICommand> = new Map();
  web3gg.on("ready", async () => await onReady(web3gg));
  web3gg.once("ready", async () => {
    console.log("web3gg ready");
    // await sequelize.sync();
    // await sequelize.sync({force: true});
    await sequelize.sync({alter: true});
  });
  CommandList.forEach((Command) => commands.set(Command.data.name, Command));
  web3gg.on(
    "interactionCreate",
    async (interaction) => await onInteraction(interaction, commands)
  );
  await web3gg.login(process.env.CLIENT_TOKEN);
})();
