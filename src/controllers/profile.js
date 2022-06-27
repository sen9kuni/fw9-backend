const response = require('../helpers/standardRespond')

exports.getProfile = (req, res) => {
    return response(res, 'Message from standard get respones profile')
}

exports.postProfile = (req, res) => {
    return response(res, 'Message from standard post respones profile')
}

exports.putProfile = (req, res) => {
    return response(res, 'Message from standard put respones profile')
}

exports.deleteProfile = (req, res) => {
    return response(res, 'Message from standard delete respones profile')
}