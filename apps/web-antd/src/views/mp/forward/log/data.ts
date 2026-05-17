/**
 * 转发日志页：表单/搜索/列表列配置
 * 公众号字段统一走简易列表接口，下拉展示「名称（appId）」
 */
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MpAccountApi } from '#/api/mp/account';
import type { MpMessageForwardLogApi } from '#/api/mp/forward/log';
import type { DescriptionItemSchema } from '#/components/description';

import { h } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';
import { formatDateTime } from '@vben/utils';

import { getSimpleAccountList } from '#/api/mp/account';
import { DictTag } from '#/components/dict-tag';
import { getRangePickerDefaultProps } from '#/utils';

/** 将公众号列表转为 ApiSelect 选项：label 为「名称（appId）」 */
function formatAccountOptions(list: MpAccountApi.Account[]) {
  return list.map((item) => ({
    ...item,
    label: `${item.name}${item.appId ? `（${item.appId}）` : ''}`,
  }));
}

/** 公众号 ApiSelect 公共配置（搜索表单） */
const accountSelectProps = {
  api: getSimpleAccountList,
  labelField: 'label',
  valueField: 'id',
  afterFetch: formatAccountOptions,
  showSearch: true,
  filterOption: (input: string, option: { label?: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
};

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'ruleId',
      label: '规则编号',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入规则编号',
      },
    },
    {
      fieldName: 'messageId',
      label: '消息编号',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入消息编号',
      },
    },
    {
      fieldName: 'accountId',
      label: '公众号',
      component: 'ApiSelect',
      componentProps: {
        ...accountSelectProps,
        allowClear: true,
        placeholder: '请选择公众号（appId）',
      },
    },
    {
      fieldName: 'openid',
      label: 'OpenID',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入OpenID',
      },
    },
    {
      fieldName: 'forwardMode',
      label: '转发模式',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.MP_MESSAGE_FORWARD_MODE, 'number'),
        placeholder: '请选择转发模式',
      },
    },
    {
      fieldName: 'status',
      label: '执行状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(
          DICT_TYPE.MP_MESSAGE_FORWARD_LOG_STATUS,
          'number',
        ),
        placeholder: '请选择执行状态',
      },
    },
    {
      fieldName: 'errorMsg',
      label: '错误信息',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入错误信息',
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/**
 * 详情展示
 *
 * @param formatAccountDisplay 由 detail.vue 注入：accountId 转展示名
 */
export function useDetailSchema(
  formatAccountDisplay: (accountId?: number) => string,
): DescriptionItemSchema[] {
  return [
    {
      field: 'id',
      label: '编号',
    },
    {
      field: 'createTime',
      label: '创建时间',
      render: (val) => formatDateTime(val) as string,
    },
    {
      field: 'ruleId',
      label: '规则编号',
    },
    {
      field: 'messageId',
      label: '消息编号',
    },
    {
      field: 'accountId',
      label: '公众号',
      render: (val) => formatAccountDisplay(val as number | undefined),
    },
    {
      field: 'appId',
      label: 'AppId',
    },
    {
      field: 'openid',
      label: 'OpenID',
    },
    {
      field: 'forwardMode',
      label: '转发模式',
      render: (val) =>
        h(DictTag, {
          type: DICT_TYPE.MP_MESSAGE_FORWARD_MODE,
          value: val,
        }),
    },
    {
      field: 'status',
      label: '执行状态',
      render: (val) =>
        h(DictTag, {
          type: DICT_TYPE.MP_MESSAGE_FORWARD_LOG_STATUS,
          value: val,
        }),
    },
    {
      field: 'httpStatus',
      label: 'HTTP状态',
    },
    {
      field: 'durationMs',
      label: '耗时(ms)',
    },
    {
      field: 'receiveResponse',
      label: '接收响应',
      render: (val) =>
        h(DictTag, {
          type: DICT_TYPE.INFRA_BOOLEAN_STRING,
          value: val,
        }),
    },
    {
      field: 'useResponseAsReply',
      label: '响应回复',
      render: (val) =>
        h(DictTag, {
          type: DICT_TYPE.INFRA_BOOLEAN_STRING,
          value: val,
        }),
    },
    {
      field: 'targetUrl',
      label: '目标地址',
      span: 2,
    },
    {
      field: 'errorMsg',
      label: '错误信息',
      span: 2,
    },
    {
      field: 'requestBody',
      label: '请求体',
      span: 2,
    },
    {
      field: 'responseBody',
      label: '响应体',
      span: 2,
    },
  ];
}

/**
 * 列表列配置
 *
 * @param formatAccountDisplay 由 index.vue 注入：accountId 转展示名
 */
export function useGridColumns(
  formatAccountDisplay: (accountId?: number) => string,
): VxeTableGridOptions<MpMessageForwardLogApi.MessageForwardLog>['columns'] {
  return [
    {
      field: 'id',
      title: '编号',
      minWidth: '90',
    },
    {
      field: 'ruleId',
      title: '规则编号',
      minWidth: '90',
    },
    {
      field: 'messageId',
      title: '消息编号',
      minWidth: '90',
    },
    {
      field: 'accountId',
      title: '公众号',
      minWidth: '140',
      formatter: ({ cellValue }) =>
        formatAccountDisplay(cellValue as number | undefined),
    },
    {
      field: 'appId',
      title: 'AppId',
      minWidth: '160',
    },
    {
      field: 'openid',
      title: 'OpenID',
      minWidth: '160',
    },
    {
      field: 'forwardMode',
      title: '转发模式',
      minWidth: '110',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.MP_MESSAGE_FORWARD_MODE },
      },
    },
    {
      field: 'httpStatus',
      title: 'HTTP状态',
      minWidth: '110',
    },
    {
      field: 'status',
      title: '执行状态',
      minWidth: '110',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.MP_MESSAGE_FORWARD_LOG_STATUS },
      },
    },
    {
      field: 'durationMs',
      title: '耗时',
      minWidth: '110',
    },
    {
      field: 'errorMsg',
      title: '错误信息',
      minWidth: '220',
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: '180',
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
