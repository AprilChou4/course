import { createServices } from '@utils';
import mock from './mock';

export default createServices({
  getServiceInfoDetail: 'instead/v2/customer/service/get.do::post', // 服务信息详情
  updateServiceInfo: 'instead/v2/customer/service/update.do::postJSON', // 修改服务信息详情
  getStaffList: 'instead/v2/user/staff/normal/list.do', // 查询未停用的员工集合 用于接单人等
  getArchivesList: 'instead/v1/user/base/archives/list.do', // 获取客户档案信息，来源，取票方式，等级
  getServiceType: 'instead/v1/user/base/archives/servicetype/list.do', // 查询客户自定义列业务类型信息
  getBookkeep: 'instead/v2/user/staff/bookkeep/list.do', // 查询记账会计集合
  getRoletypeList: 'instead/v2/user/staff/role/list.do', // 查询派工角色信息(树结构)，包括开票员等
  getAllEmployeeList: 'instead/v2/user/staff/getAllEmployee', // 查询所有员工集合
  getUserByName: 'instead/v2/user/getUser.do', // 联系人授权查账
  // ...mock,
});
