import React from 'react';
import { Form, Select } from 'antd';
import { connect } from 'nuomi';
import classnames from 'classnames';

import './style.less';

const { Option } = Select;

const FinanciaForm = ({ form, formParams, isEditing }) => {
  const { getFieldDecorator } = form;

  // 会计科目如果是个体工商户，不展示财务报表信息
  if (formParams.accounting === 6 || formParams.accounting === 7) {
    return null;
  }

  return (
    <dl className={classnames('form-block', { 'from-disabled': !isEditing })}>
      <dt>财务报表信息</dt>
      <dd>
        <div className="form-row" styleName="agent-info-row">
          <Form.Item label="税局备案财务报表类型">
            {getFieldDecorator('financialStatementsType', {
              initialValue: formParams.financialStatementsType,
            })(
              <Select
                placeholder={isEditing ? '请选择财务报表类型' : '-'}
                disabled={!isEditing}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <Option value={1}>企业会计准则</Option>
                <Option value={2}>小企业会计准则</Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="纳税期限">
            {getFieldDecorator('applyPeriod', {
              initialValue: formParams.applyPeriod,
            })(
              <Select
                placeholder={isEditing ? '请选择纳税期限' : '-'}
                disabled={!isEditing}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <Option value={1}>季报</Option>
                <Option value={2}>月报</Option>
              </Select>,
            )}
          </Form.Item>
        </div>
      </dd>
    </dl>
  );
};

const mapStateToProps = ({ formParams, isEditing }) => ({
  formParams,
  isEditing,
});

export default connect(mapStateToProps)(Form.create()(FinanciaForm));
