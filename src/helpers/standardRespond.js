const response = (res, msg, result, status = 200) => {
  let success = true;
  if (status >= 400) {
    success = false;
  }

  const data = {
    success,
    message: msg
  };

  if(result){
    data.result = result;
  }
  return res.status(status).json(data);
};

module.exports = response;