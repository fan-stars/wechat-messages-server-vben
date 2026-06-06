<!--
  处理器参数字段行：label 左（120px）+ 输入右
  字段类型由 defaultValue 推断：number → InputNumber，其余 → Input
-->
<script lang="ts" setup>
import type {
  JobParamFieldModel,
  JobParamFieldValue,
} from '../utils/job-handler-param';

import type { InfraJobApi } from '#/api/infra/job';

import { Input, InputNumber } from 'ant-design-vue';

import { isNumberParamField } from '../utils/job-handler-param';

defineOptions({ name: 'JobHandlerParamFields' });

const props = defineProps<{
  /**
   * 后端 JobHandler#getParamFields() 下发的字段定义
   */
  fields: InfraJobApi.JobParamField[];
  /**
   * 当前字段值模型，只读；变更通过 update:field 回传
   */
  model: JobParamFieldModel;
  /**
   * 数字字段最小值
   * array 模式 FTP 端口等可为 0
   */
  numberMin?: number;
}>();

const emit = defineEmits<{
  change: [];
  'update:field': [key: string, value: JobParamFieldValue | undefined];
}>();

function toNumberValue(
  val: JobParamFieldValue | undefined,
): number | undefined {
  if (val === undefined) {
    return undefined;
  }
  const num = typeof val === 'number' ? val : Number(String(val));
  return Number.isNaN(num) ? undefined : num;
}

function getNumberFieldValue(key: string) {
  return toNumberValue(props.model[key]);
}

function getStringFieldValue(key: string) {
  const val = props.model[key];
  if (val === undefined || val === null) {
    return '';
  }
  return String(val);
}

function handleNumberChange(
  key: string,
  val: null | number | string | undefined,
) {
  let value: JobParamFieldValue | undefined;
  if (val === null || val === undefined || val === '') {
    value = undefined;
  } else {
    const num = typeof val === 'number' ? val : Number(val);
    value = Number.isNaN(num) ? undefined : num;
  }
  emit('update:field', key, value);
  emit('change');
}

function handleStringChange(key: string, val: string) {
  emit('update:field', key, val);
  emit('change');
}
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <div
      v-for="field in fields"
      :key="field.key"
      class="flex w-full items-center gap-2"
    >
      <span class="w-[120px] shrink-0 text-right text-sm text-muted-foreground">
        {{ field.label }}
        <span v-if="field.required" class="text-destructive">*</span>
      </span>
      <InputNumber
        v-if="isNumberParamField(field)"
        :value="getNumberFieldValue(field.key)"
        class="min-w-0 flex-1"
        :min="numberMin ?? 1"
        @update:value="(v) => handleNumberChange(field.key, v)"
      />
      <Input
        v-else
        :value="getStringFieldValue(field.key)"
        class="min-w-0 flex-1"
        allow-clear
        @update:value="(v) => handleStringChange(field.key, v)"
      />
    </div>
  </div>
</template>
