/* eslint-disable import/prefer-default-export */
const CURRENT_ENV = 'dev';

const MAIN_NET_END_POINT = {
  host: 'nodes.get-scatter.com',
  port: 443,
  protocol: 'https',
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
};

const TEST_NET_END_POINT = {
  host: 'jungle2.cryptolions.io',
  port: 443,
  protocol: 'https',
  chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
};

export class Config {
  static get eosConfig() {
    return {
      httpEndpoint: 'https://eos.greymass.com',
      chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    };
  }

  static get eosAPIConfig() {
    return {
      httpEndpoint: 'https://api.eosnewyork.io',
      verbose: false, // API logging
    };
  }

  static get backend() {
    const env = process.env.NODE_ENV;
    if (['production', 'prod', 'staging', 'beta'].indexOf(env) > -1) {
      return 'http://lancer.host.3rdex.com:3000/';
    }
    return 'http://localhost:3000/';
  }

  static get scatterNetwork() {
    if (CURRENT_ENV === 'pdt') {
      return MAIN_NET_END_POINT;
    } else if (CURRENT_ENV === 'dev') {
      return TEST_NET_END_POINT;
    }
    return null;
  }
}
