import { router } from 'nuomi';
import { message } from 'antd';
import services from '../services';

export default {
  /**
   * 查询客户附件信息
   * @param {*string} customerId 客户id
   */
  async $getEnclosureList() {
    try {
      const {
        query: { customerId },
      } = router.location();
      const data = await services.getEnclosureList({ customerId });
      this.updateState({
        enclosureList: data,
      });
    } catch (err) {
      // message.error()
    }
  },

  /**
   * 上传客户附件信息
   * @param {*string} customerId 客户id
   * @param {*file} file 文件
   * @param {*string} enclosureClass 附件类别（1.营业执照，2.法人证件,3.公司章程,4.其他）
   */
  async $addEnclosure(payload) {
    const {
      query: { customerId },
    } = router.location();
    await services.addEnclosure({
      customerId,
      ...payload,
    });
    message.success('附件上传成功');
  },

  /**
   * 删除客户附件
   * @param {*string} customerId 客户id
   * @param {*string} customerEnclosureId 附件id
   */
  async $deleteEnclosure(payload) {
    const {
      query: { customerId },
    } = router.location();
    await services.deleteEnclosure({
      customerId,
      ...payload,
    });
    this.$getEnclosureList();
    message.success('附件删除成功！');
  },

  /**
   * 修改客户附件信息
   * @param {*string} customerId 客户id
   * @param {*string} customerEnclosureId 附件id
   * @param {*string} enclosureName 附件名称
   */
  async $updateEnclosure(payload) {
    const {
      query: { customerId },
    } = router.location();
    await services.updateEnclosure({
      customerId,
      ...payload,
    });
    this.$getEnclosureList();
    message.success('附件修改成功！');
  },

  async initData() {
    await this.$getEnclosureList();
  },
};
