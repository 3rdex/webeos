import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import { Config } from '../config';

ScatterJS.plugins(new ScatterEOS());

export class ScatterService {
  static scatter = {
    identity: {
      hash: '',
      kyc: false,
      name: '',
      publicKey: '',
    },
  }

  static async init() {
    if (ScatterService.scatter) return ScatterService.scatter;
    const connected = await ScatterJS.scatter.connect('WEBEOS');
    if (connected) {
      ScatterService.scatter = ScatterJS.scatter;
      window.scatter = null;
      return ScatterService.scatter;
    }
    return null;
  }

  static getScatterNetwork() {
    return {
      blockchain: 'eos',
      host: Config.scatterNetwork.host,
      port: Config.scatterNetwork.port,
      protocol: Config.scatterNetwork.protocol,
      chainId: Config.scatterNetwork.chainId,
    };
  }
}
