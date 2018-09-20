export function getCurlStr({ httpEndPoint, method, path, payload }) {
  let ret = `curl --request ${method} \\
        --url ${httpEndPoint}/v1/chain/${path} \\`;
  if (Object.keys(payload).some(k => !!payload[k])) {
    ret += `--data=${JSON.stringify(payload)}`;
  }
  return ret;
}

