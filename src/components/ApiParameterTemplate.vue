<style scoped lang="scss">
  @import '../styles/util';

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
      .dropdown-menu {
        justify-content: flex-end;
      }
      .el-select .el-input {
        width: 130px;
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
        <div class="path">{{ sharedHttpEndpoint + (title.path || '') }}</div>
        <div class="dropdown-menu">
          <el-dropdown split-button type="primary" @click="dialogVisible = true"
          @command="onSelect">
            NewTemplate
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">defaultParam</el-dropdown-item>
              <el-dropdown-item command="2">paramTemplate1</el-dropdown-item>
              <el-dropdown-item command="3">paramTemplate2</el-dropdown-item>
              <el-dropdown-item command="4">paramTemplate3</el-dropdown-item>
              <el-dropdown-item command="5">paramTemplate4</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dialog title="New Parameter Template" :visible.sync="dialogVisible" width="50%">
            <el-form :model="form">
              <el-form-item label="HTTP END POINT" :label-width="formLabelWidth">
                <el-input v-model="form.endPoint" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Key Provider" :label-width="formLabelWidth">
                <el-input v-model="form.keyProvider" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="Template Select" :label-width="formLabelWidth">
                <el-select v-model="form.templateName"
                placeholder="Please select Template to store paramters.">
                  <el-option label="paramTemplate1" value="1"></el-option>
                  <el-option label="paramTemplate2" value="2"></el-option>
                  <el-option label="paramTemplate3" value="3"></el-option>
                  <el-option label="paramTemplate4" value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">Cancel</el-button>
              <el-button type="primary" @click="onAddNewTemplate">Confirm</el-button>
            </span>
          </el-dialog>
        </div>
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
              <el-input v-model="sharedHttpEndpoint" placeholder="http://127.0.0.1:8888"></el-input>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div><p class="bold font-14">Key Provider</p></div>
          </el-col>
          <el-col :span="18">
            <div>
              <el-input v-model="sharedKeyProvider"
                placeholder="your eos account private key"></el-input>
            </div>
          </el-col>
        </el-row>
      </article>
    </div>
  </section>
</template>

<script>
  import { createNamespacedHelpers } from 'vuex';
  import { TEMPLATE_STORE_NAME } from '../store/modules/parameterTemplate';
  import { LocalStorage, StorageKeys } from '../services/LocalStorage';

  const { mapActions: mapTemplateActions } = createNamespacedHelpers(TEMPLATE_STORE_NAME);
  export default {
    name: 'ApiParameterTemplate',
    props: {
      title: {
        type: Object,
        required: true,
        default: () => ({}),
      },
      requestMethod: {
        type: String,
        required: true,
      },
    },
    data() {
      console.log('Running here, ApiParameterTemplate.vue');
      return {
        sharedHttpEndpoint: LocalStorage.get(StorageKeys.HTTP_END_POINT, 'https://eos.greymass.com'),
        sharedKeyProvider: LocalStorage.get(StorageKeys.KEY_PROVIDER, '+1s'),
        dialogVisible: false,
        form: {
          endPoint: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
        },
        select: '',
        formLabelWidth: '200px',
      };
    },
    methods: {
      onClear() {
        this.responseData = null;
        this.httpEndpoint = LocalStorage.get(StorageKeys.HTTP_END_POINT, '');
        this.keyProvider = LocalStorage.get(StorageKeys.KEY_PROVIDER, '');
        const bodyData = {};
        Object.keys(this.body)
          .forEach((key) => {
            bodyData[key] = this.body[key].val;
          });
        this.bodyData = bodyData;
      },
      ...mapTemplateActions(['templateSelectTab']),
      onSelect(command) {
        switch (command) {
          case '2': {
            break;
          }
          case '3': {
            break;
          }
          case '4': {
            break;
          }
          case '5': {
            break;
          }
          default: {
            this.sharedHttpEndpoint = LocalStorage.get(StorageKeys.HTTP_END_POINT, 'https://eos.greymass.com');
            this.sharedKeyProvider = LocalStorage.get(StorageKeys.KEY_PROVIDER, '+10086');
            break;
          }
        }
        console.log('Param selected: ', command);
      },
      onAddNewTemplate() {
        this.sharedHttpEndpoint = this.form.endPoint;
        this.sharedKeyProvider = this.form.keyProvider;
        this.dialogVisible = false;
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
