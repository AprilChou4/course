import React from 'react';
import { HashRouter as Router, Link, Route, Switch, useHistory, Redirect } from 'react-router-dom';

import { Button } from 'antd';
function App() {
  const sendPost = () => {
    // 获取id为otherPage的iframe窗口对象

    var iframeWin = document.getElementById('otherPage').contentWindow;
    // 向该窗口发送消息
    iframeWin.postMessage({ king: document.getElementById('message').value }, '*');
  };

  // 监听跨域请求的返回

  window.addEventListener(
    'message',
    function (event) {
      console.log(event, event.data, '-----dasdasdasd-------------');
    },
    false,
  );
  return (
    <div className="App">
      <textarea id="message"></textarea>
      <input type="button" value="发送" onClick={sendPost} />
      <iframe src="http://172.30.5.42:8000" id="otherPage" width={500} height={500}></iframe>
    </div>
  );
}

export default App;
