/* eslint-disable global-require,no-param-reassign */
/**
 **apis.json**

 ```js
 [
 {name: '', path: '',}
 ]
 ````
 * */

export class APIDefinitions {
  static raw = [];
  static indexes = {};

  static init() {
    APIDefinitions.raw = require('./apis.json');
    const apiKeyMap = APIDefinitions.raw.reduce((indexes, api) => {
      ['name', 'path'].forEach((field) => {
        const fieldValue = api.title[field];
        if (fieldValue in indexes) {
          indexes[fieldValue].push(api);
        } else {
          indexes[fieldValue] = [api];
        }
      });
      return indexes;
    }, {});
    APIDefinitions.indexes = Object.keys(apiKeyMap).reduce((res, key) => {
      res.push({ key, apis: apiKeyMap[key] });
      return res;
    }, []);
    return APIDefinitions.raw;
  }

  static seach(keyword) {
    const pat = new RegExp(keyword, 'gi');
    return new Promise(resolve => resolve(APIDefinitions.indexes
      .filter(({ key }) => pat.test(key)).reduce(([res, seen], { apis }) => {
        apis.forEach((api) => {
          if (!seen.has(api.key)) {
            res.push(api);
            seen.add(api.key);
          }
        });
        return [res, seen];
      }, [[], new Set()])[0]));
  }
}
