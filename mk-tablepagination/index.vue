<template>
    <div
        class="mk-tp"
        element-loading-background="rgba(255, 255, 255, 0)"
        element-loading-spinner="el-icon-loading"
        v-loading.lock="showLoading"
        ref="mkTP"
    >
        <div class="mk-tp_table">
            <normal-table
                ref="normalTable"
                :table-attrs="allTableAttrs"
                :table-listeners="allTableListener"
                :headers="headers"
                :height="tableHeight"
                :table-data="innerList"
                @onComponentChange="handleComponentChange"
            >
                <template
                    v-for="(slotItem, index) in headers"
                    #[slotItem.prop]="scope"
                >
                    <div
                        :key="index"
                        :class="slotItem.className"
                    >
                        <slot
                            :row="scope.row"
                            :name="slotItem.prop"
                        >
                        </slot>
                    </div>
                </template>
            </normal-table>
        </div>
        <div
            class="mk-tp_pagination"
        >
            <pagination
                @onPageSizeChange="handleSizeChange"
                @onCurrentChange="handleCurrentChange"
                :show-page="showPage"
                :cur-page="innerParams.curPage"
                :page-attrs="allPageAttrs"
                :page-size="innerParams.pageSize"
                :total-rows="innerTotalRows"
                :pageLayout="pageLayout"
            >
            </pagination>
        </div>
    </div>
</template>

