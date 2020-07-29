/**
 * 判断是否是假值
 * @param {*} value 要进行判断的值
 * @param {*} extra 要排除的值（视为false）
 */

import { isNil } from 'lodash';

export default (value, extra) => {
  return (
    isNil(value) ||
    (extra && Array.isArray(extra) ? extra.some((val) => val === value) : value === extra)
  );
};
