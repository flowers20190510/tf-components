<!-- 输入域 -->
<template lang="html">
  <el-input
    type="textarea"
    @blur="blur"
    @focus="focus"
    @change="change"
    v-model="defaultValue[field.prop]"
    v-bind="textareaAttrs"
    :placeholder="placeholder"
  >
  </el-input>
</template>

<script>
let textareaOpt = require('../common/index').default('input')
export default Object.assign(textareaOpt,{
  mixins : [{
    data(){
      const {
        textareaAttrs = {},
        placeholder = '请输入内容'
      } = this.field;
      return {
        placeholder,
        textareaAttrs
      }
    }
  }]
})
</script>
