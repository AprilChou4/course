// 新增客户>识别新增
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import { Row, Col } from 'antd';
import UploadCert from '../UploadCert';
import IdentityInfo from '../IdentityInfo';
import Style from './style.less';

class FirstStep extends PureComponent {
  render() {
    const { form } = this.props;
    return (
      <>
        <Row>
          <Col span={10} className={Style['m-side']}>
            <UploadCert form={form} />
          </Col>
          <Col span={14} className={Style['m-content']}>
            <IdentityInfo form={form} />
          </Col>
        </Row>
      </>
    );
  }
}
export default connect()(FirstStep);
