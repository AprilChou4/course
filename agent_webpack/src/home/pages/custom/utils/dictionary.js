/**
 * @func 数据字典
 */

const getData = (data) => {
  const cloneData = { ...data, map: {} };
  cloneData.list.forEach((ele) => {
    cloneData.map[ele.value] = ele.name;
  });
  return cloneData;
};

// 纳税性质
const taxType = {
  title: '纳税性质',
  list: [
    {
      name: '一般纳税人',
      value: 0,
    },
    {
      name: '小规模纳税人',
      value: 1,
    },
  ],
};

// 会计制度 用于第三方建账
const accountSystem = {
  title: '会计制度',
  list: [
    {
      name: '小企业会计准则',
      value: '0',
    },
    {
      name: '企业会计准则',
      value: '1',
    },
    {
      name: '民间非营利组织会计准则',
      value: '2',
    },
    {
      name: '系统自动判断',
      value: '3',
    },
  ],
};

// 注册登记类型 1国有企业,2集体企业,股份合作企业,4联营企业,5有限责任公司,6股份有限公司,7私营企业,8其他企业\\,9合资经营企业(港或澳台资),10合作经营企业(港或澳台资),11港澳台商独资经营企业,12港澳台商投资股份有限公司,13其他港澳台商投资企业,14中外合资经营企业,15中外合作经营企业,16外资企业,17外商投资股份有限公司,18其他外商投资企业）
const registrationType = {
  title: '注册登记类型',
  list: [
    {
      name: '国有企业',
      value: 1,
    },
    {
      name: '集体企业',
      value: 2,
    },
    {
      name: '股份合作企业',
      value: 3,
    },
    {
      name: '联营企业',
      value: 4,
    },
    {
      name: '有限责任公司',
      value: 5,
    },
    {
      name: '股份有限公司',
      value: 6,
    },
    {
      name: '私营企业',
      value: 7,
    },
    {
      name: '其他企业',
      value: 8,
    },
    {
      name: '合资经营企业(港或澳台资)',
      value: 9,
    },
    {
      name: '合作经营企业(港或澳台资)',
      value: 10,
    },
    {
      name: '港澳台商独资经营企业',
      value: 11,
    },
    {
      name: '港澳台商投资股份有限公司',
      value: 12,
    },
    {
      name: '其他港澳台商投资企业',
      value: 13,
    },
    {
      name: '中外合资经营企业',
      value: 14,
    },
    {
      name: '中外合作经营企业',
      value: 15,
    },
    {
      name: '外资企业',
      value: 16,
    },
    {
      name: '外商投资股份有限公司',
      value: 17,
    },
    {
      name: '其他外商投资企业',
      value: 18,
    },
  ],
};

export default {
  taxType: getData(taxType),
  accountSystem: getData(accountSystem),
  registrationType: getData(registrationType),
};
