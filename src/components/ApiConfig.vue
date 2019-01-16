<style scoped lang="scss">
  @import '../styles/util';

  .collapse-item-wrapper {
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

    .header-title {
      display: flex;
      flex-direction: row;
      align-items: center;
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
  <section class="collapse-item-wrapper background-color-blue">
    <article class="header-title">
      Config EOS &emsp;
      <div class="dropdown-menu">
        <el-dropdown split-button type="primary" @click="dialogVisible = true"
        @command="onSelect">
          NewTemplate
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0">defaultParam</el-dropdown-item>
            <el-dropdown-item command="1">paramTemplate1</el-dropdown-item>
            <el-dropdown-item command="2">paramTemplate2</el-dropdown-item>
            <el-dropdown-item command="3">paramTemplate3</el-dropdown-item>
            <el-dropdown-item command="4">paramTemplate4</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dialog title="New Parameter Template" :visible.sync="dialogVisible" width="50%">
          <el-form :model="form">
            <el-form-item label="HTTP END POINT" :label-width="formLabelWidth">
              <el-input v-model="form.endPoint" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="KEY PROVIDER" :label-width="formLabelWidth">
              <el-input v-model="form.keyProvider" autocomplete="off"
                placeholder="Please use either Scatter or input private key"
                :disabled="form.keyAuthMode === true"></el-input>
              <el-tooltip content="Scatter keeps private key safe"
                placement="bottom" effect="light">
                <el-button>Scatter</el-button>
              </el-tooltip>&emsp;
              <el-switch v-model="form.keyAuthMode" @change="onScatterSelect"
                :active-value=true :inactive-value=false></el-switch>
            </el-form-item>
            <el-form-item label="SAVE TO " :label-width="formLabelWidth">
              <el-select v-model="form.templateName"
              placeholder="Please select Template to store paramters.">
                <el-option label="defaultParam" value="0"></el-option>
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
    </article>
    <article class="header-content">
      <el-row>
        <el-col :span="6"><p class="bold font-14">Name</p></el-col>
        <el-col :span="18"><p class="bold font-14">Description</p></el-col>
      </el-row>
      <div class="divider"></div>
      <el-row>
        <el-col :span="6"><p class="bold font-14">Http End Point</p></el-col>
        <el-col :span="18">
          {{this.httpEndpoint}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><p class="bold font-14">Private Key</p></el-col>
        <el-col :span="18">
          {{this.privateKey}}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><p class="bold font-14">Use Scatter</p></el-col>
        <el-col :span="18">
          {{this.keyAuthMode}}
        </el-col>
      </el-row>
    </article>
  </section>
</template>

<script>
  import ScatterJS from 'scatterjs-core';
  import { LocalStorage } from '../services/LocalStorage';
  import { ScatterService } from '../services/ScatterService';

  export default {
    name: 'ApiConfig',
    props: {
      httpEndpoint: {
        type: String,
        required: true,
        default: '',
      },
      privateKey: {
        type: String,
        required: true,
        default: '',
      },
      keyAuthMode: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    data() {
      return {
        dialogVisible: false,
        formLabelWidth: '200px',
        form: {
          endPoint: '',
          keyProvider: '',
          keyAuthMode: false,
          templateName: '',
        },
      };
    },
    methods: {
      onSelect(command) {
        this.$emit('selectTemplate', command);
      },
      onScatterSelect() {
        this.keyAuthMode = this.form.keyAuthMode;
        console.log('method: onScatterSelect');
        console.log(ScatterJS.scatter);
        console.log(`scatter exist: ${ScatterService.isScatterExtensionExist}`);
        if (this.form.keyAuthMode === true) {
          if (ScatterService.isScatterExtensionExist === false) {
            this.$notify({
              title: 'Error',
              message: 'Scatter is not installed. Refresh page after installing.',
              type: 'error',
            });
          } else {
            const promiseGetId = ScatterJS.scatter.getIdentity(ScatterService.scatterNetwork);
            promiseGetId.then((id) => {
              console.log(id);
              if (id !== null && id.publicKey.indexOf('EOS') === 0) {
                this.$notify({
                  title: 'Success',
                  message: 'Scatter Authoration Completed.',
                  type: 'success',
                });
              }
            }).then(() => {
              ScatterJS.scatter.authenticate().then((sig) => {
                // This will return your `location.host`
                // signed with their Identity's private key.
                // It has already been validated,
                // but you can validate it yourself as well using eosjs-ecc.
                console.log(sig);
              }).catch(err => console.log('auth err', err));
            }).catch((err) => {
              console.log(err);
              if (err.type === 'locked') {
                this.$notify({
                  title: 'Warning',
                  message: 'Scatter is locked. Refresh page after unlocking.',
                  type: 'warning',
                });
              }
              // 当scatter extension处于locked状态时，更改使用scatter的设置为false;
              this.form.keyAuthMode = false;
              this.keyAuthMode = false;
            });
            /* ScatterJS.scatter.getIdentity().then(() => {}, (err) => {
              console.log(err);
              if (err.type === 'locked') {
                this.$notify({
                  title: 'Warning',
                  message: 'Scatter is locked. Refresh page after unlocking.',
                  type: 'warning',
                });
              }
              // 当scatter extension处于locked状态时，更改使用scatter的设置为false;
              this.form.keyAuthMode = false;
              this.keyAuthMode = false;
            });
            const identity = ScatterJS.scatter.identity;

            // const account = identity.accounts.find(x => x.blockchain === 'eos');
            if (identity !== null && identity.publicKey.indexOf('EOS') === 0) {
              this.$notify({
                title: 'Success',
                message: 'Scatter Authoration Completed.',
                type: 'success',
              });
            } */
          }
        }
      },
      onAddNewTemplate() {
        const templateName = parseInt(this.form.templateName, 10);
        console.log(`template name in onAddNewTemplate() method is ${templateName}`);
        let parameter = {};
        if (this.keyAuthMode === false || typeof window.scatter === 'undefined') {
          parameter = {
            httpEndpoint: this.form.endPoint,
            keyProvider: this.form.keyProvider,
            keyAuthMode: this.keyAuthMode,
          };
          this.httpEndpoint = this.form.endPoint;
          this.privateKey = this.form.keyProvider;
        } else {
          parameter = {
            httpEndpoint: this.form.endPoint,
            keyProvider: this.scatter,
            keyAuthMode: this.mainKeyAuth,
          };
          this.httpEndpoint = this.form.endPoint;
          this.privatekey = this.scatter;
        }
        LocalStorage.update(templateName, parameter);
        this.dialogVisible = false;
        this.$emit('selectTemplate', templateName);
      },
    },
  };
</script>

