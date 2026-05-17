<script lang="ts" setup>
import type { MpMessageForwardLogApi } from '#/api/mp/forward/log';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { getSimpleAccountList } from '#/api/mp/account';
import { getMessageForwardLog } from '#/api/mp/forward/log';
import { useDescription } from '#/components/description';

import { useDetailSchema } from '../data';

const formData = ref<MpMessageForwardLogApi.MessageForwardLog>();

/** 公众号 id -> 详情展示名 */
const accountDisplayMap = ref<Map<number, string>>(new Map());

async function loadAccountDisplayMap() {
  const list = await getSimpleAccountList();
  accountDisplayMap.value = new Map(
    list.map((item) => [
      item.id,
      item.name?.trim() ? item.name : String(item.id),
    ]),
  );
}

function formatAccountDisplay(accountId?: number) {
  if (accountId == null) {
    return '';
  }
  return accountDisplayMap.value.get(accountId) ?? String(accountId);
}

const [Descriptions] = useDescription({
  bordered: true,
  column: 2,
  schema: useDetailSchema(formatAccountDisplay),
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
      await loadAccountDisplayMap();
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
