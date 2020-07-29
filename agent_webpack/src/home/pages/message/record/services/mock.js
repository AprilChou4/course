export default {
  getTimingList() {
    // return {
    //   status: 200,
    //   data: [
    //     {
    //       id: '1',
    //     },
    //     {
    //       id: '2',
    //     },
    //   ],
    // };

    return {
      status: 200,
      message: 'mock',
      data: {
        messageTimings: [
          {
            msgTitle: '1',
            msgId: 1,
            msgContent:
              '方式发送到发是的分公司甘肃甘肃的个梵蒂冈电饭锅的的范甘迪发鬼地方个地方个电饭锅电饭锅的发的个梵蒂冈电饭锅的范甘迪发鬼地方个地方规范的',
            customers: [
              {
                customerId: '1',
                customerName: '杭州',
                grantUsers: [
                  {
                    userId: '1',
                    username: '张三',
                  },
                  {
                    userId: '2',
                    username: '李四',
                  },
                ],
              },
              {
                customerId: '1',
                customerName: '宁波',
                grantUsers: [
                  {
                    userId: '1',
                    username: '王五',
                  },
                  {
                    userId: '2',
                    username: '李四',
                  },
                ],
              },
            ],
            sendTime: 1,
            operateTime: 1,
            operateUserId: 'mock',
            operateUsername: 'mock',
          },
          {
            msgTitle: '2',
            msgId: 1,
            msgContent:
              '你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天你好明天',
            customers: [
              {
                customerId: '2',
                customerName: 'mock222222222222222',
                grantUsers: [
                  {
                    userId: 'mock',
                    username: 'mock',
                  },
                ],
              },
            ],
            sendTime: 1,
            operateTime: 1,
            operateUserId: 'mock',
            operateUsername: 'mock',
          },
        ],
        total: 1,
      },
    };
  },

  getSuccessList() {
    return {
      status: 200,
      message: 'mock',
      data: {
        successList: [
          {
            msgId: 1,
            msgTitle: 'successList',
            msgContent: 'successList',
            customers: [
              {
                customerId: 'successList',
                customerName: 'successList',
                grantUsers: [
                  {
                    userId: 'successList',
                    username: 'successList',
                  },
                ],
              },
            ],
            sendTime: 1,
          },
        ],
        total: 1,
      },
    };
  },

  getFailedList() {
    return {
      status: 200,
      message: 'mock',
      data: {
        failedList: [
          {
            msgId: 1,
            msgTitle: 'failList',
            msgContent: 'failList',
            customers: [
              {
                customerId: 'failList',
                customerName: 'failList',
                grantUsers: [
                  {
                    userId: 'failList',
                    username: 'failList',
                  },
                ],
              },
            ],
            sendTime: 1,
          },
        ],
        total: 1,
      },
    };
  },
  // 成功失败消息详情
  getDetail() {
    return {
      status: 200, // 类型：Number  必有字段  备注：状态码
      message: 'mock', // 类型：String  必有字段  备注：message
      data: {
        // 类型：Object  必有字段  备注：无
        detail: {
          // 类型：Object  必有字段  备注：无
          msgId: 1, // 类型：Number  必有字段  备注：消息id
          msgTitle: 'mock', // 类型：String  必有字段  备注：消息标题
          sendTime: 'mock', // 类型：String  必有字段  备注：设置的发送时点
          realSendTime: 1, // 类型：Number  必有字段  备注：实际发送时间
          operateTime: 1, // 类型：Number  必有字段  备注：操作时间
          operator: 'mock', // 类型：String  必有字段  备注：操作人
          customers: [
            // 类型：Array  必有字段  备注：发送对象
            {
              // 类型：Object  必有字段  备注：无
              customerId: 'mock', // 类型：String  必有字段  备注：客户id
              customerName: '周小熊才华有限公司', // 类型：String  必有字段  备注：客户名称
              msgContent: '我是内容本', // 类型：String  必有字段  备注：组装后的消息内容
              grantUsers: [
                // 类型：Array  必有字段  备注：客户被授权的用户
                {
                  // 类型：Object  必有字段  备注：无
                  userId: '1', // 类型：String  必有字段  备注：用户id
                  username: '张三', // 类型：String  必有字段  备注：用户名
                  isRead: true, // 类型：Boolean  必有字段  备注：是否已读
                  failedReason: 'mock', // 类型：String  必有字段  备注：失败原因
                },
                {
                  // 类型：Object  必有字段  备注：无
                  userId: '2', // 类型：String  必有字段  备注：用户id
                  username: '张四', // 类型：String  必有字段  备注：用户名
                  isRead: true, // 类型：Boolean  必有字段  备注：是否已读
                  failedReason: 'mock', // 类型：String  必有字段  备注：失败原因
                },
                {
                  // 类型：Object  必有字段  备注：无
                  userId: '3', // 类型：String  必有字段  备注：用户id
                  username: '张五', // 类型：String  必有字段  备注：用户名
                  isRead: false, // 类型：Boolean  必有字段  备注：是否已读
                  failedReason: 'mock', // 类型：String  必有字段  备注：失败原因
                },
              ],
            },
            {
              // 类型：Object  必有字段  备注：无
              customerId: 'mock1', // 类型：String  必有字段  备注：客户id
              customerName: '佟年小可爱', // 类型：String  必有字段  备注：客户名称
              msgContent: '我是可爱本人', // 类型：String  必有字段  备注：组装后的消息内容
              grantUsers: [
                // 类型：Array  必有字段  备注：客户被授权的用户
                {
                  // 类型：Object  必有字段  备注：无
                  userId: '1', // 类型：String  必有字段  备注：用户id
                  username: '张三三', // 类型：String  必有字段  备注：用户名
                  isRead: true, // 类型：Boolean  必有字段  备注：是否已读
                  failedReason: 'mock', // 类型：String  必有字段  备注：失败原因
                },
                {
                  // 类型：Object  必有字段  备注：无
                  userId: '2', // 类型：String  必有字段  备注：用户id
                  username: '张四四', // 类型：String  必有字段  备注：用户名
                  isRead: true, // 类型：Boolean  必有字段  备注：是否已读
                  failedReason: 'mock', // 类型：String  必有字段  备注：失败原因
                },
                {
                  // 类型：Object  必有字段  备注：无
                  userId: '3', // 类型：String  必有字段  备注：用户id
                  username: '张五五', // 类型：String  必有字段  备注：用户名
                  isRead: false, // 类型：Boolean  必有字段  备注：是否已读
                  failedReason: 'mock', // 类型：String  必有字段  备注：失败原因
                },
              ],
            },
          ],
        },
      },
    };
  },
};
