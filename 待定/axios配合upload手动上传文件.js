const formData = new FormData()
fileList.forEach((file) => {
  // formData.append('file', file);
  formData.append('file[]', file)
})
axios.post(`${basePath}instead/v2/customer/scan.do`, formData).then((res) => {
  if (res.data.status === 200) {
    message.success('成功')
  } else {
    message.error('失败')
  }
})
