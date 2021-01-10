/*
* @Author: jack.lu
* @Date: 2021/1/6 9:57 上午
* @Last Modified by: jack.lu
* @Last Modified time: 2021/1/6 9:57 上午
* @Desc
*/

export default Vue => {
  require('./fields').default(Vue)
  Vue.component('form-fields', require('./index.vue').default)
}