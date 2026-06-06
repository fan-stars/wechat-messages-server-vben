<script lang="ts" setup>
import type { InfraJobApi } from '#/api/infra/job';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createJob,
  getJob,
  pickJobSavePayload,
  updateJob,
} from '#/api/infra/job';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

defineOptions({ name: 'InfraJobForm' });

const emit = defineEmits(['success']);
const formData = ref<InfraJobApi.Job>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['任务'])
    : $t('ui.actionTitle.create', ['任务']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 过滤 paramFields / paramShape 等只读字段，仅提交 JobSavePayload
    const data = pickJobSavePayload(
      (await formApi.getValues()) as InfraJobApi.Job,
    );
    try {
      await (formData.value?.id ? updateJob(data) : createJob(data));
      // 关闭并提示
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载数据
    const data = modalApi.getData<InfraJobApi.Job>();
    // 新建：无 paramFields，handlerParam 为单行文本
    if (!data?.id) {
      formData.value = undefined;
      await formApi.resetForm();
      await formApi.setValues({
        handlerParam: '',
        retryCount: 0,
        retryInterval: 0,
        monitorTimeout: 0,
      });
      return;
    }
    // 编辑：get 详情含 paramFields + paramShape，驱动结构化参数表单
    modalApi.lock();
    try {
      formData.value = await getJob(data.id);
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-3/5">
    <Form class="mx-4" />
  </Modal>
</template>
