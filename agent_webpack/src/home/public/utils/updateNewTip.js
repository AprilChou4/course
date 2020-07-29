import request from './request';

const updateNewTip = (argv) => {
  let param = {
    functionName: Nui.type(argv, 'String') && argv,
  };
  if ($.isPlainObject(argv)) {
    param = module.extend(param, argv);
  }
  request.post('instead/company/updateNewTip.do', param, (res) => {
    if (res.result === 'success') {
      window.new_fun_tips_json[param.functionName] = 'hide';
    }
  });
};
export default updateNewTip;
