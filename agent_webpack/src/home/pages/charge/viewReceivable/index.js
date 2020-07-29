/**
 * 查看/编辑应收单
 */
import { nuomi } from 'nuomi';
import receivable from '../receivable';

export default nuomi.extend(receivable, {
  state: {
    title: '应收单',
    status: 4,
  },
});
