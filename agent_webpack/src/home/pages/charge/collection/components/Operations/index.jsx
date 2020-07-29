import React, { useMemo, useCallback } from 'react';
import { Button, ConfigProvider } from 'antd';
import { connect } from 'nuomi';
import { get, postMessageRouter } from '@utils';
import { dictionary } from '@pages/charge/receivable/utils';
import { ShowConfirm } from '@components';
import { STORE_PREFIX } from '../../utils';

import './style.less';

// 需要转成数值
const NEED_TO_NUMBER = [
  'totalReceiptMoney',
  'shouldTotalMoney',
  'preReceiptMoney',
  'freeMoney',
  'userPreReceiptMoney',
];
// 需要转成字符串 （清空是undefined）
const NEED_TO_STRING = ['receiptStaffId', 'deptId', 'businessStaffId'];
// 需要校验客户名称、收款人、业务员，没有匹配上需要转成id  #140370
const NEED_TO_TRUETH_ID = ['customerId', 'businessStaffId', 'receiptStaffId'];

const Operations = ({
  status,
  form,
  tableForm,
  dataSource,
  totalMoney,
  noUpdateAuth,
  isReference,
  dispatch,
}) => {
  // 按钮状态
  const statusData = useMemo(() => get(dictionary, `statusData.map.${status}`, {}), [status]);

  //
  const submit = async (values, tableValues, isContinue) => {
    if (
      totalMoney.totalReceiptMoney !== parseFloat(values.totalReceiptMoney) &&
      tableValues.length
    ) {
      ShowConfirm({
        title: '收款金额与实收金额合计不相等，请检查。',
        okText: '确定',
        type: 'warning',
      });
      return;
    }
    const finalParams = {
      ...values,
      ...(tableValues.length ? totalMoney : {}),
    };
    // ugly!
    NEED_TO_NUMBER.forEach((key) => {
      finalParams[key] = finalParams[key] ? parseFloat(finalParams[key]) : finalParams[key];
    });

    NEED_TO_STRING.forEach((key) => {
      finalParams[key] = finalParams[key] || '';
    });

    // NEED_TO_TRUETH_ID.forEach((key) => {
    //   const truthId = localStorage.getItem(`${STORE_PREFIX}_${key}`);
    //   finalParams[key] = truthId || finalParams[key];
    // });

    // 收款日期转成时间戳
    finalParams.receiptDate = finalParams.receiptDate.format('X');
    // console.log('tableValues', tableValues);
    // console.log('dataSource', dataSource);
    // 服务项目 表格表单补充上计划id shouldReceiveItemId
    finalParams.receiveBillItems = tableValues.map((it, index) => ({
      ...it,
      // 只要是参照应收单，明细表不能增加、减少行，所以form返回的list索引和dataSource对应的上
      shouldReceiveItemId: isReference ? dataSource[index].shouldReceiveItemId : undefined,
    }));
    // console.log('最终参数：', finalParams);
    // staus 1和2是增加，其他是更新
    const type = status > 2 ? '$updateCollection' : '$addCollection';
    console.log('最终参数', finalParams);
    await dispatch({
      type,
      payload: { params: finalParams, isContinue },
    });
    form.resetFields();
    tableForm.resetFields();
  };

  // 保存收款单 isContinue代表是否继续添加
  const handleSubmit = (isContinue) => {
    form.validateFields(async (e, values) => {
      const finnalValues = tableForm.getFieldsValue();
      // 服務項目、摘要互斥关系 有一个就行
      const validateKeys = finnalValues
        .map((it, index) => (it.serviceItemId || it.remark ? index : undefined))
        .filter((it) => it !== undefined);
      if (isReference || validateKeys.length) {
        tableForm.validateFields(validateKeys, async (err, tableValues) => {
          if (e || err) return;
          // console.log('tableValues', tableValues);
          submit(values, tableValues, isContinue);
          // 过滤掉无效服务项目
          // .map((it) => omit(it, ['id']));
          // 校验收款金额与 明细表总实收金额是否对应
        });
      } else {
        if (e) return;
        submit(values, [], isContinue);
      }
    });
  };

  // 新增收款单
  const handleAdd = () => {
    const callback = () => {
      form.resetFields();
      dispatch({
        type: '$initForm',
        payload: true,
      });
    };
    // todo: 修改后，未保存
    if (statusData.save === 0) {
      ShowConfirm({
        title: '收款单尚未保存，是否需要保存？',
        okText: '保存',
        cancelText: '不保存',
        onOk() {
          handleSubmit(true);
        },
        onCancel() {
          callback();
        },
      });
    } else {
      callback();
    }
  };

  // 刪除收款单
  const handleDelete = useCallback(() => {
    ShowConfirm({
      title: '你确定要删除此收款单吗？',
      onOk() {
        dispatch({
          type: '$deleteCollection',
        });
      },
    });
  }, [dispatch]);

  // 跳转收款单列表
  const toList = useCallback(() => {
    postMessageRouter({
      type: 'agentAccount/routerLocation',
      payload: {
        url: '/charge/collectionList',
      },
    });
  }, []);
  console.log(noUpdateAuth);
  return (
    <div styleName="charge-collection-operation">
      <ConfigProvider autoInsertSpaceInButton={false}>
        {!noUpdateAuth && (
          <Button
            type="primary"
            onClick={() => handleSubmit(false)}
            disabled={statusData.save === 1}
          >
            保存
          </Button>
        )}
        {statusData.add !== 2 && (
          <Button type="primary" onClick={handleAdd}>
            新增
          </Button>
        )}
        {statusData.saveAdd !== 2 && (
          <Button onClick={() => handleSubmit(true)} disabled={statusData.saveAdd === 1}>
            保存并新增
          </Button>
        )}
        {statusData.delete !== 2 && <Button onClick={handleDelete}>删除</Button>}
        <Button onClick={toList}>收款单列表</Button>
        {/* <Button className="arrow-btn">
          <Iconfont code="&#xe6d9;" />
        </Button>
        <Button className="arrow-btn">
          <Iconfont code="&#xe611;" />
        </Button> */}
      </ConfigProvider>
    </div>
  );
};

export default connect(
  ({ status, dataSource, tableForm, isReference, totalMoney, noUpdateAuth }) => ({
    status,
    dataSource,
    totalMoney,
    isReference,
    tableForm,
    noUpdateAuth,
  }),
)(Operations);
