// tab标签
import React, { PureComponent } from 'react';
import { Tabs } from 'antd';
import { connect, Nuomi, router } from 'nuomi';
import postMessageRouter from '@utils/postMessage';
import basicInfo from '../../../basicInfo';
import serviceInfo from '../../../serviceInfo';
import attachment from '../../../attachment';
import invoiceInfo from '../../../invoiceInfo';
import taxInfo from '../../../taxInfo';

import TaxGuide from '../TaxGuide';
import TaxSlider from '../TaxSlider';
import TaxCloseTip from '../TaxCloseTip';
import Style from './style.less';

const { TabPane } = Tabs;

class Main extends PureComponent {
  // 切换tab
  changeTab = async (key) => {
    const { dispatch, tabType } = this.props;

    // isAlone=1 提供给税务平台单独引用详情页面
    const {
      query: { customerId, isEdit, isAlone, loginInfo },
    } = router.location();
    // 调用当前tab页的onLeave, 询问是否保存
    const tabIds = [
      'customer_detail_basicInfo',
      'customer_detail_taxInfo',
      'customer_detail_invoiceInfo',
      'customer_detail_serviceInfo',
    ];
    const result = await dispatch({
      type: `${tabIds[Number(tabType) - 1]}/onLeave`,
      payload: {
        form: this.form,
      },
    });
    if (result !== true && result !== undefined) return;
    if (isAlone === '1') {
      router.location(
        `/custom/detail/?tab=${key}&isEdit=${isEdit}&isAlone=${isAlone}&customerId=${customerId}&loginInfo=${loginInfo}`,
        true,
      );
    } else {
      postMessageRouter({
        type: 'agentAccount/routerLocation',
        payload: {
          url: '/custom/detail/',
          query: {
            tab: key,
            isEdit,
            customerId,
          },
        },
      });
    }
    dispatch({
      type: 'updateState',
      payload: {
        tabType: key,
      },
    });
  };

  showTaxTip = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        taxSliderVisible: true,
      },
    });
  };

  render() {
    const { tabType } = this.props;
    const {
      query: { isAlone },
    } = router.location();
    return (
      <div className={Style['customDetail-tab']}>
        {isAlone === '1' && (
          <>
            <TaxGuide />
            <TaxSlider />
            <TaxCloseTip />
          </>
        )}
        <Tabs
          activeKey={tabType}
          onChange={this.changeTab}
          animated={false}
          tabBarExtraContent={
            isAlone === '1' && (
              <i className={`iconfont ${Style['m-newIcon']}`} onClick={this.showTaxTip}>
                &#xed9c;
              </i>
            )
          }
        >
          <TabPane tab="基本信息" key="1">
            {tabType === '1' && <Nuomi {...basicInfo} />}
          </TabPane>
          <TabPane tab="税务信息" key="2">
            {tabType === '2' && <Nuomi {...taxInfo} />}
          </TabPane>
          <TabPane tab="开票信息" key="3">
            {tabType === '3' && <Nuomi {...invoiceInfo} />}
          </TabPane>
          <TabPane tab="服务信息" key="4">
            {tabType === '4' && <Nuomi {...serviceInfo} />}
          </TabPane>
          <TabPane tab="附件管理" key="5">
            {tabType === '5' && <Nuomi {...attachment} />}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
export default connect(({ tabType, key }) => ({
  tabType,
  key,
}))(Main);
