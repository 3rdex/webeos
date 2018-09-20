<style lang="scss" scoped>
  .transaction-data-input-container {
    padding: 0;
    p {
      line-height: 48px;
    }
  }

  .data-field-type-tag {
    border-radius: 4px;
    cursor: pointer;
    margin: 0 8px;
    padding: 4px 8px;
    font-size: 14px;
    color: white;
    background-color: skyblue;
  }

  .data-field-insert-normal-row, .data-field-insert-object-row {
    display: flex;
    input {
      border: none;
      outline: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.26);
      background-color: white;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      font-size: 14px;
      height: 32px;
      padding: 0 8px;
      margin: 8px 0;
    }
    .field-name {
      width: 120px;
    }
    .colon, .comma {
      line-height: 48px;
      font-size: 16px;
      margin: 0 8px;
    }
  }

  .data-field-insert-normal-row {
    align-items: center;
  }

  .data-field-insert-object-row {
    align-items: flex-start;
  }

  .icon-remove {
    cursor: pointer;
    font-size: 16px;
    color: orangered;
    margin: 0 12px;
    line-height: 48px;
  }
</style>

<template>
  <div class="transaction-data-input-container">
    <p>{{fieldType === 'array' ? '[' : '{'}}</p>
    <div style="padding-left: 24px;">
      <div v-for="(field, idx) in fieldValue" :class="{
                    'data-field-insert-normal-row': ['number', 'string'].includes(field.type),
                    'data-field-insert-object-row': ['array', 'object'].includes(field.type),
                    }" :key="idx">
        <input
          v-if="fieldType !== 'array'"
          :ref="`${fieldName}dataFieldInput${idx}`"
          value="block_number_id"
          v-model="field.name"
          class="field-name"/>
        <span v-if="fieldType !== 'array'" class="colon">:</span>
        <input v-if="['string', 'number'].includes(field.type)"
               v-model="field.value"
               :type="field.type"
               class="field-value__normal"/>
        <span class="icon-remove el-icon-error" @click="() => removeField(idx)"></span>
        <div v-if="['array', 'object'].includes(field.type)">
          <transaction-data-input
            @change="(val) => handleObjectChange(idx, val)"
            :field-type="field.type"
            :field-name="field.name"
            :field-value="field.value"/>
        </div>
      </div>
      <div>
        <span>Field: </span>
        <span class="data-field-type-tag" @click="() => addField(type)"
              v-for="type in ['number', 'string', 'array', 'object']"
              :key="type">{{type}}</span>
      </div>
    </div>
    <p>{{fieldType === 'array' ? ']' : '}'}}</p>
  </div>
</template>

<script>
  function getDefaultValue(type) {
    let defaultValue = '';
    switch (type) {
      case 'object':
        defaultValue = [];
        break;
      case 'array':
        defaultValue = [];
        break;
      case 'number':
        defaultValue = 0;
        break;
      case 'string':
      default:
        defaultValue = '';
    }
    return defaultValue;
  }

  export default {
    name: 'TransactionDataInput',
    props: {
      fieldType: { type: String },
      fieldName: { type: String, default: '' },
      fieldValue: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    methods: {
      handleObjectChange(idx, val) {
        const newVal = [].concat(this.fieldValue);
        newVal[idx] = val;
        // this.fieldValue = [].concat(this.fieldValue).concat([val])
        this.$emit('change', { type: this.fieldType, name: this.fieldName, value: newVal });
      },
      addField(type) {
        const field = { type, name: '', value: getDefaultValue(type) };
        const value = [].concat(this.fieldValue).concat([field]);
        this.$emit('change', { type: this.fieldType, name: this.fieldName, value });
      },
      removeField(idx) {
        const value = [].concat(this.fieldValue);
        value.splice(idx, 1);
        this.$emit('change', { type: this.fieldType, name: this.fieldName, value });
      },
    },
  };
</script>
