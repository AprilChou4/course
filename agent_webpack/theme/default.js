const white = '#ffffff';
const black = '#323232';
const darkBlack = '#000000';
const primaryColor = '#008cff';
const hoverColor = '#5abeff';
const activeColor = '#0d74e5';
const disabledColor = '#bfbfbf';
const disabledBg = '#ececec';
const borderColor = '#e2e2e2';

module.exports = {
  // 覆盖Antd的less变量（不要随便改动，容易出问题）
  'font-family': '"Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
  'border-radius-base': '3px',
  // 主字号
  'font-size-base': '13px',
  // -------- Colors -----------
  white,
  black,
  blue: '#3f91f1',
  'primary-color': primaryColor,
  'success-color': '#12d265',
  'warning-color': '#f6a327',
  'error-color': '#f5222d',
  'disabled-color': disabledColor,
  'disabled-bg': disabledBg,
  'text-color': black,
  'border-color-base': borderColor,
  // Form
  'form-item-margin-bottom': '20px',
  // Modal
  'modal-body-padding': '20px',
  // Buttons
  'btn-default-color': '#303030',
  'btn-primary-color': white,
  'btn-height-base': '32px',
  'btn-padding-base': '0 20px',
  // Link
  'link-color': primaryColor,
  'link-hover-color': hoverColor,
  'link-active-color': activeColor,
  // Input
  'input-hover-border-color': primaryColor,
  // Animation
  'animation-duration-slow': '0',
  // Table
  'table-header-bg': disabledBg,
  'table-header-color': darkBlack,

  // 自定义less变量
  // -------- Colors -----------
  darkBlack,
  // hover色
  'hover-color': hoverColor,
  // 点击色
  'active-color': activeColor,
  // 背景色
  'bg-color-gray': '#f0f1f3',
  // 文本色
  'text-bold-color': darkBlack,
  'text-light-color': '#B3B3B3',
  'text-success': '#59D49E',
  'text-error': '#FF0000',
  // 滚动条颜色
  'scrollbar-color': '#c3c4c8',
  'scrollbar-hover-color': '#97989B',
  'scrollbar-bg-color': '#f0f1f3',
  // 橙色
  'color-orange': '#f8ac59',
  // 绿色
  'color-green': '#62d4d5',
  // Animation
  'transition-base': 'all .3s',
  // border
  'border-base': `1px solid ${borderColor}`,
  'border-block': `1px solid #e6e6e6`,
};
