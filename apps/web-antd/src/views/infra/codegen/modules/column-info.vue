<script lang="ts" setup>
import type { InfraCodegenApi } from '#/api/infra/codegen';
import type { SystemDictTypeApi } from '#/api/system/dict/type';

import { computed, nextTick, onMounted, ref, watch } from 'vue';

import { Checkbox, Input, Radio, Select } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSimpleDictTypeList } from '#/api/system/dict/type';

import { useCodegenColumnTableColumns } from '../data';

const props = defineProps<{
  columns?: InfraCodegenApi.CodegenColumn[];
}>();

/** 列过滤类型 */
type FilterType = 'all' | 'create' | 'list' | 'query' | 'update';
const filterType = ref<FilterType>('all');

/** 表格配置 */
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useCodegenColumnTableColumns(),
    border: true,
    showOverflow: true,
    autoResize: true,
    keepSource: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: true,
    },
  },
});

/** 过滤后的列数据 */
const filteredColumns = computed(() => {
  if (!props.columns) return [];
  if (filterType.value === 'all') return props.columns;
  return props.columns.filter((column) => {
    if (filterType.value === 'create') return column.createOperation;
    if (filterType.value === 'update') return column.updateOperation;
    if (filterType.value === 'list') return column.listOperationResult;
    if (filterType.value === 'query') return column.listOperation;
    return true;
  });
});

/** 加载数据到表格 */
async function loadFilteredData() {
  if (!gridApi.grid) return;
  gridApi.grid?.loadData(filteredColumns.value);
}

/** 监听列数据变化 */
watch(
  () => props.columns,
  async () => {
    await nextTick();
    await loadFilteredData();
  },
  {
    immediate: true,
  },
);

/** 监听过滤类型变化，使用 requestAnimationFrame 优化 */
watch(filterType, async () => {
  await nextTick();
  requestAnimationFrame(() => {
    loadFilteredData();
  });
});

/** 提供获取表格数据的方法供父组件调用 */
defineExpose({
  getData: (): InfraCodegenApi.CodegenColumn[] => gridApi.grid.getData(),
});

/** 初始化 */
const dictTypeOptions = ref<SystemDictTypeApi.DictType[]>([]); // 字典类型选项
onMounted(async () => {
  dictTypeOptions.value = await getSimpleDictTypeList();
});
</script>

<template>
  <Grid>
    <!-- 工具栏 -->
    <template #toolbar-actions>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-600">字段筛选</span>
        <Radio.Group v-model:value="filterType">
          <Radio.Button value="all">全部</Radio.Button>
          <Radio.Button value="create">插入</Radio.Button>
          <Radio.Button value="update">编辑</Radio.Button>
          <Radio.Button value="list">列表</Radio.Button>
          <Radio.Button value="query">查询</Radio.Button>
        </Radio.Group>
      </div>
    </template>

    <!-- 字段描述 -->
    <template #columnComment="{ row }">
      <Input v-model:value="row.columnComment" />
    </template>

    <!-- Java 类型 -->
    <template #javaType="{ row, column }">
      <Select v-model:value="row.javaType" style="width: 100%">
        <Select.Option
          v-for="option in column.params.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </Select.Option>
      </Select>
    </template>
    <!-- Java 属性 -->
    <template #javaField="{ row }">
      <Input v-model:value="row.javaField" />
    </template>

    <!-- 插入 -->
    <template #createOperation="{ row }">
      <Checkbox v-model:checked="row.createOperation" />
    </template>
    <!-- 编辑 -->
    <template #updateOperation="{ row }">
      <Checkbox v-model:checked="row.updateOperation" />
    </template>
    <!-- 列表 -->
    <template #listOperationResult="{ row }">
      <Checkbox v-model:checked="row.listOperationResult" />
    </template>
    <!-- 查询 -->
    <template #listOperation="{ row }">
      <Checkbox v-model:checked="row.listOperation" />
    </template>

    <!-- 查询方式 -->
    <template #listOperationCondition="{ row, column }">
      <Select v-model:value="row.listOperationCondition" class="w-full">
        <Select.Option
          v-for="option in column.params.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </Select.Option>
      </Select>
    </template>

    <!-- 允许空 -->
    <template #nullable="{ row }">
      <Checkbox v-model:checked="row.nullable" />
    </template>

    <!-- 显示类型 -->
    <template #htmlType="{ row, column }">
      <Select v-model:value="row.htmlType" class="w-full">
        <Select.Option
          v-for="option in column.params.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </Select.Option>
      </Select>
    </template>

    <!-- 字典类型 -->
    <template #dictType="{ row }">
      <Select
        v-model:value="row.dictType"
        class="w-full"
        allow-clear
        show-search
      >
        <Select.Option
          v-for="option in dictTypeOptions"
          :key="option.type"
          :value="option.type"
        >
          {{ option.name }}
        </Select.Option>
      </Select>
    </template>

    <!-- 示例 -->
    <template #example="{ row }">
      <Input v-model:value="row.example" />
    </template>

    <template #colWidth="{ row }">
      <Input v-model:value="row.colWidth" type="number" />
    </template>
  </Grid>
</template>
