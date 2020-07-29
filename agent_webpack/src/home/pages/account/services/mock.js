export default {
  // getAccountList() {
  //   return {
  //     status: 200,
  //     data: {
  //       list: [
  //         {
  //           key: '1',
  //           accountId: '',
  //           accountName: '',
  //           accountingAssistant: '',
  //           bookkeepingAccounting: '',
  //           checkStatus: 0,
  //           createPeriod: '',
  //           currentPeriod: '',
  //           customerCode: '',
  //           customerId: '',
  //           isCheckOut: 0,
  //           isNew: true,
  //           reviewStatus: 0,
  //           schedule: 0,
  //           taxType: 0,
  //           vatType: 0,
  //         },
  //       ],
  //       pageNum: 0,
  //       pageSize: 0,
  //       total: 0,
  //     },
  //   };
  // },
  getStatistics() {
    return {
      status: 200,
      data: {
        checkOutNum: 0,
        createdNum: 0,
        notCheckOutNum: 0,
        notStartNum: 0,
        ongoingNum: 0,
      },
    };
  },
};
