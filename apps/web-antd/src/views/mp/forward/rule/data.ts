/**
 * 转发规则页：表单/搜索/列表列配置
 * 公众号字段统一走简易列表接口，下拉展示「名称（appId）」
 */
import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MpAccountApi } from '#/api/mp/account';
import type { MpMessageForwardRuleApi } from '#/api/mp/forward/rule';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { getSimpleAccountList } from '#/api/mp/account';
import { getRangePickerDefaultProps } from '#/utils';

/** 将公众号列表转为 ApiSelect 选项：label 为「名称（appId）」 */
function formatAccountOptions(list: MpAccountApi.Account[]) {
  return list.map((item) => ({
    ...item,
    // 有 appId 时附带展示，便于区分同名公众号
    label: `${item.name}${item.appId ? `（${item.appId}）` : ''}`,
  }));
}

/** 公众号 ApiSelect 公共配置（表单、搜索共用） */
const accountSelectProps = {
  api: getSimpleAccountList,
  labelField: 'label',
  valueField: 'id',
  afterFetch: formatAccountOptions,
  showSearch: true,
  // 按展示文案模糊搜索
  filterOption: (input: string, option: { label?: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
};

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'accountId',
      label: '公众号',
      rules: 'selectRequired',
      component: 'ApiSelect', // 绑定公众号 id，提交给后端
      componentProps: {
        ...accountSelectProps,
        placeholder: '请选择公众号（appId）',
      },
    },
    {
      fieldName: 'name',
      label: '规则名称',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则名称',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: '请选择状态',
      },
    },
    {
      fieldName: 'priority',
      label: '优先级',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入优先级',
      },
    },
    {
      fieldName: 'forwardMode',
      label: '转发模式',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.MP_MESSAGE_FORWARD_MODE, 'number'),
        placeholder: '请选择转发模式',
      },
    },
    {
      fieldName: 'receiveResponse',
      label: '接收响应',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING, 'boolean'),
        placeholder: '请选择接收响应',
      },
    },
    {
      fieldName: 'useResponseAsReply',
      label: '响应回复',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING, 'boolean'),
        placeholder: '请选择响应回复',
      },
    },
    {
      fieldName: 'targetUrl',
      label: '目标地址',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入目标地址',
      },
    },
    {
      fieldName: 'timeoutMs',
      label: '超时',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入超时',
      },
    },
    {
      fieldName: 'messageTypes',
      label: '消息类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入消息类型',
      },
    },
    {
      fieldName: 'enableLog',
      label: '记录日志',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING, 'boolean'),
        placeholder: '请选择记录日志',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'accountId',
      label: '公众号',
      component: 'ApiSelect', // 按公众号筛选规则
      componentProps: {
        ...accountSelectProps,
        allowClear: true,
        placeholder: '请选择公众号（appId）',
      },
    },
    {
      fieldName: 'name',
      label: '规则名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入规则名称',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        placeholder: '请选择状态',
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
 * 列表列配置
 *
 * @param formatAccountDisplay 由 index.vue 注入：将 accountId 转为展示名（纯前端，不改后端）
 */
export function useGridColumns(
  formatAccountDisplay: (accountId?: number) => string,
): VxeTableGridOptions<MpMessageForwardRuleApi.MessageForwardRule>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '编号',
      minWidth: '90',
    },
    {
      field: 'accountId',
      title: '公众号',
      minWidth: '140',
      // 接口仍返回 accountId，列表展示名称（无名称则显示 id）
      formatter: ({ cellValue }) =>
        formatAccountDisplay(cellValue as number | undefined),
    },
    {
      field: 'name',
      title: '规则名称',
      minWidth: '160',
    },
    {
      field: 'status',
      title: '状态',
      minWidth: '110',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.COMMON_STATUS },
      },
    },
    {
      field: 'priority',
      title: '优先级',
      minWidth: '110',
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
      field: 'receiveResponse',
      title: '接收响应',
      minWidth: '100',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.INFRA_BOOLEAN_STRING },
      },
    },
    {
      field: 'useResponseAsReply',
      title: '响应回复',
      minWidth: '100',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.INFRA_BOOLEAN_STRING },
      },
    },
    {
      field: 'timeoutMs',
      title: '超时',
      minWidth: '120',
    },
    {
      field: 'enableLog',
      title: '记录日志',
      minWidth: '100',
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.INFRA_BOOLEAN_STRING },
      },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: '180',
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
