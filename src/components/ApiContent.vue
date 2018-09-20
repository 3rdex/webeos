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
      Config EOS
    </article>
    <article class="header-content">
      <el-row>
        <el-col :span="6"><p class="bold font-12">Name</p></el-col>
        <el-col :span="18"><p class="bold font-12">Description</p></el-col>
      </el-row>
      <div class="divider"></div>
      <el-row>
        <el-col :span="6"><p class="bold font-12">httpEndpoint</p></el-col>
        <el-col :span="18">
          <el-input :value="httpEndpoint" @change="updatehttpEndpoint"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6"><p class="bold font-12">PrivateKey</p></el-col>
        <el-col :span="18">
          <el-input :value="privateKey" @change="updatePrivateKey"></el-input>
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
      <slot name="request"></slot>
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
      <pre class="json-response">{{data}}</pre>
    </article>
  </section>
</template>

<script>
  export default {
    name: 'ApiContent',
    props: {
      generalInfo: {
        type: String,
        required: true,
      },
      curl: '',
      data: null,
      requirePrivateKey: {
        type: Boolean,
        default: false,
        required: false,
      },
      httpEndpoint: {
        type: String,
        default: 'http://127.0.0.1:8888',
      },
      privateKey: {
        type: String,
        default: '',
      },
    },
    methods: {
      onSubmit() {
        this.$emit('execute');
      },
      onClear() {
        this.httpEndpoint = '';
        this.privateKey = '';
        this.$emit('clear');
      },
      updatehttpEndpoint(val) {
        console.log('in update http end point ', val);
        this.$emit('change-http-end-point', val);
      },
      updatePrivateKey(val) {
        this.$emit('change-private-key', val);
      },
    },
  };
</script>

