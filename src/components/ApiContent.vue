<style scoped lang="scss">
  @import '../styles/util';

  .collapse-item-wrapper {
    > article {
      padding: 12px;
    }
    .el-row {
      margin-top: 8px;
    }
    .row-item {
      display: flex;
      align-items: center;
    }
    .request-title, .response-title {
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
        <el-row class="row-item" v-for="(item, key) in body" :key="key">
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
  </section>
</template>

<script>
  export default {
    name: 'ApiContent',
    props: {
      curl: {
        type: String,
        required: true,
      },
      bodyData: {
        type: Object,
        required: true,
      },
      responseData: {
        type: Object,
        required: false,
      },
      body: {
        type: Object,
        default: () => ({}),
      },
    },
    methods: {
      onSubmit() {
        this.$emit('executeCommand');
      },
      onClear() {
        this.$emit('clear');
      },
    },
  };
</script>

