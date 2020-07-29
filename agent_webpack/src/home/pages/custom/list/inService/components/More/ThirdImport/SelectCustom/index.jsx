// 第三方导入弹窗 > 选择新增客户弹窗
import React, { Component } from 'react';
import { Modal, Input, message, Transfer, Spin, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'nuomi';
import { trim } from 'lodash';
import services from '../../../../services';
import Style from './style.less';

// const { getImportedCustom, webBatchImport } = methods;
const { Search } = Input;

class SelectCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 软件类型、包括name和type
      softwareInfo: props.softwareInfo || [],
      checked: false,
      // 数据源
      dataSource: props.dataSource || [],
      // 显示在右侧框数据的 key 集合
      targetKeys: [],
      // 已导入客户的名称集合
      importedNames: [],
      // 左边列表的数据，不包括targetKeys
      leftSource: props.dataSource,
    };
  }

  async componentDidMount() {
    // 获取已导入的客户名称
    const data = await services.getImportedCustom();
    this.setState({
      importedNames: data.map((item) => item.customerName),
    });
  }

  componentWillReceiveProps(nextP) {
    const { visible } = this.props;
    // if (visible !== nextP.visible || title !== nextP.title) {
    this.setState({
      softwareInfo: nextP.softwareInfo,
      leftSource: nextP.dataSource,
      dataSource: nextP.dataSource,
    });
    // }
  }

  // 改变搜索框
  change = (e) => {
    const { value } = e.target;
    !value && this.search(trim(value));
  };

  // 回车
  onPressEnter = (e) => {
    const { value } = e.target;
    this.search(trim(value));
  };

  // 按客户名称搜索
  search = (value) => {
    const searchValue = trim(value);
    const { dataSource, targetKeys, checked, importedNames } = this.state;
    const equel = dataSource.filter(({ name }) => !importedNames.includes(name));

    this.setState({
      leftSource: checked
        ? equel.filter(
            (item) => targetKeys.includes(item.id) || item.name.indexOf(searchValue) > -1,
          )
        : dataSource.filter(
            (item) => targetKeys.includes(item.id) || item.name.indexOf(searchValue) > -1,
          ),
    });
  };

  // 已经新增的客户checkbox 改变
  changeCheckBox = ({ target: { checked } }) => {
    const { targetKeys, dataSource, importedNames } = this.state;
    // 获取当前数据中未导入客户数据
    const equel = dataSource.filter(({ name }) => !importedNames.includes(name));
    // 获取当前数据中已导入客户的id集合
    const keys = dataSource.filter(({ name }) => importedNames.includes(name)).map(({ id }) => id);
    let leftArr = [];
    if (checked) {
      leftArr = equel;
    } else {
      leftArr = dataSource;
    }
    this.setState({
      checked,
      targetKeys: checked ? targetKeys.filter((id) => !keys.includes(id)) : targetKeys,
      leftSource: leftArr,
    });
  };

  // 选项在两栏之间转移时的回调函数
  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  };

  // 确定
  onOk = () => {
    const { dispatch } = this.props;
    const {
      targetKeys,
      softwareInfo: { type },
    } = this.state;
    if (targetKeys.length === 0) {
      message.warning('请选择客户');
      return;
    }
    if (targetKeys.length > 50) {
      message.warning('一次性至多只能处理50条数据');
      return;
    }
    // 第三方导入
    dispatch({
      type: '$webBatchImport',
      payload: {
        type,
        ids: targetKeys.join(','),
      },
    });
  };

  // 取消
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        selectCustomVisible: false,
      },
    });
  };

  render() {
    const {
      softwareInfo: { name },
      checked,
      targetKeys,
      dataSource,
      leftSource,
    } = this.state;
    const { loadings, selectCustomVisible } = this.props;
    leftSource && leftSource.map((item) => (item.key = item.id));
    return (
      <>
        <Modal
          title="选择新增客户"
          width={714}
          maskClosable={false}
          visible={selectCustomVisible}
          wrapClassName={Style['m-selectCustom']}
          onCancel={this.onCancel}
          onOk={this.onOk}
          okButtonProps={{
            loading: !!loadings.$webBatchImport,
          }}
          okText="创建客户"
          destroyOnClose
          ref={(node) => (this.modal = node)}
        >
          <Spin spinning={!!loadings.$webBatchImport}>
            <div className={Style['m-header']}>
              <Search
                placeholder="请输入客户名称"
                onSearch={this.search}
                onPressEnter={this.onPressEnter}
                onChange={this.change}
                enterButton
                className="f-fl"
                allowClear
              />
              <Checkbox onChange={this.changeCheckBox} checked={checked}>
                已经新增的客户不显示
              </Checkbox>
            </div>
            <Transfer
              dataSource={leftSource}
              titles={[`${name}列表`, '需要创建的客户列表']}
              targetKeys={targetKeys}
              listStyle={{
                width: 300,
                height: 458,
              }}
              lazy={{ height: 36 }}
              // selectedKeys={selectedKeys}
              footer={() => {
                return (
                  <span>
                    <i className="left">
                      总共抽取{dataSource.length}个客户，列表中显示
                      {leftSource.length - targetKeys.length}个
                    </i>
                    <i className="right">已选 {targetKeys.length}个客户</i>
                  </span>
                );
              }}
              onChange={this.handleChange}
              onSelectChange={this.handleSelectChange}
              onScroll={this.handleScroll}
              render={(item) => item.name}
            />
          </Spin>
        </Modal>
      </>
    );
  }
}
SelectCustom.defaultProps = {
  // visible: false,
  // // 左侧列表title
  // title: '',
};
SelectCustom.propTypes = {
  // visible: PropTypes.bool,
  // title: PropTypes.string,
};
export default connect(({ loadings, selectCustomVisible }) => ({
  loadings,
  selectCustomVisible,
}))(SelectCustom);
