/* eslint-disable import/prefer-default-export */
const MAIN_NET_END_POINT = {
  host: 'nodes.get-scatter.com',
  port: 443,
  protocol: 'https',
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
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
    return MAIN_NET_END_POINT;
  }
}
