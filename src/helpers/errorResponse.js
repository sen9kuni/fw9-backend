const errorResponse = (msg, param, location='body')=>[
  {
    msg,
    param,
    location
  }
];

module.exports = errorResponse;