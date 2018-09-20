export class LocalStorage {
  static get(key, defaultValue = null) {
    let res = defaultValue;
    try {
      res = JSON.parse(localStorage.getItem(key)) || defaultValue;
    } catch (err) {
      res = localStorage.getItem(key) || defaultValue;
      console.error(err);
    }
    return res;
  }

  static update(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(err);
      localStorage.setItem(key, value);
    }
  }

  static clear() {
    try {
      localStorage.clear();
    } catch (err) {
      console.error(err);
    }
  }
}

export const StorageKeys = {
  SEARCH_HISTORY: 'SEARCH_HISTORY',
  EXECUTE_HISTORY: 'EXECUTE_HISTORY',
};
