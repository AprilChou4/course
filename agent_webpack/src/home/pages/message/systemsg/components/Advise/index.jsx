import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import { connect } from 'nuomi';
import { request, loading, layer, uploader } from 'nuijs';
import style from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const Suggest = (props) => {
  const { form, _this } = props;
  const { getFieldDecorator } = form;
  _this.form = form;
  const handleImageUploads = (e) => {
    _this.file = e.target;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        props.submit(form);
      }
    });
  };
  return (
    <Form className={`${style.suggest} ${style.popfiles}`} onSubmit={handleSubmit}>
      <FormItem>
        <div className={style.filesdiv}>
          <span>标题：</span>
          {getFieldDecorator('title')(
            <Input placeholder="请输入标题，最多25个字" maxLength={25} autoComplete="off" />,
          )}
        </div>
      </FormItem>
      <FormItem>
        <div className={style.filesdiv}>
          <span>
            <i style={{ color: 'red', paddingRight: '5px' }}>*</i>内容：
          </span>
          {getFieldDecorator('content', {
            rules: [{ required: true, message: '内容不能为空' }],
          })(
            <TextArea
              placeholder="必填，最多250个字"
              autoSize={{ minRows: 6, maxRows: 10 }}
              maxLength={250}
            />,
          )}
        </div>
      </FormItem>
      <div className={style.filesdiv}>
        <span>上传图片：</span>
        <em>图片最多上传3张，支持bmp，jpg，png，gif格式 ，单张图片大小不超过 10M</em>
      </div>
      <div className={style.files} ref={(ele) => (_this.fileDiv = ele)}>
        <div className="ui-files-div">
          <span className="iconfont">&#xea73;</span>
          <font>
            <Input
              type="file"
              title="请选择文件"
              name="files"
              className="files1"
              onChange={handleImageUploads}
            />
          </font>
          <em>
            <b>
              <img />
            </b>
            <i className="iconfont" onClick={_this.clearImgs}>
              &#xeb2f;
            </i>
            <a onClick={_this.onImgs} className="iconfont">
              &#xea35;
            </a>
          </em>
        </div>
        <div className="ui-files-div">
          <span className="iconfont">&#xea73;</span>
          <font>
            <Input type="file" name="files" className="file2" onChange={handleImageUploads} />
          </font>
          <em>
            <b>
              <img />
            </b>
            <i className="iconfont" onClick={_this.clearImgs}>
              &#xeb2f;
            </i>
            <a onClick={_this.onImgs} className="iconfont">
              &#xea35;
            </a>
          </em>
        </div>
        <div className="ui-files-div">
          <span className="iconfont">&#xea73;</span>
          <font>
            <Input type="file" name="files" className="file3" onChange={handleImageUploads} />
          </font>
          <em>
            <b>
              <img />
            </b>
            <i className="iconfont" onClick={_this.clearImgs}>
              &#xeb2f;
            </i>
            <a onClick={_this.onImgs} className="iconfont">
              &#xea35;
            </a>
          </em>
        </div>
      </div>
      <FormItem>
        <div className={style.filesdiv}>
          <span>联系方式：</span>
          {getFieldDecorator('contact')(
            <Input
              placeholder="请输入手机或QQ或邮箱，最多25个字"
              maxLength={25}
              autoComplete="off"
            />,
          )}
        </div>
      </FormItem>
      <div className="f-tac">
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </div>
    </Form>
  );
};
const SuggestForm = Form.create()(Suggest);
class Head extends Component {
  componentDidMount() {
    this.uploader();
  }

  addImg = (elem) => {
    const em = elem.closest('font').siblings('em');
    const file = elem[0].files;
    // 校验数据正确性
    const data = file[0];
    if (data.size / (1024 * 1024) > 10) {
      message.error('该图片超出10M，请重新上传');
      return false;
    }
    const tests = ['image/jpeg', 'image/bmp', 'image/png', 'image/gif'];
    // const tests = /\.jpg|\.JPG|\.jpeg|\.JPEG|\.png|\.gif?$/;
    if (!tests.includes(data.type)) {
      // if (!tests.test(data.name)) {
      message.error('文件格式不正确');
      return false;
    }

    if (file) {
      // 定义一个文件阅读器
      const reader = new FileReader();
      // 文件装载后将其显示在图片预览里
      reader.onload = function() {
        em.addClass('onimgs')
          .find('img')
          .attr('src', this.result);
      };
      // 装载文件
      reader.readAsDataURL(file[0]);
    }
  };

  clearImgs = (data) => {
    const em = $(data.target).closest('em');
    em.closest('.ui-files-div')
      .find(':file')
      .uploader('clear');
    em.removeClass('onimgs');
  };

  onImgs = (data) => {
    const _img = $(data.target)
      .siblings('b')
      .find('img')
      .attr('src');
    layer({
      template: `<p class="e-p20 f-tac"><img src="${_img}"/></p>`,
      id: 'onimgs',
      data: {},
      edge: 20,
      cancel: {
        enable: false,
      },
      title: null,
      width: 600,
      button: [],
    });
  };

