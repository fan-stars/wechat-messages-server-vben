import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MpMessageForwardRuleApi {
  /** 转发规则信息 */
  export interface MessageForwardRule {
    id: number; // 编号
    accountId?: number; // 公众号
    name?: string; // 规则名称
    status?: number; // 状态
    priority?: number; // 优先级
    forwardMode?: number; // 转发模式
    receiveResponse?: boolean; // 接收响应
    useResponseAsReply?: boolean; // 响应回复
    targetUrl?: string; // 目标地址
    timeoutMs?: number; // 超时
    messageTypes: string; // 消息类型
    enableLog?: boolean; // 记录日志
    remark: string; // 备注
  }
}

let simpleMessageForwardRuleListPromise: null | Promise<
  MpMessageForwardRuleApi.MessageForwardRule[]
> = null;

/** 查询转发规则精简列表（同页并发只发一次请求） */
export function getSimpleMessageForwardRuleList() {
  if (!simpleMessageForwardRuleListPromise) {
    simpleMessageForwardRuleListPromise = requestClient
      .get<MpMessageForwardRuleApi.MessageForwardRule[]>(
        '/mp/message-forward-rule/list-all-simple',
      )
      .catch((error) => {
        simpleMessageForwardRuleListPromise = null;
        throw error;
      });
  }
  return simpleMessageForwardRuleListPromise;
}

/** 转发规则精简列表缓存失效（规则增删改后调用） */
export function invalidateSimpleMessageForwardRuleListCache() {
  simpleMessageForwardRuleListPromise = null;
}

/** 查询转发规则分页 */
export function getMessageForwardRulePage(params: PageParam) {
  return requestClient.get<
    PageResult<MpMessageForwardRuleApi.MessageForwardRule>
  >('/mp/message-forward-rule/page', { params });
}

/** 查询转发规则详情 */
export function getMessageForwardRule(id: number) {
  return requestClient.get<MpMessageForwardRuleApi.MessageForwardRule>(
    `/mp/message-forward-rule/get?id=${id}`,
  );
}

/** 新增转发规则 */
export function createMessageForwardRule(
  data: MpMessageForwardRuleApi.MessageForwardRule,
) {
  return requestClient.post('/mp/message-forward-rule/create', data);
}

/** 修改转发规则 */
export function updateMessageForwardRule(
  data: MpMessageForwardRuleApi.MessageForwardRule,
) {
  return requestClient.put('/mp/message-forward-rule/update', data);
}

/** 删除转发规则 */
export function deleteMessageForwardRule(id: number) {
  return requestClient.delete(`/mp/message-forward-rule/delete?id=${id}`);
}

/** 批量删除转发规则 */
export function deleteMessageForwardRuleList(ids: number[]) {
  return requestClient.delete(
    `/mp/message-forward-rule/delete-list?ids=${ids.join(',')}`,
  );
}

/** 导出转发规则 */
export function exportMessageForwardRule(params: any) {
  return requestClient.download('/mp/message-forward-rule/export-excel', {
    params,
  });
}
