import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MpMessageForwardRuleApi } from '#/api/mp/forward/rule';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';

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
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入公众号',
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
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入公众号',
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

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<MpMessageForwardRuleApi.MessageForwardRule>['columns'] {
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
      minWidth: '90',
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
