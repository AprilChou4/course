// 服务项目多选
import React, { useState, forwardRef, useEffect } from 'react';
import { TreeSelect, Input } from 'antd';
import { request } from '@utils';

const { SHOW_PARENT, SHOW_CHILD } = TreeSelect;

// const treeData = [
//   {
//     title: 'Node1',
//     value: '0-0',
//     key: '0-0',
//     children: [
//       {
//         title: 'Child Node1',
//         value: '0-0-0',
//         key: '0-0-0',
//       },
//     ],
//   },
//   {
//     title: 'Node2',
//     value: '0-1',
//     key: '0-1',
//     children: [
//       {
//         title: 'Child Node3',
//         value: '0-1-0',
//         key: '0-1-0',
//       },
//       {
//         title: 'Child Node4',
//         value: '0-1-1',
//         key: '0-1-1',
//       },
//       {
//         title: 'Child Node5',
//         value: '0-1-2',
//         key: '0-1-2',
//       },
//     ],
//   },
// ];

const ServiceItem = forwardRef(({ ...rest }, ref) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await request.get('instead/contract/getChargingItem.do');
      console.log(res, '-------data-');
      if (res.status === 200) {
        let arr = [];
        res.data &&
          res.data.forEach(({ id, serviceName, chargingItemList }) => {
            const newItem = {
              title: serviceName,
              key: id,
              value: id,
              children: [],
            };
            chargingItemList &&
              chargingItemList.forEach((val) => {
                newItem.children.push({
                  title: val.itemName,
                  key: val.chargingItemId,
                  value: val.chargingItemId,
                });
              });

            arr = [...arr, newItem];
          });
        setTreeData(arr);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tProps = {
    treeData,
    // onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_CHILD,
    searchPlaceholder: '请选择服务项目',
    dropdownStyle: { maxHeight: 260 },
    ref,
    ...rest,
  };
  return <TreeSelect {...tProps} />;
});
export default ServiceItem;
