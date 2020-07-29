import React from 'react';
import { Button } from 'antd';

const DropdownButtonGroup = ({ onClick }) => {
  return (
    <a className="ui-abutton-a e-ml15">
      <Button type="primary" onClick={onClick}>
        新签合同
      </Button>
      <Divider type="vertical" style={{ margin: 0 }} />
      <Dropdown
        overlay={menu}
        trigger={['hover']}
        placement="bottomRight"
        overlayStyle={{ width: 107 }}
      >
        <Button type="primary" icon="down" />
      </Dropdown>
    </a>
  );
};

export default DropdownButtonGroup;
