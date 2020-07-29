import { get, isNil } from 'lodash';

export default (data, path, defaultValue) => {
  const value = get(data, path, defaultValue);
  return isNil(value) ? defaultValue : value;
};
