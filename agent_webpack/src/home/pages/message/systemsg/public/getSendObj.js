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
    sendObj += `${item.customerName}（${grantArr.join('、')}）${
      index < arr.length - 1 ? '、' : ''
    }`;
    return item;
  });
  return sendObj;
};
export default getSendObj;
