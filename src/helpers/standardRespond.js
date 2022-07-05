const response = (res, msg, result, pageInfo, status = 200) => {
  let success = true;
  if (status >= 400) {
    success = false;
  }

  const data = {
    success,
    message: msg
  };

  if (pageInfo) {
    data.pageInfo = pageInfo;
  }

  if(result){
    data.result = result;
  }
  console.log('err',res);
  return res.status(status).json(data);
};

module.exports = response;