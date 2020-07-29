import React, { PureComponent } from 'react';
import { Button, Popover, Icon, Form } from 'antd';
import PropTypes from 'prop-types';

class Suffix extends PureComponent {
  constructor(...args) {
    super(...args);
    this.initialValues = {};
    this.values = {};
    this.isSubmit = false;
  }

  _search = () => {
    this.props.search();
  };

  _reset = () => {
    const { form } = this.props;
    for (const i in this.values) {
      form.setFieldsValue({
        [i]: this.initialValues[i],
      });
    }
  };

  _restoreDefault = () => {
    this.values = this.initialValues;
  };

  _handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.isSubmit = true;
        this.props.search((this.values = values));
      }
    });
  };

  _visibleChange = (visible) => {
    const { form } = this.props;
    if (!visible && !this.isSubmit) {
      form.setFieldsValue(this.values);
    }
    // form用于重置表单，填充数据
    this.props.visibleChange(visible, form);
    this.isSubmit = false;
  };

  _getFieldsValue() {
    return (this.values = this.props.form.getFieldsValue());
  }

  componentDidMount() {
    this.initialValues = this.values = this.props.form.getFieldsValue();
    this.props.getSuffix(this);
  }

  render() {
    const { visible, trigger, getContent, form } = this.props;
    const content = getContent(form);
    return (
      <>
        <Popover
          placement="bottomLeft"
          trigger={trigger || 'click'}
          content={
            <Form onSubmit={this._handleSubmit}>
              {content}
              <Form.Item className="popover-footer">
                <Button onClick={this._reset}>重置</Button>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Form.Item>
            </Form>
          }
          getPopupContainer={(trigger) => trigger.parentNode.parentNode}
          onVisibleChange={this._visibleChange}
          visible={visible}
        >
          <a className="f-cblue">更多条件</a>
        </Popover>
        <Button type="primary" onClick={this._search}>
          <Icon type="search" />
        </Button>
      </>
    );
  }
}

Suffix.propTypes = {
  visibleChange: PropTypes.func,
  search: PropTypes.func,
  visible: PropTypes.bool,
  trigger: PropTypes.string,
  getContent: PropTypes.func,
  getSuffix: PropTypes.func,
};

export default Form.create()(Suffix);
