// 选择企业
import React, { useEffect, useMemo, useCallback } from 'react';
import { List } from 'antd';
import { connect } from 'nuomi';
import ShowConfirm from '@components/ShowConfirm';
import Style from './style.less';

const CompanyList = ({ loginInfo, companyList, dispatch }) => {
  // 获取公司列表
  useEffect(() => {
    dispatch({
      type: '$getCompanyList',
    });
  }, [dispatch, loginInfo]);

  // 重新申请
  const reApply = ({ companyId, phoneNum }) => {
    // 单点登录过来phoneNum取列表里的字段，loginfo取不到
    dispatch({
      type: '$reJoinStatus',
      payload: {
        companyId,
        phoneNum: loginInfo.phoneNum || phoneNum,
      },
    });
  };

  // 撤回申请
  const recallApply = ({ companyId, phoneNum }) => {
    dispatch({
      type: '$cancelJoinStatus',
      payload: {
        companyId,
        phoneNum: loginInfo.phoneNum || phoneNum,
      },
    });
  };

  // 激活企业
  const activeCompany = (item) => {
    dispatch({
      type: 'updateState',
      payload: {
        activeCompanyVisible: true,
        chooseCompanyVisible: false,
        selectedCompanyInfo: item,
      },
    });
  };

  // 删除企业
  const delCompany = ({ companyId }) => {
    ShowConfirm({
      title: '确定要删除企业信息吗？',
      width: 248,
      onOk: () => {
        dispatch({
          type: '$delCompany',
          payload: {
            companyId,
            phoneNum: loginInfo.phoneNum,
          },
        });
      },
    });
  };

  // 切换企业
  const switchCompany = (item) => {
    dispatch({
      type: '$changeCompany',
      payload: {
        ...item,
      },
    });
  };

  // 重复的名称列表
  const repeatNameList = useMemo(() => {
    const repeatNameArr = [];
    const listName = [];
    companyList.forEach((val) => {
      if (listName.includes(val.companyName)) {
        repeatNameArr.push(val.companyName);
      } else {
        listName.push(val.companyName);
      }
    });
    return repeatNameArr;
  }, [companyList]);

  return (
    <List
      className={Style['m-companyList']}
      dataSource={companyList}
      renderItem={(item) => {
        const { companyName, notActive, notReview, versionType } = item;
        return (
          <List.Item
            className={`${(notActive || notReview) && Style['m-grayItem']}`}
            onClick={!notActive && !notReview ? () => switchCompany(item) : null}
          >
            <div className={Style['m-item']}>
              <div className={Style['m-companyName']}>
                {companyName}
                <span className={Style['m-mark']}>
                  {repeatNameList.includes(companyName) && `(${['云记账', '云代账'][versionType]})`}
                </span>
              </div>
              <div className={Style['m-extra']}>
                {!notActive && !notReview && (
                  <a className={Style['m-enterCompany']}>进入企业 &gt;&gt;</a>
                )}
                {(notReview || notActive) && (
                  <>
                    <span className={Style['m-vertify']}>
                      <i className="iconfont">&#xe61e;</i>
                      {notReview && '审核中'}
                      {notActive && '待激活'}
                    </span>
                    <span className={Style['m-operateApply']}>
                      {notReview && (
                        <>
                          <a onClick={() => reApply(item)}>重新申请</a>
                          <a onClick={() => recallApply(item)}>撤回申请</a>
                        </>
                      )}
                      {notActive && (
                        <>
                          <a onClick={() => activeCompany(item)}>激活企业</a>
                          <a onClick={() => delCompany(item)}>删除企业</a>
                        </>
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </List.Item>
        );
      }}
    />
  );
};
export default connect(({ loginInfo, companyList }) => ({
  loginInfo,
  companyList,
}))(CompanyList);
