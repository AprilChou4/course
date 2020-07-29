// 系统消息> 建议反馈
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'nuomi';
import { Form, Input, Button, Spin } from 'antd';
import { loadavg } from 'os';
import UploadImg from '../UploadImg';
import Style from './style.less';

const formItemLayout = {
  labelCol: {
    sm: { span: 3 },
  },
  wrapperCol: {
    sm: { span: 21 },
  },
};
const { TextArea } = Input;
const FormItem = Form.Item;
const fileList1 = [
  {
    uid: '-1',
    name: 'xxx.png',
    status: 'done',
    url: 'http://192.168.210.110/group1/M00/14/8A/wKjScF1LgoGAaey4AABCmF9dwWc7485884',
  },
];
const fileList2 = [
  {
    uid: '-1',
    name: 'xxx.png',
    status: 'done',
    url: 'http://192.168.210.110/group1/M00/14/8A/wKjScF1LiMaAeEn8AABLTboAsco2836165',
  },
];
const fileList3 = [
  {
    uid: '-1',
    name: 'xxx.png',
    status: 'done',
    url: 'http://192.168.210.110/group1/M00/14/86/wKjScV1LiMaAbhxQAAfJGjU-Si48890937',
  },
];
@Form.create()
class Advise extends PureComponent {
  submit = () => {
    const {
      form: { validateFields },
      dispatch,
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: '$submitAdvise',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  changeImg = ({ fileList }) => {
    this.setState({ fileList });
  };

  deleteImg = () => {
    alert('图片删除');
  };

  render() {
    const {
      form: { getFieldDecorator },
      loadings,
    } = this.props;
    return (
      //   <Spin spinning={loadings.$submitAdvise}>
      <Form className={Style['advise-form']} {...formItemLayout}>
        <FormItem label="标题">
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入内容',
              },
            ],
          })(<Input placeholder="请输入标题，最多25个字" maxLength={25} autoComplete="off" />)}
        </FormItem>
        <FormItem label="内容">
          {getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '请输入内容',
              },
            ],
          })(
            <TextArea
              className={Style['m-textarea']}
              placeholder="必填，最多250个字"
              maxLength={250}
              autoComplete="off"
            />,
          )}
        </FormItem>
        <FormItem
          label="上传图片：图片最多上传3张，支持bmp，jpg，png，gif格式 ，单张图片大小不超过 10M"
          colon={false}
          labelCol={{ sm: { span: 23 } }}
        ></FormItem>
        <FormItem label="&nbsp;" colon={false}>
          {getFieldDecorator('img', {})(
            <Fragment>
              <UploadImg
                onChange={this.changeImg}
                onDeleteImg={() => this.deleteImg()}
                fileList={fileList1}
              />
              <UploadImg
                onChange={this.changeImg}
                onDeleteImg={() => this.deleteImg()}
                fileList={fileList2}
              />
              <UploadImg
                onChange={this.changeImg}
                onDeleteImg={() => this.deleteImg()}
                fileList={fileList3}
              />
            </Fragment>,
          )}
        </FormItem>
        <FormItem label="联系方式">
          {getFieldDecorator('cantact', {})(
            <Input
              placeholder="请输入手机或QQ或邮箱，最多25个字"
              maxLength={25}
              autoComplete="off"
            />,
          )}
        </FormItem>
        <div className="f-tac">
          <Button type="primary" onClick={this.submit}>
            提交
          </Button>
        </div>
      </Form>
    );
  }
}
export default connect(({ loadings }) => ({ loadings }))(Advise);
