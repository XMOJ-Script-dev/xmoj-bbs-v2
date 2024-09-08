import {Result} from "~/utils/resultUtils";

const CheckParams = (Data: object, Checklist: object): Result => {
  for (const i in Data) {
    if (Checklist[i] === undefined) {
      return new Result(false, "参数" + i + "未知");
    }
    const AvailableTypes = ["string", "number", "bigint", "boolean", "symbol", "undefined", "object", "function"];
    if (AvailableTypes.indexOf(Checklist[i]) === -1) {
      return new Result(false, "参数类型" + Checklist[i] + "未知");
    }
    if (typeof Data[i] !== Checklist[i]) {
      return new Result(false, "参数" + i + "期望类型" + Checklist[i] + "实际类型" + typeof Data[i]);
    }
  }
  for (const i in Checklist) {
    if (Data[i] === undefined) {
      return new Result(false, "参数" + i + "未找到");
    }
  }
  return new Result(true, "参数检测通过");
}