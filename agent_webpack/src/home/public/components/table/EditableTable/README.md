# 可编辑表格组件

## 路径

`components/EditableTable2`

## 完整功能示例：

`src/platform/pages/voucher/journal/components/Table/index.jsx`

## 功能

基于 antd Table 实现表格编辑功能

1. 支持表格单元格（下文简称 td）编辑，点击 td 显示输入框或其他自定义编辑组件
2. 选中编辑 td 时按 Enter 或 Tab 键切换到下一个单元格，行位可换行
3. 默认换行后调用 onSaveTr 保存上一行编辑数据
4. 自动验证是否修改行内容，未修改不保存数据
5. 从父组件修改或设置默认选中编辑 td
6. 可选行首删除或新增 icon 及对应回调函数
7. 自定义控制行、单元格是否可编辑
8. 支持大数据渲染
9. 支持属性切换是否可编辑表格（禁止编辑、新增和可选禁止选取并置灰单元格文本）
10. 支持后续更多需求功能（🌹）

## 用法

```js
import EditableTable from '@/EditableTable2';
// 设置默认选中行
this.tableRef.setActiveTd({ id: 1, dataIndex: 'name' });

<EditableTable
  loading={loading}
  ref={(ele) => (this.tableRef = ele)}
  bordered
  rowSelection={rowSelection}
  columns={columnsArr}
  dataSource={tableData || []}
  pagination={false}
  rowKey={(record, i) => record.dailyBookId || i}
  idName="dailyBookId"
  onTdChange={this.onTdChange}
  onSaveTr={this.onSaveTr}
  onDeleteTr={this.onDeleteTr}
  onAddTr={this.onAddEmptyTr}
  disabledEdit={!enableInput}
  showDeleteIcon={(record) => {
    // 设置可删除行
    return this.filterEnableSelect(record);
  }}
  showAddIcon={(record) => {
    // 设置可删除行
    return this.filterEnableSelect(record);
  }}
  enableEditTr={(record, i, dataIndex) => {
    const isStartTr = record.summary === '期初余额' || i === 0;
    const isYuETd = ['balanceAmt', 'balanceCurrency'].includes(dataIndex);

    // 初始余额行的余额可编辑，其他行余额不可编辑
    if (isStartTr && isYuETd) {
      return true;
    }
    return !isStartTr && !isYuETd && record.dailyBookId;
  }}
/>;
```

## api

| 名称            | 类型         | 描述                                                                  | 参数                                              | 必填 |
| --------------- | ------------ | --------------------------------------------------------------------- | ------------------------------------------------- | ---- |
| onTdChange      | func         | td blur 时触发                                                        | (record, value)                                   | 否   |
| onSaveTr        | func         | 点击空白处或换行编辑时触发                                            | (record)                                          | 否   |
| onDeleteTr      | func         | 点击行首删除 icon 时触发                                              | (record)                                          | 否   |
| onAddTr         | func         | 点击行首删除 icon 时触发                                              | (record)                                          | 否   |
| showDeleteIcon  | func 或 bool | 计算 record，返回 true 则显示删除 icon                                | (record)                                          | 否   |
| showAddIcon     | func 或 bool | 计算 record，返回 true 则显示删除 icon                                | (record)                                          | 否   |
| enableEditTr    | func         | 计算 record，返回 true 则行可编辑                                     | (record, index, dataIndex) 默认为所有 tr 都可编辑 | 否   |
| idName          | string       | 行 id，用于定位编辑行                                                 |                                                   | 是   |
| isBigData       | bool         | 是否支持大数据渲染                                                    | 默认 true                                         | 否   |  |
| disabled        | bool         | 是否禁止表格操作（点击编辑、hover 显示编辑框，并置灰显示 单元格文本） | 默认 false                                        | 否   |
| disabledEdit    | bool         | 禁止表格操作，不置灰文本                                              | 默认 false                                        | 否   |
| showInputBorder | bool         | 是否显示全部输入框的模拟边框                                          | 默认 false                                        | 否   |

> idName 为必选参数，一般取行数据 id 等唯一的字段名称，用于定位编辑单元格

> record 表示列表数据选中行对象，同 antd，返回最新编辑后的数据，可直接进行保存

> value 参数为编辑中 td 的编辑结果值，如 {name: 'newName'}

> dataIndex 参数为表格列字段名，通过行 index 和 dataIndex 可自定义可编辑单元格

## ref 调用子组件方法

| 名称         | 描述                          | 参数                                      |
| ------------ | ----------------------------- | ----------------------------------------- |
| setActiveTd  | 设置编辑状态 td，             | 默认 setActiveTd({id: '', dataIndex: ''}) |
| activeNextTr | 编辑下一行第一个 td，         | 默认 setActiveTd()                        |
| activeLastTr | 编辑最后一行第一个或指定 td， | dataIndex, 默认计算第一个可编辑 td        |

> id: 行 id，dataIndex: columns dataIndex
> `setActiveTd` 一般只在表格初始化或更新数据完成后设置默认编辑状态的单元格，`onTdChange`里使用会有神奇 `bug`

## columns 自定义可编辑行、列

```js
const columns = [
  {
    title: '单位换算',
    width: 160,
    dataIndex: 'convertQuantity',
    align: 'right',
    maxlength: 100, // Input 允许输入最大长度
    editable: true, // 是否可编辑
    required: true, // 是否必填项  FIXME: 点击td时验证失败
    // 原 antd render，td 非编辑状态显示内容
    render: (text) => (Number(text) || 0).toFixed(4),
    // 编辑 td 时 td 内部编辑元素，默认 Input，可自定义 antd Form 识别元素，如 Select
    isSelfBlur: false, // 默认false，为true时会根据编辑元素blur时保存数据，false时是根据td blur 时保存数据
    isSelfEnter: false, // 默认false，为true时会禁止绑定到 td 的回车或 Tab 事件切换单元格
    inputType: 'date', // 目前只在编辑组件为 datePicker 时添加，格式化 value 为 moment, 可选为 custom 时用于自定义组件内部添加 blur 事件或手动触发保存数据
    editRender: (props, record) => {
      // props 必须作为自定义组件的 props，添加相关事件
      return (
        <InputNumber
          {...props}
          className="input number"
          autoComplete="off"
          precision={4}
          min={0}
          max={9.9999}
        />
      );
    },
  },
];
```

> columns 扩展属性均为可选

## 常见问题

1. 表格添加行或删除行，或修改数据，表格内容不刷新

内部依赖组件 SuperTable 或其他使用了 PureComponent，需要对表格 DataSource 进行深拷贝处理，如

```js
dispatch({
  type: 'setState',
  payload: { tableData: JSON.parse(JSON.stringify(newTableData)) },
});
```

2. 日期选择器

因为日期选择器弹窗点击会引起 td blur 时间触发，所以包装 antd datepicker,控制只在弹窗关闭时触发包装组件的 onBlur 方法，来解决问题。可用同文件夹下 DatePicker 组件代替 antd 原组件使用，同时需要设置 isSelfBlur 为 true 来使用编辑组件自身 onBlur 判断保存时机

3. 需使用自定义封装组件代替 antd 默认组件的有

- Select
- DatePicker

> 其他复杂组件可通过自定义 onBlur 事件或自定义触发保存数据方法实现相关功能

## 使用页面

- 日记账
- 辅助管理
- 辅助管理别名编辑
- 结转计提税金设置表格
- 结转清单所有编辑表格
- 固定资产表格
- 存货页面表格
