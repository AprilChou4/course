// 一维索引对应的是登录方式，二维索引对应的是登录字段。 _ 无意义
export const LOGIN_FILEDS = [
  ['username', 'password'],
  ['_', 'passwordCa'],
  ['_', 'passwordTaxControl'],
  ['usernameTaxTray', 'passwordTaxTray'],
  ['sMSVerificationUsername', 'sMSVerificationPassword', 'loginIdentity', 'phoneNum'],
  ['_', 'personalIncomeTaxPassword'],
];

/**
 * 根据申报所属地，获取不同的登录方式下拉参数
 * @param {Array} options 所支持的所有下拉选项
 * @param {Array} supportTypes 目前该申报所属地支持的登录方式
 */
export function useSelectOpts(options, supportTypes) {
  const finalOptions = options.filter((item) => supportTypes.includes(item.value));
  return finalOptions;
}

/**
 * 获取到登录方式、对应登录方式字段数组
 * @param {Object} form 表单数据
 * @param {String} key 登录方式的字段名 loginType/personalIncomeTaxLoginType
 */
export function useLoginType(form, key) {
  const loginType = form[key] === null || form[key] < 0 ? undefined : form[key];
  const loginFileds = LOGIN_FILEDS[loginType] || {};
  return { loginType, loginFileds };
}

/**
 * 处理form表单数据的 登录信息
 * @param {Object} form 当前总form表单数据
 * @param {Object} loginModeForm 登录方式表单数据
 */
export function getProcessForm(form, loginModeForm) {
  const finalForm = { ...form };
  return function processForm(loginTypeKey) {
    const loginType = loginModeForm[loginTypeKey];
    if (loginType === undefined) {
      finalForm[loginTypeKey] = -1;
    } else if (typeof loginType === 'number' && loginType >= 0) {
      finalForm[loginTypeKey] = loginType;
      const setKeys = LOGIN_FILEDS[loginType].filter((it) => it !== '_');
      setKeys.forEach((key) => {
        finalForm[key] = loginModeForm[key];
      });
    }
    return finalForm;
  };
}
