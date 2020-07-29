import React from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import { connect } from 'nuomi';

const Footer = ({ formValues }) => {
  return (
    <Row style={{ paddingTop: 28 }}>
      <Col span={10}>
        <span style={{ marginRight: 40 }}>制单人：{formValues.createBillStaffName}</span>
        <span>
          制单日期：
          {formValues.createBillDate
            ? moment(formValues.createBillDate, 'X').format('YYYY-MM-DD')
            : ''}
        </span>
      </Col>
      <Col span={12}>
        <span style={{ marginRight: 40 }}> 修改人：{formValues.modifyStaffName}</span>
        <span>
          修改日期：
          {formValues.modifyDate ? moment(formValues.modifyDate, 'X').format('YYYY-MM-DD') : ''}
        </span>
      </Col>
    </Row>
  );
};

export default connect(({ formValues }) => ({ formValues }))(Footer);
