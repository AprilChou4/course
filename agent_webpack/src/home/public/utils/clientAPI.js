let api = {};

// 客户端注入对象
if (typeof ExternService === 'object') {
  api = ExternService;
  // 关闭客户端
  api.close = quitApp;
  // 客户端窗口最大化
  api.maxScreen = maxScreen;
  // 客户端窗口最小化
  api.minScreen = minScreen;
  // 客户端窗口还原
  api.resScreen = resScreen;
  // 读取本地税盘
  api.readTaxDevice = readTaxDevice;
  // 使用ie浏览器加载指定url
  api.sysNavUrl = sysNavUrl;
  // 启动本地应用
  api.runExtenSys = runExtenSys;
  // ajax下载文件
  api.downloadFile = function(url, filename, data) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.open('post', url, true);
    xhr.responseType = 'blob';
    xhr.onreadystatechange = function() {
      if (this.status === 200) {
        try {
          const a = document.createElement('a');
          a.href = URL.createObjectURL(this.response);
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } catch (e) {
          throw e;
        }
      }
    };
    for (const i in data) {
      formData.append(i, data[i]);
    }
    xhr.send(formData);
  };
  api.openAdobe = window.openAdobe;
  // localStorage.setItem = function(key, value){
  //     ExternService.saveLocal({
  //         key,
  //         value
  //     })
  // }

  // localStorage.getItem = function(key){
  //     return ExternService.queryLocal({
  //         key
  //     })
  // }
}

export default api;
