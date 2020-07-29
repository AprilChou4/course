import inputLimits from './inputLimits.js';

// 非负数两位小数
function nonnegativeDecimal(obj) {
  let val = 0;
  val = inputLimits(obj, 'decimal', '+');
  if (Math.abs(val) > 1000000000) {
    return '999999999.99';
  }
  return val;
}

// 两位小数
function naturalsDecimal(obj) {
  const len = obj.indexOf('-');
  let val = 0;
  val = inputLimits(obj, 'decimal');
  if (Math.abs(val) > 1000000000) {
    return len !== -1 ? '-999999999.99' : '999999999.99';
  }
  return val;
}

// 非负整数
function nonnegativeInteger(obj) {
  let val = 0;
  val = inputLimits(obj, 'integer', '+');
  if (Math.abs(val) > 1000000000) {
    return '999999999';
  }
  return val;
}

// 整数
function naturalsInteger(obj) {
  const len = obj.indexOf('-');
  let val = 0;
  val = inputLimits(obj, 'integer');
  if (Math.abs(val) > 1000000000) {
    return len !== -1 ? '-999999999' : '999999999';
  }
  return val;
}

export default function(obj, tableName, dataIndex, hc, inputType, inputrules) {
  let val;
  if (inputrules) {
    val = inputrules(obj, tableName, dataIndex, hc);
  } else {
    switch (inputType) {
      case 'nonnegativeDecimal':
        val = nonnegativeDecimal(obj);
        break;
      case 'naturalsDecimal':
        val = naturalsDecimal(obj);
        break;
      case 'nonnegativeInteger':
        val = nonnegativeInteger(obj);
        break;
      case 'naturalsInteger':
        val = naturalsInteger(obj);
        break;
      case 'string':
        val = obj;
        break;
      default:
        val = obj;
        break;
    }
  }
  return val;
}
