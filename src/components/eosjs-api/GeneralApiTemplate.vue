<style scoped lang="scss">
  @import '../../styles/util';

  .api-title-container {
    display: flex;
    align-items: center;
    border-radius: 4px;
    margin-bottom: 12px;
    .summary {
      display: flex;
      align-items: center;
      font-size: 14px;
      .action {
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        background: #61affe;
        margin-right: 12px;
        font-weight: bold;
        min-width: 80px;
        border-radius: 3px;
        text-shadow: 0 1px 0 rgba(0, 0, 0, .1);
        padding-left: 4px;
        padding-right: 4px;
      }
      .path {
        margin-right: 20px;
        font-weight: bold;
      }
    }
  }

  .api-content-container {
    > article {
      padding: 12px;
    }
    .el-row {
      margin-top: 8px;
    }
    .general-info, .request-title, .response-title {
      display: flex;
      align-items: center;
      height: 50px;
    }
    .header-title, .request-title, .response-title {
      font-weight: bold;
      font-size: 14px;
      background-color: $color-white;
    }
    .request-container {
      .action-row {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
      .curl {
        margin-top: 20px;
      }
    }
    .response-container {
    }
    .curl, .json-response {
      font-size: 12px;
      margin: 0;
      padding: 10px;
      white-space: pre-wrap;
      word-wrap: break-word;
      -webkit-hyphens: auto;
      -ms-hyphens: auto;
      hyphens: auto;
      border-radius: 4px;
      background: #41444e;
      overflow-wrap: break-word;
      font-weight: 600;
      color: $color-white;
    }
  }
</style>

<template>
  <section>
    <div class="api-title-container">
      <div class="summary">
        <div class="action">POST</div>
        <div class="path">{{httpEndpoint + (title.path || '')}}</div>
      </div>
    </div>
    <div class="api-content-container background-color-blue">
      <article class="header-title">
        Config EOS
      </article>
      <article class="header-content">
        <el-row>
          <el-col :span="6"><p class="bold font-12">Name</p></el-col>
          <el-col :span="18"><p class="bold font-12">Description</p></el-col>
        </el-row>
        <div class="divider"></div>
        <el-row>
          <el-col :span="6">
            <div><p class="bold font-14">HTTP END POINT</p></div>
          </el-col>
          <el-col :span="18">
            <div>
              <el-input v-model="httpEndpoint" placeholder="http://127.0.0.1:8888"></el-input>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div><p class="bold font-14">Key Provider</p></div>
          </el-col>
          <el-col :span="18">
            <div>
              <el-input v-model="privateKey" placeholder="your eos account private key"></el-input>
            </div>
          </el-col>
        </el-row>
      </article>
      <article class="request-title">
        Request Body
      </article>
      <article class="request-container">
        <el-row>
          <el-col :span="6"><p class="bold font-12">Name</p></el-col>
          <el-col :span="18"><p class="bold font-12">Description</p></el-col>
        </el-row>
        <div class="divider"></div>
        <div slot="request" v-if="bodyData">
          <el-row v-for="(item, key) in body" :key="key">
            <el-col :span="6">
              <div>
                <p class="bold font-14">{{item.label}}</p>
              </div>
            </el-col>
            <el-col :span="18">
              <div>
                <el-input :type="item.isJson ? 'textarea' : ''"
                          v-model="bodyData[key]" :placeholder="item.description"></el-input>
              </div>
            </el-col>
          </el-row>
        </div>
        <pre class="curl">{{curl}}</pre>
        <div class="action-row">
          <el-button type="primary" class="submit" @click.stop="onSubmit">
            Submit
          </el-button>
          <el-button type="warning" class="warning" @click.stop="onClear">
            Clear
          </el-button>
        </div>
      </article>
      <article class="response-title">Responses</article>
      <article class="response-container">
        <pre class="json-response">{{responseData}}</pre>
      </article>
    </div>
  </section>
</template>

<script>
  import { createNamespacedHelpers } from 'vuex';
  import { EOSAPIService } from '../../services/EOSAPIService';
  import { PANEL_STORE_NAME } from '../../store/modules/panel';

  const { mapActions: mapPanelActions } = createNamespacedHelpers(PANEL_STORE_NAME);

  export default {
    name: 'GeneralApiTemplate',
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
      return {
        bodyData: {},
        responseData: null,
        httpEndpoint: 'https://eos.greymass.com',
        privateKey: '',
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
        this.httpEndpoint = 'https://eos.greymass.com';
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
              keyProvider: this.privateKey,
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
    },

    mounted() {
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
