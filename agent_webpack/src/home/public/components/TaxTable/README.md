# TaxTable(Antd table 二次封装)

展示行列数据。

## Demo

https://stackblitz.com/edit/react-taxtable

## 说明

基于 Antd table 二次封装，通过`components`重新定义行列，适用于报表开发，现在税务筹划平台中大量使用。

## 使用限制

- API 延用 Antd table，无特殊说明，基本可使用。
- 由于电子税务局报表基本单页制，暂不支持大数据，同时不支持分页功能，需要分页请结合 antd Pagination 分页组件使用。
- 单元格实时编辑功能暂时只提供输入框功能，如需单选多选等请通过`columns`的`render`配置。

## 新增功能

- 表格底部合计功能。
- 单元格实时编辑功能，以及自定义输入限制。

## 如何使用

指定表格的数据源 `dataSource` 为一个数组。

```jsx
const dataSource = [
  {
    key: '1',
    hc: 1,
    xm: '行次1',
    bqje: 1.11,
    sqje: 11111111,
  },
  {
    key: '2',
    hc: 2,
    xm: '行次2',
    bqje: 2.22,
    sqje: 22222222,
  },
];

const columns = [
  {
    title: '项目',
    width: 80,
    key: 'xm',
    dataIndex: 'xm',
    editable: false,
  },
  {
    title: '行次',
    key: 'hc',
    width: 80,
    align: 'center',
    dataIndex: 'hc',
    editable: false,
  },
  {
    title: '本期金额',
    key: 'bqje',
    dataIndex: 'bqje',
    width: 200,
    editable: true,
    showTips: true,
  },
  {
    title: '上期金额',
    key: 'sqje',
    dataIndex: 'sqje',
    width: 200,
    editable: true,
    nobackground: [2],
    unusable: [1, 2, 3],
  },
];

<TaxTable dataSource={dataSource} columns={columns} />;
```

## API

### Table （差异）

| 参数               | 说明                                                                     | 类型                                       | 默认值            | 可选值                                                                                 |
| ------------------ | ------------------------------------------------------------------------ | ------------------------------------------ | ----------------- | -------------------------------------------------------------------------------------- |
| components         | 禁止使用                                                                 | object                                     | -                 | -                                                                                      |
| columns            | 表格列的配置描述，具体项见下表                                           | object[]                                   | -                 | -                                                                                      |
| dataSource         | 数据数组，具体项见下表                                                   | object[]                                   | -                 | -                                                                                      |
| tableName          | 表名                                                                     | string                                     | `default`         | -                                                                                      |
| tableBodyHeight    | 表格内容高度                                                             | number                                     | -                 | -                                                                                      |
| tableBodyMinWidth  | 表格内容最小宽度                                                         | number                                     | -                 | -                                                                                      |
| editMode           | 是否编辑模式，为`true`时 `Column`下 `editable`可用                       | boolean                                    | `false`           | -                                                                                      |
| smallHeader        | 表头高度调整                                                             | boolean                                    | `false`           | -                                                                                      |
| notEditColor       | 不可编辑单元格背景色                                                     | string                                     | `#edf2f9`         | -                                                                                      |
| onBlurEvent        | 失焦事件                                                                 | Function(obj) {}                           | -                 | -                                                                                      |
| inputType          | 输入限制，默认两位小数，可选两位小数，非负两位小数，整数，非负整，文本数 | string                                     | `naturalsDecimal` | `naturalsDecimal` `nonnegativeDecimal` `naturalsInteger` `nonnegativeInteger` `string` |
| inputrules         | 自定义输入限制，使用后`inputType`无效                                    | Function(obj, tableName, dataIndex, hc) {} | -                 | -                                                                                      |
| total              | 是否显示合计                                                             | boolean                                    | `false`           | -                                                                                      |
| totalColumns       | 合计表头                                                                 | object[]                                   | -                 | -                                                                                      |
| doubleClick        | 是否触发双击事件                                                         | boolean                                    | `false`           | -                                                                                      |
| onDoubleClickEvent | 双击事件，返回值为当前行数据                                             | Function(obj) {}                           | -                 | -                                                                                      |
| disabled           | 是否禁用                                                                 | boolean                                    | `false`           | -                                                                                      |

#### onBlurEvent 用法

```jsx
   handleSave(data){
    // tableName:表名，rowData:原行数据，colKey:当前列名，value:当前单元格值
    const { rowData, colKey, value, tableName } = data;
    const { dataSource } = this.state;
    const newData = [...dataSource];
    const index = newData.findIndex(item => rowData.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      [colKey]:value
    });
    this.setState({ dataSource: newData });
  };

  <TaxTable onBlurEvent={this.handleSave} />;
```

### Column （差异）

| 参数         | 说明                                         | 类型     | 默认值  |
| ------------ | -------------------------------------------- | -------- | ------- |
| dataIndex    | 列名，必传                                   | string   | -       |
| editable     | 是否可编辑                                   | boolean  | `false` |
| showTips     | 是否使用 hover 提示                          | boolean  | `false` |
| unusable     | 以下行次（`hc`）不可编辑，结合`editable`使用 | number[] | `[]`    |
| nobackground | 以下行次（`hc`）取消背景，结合`editable`使用 | number[] | `[]`    |

### DataSource （差异）

| 参数 | 说明                                      | 类型   | 默认值 |
| ---- | ----------------------------------------- | ------ | ------ |
| hc   | 行次，必传，从 1 开始（第一行行次为 1）） | number | -      |
