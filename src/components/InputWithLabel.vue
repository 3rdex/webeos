<style scoped lang="scss">
  @import '../styles/util';

  .input-with-label-container {
    margin-top: 12px;
  }
</style>
<template>
  <div class="input-with-label-container">
    <el-row>
      <el-col :span="6">
        <div>
          <p class="bold font-14">{{labelName}}</p>
        </div>
      </el-col>
      <el-col :span="18">
        <div v-if="!jsonInput">
          <el-input :value="inputVal" @input="handleChange" :placeholder="placeHolder"></el-input>
        </div>
        <div v-else>
          <el-input type="textarea" :rows="6" :value="inputVal"
                    @input="handleChange" :placeholder="placeHolder"></el-input>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'InputWithLabel',
    props: ['labelName', 'placeHolder', 'value', 'jsonInput'],
    data() {
      return { inputVal: this.value };
    },
    methods: {
      handleChange(val) {
        this.$emit('input', val);
      },
    },
    mounted() {
      console.log('val in input with label mounted', this.value);
    },
    updated() {
      console.log('val in input with label updated', this.value);
    },
  };
</script>

