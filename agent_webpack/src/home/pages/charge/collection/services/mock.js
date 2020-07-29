export default {
  addCollection() {
    return {
      status: 200,
      data: null,
    };
  },
  getDetail() {
    return {
      status: 200,
      data: [],
    };
  },
  getYsdList() {
    return {
      status: 200,
      data: [],
    };
  },
  getReceiptNo() {
    return {
      status: 200,
      data: 'sk123123123',
    };
  },
  getMaxMoney() {
    return {
      status: 200,
      data: 100,
    };
  },
  getStaff: 'http://192.168.206.92:3000/mock/516/instead/v2/user/staff/listServiceStaff.do::get',
  getCustomerBillList:
    'http://192.168.206.92:3000/mock/584/instead/v2/customer/receipt/shouldReceiveBill/listCustomerBillNO::get',
  getplanDetailList:
    'http://192.168.206.92:3000/mock/584/instead/v2/customer/receipt/shouldReceiveBill/planDetail.do::postJSON',
  refrenceYsd:
    'http://192.168.206.92:3000/mock/584/instead/v2/customer/receipt/shouldReceiveBill/planDetailByDate.do::postJSON',
};
