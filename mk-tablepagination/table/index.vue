<template>
  <el-table
      :data="tableData"
      v-bind="tableAttrs"
      v-on="tableListeners"
      :max-height="height"
      ref="table"
  >
    <template
        v-for="(head, index) in headers"
    >
      <el-table-column
          v-if="head.component"
          v-bind="filterHead(head)"
          :key="index"
      >
        <template
            #default="scope"
        >
          <component
              :is="head.component"
              :scope="scope.row"
              @onComponentChange="handleComponentChange"
          >
          </component>
        </template>
        <template
            #header="scope"
        >
          <component
              v-if="head.head"
              v-bind="head"
              :is="head.head"
          />
          <template
              v-else
          >
            {{ scope.column.label }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
          v-else-if="head.slot"
          :key="index"
          :width="head.width"
          :label="head.label"
      >
        <template
            #default="scope"
        >
          <slot
              :row="scope.row"
              :name="head.prop"
          >
          </slot>
        </template>
      </el-table-column>
      <el-table-column
          v-else
          v-bind="head"
          :key="index"
      >
      </el-table-column>
    </template>


<!--    <el-table-column-->
<!--        v-for="(head, index) in headers"-->
<!--        v-bind="head"-->
<!--        :key="index"-->
<!--        :label="head.label"-->
<!--    >-->
<!--      <template-->
<!--          #default="scope"-->
<!--      >-->
<!--        <component-->
<!--            :is="head.component"-->
<!--            v-if="head.component"-->
<!--            :scope="scope.row"-->
<!--            @onComponentChange="handleComponentChange"-->
<!--        >-->
<!--        </component>-->
<!--        <template-->
<!--            slot-scope="scope"-->
<!--            v-else-if="head.slot"-->
<!--        >-->
<!--          <slot-->
<!--              :row="scope.row"-->
<!--              :name="head.prop"-->
<!--          >-->
<!--          </slot>-->
<!--        </template>-->
<!--        <template v-else>-->
<!--          {{scope.row[head.prop]}}-->
<!--        </template>-->
<!--      </template>-->
<!--      <template-->
<!--          #header="scope"-->
<!--      >-->
<!--        <component-->
<!--            v-if="head.head"-->
<!--            v-bind="head"-->
<!--            :is="head.head"-->
<!--        />-->
<!--        <template-->
<!--            v-else-->
<!--        >-->
<!--          {{ scope.column.label }}-->
<!--        </template>-->
<!--      </template>-->
<!--    </el-table-column>-->
  </el-table>
</template>

<script>
export default {
  name: 'normal-table',
  props: {
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    tableAttrs: {
      type: Object,
      default () {
        return {}
      }
    },
    tableListeners: {
      type: Object,
      default () {
        return {}
      }
    },
    headers: {
      type: Array,
      default () {
        return []
      }
    },
    height: {
      type: Number,
      default: 0
    }
  },
  methods: {
    filterHead (head) {
      let map = {}
      for (let key in head) {
        if(key !== 'component' && key !== 'head') {
          map[key] = head[key]
        }
      }
      return map
    },
    handleComponentChange (payload) {
      this.$emit('onComponentChange', payload)
    }
  }
}
</script>

<style scoped lang="scss">
    .normal-table {
        height: 100%;
    }
</style>