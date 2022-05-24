import { Wallet, providers, Contract, utils } from "ethers";
import abi  from "../abi/erc20.json";

export default class Cowry {
  wallet: Wallet;
  constructor() {
    this.wallet = new Wallet(process.env.PRIVATE_KEY as string);
  }
  async initializeSinger(): Promise<Wallet> {
    const provider = new providers.AlchemyProvider(
      "rinkeby",
      process.env.ALCHEMY as string
    );
    const signer = await this.wallet.connect(provider);

    return signer;
  }
  async interact(address: string, amount: string) {
    const connectedContract = new Contract(
      process.env.CONTRACT_ADDRESS as string,
      abi,
      await this.initializeSinger()
    );
    const tx = await connectedContract.transfer(
      address,
      utils.parseEther(amount.toString())
    );
    await tx.wait();
    return tx;
  }
}
