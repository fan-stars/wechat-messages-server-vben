<script lang="ts" setup>
import type { MpMessageForwardLogApi } from '#/api/mp/forward/log';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { getMessageForwardLog } from '#/api/mp/forward/log';
import { useDescription } from '#/components/description';

import { useDetailSchema } from '../data';

const formData = ref<MpMessageForwardLogApi.MessageForwardLog>();

const [Descriptions] = useDescription({
  bordered: true,
  column: 2,
  schema: useDetailSchema(),
});

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    const data = modalApi.getData<MpMessageForwardLogApi.MessageForwardLog>();
    if (!data?.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getMessageForwardLog(data.id);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal
    title="转发日志详情"
    class="w-[1280px]"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >
    <Descriptions :data="formData" />
  </Modal>
</template>
