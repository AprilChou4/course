import React, { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, Button, Icon, Input } from 'antd';
import { flatten } from 'lodash';
import { SelectList } from '@components';
import { getGroupList, getCustomerList } from '../MessageForm/api';
import TransferItem from '../TransferItem/index';

import './index.less';

const INVALID = 'invalid'; // 常量，代表无效的key，包含代表无效
let unauthorizedList = []; // 缓存未授权查账的客户

function SendObjectModal({ onClose, isModalShow, initialSelectList, onSendObjChange }, ref) {
  // 客户分组：自定义、默认
  const [groupList, setGroupList] = useState([]);
  const [defaultGroupList, setDefaultGroupList] = useState([]);
  // 已选择列表
  const [selectedList, setSelectedList] = useState(initialSelectList);
  // 对应联系人列表
  const [customerList, setCustomerList] = useState([]);
  // 对应联系人所需参数
  const [customerParams, setCustomerParams] = useState({
    groupIds: '',
    queryCriteria: [],
    keyword: '',
  });
  // 联系人勾选的keys
  const [customerCheckedKeys, setCustomerCheckedKeys] = useState([]);
  // 联系人勾选全选
  const [customerCheckAll, setCustomerCheckAll] = useState(false);
  // 联系人勾选全选indeterminate
  const [indeterminate, setIndeterminate] = useState(false);
  // 已选择的联系人勾选的keys
  const [contactUserCheckedKeys, setContactUserCheckedKeys] = useState([]);
  // 缓存已选择的联系人的所有keys，方便做disabled
  const [cachKeys, setCachKeys] = useState(() => {
    const keys = initialSelectList.map((item) => {
      return item.grantUsers.map((user) => `${item.customerId}-${user.userId}`);
    });
    return flatten(keys);
  });
  // 已选择联系人区域的搜索框值
  const [contactUserInputVal, setContactUserInputVal] = useState('');

  useImperativeHandle(ref, () => ({
    resetFields() {
      setCustomerList([]);
      setSelectedList([]);
      setCustomerParams({
        groupIds: '',
        queryCriteria: [],
        keyword: '',
      });
      setCustomerCheckedKeys([]);
      setCachKeys([]);
      setContactUserCheckedKeys([]);
      setContactUserInputVal('');
      setCustomerCheckAll(false);
      setIndeterminate(false);
      unauthorizedList = [];
    },
  }));

  useEffect(() => {
    if (!isModalShow) return;
    async function fetchData() {
      const res = await getGroupList();
      setGroupList(res.data && res.data.customerGroups);
      setDefaultGroupList(res.data.defaultGroups);
    }
    fetchData();
  }, [isModalShow]);

  // 客户分组搜索框输入搜索
  async function groupInputValChange(e) {
    const res = await getGroupList(e.target.value);
    setGroupList(res.data && res.data.customerGroups);
    setDefaultGroupList(res.data && res.data.defaultGroups);
  }

  // 对应联系人区域的搜索
  async function customerInputChange(e) {
    const params = { ...customerParams, keyword: e.target.value };
    setCustomerParams(params);
    const res = await getCustomerList(params);
    setCustomerList(res.data && res.data.customers);
  }

  // 弹窗未授权的
  function showUnauthorizedWarning() {
    Modal.warning({
      width: 400,
      className: 'unauthorized-dialog',
      icon: <Icon type="exclamation-circle" theme="filled" />,
      title: '选择失败',
      content: (
        <p className="unauthorized-content">
          <span>以下客户未被授权查账，消息将无法发送直客户 ！</span>
          <span>
            （
            {unauthorizedList
              .slice(0, 5)
              .map((it) => it.value)
              .join('、')}
            {unauthorizedList.length > 5 ? '...' : ''}）
          </span>
        </p>
      ),
      okText: '知道了',
      onOk: () => {
        const keys = unauthorizedList.map((it) => it.key);
        unauthorizedList = [];
        const checkedKeys = customerCheckedKeys.filter((item) => !keys.includes(item));
        setCustomerCheckedKeys(checkedKeys);
        setCustomerCheckAll(false);
        if (!checkedKeys.length) {
          setIndeterminate(false);
        }
      },
    });
  }

  // 穿梭向左
  function toLeft() {
    const keys = [...contactUserCheckedKeys];
    let copyList = [...selectedList];
    let copyCacheKeys = [...cachKeys];

    let removeKeys = [];
    for (let i = 0; i < keys.length; i += 1) {
      // 父节点已经移除掉，直接跳过子节点
      if (removeKeys.includes(keys[i])) {
        // eslint-disable-next-line
        continue;
      }
      const [parentKey, childKey] = keys[i].split('-');
      // 父节点，全部移除，并减小keys长度
      if (!childKey) {
        copyList = copyList.filter((it) => it.customerId !== parentKey);
        removeKeys = removeKeys.concat(keys.filter((key) => key.includes(parentKey)));
        // keys = keys.filter((key) => !key.includes(parentKey));
      } else {
        // 只移除一个子节点，如果缓存key数组中包括父节点，也要移除(代表不是全选了)。
        const customer = copyList.find((it) => it.customerId === parentKey);
        customer.grantUsers = customer.grantUsers.filter((user) => user.userId !== childKey);
        copyCacheKeys = copyCacheKeys.filter((key) => key !== parentKey);
      }
    }
    // 过滤掉被选中的子节点
    setCachKeys(copyCacheKeys.filter((key) => !contactUserCheckedKeys.includes(key)));
    setSelectedList(copyList);
    setContactUserCheckedKeys([]);
  }

  // 穿梭向右
  function toRight() {
    // 还有未授权查账的，弹窗，终止逻辑
    if (unauthorizedList.length) {
      showUnauthorizedWarning();
      return;
    }
    setCachKeys([...cachKeys, ...customerCheckedKeys]);
    const keys = [...customerCheckedKeys];
    const copySelectedList = [...selectedList];
    const seletedMap = new Map();
    // 生成Map，key是父亲节点、value是子节点key数组。
    keys.forEach((key) => {
      const [parentKey, childKey] = key.split('-');
      if (childKey) {
        if (seletedMap.has(parentKey)) {
          const list = seletedMap.get(parentKey);
          seletedMap.set(parentKey, [...list, childKey]);
        } else {
          seletedMap.set(parentKey, [childKey]);
        }
      }
    });
    const list = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const [parentKey, childKeys] of seletedMap) {
      // 找到对应的父亲节点，过滤掉未选中的。
      const customer = customerList.find(({ customerId }) => customerId === parentKey);
      const copyCustomer = { ...customer };
      copyCustomer.grantUsers = copyCustomer.grantUsers.filter(({ userId }) =>
        childKeys.includes(userId),
      );
      // 去重
      const idx = copySelectedList.findIndex((item) => item.customerId === parentKey);
      if (idx > -1) {
        copyCustomer.grantUsers = [...copyCustomer.grantUsers, ...copySelectedList[idx].grantUsers];
        copySelectedList.splice(idx, 1);
      }
      list.push(copyCustomer);
    }
    setSelectedList([...copySelectedList, ...list]);
    setCustomerCheckedKeys([]);
    setCustomerCheckAll(false);
    setIndeterminate(false);
  }

  // 左侧checkBox
  function onLeftCheck(checkedKeys, e, allkeys) {
    setCustomerCheckedKeys(checkedKeys);
    setIndeterminate(!!checkedKeys.length && checkedKeys.length < allkeys.length);
    setCustomerCheckAll(allkeys.length === checkedKeys.length);
    const { checked, dataRef } = e.node.props;
    const { customerId, grantUsers, customerName } = dataRef;
    if (customerId && !grantUsers.length) {
      if (!checked) {
        // 未授权查账
        unauthorizedList.push({
          key: customerId,
          value: customerName,
        });
      } else {
        const index = unauthorizedList.findIndex((it) => it.key === customerId);
        unauthorizedList.splice(index, 1);
      }
    }
  }

  // 左侧全选
  function onLeftCheckAll(e, keys) {
    for (let i = 0; i < customerList.length; i += 1) {
      const customer = customerList[i];
      if (!customer.grantUsers.length) {
        unauthorizedList.push({
          key: customer.customerId,
          value: customer.customerName,
        });
      }
    }
    setIndeterminate(false);
    setCustomerCheckAll(e.target.checked);
    setCustomerCheckedKeys(keys);
  }

  // 右checkBox
  function onRightCheck(checkedKeys) {
    setContactUserCheckedKeys(checkedKeys);
  }

  // 选择客户分组，请求对应联系人
  async function onSelect(selectedKeys) {
    if (!selectedKeys.length) {
      setCustomerList([]);
      return;
    }
    const groupIds = [];
    const queryCriteria = [];
    if (selectedKeys[0] !== 'all') {
      selectedKeys.forEach((key) => {
        // 有-的key代表是预置分组
        const splitKeys = key.split('-');
        // 预置分组，需要传type、value。 自定义传id
        if (splitKeys[1] !== undefined) {
          queryCriteria.push({
            type: splitKeys[0],
            value: splitKeys[1],
          });
        } else {
          groupIds.push(splitKeys[0]);
        }
      });
    }
    const params = { keyword: '', groupIds, queryCriteria };
    const res = await getCustomerList(params);
    setCustomerParams(params);
    setCustomerCheckedKeys([]);
    setCustomerCheckAll(false);
    unauthorizedList = [];
    if (res.data && res.data.customers) {
      setCustomerList(res.data.customers);
    }
  }

  // 对已选联系人区域的搜索
  function onContactUserChange(e) {
    setContactUserInputVal(e.target.value);
  }

  // 提交后回填到发送对象输入框内
  function onSubmit() {
    onSendObjChange(selectedList);
    onClose();
  }

  // 计算得到客户分组列表
  const calcGourpList = useMemo(() => {
    const groupData = groupList.map((it) => {
      return {
        title: it.groupName,
        key: it.groupId,
        // selectable: false,
      };
    });
    const defaultGroupData = defaultGroupList
      .filter((it) => it.selected)
      .map((it) => {
        return {
          title: it.classifyName,
          key: `${INVALID}-${it.type}`,
          selectable: false,
          children: it.extendGroupValuelist.map((child) => ({
            title: child.name,
            key: `${it.type}-${child.value}`,
            // selectable: false,
          })),
        };
      });
    return [
      {
        title: '全部客户',
        key: 'all',
      },
      {
        title: '自定义客户分组',
        key: INVALID,
        selectable: false,
        children: groupData,
      },
      ...defaultGroupData,
    ];
  }, [groupList, defaultGroupList]);
  // 搜索已选择发送对象的结果列表
  const searchedSelectedList = useMemo(() => {
    return selectedList
      .map((item) => {
        if (item.customerName.indexOf(contactUserInputVal) > -1) {
          return item;
        }
        const grantUsers = item.grantUsers.filter((user) =>
          user.username.includes(contactUserInputVal),
        );
        if (grantUsers.length) {
          return { ...item, grantUsers };
        }
        return undefined;
      })
      .filter((_) => _);
  }, [selectedList, contactUserInputVal]);

  return (
    <Modal
      title="选择发送对象"
      wrapClassName="send-object-modal"
      visible={isModalShow}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <SelectList
        style={{ width: '240px', height: '440px' }}
        dataSource={calcGourpList}
        title="客户分组"
        onSelect={onSelect}
        search={() => {
          return (
            <Input
              prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入分组名称搜索"
              onChange={groupInputValChange}
              allowClear
            />
          );
        }}
        getTreeNodeProps={() => {
          return {};
        }}
      />
      <TransferItem
        title="客户/联系人"
        checkable
        dataSource={customerList}
        checkedKeys={customerCheckedKeys}
        checkAll={customerCheckAll}
        indeterminate={indeterminate}
        searchOpt={{
          placeholder: '请输入客户名称搜索',
          onChange: customerInputChange,
        }}
        getTreeNodeProps={(record) => {
          if (record.parentNode) {
            const { parentNode } = record;
            return {
              title: record.username,
              key: `${parentNode.customerId}-${record.userId}`,
              selectable: false,
              disabled: cachKeys.includes(`${parentNode.customerId}-${record.userId}`),
            };
          }
          return {
            title: record.customerName,
            key: record.customerId,
            selectable: false,
            disabled: cachKeys.includes(record.customerId),
            childrenPropName: 'grantUsers',
          };
        }}
        onCheck={onLeftCheck}
        onCheckAll={onLeftCheckAll}
      />
      <div className="transfer-operation">
        <Button disabled={!customerCheckedKeys.length} type="primary" onClick={toRight}>
          添加
          <Icon type="right" />
        </Button>
        <Button type="primary" disabled={!contactUserCheckedKeys.length} onClick={toLeft}>
          <Icon type="left" />
          删除
        </Button>
      </div>
      <TransferItem
        checkedKeys={contactUserCheckedKeys}
        dataSource={searchedSelectedList}
        title="已选发送对象"
        searchOpt={{
          placeholder: '请输入客户名称搜索',
          onChange: onContactUserChange,
        }}
        getTreeNodeProps={(record) => {
          if (record.parentNode) {
            const { parentNode } = record;
            return {
              title: record.username,
              key: `${parentNode.customerId}-${record.userId}`,
              selectable: false,
            };
          }
          return {
            title: record.customerName,
            key: record.customerId,
            selectable: false,
            childrenPropName: 'grantUsers',
          };
        }}
        onCheck={onRightCheck}
      />
      <div className="handle-row">
        <Button type="plain" onClick={onClose}>
          取消
        </Button>
        <Button type="primary" onClick={onSubmit}>
          保存
        </Button>
      </div>
    </Modal>
  );
}

export default forwardRef(SendObjectModal);
