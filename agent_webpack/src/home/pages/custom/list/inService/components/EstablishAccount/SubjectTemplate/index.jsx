// 建账 > 会计科目(新建账套和excel建账)
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Select, message } from 'antd';
import { request } from 'nuijs';
import pubData from 'data';

const { Option, OptGroup } = Select;
const { areaCode } = pubData.get('userInfo').company;
class SubjectTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      systemAccounting: [], // 系统预置的会计模板
      customAccounting: [], // 用户自定义的会计模板
      fdcNameArr: [],
    };
  }

  componentDidMount() {
    const { vatType, industryTypeParent } = this.props;
    this.getAccountList({
      vatType,
      industryTypeParent,
    });
    this.shFdcHint(industryTypeParent);
  }

  componentWillReceiveProps(nextP) {
    const { vatType, industryTypeParent } = this.props;
    if (nextP.vatType !== vatType || nextP.industryTypeParent !== industryTypeParent) {
      this.getAccountList({
        vatType: nextP.vatType,
        industryTypeParent: nextP.industryTypeParent,
      });
    }
    this.shFdcHint(nextP.industryTypeParent);
  }

  // 任务 #135353 建账页面为房地产时候加提示
  shFdcHint = (industryTypeParent) => {
    const { type } = this.props;
    if (['2', '3'].includes(type) && industryTypeParent.indexOf('房地产') > -1) {
      message.warning('请重新选择行业类型和会计制度');
    }
  };

  /**
   * 获取会计科目
   * @param {*int} vatType 纳税性质（0:一般纳税人1：小规模纳税人）
   * @param {*int} type=1
   * @param {*int} ableFlag=1
   */
  getAccountList = async (parmas = {}) => {
    // const { industryTypeParent } = parmas;
    // const data = await services.querySubjectTemplateList({
    //   type: 1,
    //   ableFlag: 1,
    //   ...parmas,
    // });
    const res = await request.sync('instead/subjectTemplate/querySubjectTemplateList.do', {
      type: 1,
      ableFlag: 1,
      ...parmas,
    });

    // 获取房地产会计科目
    const res1 = await request.sync('instead/subjectTemplate/querySubjectTemplateList.do', {
      type: 1,
      ableFlag: 1,
      industryTypeParent: '房地产业',
      vatType: parmas.vatType,
    });
    const nameArr = [];
    res1.data.custom.forEach((item) => {
      nameArr.push(item.name);
    });
    res1.data.system.forEach((item) => {
      nameArr.push(item.name);
    });
    this.setState({
      systemAccounting: res.data.system,
      customAccounting: res.data.custom,
      fdcNameArr: nameArr,
    });
  };

  // 会计科目选择
  onSelect = (value, option) => {
    const { accounting, subjectTemplateName, subjectTemplateId } = this.props;

    const { data } = option.props;
    const {
      form: { setFieldsValue },
    } = this.props;
    const setObj = {};
    if (accounting) {
      setObj[accounting] = data.accounting;
    }
    if (subjectTemplateName) {
      setObj[subjectTemplateName] = data.name;
    }
    if (subjectTemplateId) {
      setObj[subjectTemplateId] = data.subjectTemplateId;
    }
    setFieldsValue(setObj);
  };

  render() {
    const { systemAccounting, customAccounting, fdcNameArr } = this.state;
    const {
      form: { getFieldDecorator },
      accounting,
      subjectTemplateName,
      subjectTemplateId,
      type,
      industryTypeParent,
      vatType,
      ...rest
    } = this.props;

    /** 地区编码
     * 1、手工新增账套时：上海地区房地产会计制度置灰不可选择 (type === '1' && ['31'].includes(areaCode.substring(0, 2)) && fdcNameArr.includes(name))
     * 2、Excel建账和导入第三方，房地产会计制度置灰不可选择
     */
    const isFdc = (name) => {
      return ['2', '3'].includes(type) && fdcNameArr.includes(name);
    };
    const systemOptions = () => {
      return (
        <OptGroup key={1} label="系统预置">
          {systemAccounting.map((item) => {
            return (
              <Option
                value={item.accounting}
                key={item.accounting}
                data={item}
                disabled={isFdc(item.name)}
              >
                {item.name}
              </Option>
            );
          })}
        </OptGroup>
      );
    };
    const customOptions = (
      <OptGroup key={0} label="其他科目模板">
        {customAccounting.map((item) => {
          return (
            <Option
              value={item.subjectTemplateId}
              key={item.subjectTemplateId}
              data={item}
              disabled={isFdc(item.name)}
            >
              {item.name}
            </Option>
          );
        })}
      </OptGroup>
    );

    let subjectTemplateNameValue = '';
    let subjectTemplateIdValue = '';
    systemAccounting &&
      systemAccounting.forEach((item) => {
        if (item.accounting === rest.value) {
          subjectTemplateNameValue = item.name;
          subjectTemplateIdValue = item.subjectTemplateId;
        }
      });

    return (
      <>
        {accounting &&
          getFieldDecorator(accounting, {
            initialValue: rest.value,
          })(<Input type="hidden" />)}
        {subjectTemplateName &&
          getFieldDecorator(subjectTemplateName, {
            initialValue: subjectTemplateNameValue,
          })(<Input type="hidden" />)}
        {subjectTemplateId &&
          getFieldDecorator(subjectTemplateId, {
            initialValue: subjectTemplateIdValue,
          })(<Input type="hidden" />)}
        <Select
          showSearch
          optionFilterProp="children"
          onSelect={this.onSelect}
          placeholder="请选择会计科目"
          {...rest}
        >
          {customOptions}
          {systemOptions()}
        </Select>
      </>
    );
  }
}
SubjectTemplate.defaultProps = {
  // 需要的参数名称 新建账套和excel不一样
  accounting: '', // 会计科目值对应值
  subjectTemplateName: '', // 会计科目名称
  subjectTemplateId: '', // 会计科目id
  industryTypeParent: '', // 行业大类
  vatType: 1, // 纳税性质
};
SubjectTemplate.propTypes = {
  // 验证form
  form: PropTypes.object,
  // 需要的参数名称 新建账套和excel不一样
  accounting: PropTypes.string,
  subjectTemplateName: PropTypes.string,
  subjectTemplateId: PropTypes.string,
  industryTypeParent: PropTypes.string,
  vatType: PropTypes.number,
};
export default SubjectTemplate;