<script>
import NormalTable from './table/index'
import Pagination from './pagination/index'
export default {
    name: 'mk-table-pagination',
    components: {
        NormalTable,
        Pagination
    },
    props: {
        tableAttrs: { // table属性--参考element-ui
            type: Object,
            default () {
                return {}
            }
        },
        columnAttrs: { // column属性 -- 参考element-ui
            type: Object,
            default () {
                return {}
            }
        },
        pageAttrs: {
            type: Object,
            default () {
                return {}
            }
        },
        pageLayout: {
            type: String,
            default: 'total, prev, pager, next, jumper'
        },
        headers: { // 表头信息 -- 同element-ui
            type: Array,
            default () {
                return []
            }
        },
        loading: { // table请求loading
            type: Boolean,
            default: true
        },
        pagehide: { // 隐藏分页
            type: Boolean,
            default: false
        },
        pageAutoHide: { // 自动隐藏分页  根据数据总量
            type: Boolean,
            default: true
        },
        defaultRequest: { // 默认请求
            type: Boolean,
            default: true
        },
        search: {
            type: Boolean,
            default: true
        },
        list: { // 列表数据
            type: Array,
            default () {
                return []
            }
        },
        totalRows: { // 总页数
            type: Number,
            default: 0
        },
        params: { // 请求参数
            type: Object,
            default () {
                return {
                    pageSize: 10,
                    curPage: 1
                }
            }
        },
        paramsAlias: { // 参数字段别名
            type: Object,
            default () {
                return {
                    curPage: 'curPage',
                    pageSize: 'pageSize'
                }
            }
        },
        resAlias: { // 响应字段别名
            type: Object,
            default () {
                return {
                    totalRows: 'data.total',
                    curPage: 'data.page',
                    pageSize: 'data.pageSize',
                    list: 'data.list'
                }
            }
        },
        api: { // 请求对象
            type: Object,
            default () {
                return {
                    name: '',
                    code: 500200,
                    obj: null
                }
            }
        }
    },
    data () {
      return {
          innerLoading: true,
          innerPageHide: true,
          innerTotalRows: 0,
          innerList: [],
          innerParams: {
              pageSize: 10,
              curPage: 1
          },
          tableHeight: 0
          // pageTop: 0 //todo
      }
    },
    watch: {
        params: {
            handler (to) {
                Object.assign(this.innerParams, to)
            },
            deep: true
        },
        totalRows (to) {
            this.innerTotalRows = to
        },
        list (to) {
            this.innerList = to
        },
        search () {
            this.getTableData()
        }
    },
    computed: {
        allTableAttrs () {
            // deepCopy
            return Object.assign({
                //公共属性
                border: true,
                size: 'small'
            }, this.tableAttrs)
        },
        allTableListener () {
            return Object.assign({
                // 自定义事件
            }, this.$listeners)
        },
        allColumnAttrs () {
            // deepCopy
            return Object.assign({
                //公共属性
            }, this.allColumnAttrs())
        },
        allPageAttrs () {
            return Object.assign({

            }, this.pageAttrs)
        },
        showLoading () {
            return this.loading && this.innerLoading
        },
        showPage () {
            return !this.pagehide && !this.innerPageHide
        }
    },
    created () {
        this.innerList = this.list
        Object.assign(this.innerParams, this.params)
        this.innerTotalRows = this.totalRows
        this.defaultRequest && this.getTableData()
    },
    mounted () {
        this.countHeight()
    },
    methods: {
        handleSizeChange (v) { // 更改每页显示条数
            this.innerParams[this.paramsAlias.pageSize] = v
            this.$emit('onPageSizeChange', v)
            this.getTableData()
        },
        handleCurrentChange (v) { // 切换当前页
            this.innerParams[this.paramsAlias.curPage] = v
            this.$emit('onCurrentChange', v)
            this.getTableData()
        },
        async getTableData () {
            if(!this.api.obj) return
            if (!this.api.name) {
                return console.log('请传递请求接口名称')
            }
            this.innerLoading = this.loading
            let { totalRows, curPage, pageSize, list } = this.resAlias
            let res = await this.api.obj[this.api.name](this.innerParams)
            this.innerLoading = false
            if (res.code === this.api.code || res.code === 500200) {
                this.innerTotalRows = this.dismantleStr(totalRows, res) || 0
                this.innerParams[this.paramsAlias.curPage] = this.dismantleStr(curPage, res) || 0
                this.innerParams[this.paramsAlias.pageSize] = this.dismantleStr(pageSize, res) || 10
                this.innerList = this.dismantleStr(list, res) || []
                this.innerPageHide = this.pageAutoHide && this.innerList.length === 0
                this.$emit('success', res)
                //todo 待定
                // this.$nextTick(() => {
                //     this.pageTop =this.pageAttrs.relative
                //         ? this.$refs.normalTable.$el.clientHeight - this.tableHeight + 'px'
                //         : 0
                // })
            } else {
                this.innerTotalRows = 0
                this.innerParams[this.paramsAlias.curPage] = 0
                this.innerParams[this.paramsAlias.pageSize] = 10
                this.innerList = []
                this.$emit('error', res)
            }
        },
        countHeight () {
            this.$nextTick(() => {
                this.tableHeight = this.tableAttrs.maxHeight || this.$refs.mkTP.clientHeight - 56
            })
        },
        dismantleStr (str, obj) {
            let arr = str.split('.')
            for (let i = 0; i < arr.length; i++) {
                obj = obj[arr[i]]
            }
            return obj
        },
        handleComponentChange (payload) {
            this.$emit('onComponentChange', payload)
        },
        setCurrentRow (rowIndex) { // 处理element-ui事件
            let row =this.innerList.length >= rowIndex ? this.innerList[rowIndex] : ''
            this.$refs.normalTable.$refs.table.setCurrentRow(row)
        },
        toggleRowSelection (rowIndex) {
            let row =this.innerList.length >= rowIndex ? this.innerList[rowIndex] : ''
            this.$refs.normalTable.$refs.table.toggleRowSelection(row)
        },
        clearSelection () {
            this.$refs.normalTable.$refs.table.clearSelection()
        },
        toggleAllSelection () {
            this.$refs.normalTable.$refs.table.toggleAllSelection()
        },
        toggleRowExpansion () {
            this.$refs.normalTable.$refs.table.toggleRowExpansion()
        },
        clearSort () {
            this.$refs.normalTable.$refs.table.clearSort()
        },
        clearFilter () {
            this.$refs.normalTable.$refs.table.clearFilter()
        },
        doLayout () {
            this.$refs.normalTable.$refs.table.doLayout()
        },
        sort () {
            this.$refs.normalTable.$refs.table.sort()
        }
    }
}
</script>

<style scoped lang="scss">
    .mk-tp {
        width: 100%;
        height: 100%;
        /*display: flex;*/
        /*flex-direction: column;*/
        /*justify-content: left;*/
        .mk-tp_table{
            flex: 1;
            overflow: hidden;
        }
        .mk-tp_pagination {
            height: 56px;
            /*flex-grow: 0;*/
            /*flex-shrink: 0;*/
            position: relative;
        }
    }
</style>