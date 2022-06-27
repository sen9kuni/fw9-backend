const response = require('../helpers/standardRespond')

exports.getAllUsers = (req, res) => {
    return response(res, 'Message from standard get respones users')
}

exports.postAllUsers = (req, res) => {
    return response(res, 'Message from standard post respones users')
}

exports.putAllUsers = (req, res) => {
    return response(res, 'Message from standard put respones users')
}

exports.deleteAllUsers = (req, res) => {
    return response(res, 'Message from standard delete respones users')
}