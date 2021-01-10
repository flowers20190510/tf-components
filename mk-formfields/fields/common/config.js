/*
* @Author: jack.lu
* @Date: 2021/1/6 11:05 上午
* @Last Modified by: jack.lu
* @Last Modified time: 2021/1/6 11:05 上午
* @Desc
*/

/*  事件集 */
const eventsMap = {
  time : ['change'],
  input : ['change', 'blur', 'focus', 'input', 'keyup'],
  radio : ['change'],
  select : ['change','visibleChange','removeTag','clear','blur','focus'],
  slider : ['change'],
  switch : ['change'],
  checkbox : ['change'],
  textarea : ['change','blur','focus'],
  fixedTime : ['change'],
  datePicker : ['change'],
  dateTimePicker : ['change'],
  fixedTimeRange : ['change'],
  cascader : ['change', 'visibleChange', 'removeTag', 'clear', 'blur', 'focus'],
}
export default (name) => {
  return {
    events : eventsMap[name] || ['change']
  }
}
