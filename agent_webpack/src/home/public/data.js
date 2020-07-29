var data = {
    //权限列表
    isUserHasArea:false,
    areacodePrefix:0,
    authoritys:'',
    authority:{},
    //辅助核算类型
    auxiliaryType:[],
    //模板类型
    templateType:[{
        name:'小企业会计准则'
    }, {
        name:'企业会计准则'
    }, {
        name:'民间非营利组织会计制度'
    }],
    //模板来源
    templateSource:[{
        name:'系统预置'
    }, {
        name:'用户新增'
    }],
    rolename:'',
    isCsUser:'',
    taskCount:'',
    userinfo:{},
    monthDays:{
        '1' :31,
        '2' :28,
        '3' :31,
        '4' :30,
        '5' :31,
        '6' :30,
        '7' :31,
        '8' :31,
        '9' :30,
        '10':31,
        '11':30,
        '12':31

    },
    bookkeeper:[],
    accountList:[]
}

var originalData = $.extend(true, {}, data);

module.exports = {
    set:function(type, result){
        if(typeof result === 'function'){
            result = result();
        }
        data[type] = result || originalData[type];
        if (data[type] === undefined) { 
            data[type] = '';
        }
    },
    get:function(type, key){
        var _data = data[type];
        if(typeof key === 'undefined'){
            return _data
        }
        return _data[key]
    }
}