  uploader = () => {
    const that = this;
    const layerSelf = that.props.self;
    const _div = $(that.fileDiv);
    _div.find(':file').uploader({
      url: '/instead/v2/message/system/addSuggest.do',
      action: 'instead/v2/message/system/addSuggest.do',
      auto: false,
      accept: ['bmp', 'jpg', 'png', 'gif'], // bmp，jpg，png，gif
      data(data) {
        const Subdata = {
          contact: '',
          content: '',
          title: '',
        };
        return Subdata;
      },
      goSizeMB(size) {
        return size / (1024 * 1024);
      },
      onChange(self) {
        if (this.goSizeMB(self.$file[0].files[0].size) > 10) {
          message.error('该图片超出10M，请重新上传');
        }
        that.addImg(self.target);
      },
      onBefore(_self) {
        // const val = _self.$file.val();
        // if (val === '') {
        //   message.error('文件格式不正确');
        //   return false;
        // }
        const selfElems = _self.element.find('form');
        const datas = that.form.getFieldsValue();
        const f1 = $('[action="/instead/v2/message/system/addSuggest.do"]')
          .eq(0)
          .find('[name="files"]')
          .eq(0)
          .clone();
        const f2 = $('[action="/instead/v2/message/system/addSuggest.do"]')
          .eq(1)
          .find('[name="files"]')
          .eq(0)
          .clone();
        const f3 = $('[action="/instead/v2/message/system/addSuggest.do"]')
          .eq(2)
          .find('[name="files"]')
          .eq(0)
          .clone();
        const tests = /\.bmp|\.jpg|\.JPG|\.jpeg|\.JPEG|\.png|\.gif?$/;
        selfElems.find('[name="title"]').val(datas.title);
        selfElems.find('[name="content"]').val(datas.content);
        selfElems.find('[name="contact"]').val(datas.contact);

        selfElems
          .find('[name="files"]')
          .not(`.${_self.$file.attr('class').split(' ')[0]}`)
          .remove();
        let figs = false;
        if (this.goSizeMB(_self.$file[0].files[0].size) > 10) {
          figs = true;
        }
        if (f1.attr('class') !== _self.$file.attr('class')) {
          selfElems.append(f1);
        }
        if (f2.attr('class') !== _self.$file.attr('class')) {
          if (f2[0] && this.goSizeMB(f2[0].files[0].size) > 10) {
            figs = true;
          }
          selfElems.append(f2);
        }
        if (f3.attr('class') !== _self.$file.attr('class')) {
          if (f3[0] && this.goSizeMB(f3[0].files[0].size) > 10) {
            figs = true;
          }
          selfElems.append(f3);
        }
        if (figs) {
          message.error('上传图片超出10M，请重新上传');
          return false;
        }
        if (tests.test(f1.val()) || tests.test(f2.val()) || tests.test(f3.val())) {
          //
        } else {
          message.error('文件格式不正确3');
          return false;
        }

        this.loading = loading({
          content: '文件上传中，请等待...',
        });
      },
      onClear(self) {
        self.element
          .find('form')
          .find('[name="files"]')
          .remove();
      },
      onSuccess(_self, res) {
        if (layerSelf) {
          if (res.status === 200) {
            that.layerMsg();
            layerSelf.hide();
          } else {
            message.error(res.message || '反馈提交失败');
          }
        } else if (res.status === 200) {
          that.layerMsg();
          // //跳转到我的提问
          // that.props.changeActive('grid2');
          // //刷新列表
          // that.props.router.grid2.query();
        } else {
          message.error(res.message || '反馈提交失败');
        }
      },
      onError() {
        message.error('反馈提交失败');
      },
      onComplete(_self) {
        this.loading.destroy();
        _self.$file.siblings('[name="files"]').remove();
      },
    });
  };

  // 提示弹出层
  layerMsg = (form) => {
    const { dispatch } = this.props;
    const that = this;
    setTimeout(() => {
      layer({
        content:
          '<h6><img width=20 style="vertical-align:top;margin:3px 5px 0 0" src="/static/images/xiaolian.png"/>感谢您的反馈~</h6><h6>我们的进步离不开您的支持！</h6><p>我们会在3个工作日内回复~请在“系统消息-我的提问”中查看</p>(<span>5</span>)秒后自动关闭',
        id: 'layerMesg',
        title: null,
        width: 400,
        close: {
          enable: false,
        },
        cancel: {
          enable: false,
        },
        onInit(self) {
          let timeVal = 5;
          const auto = setInterval(function() {
            timeVal -= 1;
            self.main.find('span').text(timeVal);
            if (timeVal === 0) {
              clearInterval(auto);
              self.hide();
              if (!that.props.self) {
                // 跳转到我的提问
                dispatch({
                  type: '$getQuesList',
                });
                dispatch({
                  type: 'updateState',
                  payload: {
                    tabType: '2',
                  },
                });
                if (form) {
                  form.resetFields();
                }
              }
            }
          }, 1000);
        },
      });
    });
  };

  submit = (form) => {
    const data = form.getFieldsValue();
    // if(!data.title){
    //     message.error('请输入标题');
    //     return;
    // }
    // if (typeof data.content === 'undefined' || data.content.length < 6) {
    //   message.error('内容不能小于6个字符串');
    //   return;
    // }
    if ($(this.fileDiv).find('.onimgs').length > 0) {
      $(this.fileDiv)
        .find('.onimgs')
        .eq(0)
        .closest('.ui-files-div')
        .find(':file')
        .uploader('upload');
    } else {
      request.post('instead/v2/message/system/addSuggest.do', data, (res) => {
        if (this.props.self) {
          if (res.status === 200) {
            this.layerMsg(form);
            // message.success('感谢您的反馈~我们的进步离不开您的支持！我们会在3个工作日内回复~请在“系统消息-我的提问”中查看')
          } else {
            message.error(res.message || '反馈提交失败');
          }
          this.props.self.hide();
        } else if (res.status === 200) {
          this.layerMsg(form);
          // message.success('感谢您的反馈~我们的进步离不开您的支持！我们会在3个工作日内回复~请在“系统消息-我的提问”中查看')
          // //跳转到我的提问
          // this.props.changeActive('grid2');
          // //刷新列表
          // this.props.router.grid2.query();
        }
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <SuggestForm _this={this} submit={this.submit} />
      </React.Fragment>
    );
  }
}

export default connect()(Head);
