import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MpMessageForwardLogApi } from '#/api/mp/forward/log';

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
      fieldName: 'ruleId',
      label: '规则编号',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则编号',
      },
    },
    {
      fieldName: 'messageId',
      label: '消息编号',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入消息编号',
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
      fieldName: 'appId',
      label: 'AppId',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入AppId',
      },
    },
    {
      fieldName: 'openid',
      label: 'OpenID',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入OpenID',
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
      fieldName: 'requestBody',
      label: '请求体',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入请求体',
      },
    },
    {
      fieldName: 'responseBody',
      label: '响应体',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入响应体',
      },
    },
    {
      fieldName: 'httpStatus',
      label: 'HTTP状态',
      component: 'Input',
      componentProps: {
        placeholder: '请输入HTTP状态',
      },
    },
    {
      fieldName: 'status',
      label: '执行状态',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: getDictOptions(
          DICT_TYPE.MP_MESSAGE_FORWARD_LOG_STATUS,
          'number',
        ),
        placeholder: '请选择执行状态',
      },
    },
    {
      fieldName: 'durationMs',
      label: '耗时',
      component: 'Input',
      componentProps: {
        placeholder: '请输入耗时',
      },
    },
    {
      fieldName: 'errorMsg',
      label: '错误信息',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入错误信息',
      },
    },
  ];
}

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
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入公众号',
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

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions<MpMessageForwardLogApi.MessageForwardLog>['columns'] {
  return [
    { type: 'checkbox', width: 40 },
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
      minWidth: '90',
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
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
