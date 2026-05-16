import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MpMessageForwardLogApi {
  /** 转发日志信息 */
  export interface MessageForwardLog {
    id: number; // 编号
    ruleId?: number; // 规则编号
    messageId?: number; // 消息编号
    accountId?: number; // 公众号
    appId?: string; // AppId
    openid?: string; // OpenID
    forwardMode?: number; // 转发模式
    receiveResponse?: boolean; // 接收响应
    useResponseAsReply?: boolean; // 响应回复
    targetUrl?: string; // 目标地址
    requestBody: string; // 请求体
    responseBody: string; // 响应体
    httpStatus: number; // HTTP状态
    status?: number; // 执行状态
    durationMs: number; // 耗时
    errorMsg: string; // 错误信息
  }
}

/** 查询转发日志分页 */
export function getMessageForwardLogPage(params: PageParam) {
  return requestClient.get<
    PageResult<MpMessageForwardLogApi.MessageForwardLog>
  >('/mp/message-forward-log/page', { params });
}

/** 查询转发日志详情 */
export function getMessageForwardLog(id: number) {
  return requestClient.get<MpMessageForwardLogApi.MessageForwardLog>(
    `/mp/message-forward-log/get?id=${id}`,
  );
}

/** 新增转发日志 */
export function createMessageForwardLog(
  data: MpMessageForwardLogApi.MessageForwardLog,
) {
  return requestClient.post('/mp/message-forward-log/create', data);
}

/** 修改转发日志 */
export function updateMessageForwardLog(
  data: MpMessageForwardLogApi.MessageForwardLog,
) {
  return requestClient.put('/mp/message-forward-log/update', data);
}

/** 删除转发日志 */
export function deleteMessageForwardLog(id: number) {
  return requestClient.delete(`/mp/message-forward-log/delete?id=${id}`);
}

/** 批量删除转发日志 */
export function deleteMessageForwardLogList(ids: number[]) {
  return requestClient.delete(
    `/mp/message-forward-log/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出转发日志 */
export function exportMessageForwardLog(params: any) {
  return requestClient.download('/mp/message-forward-log/export-excel', {
    params,
  });
}
