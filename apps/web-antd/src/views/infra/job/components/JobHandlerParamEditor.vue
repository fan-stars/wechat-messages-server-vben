<!--
  任务处理器参数编辑器（Vben Form 自定义组件）

  - 新建：单行 Input，手填 JSON 或纯文本
  - 编辑：按后端下发的 paramShape + paramFields 渲染结构化表单
    - object：单组字段
    - array：多组配置块（如 FTP 列表）
    - string_array：多行字符串（如域名列表）
  - 对外仅暴露 handlerParam 字符串（v-model:value）
-->
<script lang="ts" setup>
import type {
  JobParamFieldModel,
  JobParamFieldValue,
} from '../utils/job-handler-param';

import type { InfraJobApi } from '#/api/infra/job';

import { computed, ref, watch } from 'vue';

import { ContentWrap, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Input } from 'ant-design-vue';

import {
  buildDefaultParamModel,
  parseArrayParamValue,
  parseObjectParamValue,
  parseStringArrayParamValue,
  serializeStringArrayParam,
} from '../utils/job-handler-param';
import JobHandlerParamFields from './JobHandlerParamFields.vue';

defineOptions({ name: 'JobHandlerParamEditor' });

const props = withDefaults(
  defineProps<{
    isEdit?: boolean;
    paramFields?: InfraJobApi.JobParamField[];
    paramShape?: InfraJobApi.JobParamShape;
    value?: string;
  }>(),
  {
    isEdit: false,
    paramFields: () => [],
    paramShape: 'object',
    value: '',
  },
);

const emit = defineEmits<{
  'update:value': [value: string];
}>();

// 编辑态字段定义，来自 GET /infra/job/get
const fields = ref<InfraJobApi.JobParamField[]>([]);
// object 形态：单对象模型
const formModel = ref(buildDefaultParamModel([]));
// array 形态：对象数组，每项对应一个配置块
const arrayItems = ref([buildDefaultParamModel([])]);
// string_array 形态：字符串数组，每项一行输入
const stringItems = ref<string[]>(['']);

const normalizedShape = computed(() => props.paramShape ?? 'object');

/**
 * 编辑态且后端有字段定义（或 string_array）时启用结构化 UI
 */
const useStructuredForm = computed(() => {
  if (!props.isEdit) {
    return false;
  }
  if (normalizedShape.value === 'string_array') {
    return true;
  }
  return fields.value.length > 0;
});

const plainValue = computed({
  get: () => props.value ?? '',
  set: (val: string) => emit('update:value', val),
});

/**
 * 按 paramShape 将 props.value 同步到本地模型并回写
 */
function syncFormModelFromValue() {
  if (normalizedShape.value === 'string_array') {
    stringItems.value = parseStringArrayParamValue(props.value);
    emitStringArrayValue();
    return;
  }
  if (normalizedShape.value === 'array') {
    arrayItems.value = parseArrayParamValue(props.value, fields.value);
    emitArrayValue();
    return;
  }
  formModel.value = parseObjectParamValue(props.value, fields.value);
  emitObjectValue();
}

function emitObjectValue() {
  if (!useStructuredForm.value || normalizedShape.value !== 'object') {
    return;
  }
  emit('update:value', JSON.stringify(formModel.value));
}

function emitArrayValue() {
  if (!useStructuredForm.value || normalizedShape.value !== 'array') {
    return;
  }
  emit('update:value', JSON.stringify(arrayItems.value));
}

function emitStringArrayValue() {
  if (!useStructuredForm.value || normalizedShape.value !== 'string_array') {
    return;
  }
  emit('update:value', serializeStringArrayParam(stringItems.value));
}

function addArrayItem() {
  arrayItems.value.push(buildDefaultParamModel(fields.value));
  emitArrayValue();
}

/**
 * 至少保留一组空配置，避免 UI 消失
 */
function removeArrayItem(index: number) {
  arrayItems.value.splice(index, 1);
  if (arrayItems.value.length === 0) {
    arrayItems.value.push(buildDefaultParamModel(fields.value));
  }
  emitArrayValue();
}

function addStringItem() {
  stringItems.value.push('');
  emitStringArrayValue();
}

/**
 * 至少保留一行空输入
 */
