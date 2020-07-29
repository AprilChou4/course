const jsonParse = (data) => {
  let datas = {};
  if (data) {
    if (typeof data === 'object') {
      datas = data;
    } else if (typeof data === 'string' && data.startsWith(`{"`)) {
      datas = JSON.parse(data);
    }
  }
  return datas;
};

export default jsonParse;
