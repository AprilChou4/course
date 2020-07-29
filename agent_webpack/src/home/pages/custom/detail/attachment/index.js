// 客户详情 > 附件管理5
import React from 'react';
import effects from './effects';
import Main from './components/Main';

export default {
  id: 'custom_detail_attachment',
  state: {
    // 附件列表
    enclosureList: [],
    // 编辑文件模块
    editFileItem: {},
    // 预览图片弹窗
    previewFileVisible: false,
    // 附件类别（1.营业执照，2.法人证件,3.公司章程,4.其他）
    upType: 1,
  },
  effects,
  render() {
    return <Main />;
  },
  onInit() {},
};
