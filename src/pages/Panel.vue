<style scoped lang="scss">
  @import '../styles/util';

  .container {
    display: flex;
    justify-content: flex-start;
  }

  .api-search {
    width: 360px;
    box-sizing: border-box;
    padding: 0;
    height: 100vh;
    overflow-y: scroll;
    .search-input {
      padding: 32px 24px;
    }
    .search-history, .execution-history {
      padding: 0 24px;
      margin-bottom: 32px;
    }
    h4 {
      font-size: 16px;
      color: rgba(0, 0, 0, 0.87);
      padding: 0 24px;
    }
    .api-history-item {
      padding: 12px 24px 12px 24px;
      display: flex;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      p {
        font-size: 14px;

        margin: 0;
        min-width: 100px;
      }
      p:first-child {
        color: rgba(0, 0, 0, 0.87);
        font-weight: 500;
      }
      p:nth-child(2) {
        color: rgba(0, 0, 0, 0.56);
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
    }
    .api-history-item:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }

    .tabs {
      display: flex;
      align-items: center;
      > div {
        cursor: pointer;
        flex-basis: 50%;
        padding: 12px;
        &:hover {
          color: $color-blue;
        }
        &.active {
          color: $color-blue;
          border-bottom: 2px solid $color-blue;
        }
      }
    }
    .tab-content {
      .clear {
        background-color: rgba(0, 0, 0, 0.06);
      }
      .item {
        cursor: pointer;
        padding: 8px;
        border-bottom: 1px solid lightgrey;
        &.active {
          background-color: $color-light-blue;
        }
      }
    }
  }

  .api-content-wrapper {
    flex: 1;
    padding: 12px;
    height: 100vh;
    overflow-y: scroll;
  }

</style>
<template>
  <div class="panel-container">
    <div class="container">
      <section class="api-search">
        <div class="search-input background-color-blue">
          <el-input
            placeholder="API Name or API Path"
            :value="keyword"
            @change="(keyword) => search({keyword})">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div class="tabs">
          <div :class="{active: selectedTab === TAB_OPTIONS.collection}"
               @click="() => selectTab(TAB_OPTIONS.collection)">COLLECTION
          </div>
          <div :class="{active: selectedTab === TAB_OPTIONS.history}"
               @click="() => selectTab(TAB_OPTIONS.history)">HISTORY
          </div>
        </div>
        <div class="divider"></div>
        <div class="tab-content">
          <div v-if="selectedTab === TAB_OPTIONS.history" class="item clear"
               @click="clearHistory">
            Clear All History
          </div>
          <div :class="['item', {active: api.key === currentAPI.key}]"
               v-for="api in filteredItems" :key="api.key"
               @click="() => onApiSelected(api)">
            {{api.key}}
          </div>
        </div>
      </section>
      <section class="api-content-wrapper" v-if="currentAPI">
        <general-api-template
          :key="currentAPI.key"
          :apiKey="currentAPI.key"
          :title="currentAPI.title"
          :body="currentAPI.body"
          :requestMethod="currentAPI.requestMethod || 'getInfo'"/>
      </section>
    </div>
  </div>
</template>

<script>
  import { createNamespacedHelpers } from 'vuex';
  // eosjs-api actions
  import GeneralApiTemplate from '../components/eosjs-api/GeneralApiTemplate';
  import { PANEL_STORE_NAME, TAB_OPTIONS } from '../store/modules/panel';
  import { APIDefinitions } from '../services/ResourceService';

  const {
    mapState: mapPanelState,
    mapActions: mapPanelActions,
    mapGetters: mapPanelGetters,
  } = createNamespacedHelpers(PANEL_STORE_NAME);
  export default {
    name: 'Panel',
    components: { GeneralApiTemplate },
    computed: {
      ...mapPanelState([
        'keyword',
        'rawApis',
        'selectedTab',
      ]),
      ...mapPanelGetters([
        'filteredItems',
      ]),
    },
    methods: {
      ...mapPanelActions([
        'init',
        'initRawApi',
        'search',
        'selectTab',
        'clearHistory',
      ]),
      onApiSelected(api) {
        this.currentAPI = { ...api };
      },
    },
    data() {
      return {
        TAB_OPTIONS,
        apiRaw: [],
        currentAPI: {},
      };
    },
    mounted() {
      this.init();
      this.initRawApi(APIDefinitions.raw);
      this.currentAPI = this.filteredItems[0];
    },
  };
</script>

