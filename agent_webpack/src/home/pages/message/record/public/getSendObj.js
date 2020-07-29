// 发送对象格式
const getSendObj = (arr) => {
  let sendObj = '';
  arr.map((item, index) => {
    let grantArr = [];
    item.grantUsers &&
      item.grantUsers.map((val) => {
        grantArr = [...grantArr, val.username];
        return val;
      });
    // 联系人为空，不用+括号了
    grantArr = grantArr.filter((i) => i);
    const userStr = grantArr.length ? `（${grantArr.join('、')}）` : '';
    sendObj += `${item.customerName}${userStr}${index < arr.length - 1 ? '、' : ''}`;
    return item;
  });
  return sendObj;
};
export default getSendObj;
