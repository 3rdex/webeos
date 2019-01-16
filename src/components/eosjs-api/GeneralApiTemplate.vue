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
        :privateKey="privateKey"
        :keyAuthMode="keyAuthMode"
        v-on:selectTemplate="readTemplate"
        v-on:clear="onClear"/>
      <api-content/>
    </div>
  </section>
</template>

<script>
  import { createNamespacedHelpers } from 'vuex';
  import { EOSAPIService } from '../../services/EOSAPIService';
  import { ScatterService } from '../../services/ScatterService';
  import { PANEL_STORE_NAME } from '../../store/modules/panel';
  import { LocalStorage, StorageKeys } from '../../services/LocalStorage';
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
      const endPoint = 'https://eos.greymass.com'; // 需要从ApiConfig中emit给父组件, 暂用hardcore
      const path = endPoint + this.title.path || '';
      console.log(path);
      return {
        bodyData: {},
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
      curl() {
        return `curl --request POST \\
        --url ${this.httpEndpoint}/${this.title.path || ''} \\
        --data = ${JSON.stringify(this.bodyData)}`;
      },
    },
    methods: {
      ...mapPanelActions(['traceExecution']),
      updateKey(key, val) {
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
          console.error(err);
        }
        // noinspection JSCheckFunctionSignatures
        this.traceExecution({ ...this.$props, key: this.$props.apiKey });
      },
      readTemplate(templateName) {
        console.log(`templateName is ${templateName}`);
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
            this.$notify({
              title: 'Success',
              message: 'This template paramater is loaded successfully.',
              type: 'success',
            });
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
