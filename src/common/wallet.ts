import { Wallet } from "ethers";
export default class CreateWallet {
  initializeNewWallet(): Wallet {
    return Wallet.createRandom();
  }
  importFromPrivateKey(privateKey: string): Wallet {
    return new Wallet(privateKey);
  }
  importFromPhrase(phrase: string) : Wallet {
    return Wallet.fromMnemonic(phrase);
  }
}
