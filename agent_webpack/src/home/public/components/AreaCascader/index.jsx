import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover, Tabs, Tag, Input, Icon } from 'antd';
import { request } from '@utils';
import './style.less';

const { TabPane } = Tabs;
const { CheckableTag } = Tag;

class AreaCascader extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const tabPanes = [{ key: '0', title: '省份', data: [] }];
    const value = props.value || {};
    this.state = {
      visible: false,
      tabPanes,
      selectedTags: [],
      activeTabKey: tabPanes[0].key,
      areaCode: value.areaCode || '',
      areaName: value.areaName || '',
    };
    this.inputRef = null;
  }

  componentDidMount() {
    this.getProvince();
  }

  getProvince = async () => {
    const res = await request.get('instead/v2/user/allow/getProvince.do', {}, '', null);
    if (!res.data) {
      return;
    }
    const { tabPanes } = this.state;
    let { value } = this.props;
    value = value || {};
    const areaName = (value.areaName || '').split('-')[0];
    const selectedTags = [res.data.find((item) => item.areaName === areaName)];
    tabPanes[0].data = res.data;
    this.setState({
      tabPanes,
      selectedTags,
    });
  };

  handleTabChange = (activeKey) => {
    this.setState({ activeTabKey: activeKey });
  };

  handleTagChange = async (paneIndex, data) => {
    const { changeOnSelect } = this.props;
    const { activeTabKey, selectedTags, tabPanes } = this.state;
    const { areaCode, areaId } = data;
    const newSelectedTags = selectedTags.slice(0, paneIndex + 1);
    newSelectedTags[paneIndex] = data;
    // 选中当前tag
    if (activeTabKey === '2') {
      // 最后一个Tab
      this.setState({
        selectedTags: newSelectedTags,
        visible: false,
      });
    } else {
      const param = activeTabKey === '0' ? { provinceId: areaId } : { cityId: areaId };
      const res = await request.get(
        `instead/v2/user/allow/${activeTabKey === '0' ? 'getCity' : 'getArea'}.do`,
        param,
      );
      if (!res.data) return;
      const nextPaneIndex = paneIndex + 1;
      const nextActiveTabKey = String(nextPaneIndex);
      const newTabPanes = tabPanes.slice(0, paneIndex + 1);
      newTabPanes[nextPaneIndex] = {
        key: nextActiveTabKey,
        title: `${nextActiveTabKey === '1' ? '城市' : '区县'}`,
        data: res.data,
      };
      this.setState({
        tabPanes: newTabPanes,
        activeTabKey: nextActiveTabKey,
        selectedTags: newSelectedTags,
      });
    }
    if (activeTabKey === '2' || changeOnSelect) {
      // value改变
      const changedValue = {
        areaCode,
        areaName: newSelectedTags.map((item) => item.areaName).join('-'),
      };
      if (!('value' in this.props)) {
        this.setState(changedValue);
      }
      this.triggerChange(changedValue);
    }
  };

  handleInputChange = (e) => {
    const { value } = e.target;
    const { tabPanes } = this.state;
    if (!value) {
      const changedValue = { areaCode: '', areaName: '' };
      if (!('value' in this.props)) {
        this.setState(changedValue);
      }
      this.triggerChange(changedValue);
      // 重置相关信息
      this.setState({
        selectedTags: [],
        activeTabKey: '0',
        tabPanes: tabPanes.slice(0, 1),
      });
    }
  };

  triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    const { areaCode, areaName } = this.state;
    if (onChange) {
      onChange({
        areaCode,
        areaName,
        ...changedValue,
      });
    }
  };

  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };

  render() {
    const {
      style,
      allowClear,
      disabled,
      autoComplete,
      placeholder,
      value: { areaName },
      value,
      onChange,
      getPopupContainer,
      changeOnSelect,
      // prefix,
      // size,
      ...rest
    } = this.props;
    const { visible, tabPanes, activeTabKey, selectedTags } = this.state;
    const contennt = (
      <Tabs
        type="card"
        activeKey={activeTabKey}
        onChange={this.handleTabChange}
        className="tabs-areaCascader"
      >
        {tabPanes.map((pane, paneIndex) => (
          <TabPane tab={pane.title} key={pane.key}>
            {pane.data.map((item) => (
              <CheckableTag
                key={item.areaCode}
                checked={Boolean(
                  selectedTags[paneIndex] && selectedTags[paneIndex].areaCode === item.areaCode,
                )}
                onChange={(checked) => this.handleTagChange(paneIndex, item, checked)}
              >
                {item.areaName}
              </CheckableTag>
            ))}
          </TabPane>
        ))}
      </Tabs>
    );
    return (
      <Popover
        placement="top"
        trigger="click"
        content={contennt}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
        // {...rest}
        getPopupContainer={getPopupContainer}
        overlayClassName="popover-areaCascader"
        overlayStyle={{ padding: 0 }}
      >
        <Input
          ref={(el) => (this.inputRef = el)}
          readOnly
          disabled={disabled}
          style={style}
          allowClear={allowClear}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={areaName}
          {...rest}
          onChange={this.handleInputChange}
          className="input-areaCascader"
          suffix={
            <Icon
              type="down"
              className={visible ? 's-transform' : ''}
              onClick={() => this.inputRef.input.click()}
            />
          }
        />
      </Popover>
    );
  }
}

AreaCascader.defaultProps = {
  changeOnSelect: false,
};

AreaCascader.propTypes = {
  changeOnSelect: PropTypes.bool, // 是否 开启选择即改变，是则允许只选中父级选项
  value: PropTypes.objectOf(PropTypes.string), // areaInfo是areacode、areaname组成的对象
};

export default AreaCascader;
