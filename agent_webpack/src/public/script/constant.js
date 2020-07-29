const constant = {
  /* 常用FormItem布局 */
  // FORM_ITEM_LAYOUT: {
  //   labelCol: { span: 6 },
  //   wrapperCol: { span: 15 },
  // },
  // SEARCH_FORM_ITEM_LAYOUT: {
  //   labelCol: { span: 8 },
  //   wrapperCol: { span: 15 },
  // },
  // FORM_ITEM_LAYOUT_SEARCH: {
  //   labelCol: { span: 5 },
  //   wrapperCol: { span: 18 },
  // },
  // 通用默认reducer
  VALIDATE_TRIGGER_ONBLUR: { validateTrigger: 'onBlur' },
  REGEX: {
    // 手机
    mobile: /^0?1[3-9][0-9]{9}$/,
    // 电话
    tel: /^[0-9-()（）]{7,18}$/,
    // 邮箱
    email: /^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
    // 身份证
    idcard: /^\d{17}[\d|x]|\d{15}$/,
    // 中文
    cn: /^[\u4e00-\u9fa5]+$/,
    // 税号
    taxnum: /^[a-zA-Z0-9]{15,20}$/,
  },
};

export default constant;
