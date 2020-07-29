import React, { useImperativeHandle, useState, forwardRef } from 'react';
import { Form, Radio, Select, DatePicker, Input } from 'antd';
import moment from 'moment';
import { disabledDate, disabledDateTime } from './disabledFuc';

import './index.less';

const { Option } = Select;
// 默认的发送时点radios, 3/4 代表结账上、当月, 5/6 代表保税数据录入上、当月
const defaultTimingTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// radio对应的必填项，用于校验
const timingTypeMap = {
  1: ['sendDay', 'sendHour'],
  2: ['date'],
  3: ['3/currentLastMonth'],
  4: ['4/currentLastMonth'],
  5: ['5/beforeDay'],
  6: ['6/beforeDay'],
};

function TimingRadioGroup({ messageData, timingTypes = defaultTimingTypes, form }, ref) {
  // 发送时点的type值
  const [timingType, setTimingType] = useState(messageData.msgTimingType || -1);
  // 错误显示的位置
  const [errLine, setErrLine] = useState(-1);

  // 自定义暴露给父组件的实例值, 转发ref
  useImperativeHandle(ref, () => ({
    // 获取表单数据
    getFieldsValue() {
      // const formValues = form.getFieldsValue();
      let values = {};
      switch (timingType) {
        case 1:
          values = form.getFieldsValue(['sendDay', 'sendHour']);
          break;
        case 2: {
          const date = form.getFieldValue('date');
          values = {
            sendYear: date.year(),
            sendMonth: date.month() + 1,
            sendDay: date.date(),
            sendHour: date.hour(),
          };
          break;
        }
        case 3:
        case 4: {
          const currentLastMonth = form.getFieldValue(`${timingType}/currentLastMonth`);
          values = {
            currentLastMonth: parseInt(currentLastMonth, 10),
          };
          break;
        }
        case 5:
        case 6: {
          const result = form.getFieldValue(`${timingType}/beforeDay`);
          values = {
            beforeDay: parseInt(result, 10),
          };
          break;
        }
        default:
      }
      return {
        ...values,
        timingType,
      };
    },
    // 校验表单
    validateFields() {
      // 当月保存第一笔凭证7 勾选即可
      if (timingType === 7) {
        return true;
      }
      const formValues = form.getFieldsValue(timingTypeMap[timingType]);
      const passed = Object.keys(formValues).every(
        (key) => formValues[key] !== undefined && formValues[key] !== null,
      );
      !passed && setErrLine(Math.max(timingType, 1));
      return passed;
    },
    resetFields: (params) => {
      form.resetFields(params);
      setTimingType(-1);
    },
  }));

  // 发送时点切换
  const onRadioChange = (e) => {
    setErrLine(-1);
    setTimingType(e.target.value);
  };

  // 表单有变化，清空错误
  const clearErr = () => {
    setErrLine(-1);
  };

  const months = Array.from({ length: 31 }, (n, i) => i + 1);
  const hours = Array.from({ length: 25 }, (n, i) => i);
  const { getFieldDecorator } = form;

  // 处理初始值
  const currentMessage = { ...messageData };
  switch (messageData.msgTimingType) {
    case 2: {
      const { sendYear, sendMonth, sendDay, sendHour } = currentMessage;
      const date = moment()
        .year(sendYear)
        .month(sendMonth - 1)
        .date(sendDay)
        .hour(sendHour)
        .minute(0)
        .seconds(0);
      currentMessage.date = date;
      break;
    }
    case 3:
    case 4:
      currentMessage[`${messageData.msgTimingType}/currentLastMonth`] =
        messageData.currentLastMonth;
      break;
    case 5:
    case 6:
      currentMessage[`${messageData.msgTimingType}/beforeDay`] = messageData.beforeDay;
      break;
    default:
  }

  return (
    <Radio.Group className="message-timming-group" value={timingType} onChange={onRadioChange}>
      {/* 每月 */}
      {timingTypes.includes(1) && (
        <Radio value={1}>
          每月
          {getFieldDecorator('sendDay', {
            initialValue: currentMessage.sendDay,
          })(
            <Select placeholder="选择" onChange={clearErr}>
              {months.map((month) => (
                <Option value={month} key={month}>
                  {month}
                </Option>
              ))}
            </Select>,
          )}
          日
          {getFieldDecorator('sendHour', {
            initialValue: currentMessage.sendHour,
          })(
            <Select placeholder="选择" onChange={clearErr}>
              {hours.map((hour) => (
                <Option value={hour} key={hour}>
                  {hour}
                </Option>
              ))}
            </Select>,
          )}
          时{errLine === 1 && <span className="err-msg">请选择时点</span>}
        </Radio>
      )}
      {/* 固定时间点 */}
      {timingTypes.includes(2) && (
        <Radio value={2}>
          {getFieldDecorator('date', {
            initialValue: currentMessage.date,
          })(
            <DatePicker
              className="ml0"
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              showTime={{
                defaultValue: moment('00:00:00', 'HH:mm:ss'),
              }}
              showToday={false}
              onChange={clearErr}
            />,
          )}
          {errLine === 2 && <span className="err-msg">请选择时点</span>}
        </Radio>
      )}
      {/* 结账完成 */}
      {(timingTypes.includes(3) || timingTypes.includes(4)) && (
        <Radio value={3}>
          {getFieldDecorator('3/currentLastMonth', {
            initialValue: currentMessage['3/currentLastMonth'],
          })(
            <Select className="ml0" placeholder="选择" onChange={clearErr}>
              {timingTypes.includes(3) && <Option value={0}>上月</Option>}
              {timingTypes.includes(4) && <Option value={1}>当月</Option>}
            </Select>,
          )}
          结账完成
          {errLine === 3 && <span className="err-msg">请选择时点</span>}
        </Radio>
      )}
      {/* 报税数据录入完成 */}
      {(timingTypes.includes(5) || timingTypes.includes(6)) && (
        <Radio value={4}>
          {getFieldDecorator('4/currentLastMonth', {
            initialValue: currentMessage['4/currentLastMonth'],
          })(
            <Select className="ml0" placeholder="选择" onChange={clearErr}>
              {timingTypes.includes(5) && <Option value={0}>上月</Option>}
              {timingTypes.includes(6) && <Option value={1}>当月</Option>}
            </Select>,
          )}
          报税数据录入完成
          {errLine === 4 && <span className="err-msg">请选择时点</span>}
        </Radio>
      )}
      {/* 合同到期前 */}
      {timingTypes.includes(7) && (
        <Radio value={5}>
          合同到期前
          {getFieldDecorator('5/beforeDay', {
            initialValue: currentMessage['5/beforeDay'],
          })(<Input placeholder="请输入" onChange={clearErr} autoComplete="off" />)}
          天{errLine === 5 && <span className="err-msg">请选择时点</span>}
        </Radio>
      )}
      {/* 产生欠费前 */}
      {timingTypes.includes(8) && (
        <Radio value={6}>
          产生欠费前
          {getFieldDecorator('6/beforeDay', {
            initialValue: currentMessage['6/beforeDay'],
          })(<Input placeholder="请输入" onChange={clearErr} autoComplete="off" />)}
          天{errLine === 6 && <span className="err-msg">请选择时点</span>}
        </Radio>
      )}
      {/* 当月保存第一笔凭证 */}
      {timingTypes.includes(9) && <Radio value={7}>当月保存第一笔凭证</Radio>}
    </Radio.Group>
  );
}

export default Form.create()(forwardRef(TimingRadioGroup));
