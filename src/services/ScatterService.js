import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import { Config } from '../config';

ScatterJS.plugins(new ScatterEOS());

export class ScatterService {
  /* static scatter = {
    identity: {
      hash: '',
      kyc: false,
      name: '',
      publicKey: '',
    },
  }; */

  static isScatterExtensionReady = false;

  static isScatterExtensionExist = false;

  static connectionOption = { initTimeout: 1000 };

  static init() {
    console.log('ScatterService init() start...');

    ScatterJS.scatter.connect('webeos', this.connectionOption).then((connected) => {
      console.log(`scatter connection result: ${connected}`);
      // User does not have Scatter Desktop, Mobile or Classic installed.
      if (!connected) {
        console.log('scatter connect failed.');
        this.isScatterExtensionReady = false;
        return;
      }
      window.scatter = null;
      this.isScatterExtensionExist = true;
      this.isScatterExtensionReady = true;
    });
  }

  static getRequiredFields(env) {
    const network = Config.getScatterNetwork(env);
    return { accounts: [network] };
  }
}
