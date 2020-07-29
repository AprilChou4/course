/* eslint-disable no-param-reassign */
/**
 * 新增
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, message, Modal } from 'antd';
import { postMessageRouter } from '@utils';
import { connect } from 'nuomi';

const AddBtn = () => {
  // 点击新增
  const add = () => {
    postMessageRouter({
      type: 'agentAccount/routerLocation',
      payload: {
        url: '/charge/receivable',
      },
    });
  };

  return (
    <>
      <Button className="e-ml12" type="primary" onClick={add}>
        新增
      </Button>
    </>
  );
};

export default connect()(AddBtn);
