/*
* @Author: jack.lu
* @Date: 2021/1/6 11:05 上午
* @Last Modified by: jack.lu
* @Last Modified time: 2021/1/6 11:05 上午
* @Desc
*/
import defaultOptions from './config'
export default (name) => {
  const {events} = defaultOptions(name)
  let eventsFunctions = {}
  events.forEach(k => eventsFunctions[k] = function(){
    this.events[k] && this.events[k].call(this,...arguments)
  })
  return {
    props : {
      field : { // 控件内容
        type : Object,
        default(){
          return {}
        }
      },
      defaultValue : { // 默认值
        type : Object,
        default(){
          return {}
        }
      },
      submitData : { // 提交数据
        type : Object,
        default(){
          return {}
        }
      }
    },
    data(){
      return {
        events : this.field.events || {}//注册事件
      }
    },
    created(){
      this.initDefaultAct()
    },
    methods : {
      ...eventsFunctions,
      initDefaultAct (){
        if(this.field.type){ // 类型统一小写
          // console.log(this.field.type);
          // this.field.type = this.field.type.toLocaleLowerCase()
        }
      }
    }
  }
}