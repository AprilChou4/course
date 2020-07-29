import { createServices } from '@utils';
import mock from './mock';

export default createServices({
  getEnclosureList: 'instead/v2/customer/enclosure/list.do', // 查询客户附件列表
  addEnclosure: 'instead/v2/customer/enclosure/add.do::post', // 上传客户附件信息
  deleteEnclosure: 'instead/v2/customer/enclosure/delete.do::post', // 删除客户附件
  downEnclosureFile: 'instead/v2/customer/enclosure/downloadFile.do', // 下载文件
  updateEnclosure: 'instead/v2/customer/enclosure/update.do::post', // 修改客户附件信息
  ...mock,
});
