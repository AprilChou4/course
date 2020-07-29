// 记账会计
import React from 'react';
import { connect } from 'nuomi';
import { Select } from 'antd';

const Bookeeper = ({ bookeepers, allEmployeeList, value, ...rest }) => {
  // 修改后记账会计，为了解决员工角色修改后，显示成员工id
  const bookeepersArr = [...bookeepers];
  if (rest.mode === 'multiple') {
    // 多选
    value &&
      value.forEach((v) => {
        if (JSON.stringify(bookeepers).indexOf(v) === -1) {
          allEmployeeList.forEach(({ realName, staffId }) => {
            if (staffId === v) {
              bookeepersArr.push({
                realName,
                staffId,
              });
            }
          });
        }
      });
  } else if (JSON.stringify(bookeepers).indexOf(value) === -1) {
    allEmployeeList.forEach(({ realName, staffId }) => {
      if (staffId === value) {
        bookeepersArr.push({
          realName,
          staffId,
        });
      }
    });
  }
  return (
    <Select
      placeholder="请选择记账会计"
      value={value}
      {...rest}
      showArrow
      showSearch
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      // getPopupContainer={(triggerNode) => triggerNode.parentNode}
    >
      {bookeepersArr.map(({ staffId, realName }) => (
        <Select.Option
          key={staffId}
          value={staffId}
          style={{ ...(staffId === value ? { display: 'none' } : {}) }}
        >
          {realName}
        </Select.Option>
      ))}
    </Select>
  );
};
export default connect(({ bookeepers, allEmployeeList }) => ({ bookeepers, allEmployeeList }))(
  Bookeeper,
);
