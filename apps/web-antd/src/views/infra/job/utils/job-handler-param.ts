/**
 * 任务处理器参数（handlerParam）解析与序列化工具
 *
 * handlerParam 在库中存为 JSON 字符串，形态由后端 JobHandler#getParamShape() 决定：
 * - object：单个 JSON 对象
 * - array：JSON 对象数组
 * - string_array：JSON 字符串数组
 */
import type { InfraJobApi } from '#/api/infra/job';

export type JobParamFieldValue = number | string | undefined;

export type JobParamFieldModel = Record<string, JobParamFieldValue>;

/**
 * 判断字段是否渲染为数字输入框
 * defaultValue 为 number 时使用 InputNumber
 */
export function isNumberParamField(field: InfraJobApi.JobParamField) {
  return typeof field.defaultValue === 'number';
}

/**
 * 按字段定义生成空模型
 * 有 defaultValue 时预填
 */
export function buildDefaultParamModel(
  paramFields: InfraJobApi.JobParamField[],
): JobParamFieldModel {
  const model: JobParamFieldModel = {};
  for (const field of paramFields) {
    const defaultValue = field.defaultValue;
    model[field.key] =
      typeof defaultValue === 'number' || typeof defaultValue === 'string'
        ? defaultValue
        : undefined;
  }
  return model;
}

/**
 * 将 JSON 对象键值写入模型
 * 按字段类型做 number / string 转换
 */
export function mapObjectToParamModel(
  obj: Record<string, unknown>,
  paramFields: InfraJobApi.JobParamField[],
): JobParamFieldModel {
  const model = buildDefaultParamModel(paramFields);
  for (const field of paramFields) {
    const raw = obj[field.key];
    if (raw === undefined || raw === null) {
      continue;
    }
    if (isNumberParamField(field)) {
      const num = Number(raw);
      if (!Number.isNaN(num)) {
        model[field.key] = num;
      }
    } else {
      model[field.key] = String(raw);
    }
  }
  return model;
}

/**
 * object 形态
 * 解析 handlerParam → 单对象模型
 */
export function parseObjectParamValue(
  value: string | undefined,
  paramFields: InfraJobApi.JobParamField[],
): JobParamFieldModel {
  const model = buildDefaultParamModel(paramFields);
  if (!value?.trim()) {
    return model;
  }
  try {
    const parsed = JSON.parse(value) as Record<string, unknown>;
    return mapObjectToParamModel(parsed, paramFields);
  } catch {
    return model;
  }
}

/**
 * array 形态
 * 解析 handlerParam → 对象数组
 * 兼容历史单对象写法（自动包成数组）
 */
export function parseArrayParamValue(
  value: string | undefined,
  paramFields: InfraJobApi.JobParamField[],
): JobParamFieldModel[] {
  const fallback = [buildDefaultParamModel(paramFields)];
  if (!value?.trim()) {
    return fallback;
  }
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.length > 0
        ? parsed.map((item) =>
            mapObjectToParamModel(item as Record<string, unknown>, paramFields),
          )
        : fallback;
    }
    // 兼容旧数据：单对象自动包成数组
    if (parsed && typeof parsed === 'object') {
      return [
        mapObjectToParamModel(parsed as Record<string, unknown>, paramFields),
      ];
    }
  } catch {
    // 非法 JSON，回退默认一组空配置
  }
  return fallback;
}

/**
 * string_array 形态
 * 解析 handlerParam → 字符串行列表
 * 兼容历史 extraDomains 对象写法
 */
export function parseStringArrayParamValue(
  value: string | undefined,
): string[] {
  const fallback = [''];
  if (!value?.trim()) {
    return fallback;
  }
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.length > 0 ? parsed.map(String) : fallback;
    }
    // 兼容旧 object 形态：extraDomains 逗号分隔
    if (parsed && typeof parsed === 'object') {
      const extraDomains = (parsed as Record<string, unknown>).extraDomains;
      if (typeof extraDomains === 'string' && extraDomains.trim()) {
        const domains = extraDomains
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        return domains.length > 0 ? domains : fallback;
      }
    }
  } catch {
    // 非法 JSON，回退一行空输入
  }
  return fallback;
}

/**
 * string_array 序列化
 * 去空白后输出 JSON 数组，空项不写入
 */
export function serializeStringArrayParam(items: string[]) {
  const values = items
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return JSON.stringify(values);
}

/**
 * 详情 / 列表展示 handlerParam
 * 合法 JSON 时格式化缩进，否则原样返回
 */
export function formatHandlerParamDisplay(val?: string) {
  if (!val?.trim()) {
    return '无';
  }
  try {
    return JSON.stringify(JSON.parse(val), null, 2);
  } catch {
    return val;
  }
}
