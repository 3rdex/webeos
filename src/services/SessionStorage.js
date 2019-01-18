export class SessionStorage {
  static get(key, defaultValue = null) {
    let res = defaultValue;
    try {
      res = JSON.parse(sessionStorage.getItem(key)) || defaultValue;
    } catch (err) {
      res = sessionStorage.getItem(key) || defaultValue;
      console.error(err);
    }
    return res;
  }

  static update(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(err);
      sessionStorage.setItem(key, value);
    }
  }
}
