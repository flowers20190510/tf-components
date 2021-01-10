/*
* @Author: jack.lu
* @Date: 2021/1/6 9:59 上午
* @Last Modified by: jack.lu
* @Last Modified time: 2021/1/6 9:59 上午
* @Desc
*/
function titleCase (str) {
  return str[0].toUpperCase() + str.slice(1)
}
const keys = {}
export default Vue => {
  const components = (r => r.keys().map(key => {
    let tmp = key.split('/')[1]
    let name = 'mk-' + titleCase(tmp)
    keys[tmp] = name
    return ({
      key: name,
      value: r(key).default
    })
  }))(require.context('./', true, /^\.\/((?!\/)[\s\S])+\/index\.vue$/))
  components.forEach(item => Vue.component(item.key, item.value))
}
export { keys }