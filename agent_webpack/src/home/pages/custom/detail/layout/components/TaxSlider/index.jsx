// 对接税务筹划平台新手引导 轮播图
import React, { Component } from 'react';
import { Carousel, Modal } from 'antd';
import { connect } from 'nuomi';
import Style from './style.less';

const list = [
  {
    key: 1,
  },
  {
    key: 2,
  },
  {
    key: 3,
  },
  {
    key: 4,
  },
  {
    key: 5,
  },
  {
    key: 6,
  },
  {
    key: 7,
  },
  {
    key: 8,
  },
  {
    key: 9,
  },
  {
    key: 10,
  },
  {
    key: 11,
  },
];
class TaxSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.beforeChange = this.beforeChange.bind(this);
  }

  // 关闭弹窗
  close = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        taxSliderVisible: false,
        taxCloseTipVisible: true,
      },
    });
  };

  beforeChange(a, b) {
    this.setState({ index: b });
  }

  prev() {
    this.img.prev();
  }

  next() {
    this.img.next();
  }

  render() {
    const { taxSliderVisible } = this.props;
    const { index } = this.state;
    const lunboSetting = {
      dots: true,
      lazyLoad: true,
    };
    return (
      <Modal
        maskClosable={false}
        width={900}
        height={540}
        visible={taxSliderVisible}
        onCancel={this.close}
        footer={null}
        className={Style['m-taxSlider']}
      >
        <h3>
          {index + 1}/{list.length}
        </h3>
        <div>
          {index !== 0 && (
            <i className={`iconfont ${Style['m-leftIcon']}`} onClick={this.prev}>
              &#xeda0;
            </i>
          )}
          <Carousel
            dotsClass="slick-dots"
            infinite
            {...lunboSetting}
            ref={(dom) => {
              this.img = dom;
            }}
            beforeChange={this.beforeChange}
          >
            {list.map(({ key }) => (
              <div key={key} className={`${Style['m-image']} ${Style[`m-image${key}`]}`} />
            ))}
          </Carousel>
          {index <= list.length - 1 && (
            <i className={`iconfont ${Style['m-rightIcon']}`} onClick={this.next}>
              &#xeda1;
            </i>
          )}
        </div>
      </Modal>
    );
  }
}
TaxSlider.propTypes = {
  // tipsVisible: PropTypes.bool.isRequired, // 是否展示弹窗
  // closeUpgradeTips: PropTypes.func.isRequired, // 关闭弹窗
};
TaxSlider.defaultProps = {};
export default connect(({ taxSliderVisible }) => ({
  taxSliderVisible,
}))(TaxSlider);
