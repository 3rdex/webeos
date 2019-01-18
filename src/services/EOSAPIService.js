import Eos from 'eosjs';
import { Config } from '../config';

export class EOSAPIService {
  static eos = null;

  static init() {
    EOSAPIService.eos = Eos(Config.eosAPIConfig);
  }

  static getEos({ config = Config.eosAPIConfig }) {
    return Eos(config);
  }

  // Collection: get_info
  static async getInfo({ eos }) {
    return eos.getInfo({});
  }
  // Collection: get_block
  static getBlock({ eos, payload }) {
    return eos.getBlock(payload);
  }

  static getCode(payload) {
    return EOSAPIService.eos.getCode(payload);
  }
  // Collection: get_block
  static async getBlockHeaderState({ blockNumOrId = 1 }) {
    return EOSAPIService.eos.getBlockHeaderState({ block_num_or_id: blockNumOrId });
  }
  // Collection: get_account
  static async getAccount({ eos, payload }) {
    return eos.getAccount(payload);
  }
  // Collection: get_currency_balance
  static async getCurrencyBalance({ eos, payload }) {
    return eos.getCurrencyBalance(payload);
  }
  // Collection: issue_token
  static async issueToken({ eos, payload }) {
    const token = `${Number(payload.count)
      .toFixed(3)} ${payload.unit}`;
    await eos.transaction(payload.account, (account) => {
      account.create(payload.account, token);
      account.issue(payload.account, token, 'issue');
    });
  }
  // Collection: get_table
  static async getTableRows({ json = true, code, scope, table }) {
    return EOSAPIService.eos.getTableRows({ json, code, scope, table });
  }
  // Collection: push_transaction
  static async pushTransactions({ eos, payload }) {
    return eos.transaction(payload);
  }
}
