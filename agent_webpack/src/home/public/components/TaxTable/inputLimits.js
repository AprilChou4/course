// 输入限制
// type: integer|整数 decimal|小数
// limit: +|非负  -|非正 不传则不限制

function numlenlimit(val, numlen = 2) {
  let obj = val;
  if (numlen === 1) {
    obj = obj.replace(/^(-)*(\d+)\.(\d{0,1}).*$/, "$1$2.$3");
  } else if (numlen === 3) {
    obj = obj.replace(/^(-)*(\d+)\.(\d{0,3}).*$/, "$1$2.$3");
  } else if (numlen === 4) {
    obj = obj.replace(/^(-)*(\d+)\.(\d{0,4}).*$/, "$1$2.$3");
  } else if (numlen === 8) {
    obj = obj.replace(/^(-)*(\d+)\.(\d{0,8}).*$/, "$1$2.$3");
  } else if (numlen === 10) {
    obj = obj.replace(/^(-)*(\d+)\.(\d{0,10}).*$/, "$1$2.$3");
  } else {
    obj = obj.replace(/^(-)*(\d+)\.(\d{0,2}).*$/, "$1$2.$3"); // 只能输入两个小数
  }
  return obj;
}

export default function(val, type = "decimal", limit = "", numlen = 2) {
  let obj = val;
  // 整数
  if (type === "integer" && limit === "") {
    if (obj[0] === "0") {
      obj = "0";
    } else {
      const len = obj.indexOf("-");
      obj = obj.replace(/[^\d-]/g, "");
      obj = obj.replace(/-{2,}/g, "-");
      obj = obj
        .replace("-", "$#$")
        .replace(/-/g, "")
        .replace("$#$", "-");
      if (len > 0) {
        obj = obj.substring(0, len) + obj.substring(len + 1, obj.length);
      }
    }
    return obj;
  }
  // 非负整数
  if (type === "integer" && limit === "+") {
    if (obj[0] === "0") {
      obj = "0";
    } else {
      obj = obj.replace(/[^\d]/g, "");
    }
    return obj;
  }
  // 非正整数
  if (type === "integer" && limit === "-") {
    const len = obj.indexOf("-");
    if (obj[0] === "0") {
      obj = "0";
    } else if (len !== 0) {
      obj = "";
    } else {
      obj = obj.replace(/[^\d-]/g, "");
      obj = obj.replace(/-{2,}/g, "-");
      obj = obj
        .replace("-", "$#$")
        .replace(/-/g, "")
        .replace("$#$", "-");
      if (len > 0) {
        obj = obj.substring(0, len) + obj.substring(len + 1, obj.length);
      }
    }
    return obj;
  }
  // 小数
  if (type === "decimal" && limit === "") {
    const len = obj.indexOf("-");
    obj = obj.replace(/[^\d.-]/g, ""); // 清除“数字”和“.”以外的字符
    obj = obj.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
    obj = obj
      .replace(".", "$#$")
      .replace(/\./g, "")
      .replace("$#$", "."); // 只能一个小数点
    obj = obj.replace(/-{2,}/g, "-"); // 只保留第一个. 清除多余的
    obj = obj
      .replace("-", "$#$")
      .replace(/-/g, "")
      .replace("$#$", "-"); // 只能一个负号
    obj = numlenlimit(obj, numlen);

    obj = obj.replace(/^\./, "0."); // 第一位小数点时补零
    if (len > 0) {
      obj = obj.substring(0, len) + obj.substring(len + 1, obj.length);
    }
    if (obj.substring(0, 2) === "-.") {
      obj = "-";
    }
    if (obj === "-" || obj === "-.") {
      return obj;
    }
    if (obj === "00") {
      obj = "0";
    }
    if (obj === "-00") {
      obj = "-0";
    }
    return obj;
  }
  // 非负小数
  if (type === "decimal" && limit === "+") {
    obj = obj.replace(/[^\d.]/g, ""); // 清除“数字”和“.”以外的字符
    obj = obj.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
    obj = obj
      .replace(".", "$#$")
      .replace(/\./g, "")
      .replace("$#$", "."); // 只能一个小数点
    obj = numlenlimit(obj, numlen);
    obj = obj.replace(/^\./, "0."); // 第一位小数点时补零
    obj = obj.replace(/^-/, ""); // 不得为负数
    if (obj.indexOf(".") < 0 && obj !== "") {
      // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      obj = parseFloat(obj);
    }
    if (obj === "00") {
      obj = "0";
    }
    return obj;
  }
  // 非正小数
  if (type === "decimal" && limit === "-") {
    const len = obj.indexOf("-");
    if (obj[0] === "0") {
      obj = "0";
    } else if (len !== 0) {
      obj = "";
    } else {
      obj = obj.replace(/[^\d.-]/g, ""); // 清除“数字”和“.”以外的字符
      obj = obj.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的
      obj = obj
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", "."); // 只能一个小数点
      obj = obj.replace(/-{2,}/g, "-"); // 只保留第一个. 清除多余的
      obj = obj
        .replace("-", "$#$")
        .replace(/-/g, "")
        .replace("$#$", "-"); // 只能一个负号
      obj = numlenlimit(obj, numlen);
      obj = obj.replace(/^\./, "0."); // 第一位小数点时补零
      if (len > 0) {
        obj = obj.substring(0, len) + obj.substring(len + 1, obj.length);
      }
      if (obj.substring(0, 2) === "-.") {
        obj = "-";
      }
      if (obj === "-" || obj === "-.") {
        return obj;
      }
    }
    return obj;
  }
  return obj;
}
