<template>
  <el-input
    @blur="blur"
    @focus="focus"
    @change="change"
    @input="input"
    @keyup.enter.native="keyup"
    v-model="defaultValue[field.prop]"
    v-bind="inputAttrs"
    :placeholder="placeholder"
  >
  </el-input>
</template>
<script>
let inputOpt = require('../common/index').default('input')
export default Object.assign(inputOpt, {
  mixins : [{
    data () {
      const {
        inputAttrs = {},
        placeholder = '请输入内容',
        blurEvent = null,
        keyupEnter =null,
        change = (v) => {}
      } = this.field
      return {
        placeholder,
        inputAttrs,
        blurEvent,
        keyupEnter,
        click: change
      }
    }
  }]
})
</script>
