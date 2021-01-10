<template>
  <div class="form-fields">
    <el-form
        ref="formFields"
        class="form-fields"
        v-bind="totalFormFieldsAttrs"
        :model="formFields"
        :rules="formRules"
    >
      <slot name="beforeItem"></slot>
      <el-form-item
          v-for="(field,key) in effectiveFields"
          v-show="!field.hidden"
          v-bind="computeAttrs(totalFormFieldItemAttrs, field.attrs)"
          :key="key"
          :class="{'mk-form-fields_item': true, 'l': field.float}"
          :label="field.label"
          :prop="field.prop"
      >
        <component
            :is="components[field.type] || 'mk-input'"
            v-if="!field.slot"
            :field="field"
            :class="`mk-form-fields_item--${field.type}`"
            :default-value="formFields"
        >
        </component>
        <slot
            v-else
            :name="field.prop"
        >
        </slot>
      </el-form-item>
      <slot name="beforeBtn"></slot>
      <div
          :class="{'form-action': true, 'line': (formFieldsAttrs.inline ? formFieldsAttrs.inline : false)}"
      >
        <!-- 按钮 -->
        <el-form-item>
          <!-- 前置按钮 -->
          <el-button
              v-for="(item,key) in prefixButton"
              v-bind="item.attrs || {}"
              :key="key+'prefix'"
              :size="item.size || 'mini'"
              :type="item.type || 'info' "
              :class="'prefix-'+ item.class"
              :style="item.style"
              @click="item.click && item.click()"
          >
            {{ item.text }}
          </el-button>
          <!-- 提交按钮 -->
          <el-button
              v-if="innerButtonOptions.submit.show"
              size="mini"
              :type="innerButtonOptions.submit.type"
              @click="onSubmit('formFields')"
          >
            {{ innerButtonOptions.submit.name }}
          </el-button>
          <!-- 重置按钮 -->
          <el-button
              v-if="innerButtonOptions.reset.show"
              size="mini"
              :type="innerButtonOptions.reset.type"
              @click="resetFields('formFields')"
          >
            {{ innerButtonOptions.reset.name }}
          </el-button>
          <!-- 后置按钮 -->
          <el-button
              v-for="(item,key) in suffixButton"
              v-bind="item.attrs || {}"
              :key="key+'suffix'"
              :type="item.type || 'info' "
              :size="item.size || 'mini'"
              :class="'suffix-'+ item.class"
              :style="item.style"
              @click="item.click && item.click()"
          >
            {{ item.text }}
          </el-button>
        </el-form-item>
      </div>
      <slot name="afterBtn"></slot>
    </el-form>
  </div>
</template>

<script>
import { keys } from './fields/index'
import { MessageBox } from 'element-ui'
import {Obj} from './utils'
export default {
  name: 'form-fields',
  props: {
    formFieldsAttrs: { // 表单注入属性
      type: Object,
      default () {
        return {
          inline: false
        }
      }
    },
    formFieldItemAttrs: { // 表单元素属性
      type: Object,
      default () {
        return {}
      }
    },
    fields: { // 表单字段
      type: Array,
      default () {
        return []
      }
    },
    formFields: { // 表单数据对象
      type: Object,
      default () {
        return {}
      }
    },
    formRules: { // 表单校验规则
      type: Object,
      default () {
        return {}
      }
    },
    prefixButton: { // 前置按钮
      type: Array,
      default () {
        return []
      }
    },
    suffixButton: { // 后置按钮
      type: Array,
      default () {
        return []
      }
    },
    innerButton: { // 内置按钮
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      components: {
        ...keys
      }
    }
  },
  computed: {
    totalFormFieldsAttrs () { // 合并form属性
      return Object.assign({
        inline: true,
        labelWidth: '100px',
        size: 'mini'
      }, this.formFieldsAttrs)
    },
    effectiveFields () { // 有效字段
      return this.fields.filter(item => item.prop)
    },
    totalFormFieldItemAttrs () {
      return Object.assign({

      }, this.formFieldItemAttrs)
    },
    innerButtonOptions: function () {
      return Obj.merge({
        reset: {
          show: false,
          name: '重置',
          text: '你确定要重置这些信息？',
          type: 'info',
          title: '提示',
          resetToast: true,
          afterReset: void 0,
          beforeReset: void 0,
          cancelButtonText: '取消',
          confirmButtonText: '确定'
        },
        submit: {// 提交按钮默认属性
          show: true,
          name: '提交',
          type: 'primary',
          afterSubmit: void 0,
          beforeSubmit: void 0
        }
      }, this.innerButton)
    }
  },
  methods: {
    computeAttrs (arg0, arg1) { // 浅合并
      return Object.assign({}, arg0, arg1)
    },
    resetFields: function () { // 重置表单内容
      let reset = this.$refs.formFields.resetFields
      let {
        text, title, confirmButtonText, beforeReset, afterReset,
        cancelButtonText, resetToast
      } = this.innerButtonOptions.reset
      resetToast
        ? this.resetNotify(text, title, () => {
          if (typeof beforeReset === 'function' && beforeReset() === false) return // 重置前调用
          reset()// 重置操作
          typeof afterReset === 'function' && afterReset()// 重置后调用
        })
        : reset()
    },
    onSubmit () { // 提交表单内容
      let { afterSubmit, beforeSubmit } = this.innerButtonOptions.submit
      this.$refs.formFields.validate((valid) => { // 验证表单
        if (valid) {
          let temp = JSON.parse(JSON.stringify(this.formFields))
          if (typeof beforeSubmit === 'function' && beforeSubmit() === false) { // 提交前调用
            return
          }
          this.$emit('success', temp) // 提交成功派发
          typeof afterSubmit === 'function' && afterSubmit() // 提交后调用
        } else {
          this.$emit('error')
          return false
        }
      })
    },
    resetNotify (msg, title, success, error) {
      MessageBox.confirm(msg, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          success && success()
        })
        .catch(() => {
          error && error();
        })
    }
  }
}
</script>

<style scoped lang="scss">
    .form-fields {
      width: 100%;
      .line{
        display: inline-block;
      }
    }
</style>