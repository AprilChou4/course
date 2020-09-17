import React from 'react';

// import { Select, Button } from 'antd';
// import SuperSelect from './SuperSelect';
// // import NpmSelect from 'antd-virtual-select';
// // import SuperSelect from "antd-virtual-select";
// const Option = Select.Option;
// import 'antd/dist/antd.css';
// // import './styles.css';

const children = [];

for (let i = 0; i < 10000; i++) {
  children.push(
    <Option value={i + 'aab'} key={i}>
      {i + 'aab'}
    </Option>,
  );
}

class App extends React.Component {
  componentDidMount() {
    //  1、1、2、3、5、8、13、21
    function fun(n) {
      var num1 = 1,
        num2 = 1,
        num3 = 0;
      for (var i = 0; i < n - 2; i++) {
        num3 = num1 + num2;
        num1 = num2;
        num2 = num3;
      }
      return num3;
    }
    fun(1);
  }
  render() {
    return <div className="App">数组</div>;
  }
}

export default App;
