import React, { Component } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { connect } from 'nuomi';
import BatchImport from './Batch';
// import ThirdImport from './ThirdImport';
// import { Batch, Other, OtherCtrl } from './content'; // 批量导入， 第三方导入
const MenuItem = Menu.Item;

class Import extends Component {
  handleClick = () => {};

  render() {
    const { processingCtrl } = this.props;
    return (
      <>
        <Dropdown
          trigger={['hover']}
          placement="bottomRight"
          // overlayClassName="client-header-import"
          overlayStyle={{ width: 125 }}
          disabled={processingCtrl}
          overlay={
            <Menu>
              <MenuItem key="0">
                <BatchImport />
              </MenuItem>
              {/* <MenuItem key="1">
                <ThirdImport />
              </MenuItem> */}
            </Menu>
          }
        >
          <Button
            type="primary"
            icon="down"
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, verticalAlign: 'middle' }}
          />
        </Dropdown>
      </>
    );
  }
}
export default connect()(Import);
