import moment from 'moment';

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i += 1) {
    result.push(i);
  }
  return result;
}

// 禁用日期
export const disabledDate = (current) => {
  return current && current < moment().startOf('day');
};
// 禁用时分
export const disabledDateTime = (current) => {
  return {
    disabledHours: () => {
      if (!current || current.date() === moment().date()) {
        return range(0, 24).slice(0, moment().hour() + 1);
      }
      return [];
    },
    disabledMinutes: () => range(1, 60),
    disabledSeconds: () => range(1, 60),
  };
};
