/**
 * 判断是否是真值
 * @param {*} value 要进行判断的值
 * @param {*} extra 要排除的值（视为true）
 */

export default (value, extra) => {
  return (
    !!value ||
    (extra && Array.isArray(extra) ? extra.some((val) => val === value) : value === extra)
  );
};
