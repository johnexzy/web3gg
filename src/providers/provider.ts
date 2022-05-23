import { providers } from "ethers";
import NetworkUtils from "../utils/networkUtils";
export default class Provider {
  provider: providers.JsonRpcProvider;
  constructor(network: string) {
    this.provider = new providers.JsonRpcProvider(
      NetworkUtils.getRpcUrl(network)
    );
  }
  
  
  getProvider(): providers.JsonRpcProvider {
    return this.provider;
  }
  setProvider(network: string) {
    this.provider = new providers.JsonRpcProvider(
      NetworkUtils.getRpcUrl(network)
    );
  }
}
