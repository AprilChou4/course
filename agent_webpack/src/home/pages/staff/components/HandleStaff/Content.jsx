import React, {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
} from 'react';
import { connect } from 'nuomi';
import { Form, Input, Radio, Row, Col, message } from 'antd';
import classnames from 'classnames';
import {
  If,
  AntdInput,
  LinkButton,
  ShowConfirm,
  LimitInput,
  Iconfont,
  DeptTreeSelect,
} from '@components';
import { get, trim, isNil, regex } from '@utils';
import RolesList from './RolesList';
import styles from './style.less';

const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
const formItemLayoutHalf = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const formItemLayoutWithoutLabel = {
  wrapperCol: {
    span: 20,
    offset: 4,
  },
};
const formItemLayoutDept = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
const formItemLayoutDeptWithoutLabel = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    span: 19,
    offset: 5,
  },
};

const sexOptions = [
  { label: '男', value: 'M' },
  { label: '女', value: 'W' },
];
const postOptions = [
  { label: '经理', value: 2 },
  { label: '员工', value: 3 },
];

const Content = forwardRef(
  (
    {
      data: propsData,
      form,
      form: { getFieldDecorator, setFieldsValue, validateFields },
      dispatch,
    },
    ref,
  ) => {
    // 注册隐藏域
    getFieldDecorator('deptRowKeys');
    getFieldDecorator('staffId');
    const staffModalType = useMemo(() => get(propsData, 'staffModalType'), [propsData]);
    const isEdit = staffModalType === 1;
    const isAddEditStaff = [0, 1].includes(staffModalType);
    const isApproveStaff = staffModalType === 2;
    const deptRowKeyCount = useRef(-1);

    const [initData, setInitData] = useState(() => {
      deptRowKeyCount.current += 1;
      const deptRowKeys = [deptRowKeyCount.current];
      const defaultDeptName = get(propsData, 'curDeptNodes.name');
      const dept = [
        {
          id: staffModalType === 0 ? get(propsData, 'curDeptKey') : undefined,
          name: staffModalType === 0 ? defaultDeptName : undefined,
          type: defaultDeptName === '全公司' ? 2 : 3,
        },
      ];
      const defaultAddEditStaffValue = { sex: 'M' };
      const defaultApproveStaffValue = {};

      return {
        staffId: get(propsData, 'record.staffId'),
        deptRowKeys,
        dept,
        roleIds: [],
        ...(isApproveStaff ? defaultApproveStaffValue : defaultAddEditStaffValue),
      };
    });

    const curFormValues = useMemo(() => form.getFieldsValue(), [form]);
    // 把keys保存在form中（而不是state），以便在任何地方提交form的时候可以直接取到
    const curType = useMemo(() => form.getFieldValue('dept[0].type'), [form]);
    const curDeptRowKeys = useMemo(() => form.getFieldValue('deptRowKeys') || [], [form]);
    const curDept = useMemo(() => form.getFieldValue('dept') || [], [form]);

    const getDeptDisabled = useCallback(
      (curNode) => {
        const curDeptIds = curDept.map(({ id }) => id);
        return curDeptIds.includes(curNode.deptId);
      },
      [curDept],
    );

    // 是否禁用“添加其他职务”按钮
    const addDeptRowsDisabled = useMemo(
      () =>
        curType === 3 ||
        !(curDept && curDept[curDept.length - 1] && curDept[curDept.length - 1].id),
      [curDept, curType],
    );

    const handleTypeChange = useCallback(
      (index, e) => {
        // 部门第一行选员工时，删除下面所有行
        if (index === 0 && e.target.value === 3) {
          setFieldsValue({
            deptRowKeys: curDeptRowKeys.filter((v, i) => i === 0),
          });
        }
      },
      [curDeptRowKeys, setFieldsValue],
    );

    const handleAddDeptRows = useCallback(() => {
      if (curDeptRowKeys.length >= 10) {
        message.warning('最多只能添加10个职务');
        return;
      }
      deptRowKeyCount.current += 1;
      form.setFieldsValue({
        deptRowKeys: [...curDeptRowKeys, deptRowKeyCount.current],
      });
      // 重新刷新下，否则form的值不对
      setTimeout(() => {
        validateFields(['dept']);
      });
    }, [curDeptRowKeys, form, validateFields]);

    const removeDeptRow = useCallback(
      (key) => {
        setFieldsValue({
          deptRowKeys: curDeptRowKeys.filter((v) => v !== key),
        });
        // 重新刷新下，否则form的值不对
        setTimeout(() => {
          validateFields(['dept']);
        });
      },
      [curDeptRowKeys, setFieldsValue, validateFields],
    );

    const handleRemoveDeptRow = useCallback(
      (key) => {
        if (curDeptRowKeys.length === 1) {
          return;
        }
        if (form.getFieldValue(`dept[${key}].id`)) {
          ShowConfirm({
            title: '你确定要删除新增部门信息吗？',
            onOk() {
              removeDeptRow(key);
            },
          });
          return;
        }
        removeDeptRow(key);
      },
      [curDeptRowKeys, form, removeDeptRow],
    );

    const handleDeptIdChange = useCallback(
      (key, index, value, label) => {
        const name = label[0];
        // 部门选择后设置form中的name字段，如果选择的是全公司，职位更改为经理
        setFieldsValue({
          [`dept[${key}].name`]: name,
          ...(name === '全公司' ? { [`dept[${key}].type`]: 2 } : {}),
        });
      },
      [setFieldsValue],
    );

    // 手机号验证
    const phoneValidator = useCallback(
      async (rule, value, callback) => {
        // 验证空字段
        if (!value || !trim(value)) {
          callback('手机号码不能为空');
          return;
        }

        // 验证格式
        if (!regex.mobile.test(value)) {
          callback('手机号码格式有误');
          return;
        }

        // 远程验证 (-1未激活,0已启用,1停用,2未申请,3待审批)
        const data = await dispatch({
          type: 'getApplyStatus',
          payload: {
            phoneNum: value,
          },
        });
        if (isNil(data)) {
          callback();
          return;
        }
        const msg = {
          '-1': '当前手机号已是公司员工，不支持重复添加',
          0: '当前手机号已是公司员工，不支持重复添加',
          1: '该员工已被停用，可在已停用列表启用员工',
          3: '该员工已申请加入贵公司，可在待审核列表同意加入',
        };
        callback(msg[data]);
      },
      [dispatch],
    );

    const getStaffInfo = useCallback(
      async ({ staffId }) => {
        const staffInfo = await dispatch({
          type: 'getStaffInfo',
          payload: {
            staffId,
          },
        });

        if (isNil(staffInfo)) {
          return;
        }

        const { realName, deptIds = '', deptNames = '', iDNumber, phoneNum, roleIds, sex, type } =
          staffInfo || {};
        const keys = [];
        deptRowKeyCount.current = -1;
        const deptNamesArr = deptNames.split(',');
        const dept = deptIds.split(',').map((val, index) => {
          deptRowKeyCount.current += 1;
          keys.push(deptRowKeyCount.current);
          return {
            id: val,
            name: deptNamesArr[index],
            type,
          };
        });

        setInitData({
          staffId,
          realName,
          sex: ['W', 'M'].includes(sex) ? sex : undefined,
          phoneNum,
          iDNumber,
          deptRowKeys: keys,
          dept,
          roleIds: roleIds.split(','),
        });
      },
      [dispatch],
    );

    useEffect(() => {
      const staffId = get(propsData, 'record.staffId', '');
      isEdit && getStaffInfo({ staffId });
    }, [getStaffInfo, isEdit, propsData]);

    // 使用form.setFieldsValue()设置初始值，这样初始的数据也能监听到
    useEffect(() => {
      // 先利用initialValues中的deptRowKeys生成部门的field后，再用setTimeout去设置部门的值，否则会报错
      const { dept, ...rest } = initData;
      setFieldsValue(rest);
      setTimeout(() => {
        setFieldsValue({ dept });
      });
    }, [setFieldsValue, initData]);

    // 用form.getFieldDecorator才能拿到最新的form，否则会出现验证信息不显示等问题;
    const deptRowContent = useMemo(
      () =>
        curDeptRowKeys.map((key, index) => (
          <Row key={key}>
            <Col span={18}>
              <FormItem
                {...(index === 0 ? formItemLayoutDept : formItemLayoutDeptWithoutLabel)}
                className={styles.dept}
                label={index === 0 ? '部门' : ''}
              >
                {form.getFieldDecorator(`dept[${key}].id`, {
                  rules: [...(index === 0 ? [{ required: true, message: '请选择部门' }] : [])],
                })(
                  <DeptTreeSelect
                    allowClear
                    getTreeNodeProps={(record) => ({
                      key: record.deptId,
                      value: record.deptId,
                      title: record.name,
                      disabled: getDeptDisabled(record),
                      // style:
                      //   record.name === '未分配'
                      //     ? {
                      //         display: 'none',
                      //       }
                      //     : {},
                    })}
                    onChange={(...args) => handleDeptIdChange(key, index, ...args)}
                  />,
                )}
              </FormItem>
            </Col>
            {form.getFieldDecorator(`dept[${key}].name`)(<Input type="hidden" />)}
            <Col span={6}>
              <FormItem wrapperCol={{ span: 21, offset: 3 }}>
                {form.getFieldDecorator(`dept[${key}].type`, {
                  initialValue: 2,
                  rules: [{ required: true, message: '请选择职务' }],
                })(
                  <RadioGroup
                    onChange={(e) => handleTypeChange(index, e)}
                    options={
                      index !== 0 || get(curFormValues, `dept[${key}].name`) === '全公司'
                        ? postOptions.filter(({ value }) => value === 2)
                        : postOptions
                    }
                  />,
                )}
                <If condition={index > 0}>
                  <Iconfont
                    className="icon-clear"
                    code="&#xeb2f;"
                    onClick={() => handleRemoveDeptRow(key, index)}
                  />
                </If>
              </FormItem>
            </Col>
          </Row>
        )),
      [
        curDeptRowKeys,
        curFormValues,
        form,
        getDeptDisabled,
        handleDeptIdChange,
        handleRemoveDeptRow,
        handleTypeChange,
      ],
    );

    const addDeptBtn = useMemo(
      () => (
        <FormItem {...formItemLayoutWithoutLabel} className={styles.addDept}>
          <LinkButton disabled={addDeptRowsDisabled} onClick={handleAddDeptRows}>
            <Iconfont className={styles.addDeptIcon} code="&#xe64e;" /> 添加其他职务
          </LinkButton>
        </FormItem>
      ),
      [addDeptRowsDisabled, handleAddDeptRows],
    );

    // 传给父组件
    useImperativeHandle(ref, () => ({ form, initData }), [form, initData]);

    return (
      <Form
        className={classnames('section-form', styles.form, {
          [styles['form-addEditStaff']]: isAddEditStaff,
          [styles['form-approveStaff']]: isApproveStaff,
        })}
      >
        {isApproveStaff ? (
          <>
            <p className="t-bold f-tac">确认同意该员工加入公司，请为该员工分配部门及角色？</p>
            {deptRowContent}
            {addDeptBtn}
            <FormItem label="角色授权" className={styles.roles} {...formItemLayout}>
              {getFieldDecorator('roleIds')(<RolesList />)}
            </FormItem>
          </>
        ) : (
          <>
            <dl>
              <dt>基本信息</dt>
              <dd>
                <Row>
                  <Col span={12}>
                    <FormItem label="姓名" {...formItemLayoutHalf}>
                      {getFieldDecorator('realName', {
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '员工姓名不能为空',
                          },
                          {
                            max: 15,
                            message: '姓名最大15个字符',
                          },
                        ],
                      })(<LimitInput placeholder="请输入姓名" maxLength={15} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="性别" {...formItemLayoutHalf}>
                      {getFieldDecorator('sex', {
                        rules: [{ required: true, message: '请选择性别' }],
                      })(<RadioGroup options={sexOptions} />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem required label="手机号码" {...formItemLayoutHalf}>
                      {getFieldDecorator('phoneNum', {
                        rules: isEdit
                          ? []
                          : [
                              {
                                validator: phoneValidator,
                              },
                            ],
                      })(<AntdInput allowClear placeholder="请输入手机号码" disabled={isEdit} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="身份证号" {...formItemLayoutHalf}>
                      {getFieldDecorator('iDNumber', {
                        rules: [
                          {
                            pattern: regex.idcard,
                            message: '身份证号必须15或18位数字字母',
                          },
                        ],
                      })(<AntdInput allowClear placeholder="请输入身份证号" />)}
                    </FormItem>
                  </Col>
                </Row>
                {deptRowContent}
                {addDeptBtn}
              </dd>
            </dl>
            <dl>
              <dt>角色授权</dt>
              <dd>
                <FormItem className={styles.roles}>
                  {getFieldDecorator('roleIds')(<RolesList />)}
                </FormItem>
              </dd>
            </dl>
          </>
        )}
      </Form>
    );
  },
);

export default connect()(Form.create()(Content));
