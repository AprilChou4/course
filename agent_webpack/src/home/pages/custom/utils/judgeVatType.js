/**
 *
 * @param {*} vatType 纳税性质
 * @param {*} industryTypeParent 行业类型
 */
const judgeVatType = (vatType, industryTypeParent) => {
  // 会计科目默认值  当纳税性质为空时，默认小企业会计准则-小规模纳税人(4) 当纳税性质有值时，默认小企业会计准则-纳税性质值(0,4)
  const isVatType = (vatType || vatType === 0) && vatType !== -1; // 纳税性质是否存在(一般纳税人为0)
  let kjkmInitValue = isVatType ? [0, 4][vatType] : 4;

  if (industryTypeParent) {
    if (industryTypeParent.indexOf('房地产业') > -1) {
      kjkmInitValue = isVatType ? [10, 11][vatType] : 11;
    } else if (industryTypeParent.indexOf('公共管理、社会保障和社会组织') > -1) {
      kjkmInitValue = isVatType ? [2, 3][vatType] : 3;
    }
  }
  return {
    isVatType,
    kjkmInitValue,
  };
};

export default judgeVatType;
