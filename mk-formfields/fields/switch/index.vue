<!-- 开关 -->
<template lang="html">
  <el-switch
    @change="change"
    :inactive-text="offText"
    :active-text="onText"
    v-bind="switchAttrs"
    v-model="defaultValue[field.prop]"
  >
  </el-switch>
</template>

<script>
let switchOpt = require('../common/index').default('switch')
export default Object.assign(switchOpt,{
  mixins : [{
    data(){
      const {
        onText = '',
        offText = '',
        switchAttrs = {}
      } = this.field;
      return {
        onText,
        offText,
        switchAttrs
      }
    },
    methods : {

    }
  }]
})
</script>
