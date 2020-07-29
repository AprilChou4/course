import React from 'react';
import ReactDOM from 'react-dom';
import AntdModal from '../AntdModal';

/**
 * 函数式Modal
 * @param {*} [options={}] Antd.Modal原本的API
 * @param {*} children  Modal的内容
 */
function ShowModal(options = {}, children) {
  const destroy = (node) => {
    const unmountResult = ReactDOM.unmountComponentAtNode(node); // 如果组件被移除将会返回 true，如果没有组件可被移除将会返回 false
    if (unmountResult && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  };
  const modalHas = document.getElementsByClassName('smart-modal')[0];
  if (modalHas) {
    destroy(modalHas);
  }
  const div = document.createElement('div');
  div.setAttribute('class', 'smart-modal');

  const { onOk = () => {}, onCancel = () => {}, ...rest } = options;
  const handleOk = () => {
    onOk && onOk();
    destroy(div);
  };
  const handleCancel = () => {
    onCancel && onCancel();
    destroy(div);
  };
  const smModal = (
    <AntdModal {...rest} visible onCancel={handleCancel} onOk={handleOk}>
      {children}
    </AntdModal>
  );
  document.body.appendChild(div);
  ReactDOM.render(smModal, div);
  return {
    destroy: () => destroy(div),
  };
}

export default ShowModal;
