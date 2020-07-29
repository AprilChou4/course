// 指派/新增客户title
import React from 'react';
import PropTypes from 'prop-types';
import Style from './style.less';

const Title = ({ title }) => <div className="ui-title">{title}</div>;
Title.propTypes = {
  title: PropTypes.string,
};
export default Title;
