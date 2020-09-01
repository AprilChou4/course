/**
 * 弹窗确认是否同步修改客户名称
 */
export const syncMoneyConfirm = async () => {
  return new Promise((resolve) => {
    ShowConfirm({
      title: '收款金额与实收金额合计不相等，是否同步（以表体合计值为准）？',
      okText: '是',
      cancelText: '否',
      onOk() {
        resolve(true)
      },
      onCancel() {
        resolve(false)
      },
    })
  })
}

const result = await syncMoneyConfirm()
