import { createServices } from '@utils';
import mock from './mock';

export default createServices({
  getList: 'a/b/c::post',
  ...mock,
});
