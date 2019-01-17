<style scoped lang="scss">
  @import '../../styles/util';

  .api-container {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    margin-bottom: 12px;
  }
</style>

<template>
  <section>
    <div class="api-container">
      <api-title
        :action="action"
        :path="apiPath"></api-title>
      <api-config
        :httpEndpoint="httpEndpoint"
        :privateKey="keyProvider"
        :keyAuthMode="mainKeyAuth"
        v-on:selectTemplate="readTemplate"/>
      <api-content
        :curl="curl"
        :bodyData="bodyData"
        :responseData="responseData"
        :body="propbody"
        v-on:executeCommand="onSubmit"
        v-on:clear="onClear"/>
    </div>
  </section>
</template>

<script>
  import { createNamespacedHelpers } from 'vuex';
  import { EOSAPIService } from '../../services/EOSAPIService';
  import { ScatterService } from '../../services/ScatterService';
  import { PANEL_STORE_NAME } from '../../store/modules/panel';
  import { LocalStorage, StorageKeys } from '../../services/LocalStorage';
  import { SessionStorage } from '../../services/SessionStorage';
  import ApiTitle from '../ApiTitle';
  import ApiConfig from '../ApiConfig';
  import ApiContent from '../ApiContent';

  const { mapActions: mapPanelActions } = createNamespacedHelpers(PANEL_STORE_NAME);

  export default {
    name: 'GeneralApiTemplate',
    components: {
      ApiTitle,
      ApiConfig,
      ApiContent,
    },
    props: {
      apiKey: {
        type: String,
        default: '',
      },
      title: {
        type: Object,
        required: true,
        default: () => ({}),
      },
      body: {
        type: Object,
        default: () => ({}),
      },
      requestMethod: {
        type: String,
        required: true,
      },
    },
    data() {
      console.log('data() method...');
      ScatterService.init();
      let endPoint = '';
      const templateNum = SessionStorage.get('templateNum');
      if (templateNum !== null) {
        const readParam = LocalStorage.get(templateNum);
        endPoint = readParam.httpEndpoint;
      }
      const path = endPoint + this.title.path || '';
      return {
        bodyData: {},
        propbody: this.body,
        responseData: null,
        httpEndpoint: 'https://eos.greymass.com',
        keyProvider: '',
        dialogVisible: false,
        mainKeyAuth: false,
        apiPath: path,
        action: 'POST',
      };
    },
    computed: {
      curl: {
        get() {
          return `curl --request POST \\
            --url ${this.httpEndpoint}/${this.title.path || ''} \\
            --data = ${JSON.stringify(this.bodyData)}`;
        },
        set(val) {
          console.log(val);
        },
      },
    },
    methods: {
      ...mapPanelActions(['traceExecution']),
      updateKey(key, val) {
        console.log('updateKey() method...');
        const keyDef = this.body[key];
        let kv = { [key]: val };
        if (keyDef.isJson) {
          try {
            kv = { [key]: JSON.parse(val) };
          } catch (e) {
            // console.error(e);
          }
        }
        this.bodyData = Object.assign({}, this.bodyData, kv);
      },
      onClear() {
        this.responseData = null;
        this.httpEndpoint = LocalStorage.get(StorageKeys.HTTP_END_POINT, '');
        this.keyProvider = LocalStorage.get(StorageKeys.KEY_PROVIDER, '');
        this.mainKeyAuth = false;
        const bodyData = {};
        Object.keys(this.body)
          .forEach((key) => {
            bodyData[key] = this.body[key].val;
          });
        this.bodyData = bodyData;
      },
      async onSubmit() {
        console.log(`on Submit() method: ${this.requestMethod}`);
        try {
          const eos = EOSAPIService.getEos({
            config: {
              httpEndpoint: this.httpEndpoint,
              keyProvider: this.keyProvider,
            },
          });
          this.responseData = await EOSAPIService[this.requestMethod]({
            payload: this.bodyData, eos,
          });
        } catch (err) {
            this.$notify({
              title: 'Error',
              message: 'error',
              type: 'error',
            });
            console.log(err);
        }
        // noinspection JSCheckFunctionSignatures
        this.traceExecution({ ...this.$props, key: this.$props.apiKey });
      },
      readTemplate(templateName) {
        console.log(`templateName is ${templateName}`);
        SessionStorage.update('templateNum', templateName);
        const readParam = LocalStorage.get(templateName);
        if (readParam === null) {
          this.$notify({
            title: 'Warning',
            message: 'This template paramater is null.',
            type: 'warning',
          });
        } else {
          this.httpEndpoint = readParam.httpEndpoint;
          this.keyProvider = readParam.keyProvider;
          this.mainKeyAuth = readParam.keyAuthMode;
          if (this.httpEndpoint === '' || this.keyProvider === '') {
            this.$notify({
              title: 'Warning',
              message: 'This template paramater is lacking something important.',
              type: 'warning',
            });
          } else {
            // console.log('This template paramater is loaded successfully.');
            this.apiPath = this.httpEndpoint + this.title.path || '';
          }
        }
      },
    },

    mounted() {
      console.log('mounted() method...');
      // const scatterInstance = ScatterService.init();
      if (this.body) {
        this.bodyData = {};
        Object.keys(this.body)
          .forEach((key) => {
            this.bodyData[key] = this.body[key].val;
          });
        console.log('bodyData', this.bodyData);
      }
    },
  };
</script>
