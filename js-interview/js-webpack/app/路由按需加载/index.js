import React from 'react';
import {
  HashRouter as Router,
  Link,
  Route,
  Switch,
  useHistory,
  Redirect,
  withRouter,
} from 'react-router-dom';
import Loadable from 'react-loadable';
import RouteLoad from './RouteLoad';
import { Button } from 'antd';

const loadingComponent = () => {
  return <div>loading</div>;
};

const Login = () => {
  const history = useHistory();
  const login = () => {
    history.push('/product/a');
  };
  return (
    <div>
      <h2>我是登录页</h2>
      <Button type="primary" onClick={login}>
        登录
      </Button>
    </div>
  );
};

// Loadable 按需加载
const ProductA = Loadable({
  loader: () => import('./ProductA.js'),
  loading: loadingComponent,
});
const ProductB = Loadable({
  loader: () => import('./ProductB.js'),
  loading: loadingComponent,
});
const ProductC = RouteLoad(() => import('./ProductC.js'));

const Product = (props) => {
  console.log(props, '---------props-------');
  return (
    <div>
      <h2>我是工作台</h2>
      <Link to="/product/a">a</Link>
      <Link to="/product/b">b</Link>
      <Link to="/product/c">c</Link>
      <Switch>
        <Route path="/product/a" component={ProductA} />
        <Route path="/product/b" component={ProductB} />
        <Route path="/product/c" component={ProductC} />
      </Switch>
    </div>
  );
};
function App(props) {
  console.log(props, '-----props------');

  return (
    <div className="App">
      <Router>
        <div className="App">
          <Switch>
            {/* 重定向 如你启动时候地址是没有login的，就匹配不到路由，这个可以帮你重定向到login */}
            <Redirect exact path="/" to="/login" />
            <Route path="/login" exact component={Login} />
            <Route path="/product" component={withRouter(Product)} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