function removeStringItem(index: number) {
  stringItems.value.splice(index, 1);
  if (stringItems.value.length === 0) {
    stringItems.value.push('');
  }
  emitStringArrayValue();
}

function handleStringItemChange(index: number, val: string) {
  stringItems.value[index] = val;
  emitStringArrayValue();
}

function updateObjectField(key: string, value: JobParamFieldValue | undefined) {
  formModel.value[key] = value;
}

function updateArrayItemField(
  item: JobParamFieldModel,
  key: string,
  value: JobParamFieldValue | undefined,
) {
  item[key] = value;
}

watch(
  () => [props.isEdit, props.paramFields, props.paramShape] as const,
  ([isEdit, paramFields]) => {
    if (!isEdit) {
      fields.value = [];
      return;
    }
    fields.value = paramFields ?? [];
    syncFormModelFromValue();
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div class="w-full">
    <!--
      新建：单行文本
    -->
    <Input
      v-if="!useStructuredForm"
      v-model:value="plainValue"
      placeholder="请输入处理器的参数"
      allow-clear
    />

    <!--
      object：如 infra 清理 Job {"retainDay":14}
    -->
    <div
      v-else-if="normalizedShape === 'object'"
      class="flex w-full flex-col gap-2"
    >
      <JobHandlerParamFields
        :fields="fields"
        :model="formModel"
        @update:field="updateObjectField"
        @change="emitObjectValue"
      />
    </div>

    <!--
      array：如云备份 FTP 配置列表
    -->
    <div
      v-else-if="normalizedShape === 'array'"
      class="flex w-full flex-col gap-3"
    >
      <ContentWrap
        v-for="(item, index) in arrayItems"
        :key="index"
        content-class="px-4 pb-4 pt-3"
        header-class="border-border px-4 py-3"
      >
        <template #title>
          <div class="flex w-full items-center justify-between gap-2">
            <span class="text-sm font-medium text-foreground">
              配置 {{ index + 1 }}
            </span>
            <VbenButton
              class="text-destructive hover:text-destructive"
              size="sm"
              variant="ghost"
              @click="removeArrayItem(index)"
            >
              <IconifyIcon icon="lucide:trash-2" class="mr-1" />
              删除
            </VbenButton>
          </div>
        </template>
        <JobHandlerParamFields
          :fields="fields"
          :model="item"
          :number-min="0"
          @update:field="(key, value) => updateArrayItemField(item, key, value)"
          @change="emitArrayValue"
        />
      </ContentWrap>
      <VbenButton
        class="w-full border-dashed border-border"
        variant="outline"
        @click="addArrayItem"
      >
        <IconifyIcon icon="lucide:plus" class="mr-1" />
        添加配置
      </VbenButton>
    </div>

    <!--
      string_array：如活动日志域名列表 ["a.com"]
    -->
    <div
      v-else-if="normalizedShape === 'string_array'"
      class="flex w-full flex-col gap-3"
    >
      <ContentWrap
        v-for="(item, index) in stringItems"
        :key="index"
        content-class="px-4 pb-4 pt-3"
        header-class="border-border px-4 py-3"
      >
        <template #title>
          <div class="flex w-full items-center justify-between gap-2">
            <span class="text-sm font-medium text-foreground">
              配置 {{ index + 1 }}
            </span>
            <VbenButton
              class="text-destructive hover:text-destructive"
              size="sm"
              variant="ghost"
              @click="removeStringItem(index)"
            >
              <IconifyIcon icon="lucide:trash-2" class="mr-1" />
              删除
            </VbenButton>
          </div>
        </template>
        <div class="flex w-full items-center gap-2">
          <span
            class="w-[120px] shrink-0 text-right text-sm text-muted-foreground"
          >
            域名
          </span>
          <Input
            :value="item"
            class="min-w-0 flex-1"
            placeholder="请输入域名"
            @update:value="(v) => handleStringItemChange(index, v)"
          />
        </div>
      </ContentWrap>
      <VbenButton
        class="w-full border-dashed border-border"
        variant="outline"
        @click="addStringItem"
      >
        <IconifyIcon icon="lucide:plus" class="mr-1" />
        添加配置
      </VbenButton>
    </div>
  </div>
</template>
