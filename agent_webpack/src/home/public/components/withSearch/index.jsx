import React, { Component } from 'react';
import { Checkbox } from 'antd';
import classnames from 'classnames';
import './style.less';

function getDisplayName(component) {
  return component.displayName || component.name || 'Component';
}

export default ({ style, search, footer, onCheckedAllChange }) => {
  return (WrappedComponent) => {
    return class WithSearch extends Component {
      static displayName = `WithSearch(${getDisplayName(WrappedComponent)})`;

      state = {
        checkedAllStatus: '0',
      };

      getCheckedAllData = (status) => ({
        checked: status === '1',
        indeterminate: status === '2',
      });

      onCheckedAllChange = (e) => {
        const {
          target: { checked },
        } = e;
        this.setCheckedAllStatus(checked ? '1' : '0');
        onCheckedAllChange && onCheckedAllChange(e, this);
      };

      setCheckedAllStatus = (status) => {
        this.setState({
          checkedAllStatus: status,
        });
      };

      render() {
        const { checkedAllStatus } = this.state;
        const { checked, indeterminate } = this.getCheckedAllData(checkedAllStatus);
        return (
          <div
            className={classnames('search-list', { 'search-list-with-footer': footer })}
            style={style}
          >
            <div className="search-list-header">
              <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                onChange={this.onCheckedAllChange}
              />
            </div>
            <div
              className={classnames('search-list-body', { 'search-list-body-with-search': search })}
            >
              <div className="search-list-content">
                <div className="search-list-body-search-wrapper">{search(this)}</div>
                <div className="search-list-body-customize-wrapper">
                  <WrappedComponent {...this.Props} selectList={this} />
                </div>
              </div>
            </div>
            <div className="search-list-footer">{footer(this)}</div>
          </div>
        );
      }
    };
  };
};
