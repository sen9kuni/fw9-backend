const response = require('../helpers/standardRespond')

exports.getAllUsers = (req, res) => {
    return response(res, 'Message from standard get respones')
}

exports.postAllUsers = (req, res) => {
    return response(res, 'Message from standard post respones')
}

exports.putAllUsers = (req, res) => {
    return response(res, 'Message from standard put respones')
}

exports.deleteAllUsers = (req, res) => {
    return response(res, 'Message from standard delete respones')
}