<!-- 下拉 -->
<template lang="html">
  <el-select
  @blur="blur"
  @clear="clear"
  @focus="focus"
  @change="change"
  @remove-tag="removeTag"
  @visible-change="visibleChange"
  v-bind="selectAttrs"
  v-model="defaultValue[field.prop]"
  :placeholder="field.placeholder || '请选择'">
    <el-option
      v-for="(item,index) in field.options"
      v-bind="computeSelfAttrs(item.attrs)"
      :key="index"
      :label="item[alias.label]"
      :value="item[alias.value]">
    </el-option>
  </el-select>
</template>

<script>
let selectOpt = require('../common/index').default('select')
export default Object.assign(selectOpt,{
  mixins : [{
    data(){
      const {
        selectAttrs = {},
        optionAttrs = {},
        placeholder = '请选择',
        api= {
          code: 500200,
          obj: null,
          name: ''
        },
        autoSelect= false,
        params = {},
        alias  = {
          list : 'data.list',
          label : 'label',
          value : 'value'
        },
        success,
        error
      } = this.field;

      return {
        placeholder,
        selectAttrs,
        optionAttrs,
        success,
        error,
        alias,
        api,
        params,
        autoSelect
      }
    },
    beforeMount () {
      this.getOptionData();
    },
    watch : {
      'field.params' (n) {//监听参数变化请求
        this.getOptionData()
      }
    },
    methods : {
      computeSelfAttrs(value){//合并属性
        return Object.assign({

        },this.optionAttrs,value);
      },
      async getOptionData () {//内部方式请求
        let { obj, name, code = 500200 } = this.api
        if (!obj) return
        let res = await obj[name](this.params)
        if (res.code === code) {
          this.field.options = this.dismantleStr(this.alias.list, res);
          if (this.autoSelect) {
            this.defaultValue[this.field.prop] =  this.field.options[0][this.alias.value]
          }
          this.success && this.success()
        } else {
          this.error && this.error()
        }
      },
      dismantleStr (str, obj) {
        let arr = str.split('.')
        for (let i = 0; i < arr.length; i++) {
          obj = obj[arr[i]]
        }
        return obj
      },
    }
  }]
})
</script>

<style lang="scss">
</style>
