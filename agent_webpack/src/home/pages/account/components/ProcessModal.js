import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Progress } from 'antd';


const ProcessModal = ({ isShowProcess, process }) => {
    return (
        <Modal
            className="check-process-modal"
            width={420}
            title={null}
            footer={null}
            maskClosable={false}
            visible={isShowProcess}
            centered
        >
            <div className="process-status">批量结账中…</div>
            <Progress percent={process} status="active" />

            <div className="process-info">当前结账进度为
                        <span style={{ color: '#008CFF' }}>{process}%</span>
                … 请耐心等待
                    </div>
        </Modal> 
    );
};

export default ProcessModal;
