import React, { forwardRef } from 'react';
import monment from 'moment';
import { connect } from 'nuomi';
import { Descriptions } from 'antd';
import styles from './style.less';

const { Item: DescriptionsItem } = Descriptions;
const dateFormat = 'YYYY-MM-DD';

const Footer = forwardRef(({ formInitialValues }, ref) => {
  return (
    <Descriptions column={6} ref={ref} className={styles.descriptions}>
      <DescriptionsItem label="制单人">
        {formInitialValues.createBillStaffName || ''}
      </DescriptionsItem>
      <DescriptionsItem label="制单日期" span={2}>
        {formInitialValues.createBillDate
          ? monment(formInitialValues.createBillDate, 'X').format(dateFormat)
          : ''}
      </DescriptionsItem>
      <DescriptionsItem label="修改人">{formInitialValues.modifyStaffName || ''}</DescriptionsItem>
      <DescriptionsItem label="修改日期">
        {formInitialValues.modifyDate
          ? monment(formInitialValues.modifyDate, 'X').format(dateFormat)
          : ''}
      </DescriptionsItem>
    </Descriptions>
  );
});

export default connect(({ formInitialValues }) => ({ formInitialValues }))(Footer);
