// tab标签
import React, { PureComponent, Fragment } from 'react';
import { Spin } from 'antd';
import { connect } from 'nuomi';
import AttachItem from '../AttachItem';
import Style from './style.less';
import ViewFileModal from '../ViewFileModal';

@connect(({ tabType }) => ({
  tabType,
}))
class Main extends PureComponent {
  // 切换tab
  changeTab = (key) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'updateState',
      payload: {
        tabType: key,
      },
    });
  };

  render() {
    // 1.营业执照，2.法人证件,3.公司章程,4.其他
    const list = [
      {
        itemTitle: '营业执照',
        upType: 1,
      },
      {
        itemTitle: '法人证件',
        upType: 2,
      },
      {
        itemTitle: '公司章程',
        upType: 3,
      },
      {
        itemTitle: '其他',
        upType: 4,
      },
    ];
    const { loadings, enclosureList } = this.props;
    return (
      <Fragment>
        <Spin spinning={!!loadings.$getEnclosureList || !!loadings.$deleteEnclosure}>
          <div className={Style['m-attachment']}>
            {list.map((item) => (
              <AttachItem
                key={item.upType}
                fileList={enclosureList.filter((v) => v.enclosureClass === item.upType)}
                itemTitle={item.itemTitle}
                upType={item.upType}
              />
            ))}
          </div>
        </Spin>
        <ViewFileModal />
      </Fragment>
    );
  }
}
export default connect(({ loadings, enclosureList }) => ({ loadings, enclosureList }))(Main);
