import React from "react";
import ReactDOM from "react-dom";
import Greeter from "./Greeter";
import "./main.css"; //使用require导入css文件
// 通常情况下，css会和js打包到同一个文件中，并不会打包为一个单独的css文件，
// 不过通过合适的配置webpack也可以把css打包为单独的文件的。
ReactDOM.render(<Greeter />, document.getElementById("root"));
