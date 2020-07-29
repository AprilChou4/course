import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColTable from './ColTable';
import { Modal, message } from 'antd';

export default class CustomCol extends Component {
    static propTypes = {
        visible: PropTypes.bool,
        onCancel: PropTypes.func,
        setColOption: PropTypes.func, // 获取自定义顺序列
    }

    constructor(props) { 
        super(props);
        this.columnSource = [];
    }

    setStateData = (obj) => {
        this.columnSource = obj;
    }

    onSave = () => {
        this.props.setColOption(this.columnSource);
    }

    render() {

        const { onCancel, visible } = this.props;
        return (
            <Modal 
                title="显示列设置"
                visible={visible}
                width={520}
                maskClosable={false}
                centered
                onOk={this.onSave}    
                onCancel={onCancel}    
            >
                <p className="custom-col-note">注：鼠标拖动行，可调整顺序</p>
                <ColTable saveData={this.setStateData} />
            </Modal>
        );
    }
}
