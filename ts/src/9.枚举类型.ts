// 标注语法=> enum 枚举名称 { key1=value,key2=value2}
// 1.key不能是数字
// 2.value可以是数字，称为 数字类型枚举；也可以是字符串，称为字符串类型枚举；但不能是其他值，默认为数字：0
// 3.第一个枚举值或者前一个枚举值为数字时,可以省略赋值，其值为前一个数字值+1

// 数字类型枚举
enum HTTP_CODE {
  OK = 200,
  NOT_FOUND = 404,
}

HTTP_CODE.OK; //200

// 字符串类型枚举
enum URLS {
  USER_LOGIN = "/user/login",
  USER_REGISTER = "/user/register",
}
