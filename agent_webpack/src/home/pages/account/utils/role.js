/* eslint-disable import/no-mutable-exports */
import pubData from 'data';

const roleName = pubData.get('userInfo_roleName');

// 主管会计
let role = 1;
// 管理员
if (roleName.indexOf('管理员') !== -1) {
  role = 0;
}
// 记账会计
else if (roleName === '记账会计') {
  role = 2;
}
// 会计助理
else if (roleName.indexOf('助理') !== -1) {
  role = 3;
}

export default role;
