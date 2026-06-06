import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace InfraJobApi {
  /**
   * 任务处理器参数形态
   * object / array / string_array
   */
  export type JobParamShape = 'array' | 'object' | 'string_array';

  /**
   * 任务处理器参数字段
   * 单条配置内的表单项定义
   */
  export interface JobParamField {
    key: string;
    label: string;
    defaultValue?: boolean | number | string;
    required?: boolean;
  }

  /** 任务信息 */
  export interface Job {
    id?: number;
    name: string;
    status: number;
    handlerName: string;
    handlerParam: string;
    cronExpression: string;
    retryCount: number;
    retryInterval: number;
    monitorTimeout: number;
    createTime?: Date;
    nextTimes?: Date[];
    /**
     * 处理器参数字段定义
     * 仅编辑时 get 详情返回
     */
    paramFields?: JobParamField[];
    /**
     * 处理器参数形态
     * 仅编辑时 get 详情返回
     */
    paramShape?: JobParamShape;
  }

  /**
   * 创建/修改任务提交体
   * 不含 paramFields、paramShape 等详情元数据
   */
  export type JobSavePayload = Pick<
    Job,
    | 'cronExpression'
    | 'handlerName'
    | 'handlerParam'
    | 'id'
    | 'monitorTimeout'
    | 'name'
    | 'retryCount'
    | 'retryInterval'
  >;
}

/**
 * 从表单值提取任务保存 payload
 * 过滤 paramFields、paramShape 等只读字段
 */
export function pickJobSavePayload(
  job: InfraJobApi.Job,
): InfraJobApi.JobSavePayload {
  return {
    id: job.id,
    name: job.name,
    handlerName: job.handlerName,
    handlerParam: job.handlerParam,
    cronExpression: job.cronExpression,
    retryCount: job.retryCount,
    retryInterval: job.retryInterval,
    monitorTimeout: job.monitorTimeout,
  };
}

/** 查询任务列表 */
export function getJobPage(params: PageParam) {
  return requestClient.get<PageResult<InfraJobApi.Job>>('/infra/job/page', {
    params,
  });
}

/** 查询任务详情 */
export function getJob(id: number) {
  return requestClient.get<InfraJobApi.Job>(`/infra/job/get?id=${id}`);
}

/** 新增任务 */
export function createJob(data: InfraJobApi.JobSavePayload) {
  return requestClient.post('/infra/job/create', data);
}

/** 修改定时任务调度 */
export function updateJob(data: InfraJobApi.JobSavePayload) {
  return requestClient.put('/infra/job/update', data);
}

/** 删除定时任务调度 */
export function deleteJob(id: number) {
  return requestClient.delete(`/infra/job/delete?id=${id}`);
}

/** 批量删除定时任务调度 */
export function deleteJobList(ids: number[]) {
  return requestClient.delete(`/infra/job/delete-list?ids=${ids.join(',')}`);
}

/** 导出定时任务调度 */
export function exportJob(params: any) {
  return requestClient.download('/infra/job/export-excel', { params });
}

/** 任务状态修改 */
export function updateJobStatus(id: number, status: number) {
  return requestClient.put('/infra/job/update-status', undefined, {
    params: {
      id,
      status,
    },
  });
}

/** 定时任务立即执行一次 */
export function runJob(id: number) {
  return requestClient.put(`/infra/job/trigger?id=${id}`);
}

/** 获得定时任务的下 n 次执行时间 */
export function getJobNextTimes(id: number) {
  return requestClient.get(`/infra/job/get_next_times?id=${id}`);
}
