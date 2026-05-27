<script lang="ts" setup>
/**
 * 转发日志列表页
 * - 分页查询、按条件导出
 * - 公众号列/筛选：getSimpleAccountList 做 id -> 名称映射（不改后端）
 * - 转发规则列：规则分页拉取 id -> 名称，展示「名称(id)」
 */
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MpMessageForwardLogApi } from '#/api/mp/forward/log';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSimpleAccountList } from '#/api/mp/account';
import { getSimpleMessageForwardRuleList } from '#/api/mp/forward/rule';
import {
  exportMessageForwardLog,
  getMessageForwardLogPage,
} from '#/api/mp/forward/log';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Detail from './modules/detail.vue';

/** 公众号 id -> 列表展示名 */
const accountDisplayMap = ref<Map<number, string>>(new Map());
/** 转发规则 id -> 规则名称 */
const ruleDisplayMap = ref<Map<number, string>>(new Map());

/** 拉取公众号简易列表并构建映射 */
async function loadAccountDisplayMap() {
  const list = await getSimpleAccountList();
  accountDisplayMap.value = new Map(
    list.map((item) => [
      item.id,
      item.name?.trim() ? item.name : String(item.id),
    ]),
  );
}

/** accountId 转展示文案；未命中时回退 id */
function formatAccountDisplay(accountId?: number) {
  if (accountId == null) {
    return '';
  }
  return accountDisplayMap.value.get(accountId) ?? String(accountId);
}

/** 拉取转发规则并构建 id -> 名称映射 */
async function loadRuleDisplayMap() {
  const list = await getSimpleMessageForwardRuleList();
  ruleDisplayMap.value = new Map(
    list.map((item) => [
      item.id,
      item.name?.trim() ? item.name : String(item.id),
    ]),
  );
}

/** ruleId 转「名称(id)」；未命中时回退 id */
function formatRuleDisplay(ruleId?: number) {
  if (ruleId == null) {
    return '';
  }
  const name = ruleDisplayMap.value.get(ruleId);
  return name ? `${name}(${ruleId})` : String(ruleId);
}

onMounted(() => {
  loadAccountDisplayMap();
  loadRuleDisplayMap();
});

/** 日志详情弹窗 */
const [DetailModal, detailModalApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
});

/** 按当前筛选条件导出 Excel */
async function handleExport() {
  const data = await exportMessageForwardLog(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '转发日志.xls', source: data });
}

/** 查看转发日志详情 */
function handleDetail(row: MpMessageForwardLogApi.MessageForwardLog) {
  detailModalApi.setData(row).open();
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(formatAccountDisplay, formatRuleDisplay),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          if (accountDisplayMap.value.size === 0) {
            await loadAccountDisplayMap();
          }
          if (ruleDisplayMap.value.size === 0) {
            await loadRuleDisplayMap();
          }
          return await getMessageForwardLogPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<MpMessageForwardLogApi.MessageForwardLog>,
});
</script>

<template>
  <Page auto-content-height>
    <DetailModal />
    <Grid table-title="转发日志列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['mp:message-forward-log:export'],
              onClick: handleExport,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.detail'),
              type: 'link',
              icon: ACTION_ICON.VIEW,
              auth: ['mp:message-forward-log:query'],
              onClick: handleDetail.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
