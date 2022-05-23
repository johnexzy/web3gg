import { Interaction } from "discord.js";
import { ICommand } from "../types/types";
export const onInteraction = async (
  interaction: Interaction,
  commands: Map<string, ICommand>
) => {
  if (!interaction.isCommand()) return;

  const command: ICommand | undefined = commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.log(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
};
