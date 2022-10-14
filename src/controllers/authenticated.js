const response = require('../helpers/standardRespond')
const profileModel = require('../models/profile')
// const transactionModel = require('../models/transactions');
const userModel = require('../models/users')
const authModel = require('../models/authenticated')
const errorResponse = require('../helpers/errorResponse')
const { LIMIT_DATA } = process.env
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2
const notifModel = require('../models/notifications')
const admin = require('../helpers/firebaseNotif')

exports.profile = (req, res) => {
  const user_id = parseInt(req.authUser.id)
  profileModel.getProfileByUserId(user_id, (results) => {
    return response(res, 'profile user', results[0])
  })
}

exports.deletePicture = (req, res) => {
  const user_id = parseInt(req.authUser.id)
  profileModel.getProfileByUserId(user_id, (results) => {
    if (results[0].picture !== null && results[0].picture !== undefined) {
      const nameFolder = results[0].picture.split('/')[7]
      const nameFileFull = results[0].picture.split('/')[results[0].picture.split('/').length - 1]
      const nameFile = nameFileFull.split('.')[0]
      // const publicUrl = `${nameFolder}/${nameFile}`;
      // return response(res, 'image deleted', {nameFolder, nameFileFull, nameFile, publicUrl});
      cloudinary.uploader.destroy(`${nameFolder}/${nameFile}`, (err, resultsDelete) => {
        if (err) {
          return errorResponse(err, res)
        } else {
          authModel.deleteImage(user_id, (err, results) => {
            return response(res, 'your picture is deleted', results.rows[0])
            // }
          })
        }
      })
    } else {
      return response(res, 'picture already deleted')
    }
  })
}

exports.historyTransactions = (req, res) => {
  const id = parseInt(req.authUser.id)
  const {
    searchBy = 'note',
    search = '',
    sortBy = 'id',
    sortType = 'ASC',
    limit = parseInt(LIMIT_DATA),
    page = 1
  } = req.query
  const offset = (page - 1) * limit
  authModel.historyTransactions(id, searchBy, search, sortBy, sortType, limit, offset, (err, results) => {
    if (results.length < 1) {
      return res.redirect('/404')
    }
    const pageInfo = {}

    authModel.countHistoryTransactions(id, searchBy, search, (err, totalData) => {
      pageInfo.totalData = totalData
      pageInfo.totalPage = Math.ceil(totalData / limit)
      pageInfo.currentPage = parseInt(page)
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null
      return response(res, 'List history Transaction User', results, pageInfo)
    })
  })
}

exports.addPhone = (req, res) => {
  const user_id = parseInt(req.authUser.id)
  profileModel.getProfileByUserIdAuth(user_id, (err, results) => {
    if (results.rows.length > 0) {
      const profile = results.rows[0]
      if (profile.phonenumber === null) {
        profileModel.updateProfile(profile.id, { phonenumber: req.body.phonenumber }, (err, resultUpdate) => {
          const profileUpdate = resultUpdate.rows[0]
          if (profileUpdate.id === profile.id) {
            return response(res, 'Add phone number Success')
          }
        })
      } else {
        return response(res, 'Error: phonenumber already set', null, null, 400)
      }
    } else {
      return response(res, 'Error: id does not exists', null, null, 400)
    }
  })
}

exports.transfer = (req, res) => {
  const sender_id = req.authUser.id
  const { amount, pin } = req.body
  userModel.getUserById(sender_id, (err, results) => {
    if (results.rows.length > 0) {
      const user = results.rows[0]
      profileModel.getProfileByUserIdTf(sender_id, (err, results2) => {
        // console.log(results2.rows[0]);
        if (results2.rows.length > 0) {
          const profile = results2.rows[0]
          if (parseInt(profile.balance) >= parseInt(amount)) {
            if (pin == user.pin) {
              notifModel.getDataById(req.body.recipient_id, (err, resultNotif) => {
                if (err) {
                  console.log(err)
                }

                profileModel.getProfileByUserIdAuth(parseInt(req.body.recipient_id), (err, resultRec) => {
                  // console.log(resultRec.rows);
                  if (err) {
                    // console.log(err);
                    return response(res, 'User not found recipient', null, null, 400)
                  } else {
                    notifModel.getDataById(sender_id, (err, resultNotifSend) => {
                      if (err) {
                        console.log(err)
                      }

                      authModel.trasfer(sender_id, amount, req.body, (err, results3) => {
                        if (err) {
                          return errorResponse(err, res)
                        } else {
                          // return response(res, `Transaction is successfully, balance left: Rp.${profile.balance - results3.rows[0].amount}`, results3.rows[0]);
                          // notifModel.createNotif(sender_id, req.body.recipient_id, results3.rows.id, (err)=>{
                          //   if (err) {
                          //     console.log(err);
                          //   }
                          // });
                          // console.log(results3.rows[0].recipient_id);
                          if (resultNotifSend.rows.length > 0) {
                            const message = {
                              notification: {
                                title: 'Transfer',
                                body: `Transfer Rp.${amount} success to ${resultRec.rows[0].first_name} ${resultRec.rows[0].last_name}`
                              }
                            }
                            admin
                              .messaging()
                              .sendToDevice(resultNotifSend.rows[0].token, message, { priority: 'high' })
                              .then((response) => {
                                console.log(response)
                              })
                              .catch(console.log('error'))
                          }
                          if (resultNotif.rows.length > 0) {
                            const message = {
                              notification: {
                                title: 'Transfer',
                                body: `You get transfer Rp.${amount} from ${results2.rows[0].first_name} ${results2.rows[0].last_name}`
                              }
                            }
                            admin
                              .messaging()
                              .sendToDevice(resultNotif.rows[0].token, message, { priority: 'high' })
                              .then((response) => {
                                console.log(response)
                              })
                              .catch(console.log('error'))
                          }
                          return response(res, 'Transaction is successfully', results3.rows[0])
                        }
                      })
                    })
                  }
                })
              })
            } else {
              return response(res, 'Wrong input Pin', null, null, 400)
            }
          } else {
            return response(res, 'Balance not enough', null, null, 400)
          }
        }
      })
    } else {
      return response(res, 'User not found', null, null, 400)
    }
  })
}

exports.topUp = (req, res) => {
  const recipient_id = req.authUser.id
  const { amount, type_id_trans = 2 } = req.body
  profileModel.getProfileByUserIdTf(recipient_id, (err, results1) => {
    if (results1.rows.length > 0) {
      const profile = results1.rows[0]
      notifModel.getDataById(recipient_id, (err, resultNotifSend) => {
        authModel.topUp(recipient_id, amount, type_id_trans, req.body, (err, results) => {
          if (err) {
            return errorResponse(err, res)
          } else {
            if (resultNotifSend.rows.length > 0) {
              const message = { notification: { title: 'Top Up', body: `top up Rp.${amount} successfully` } }
              admin
                .messaging()
                .sendToDevice(resultNotifSend.rows[0].token, message, { priority: 'high' })
                .then((response) => {
                  console.log(response)
                })
                .catch(console.log('error'))
            }
            return response(
              res,
              `TopUp is successfully, balance left: Rp.${parseInt(profile.balance) + parseInt(results.rows[0].amount)}`,
              results.rows[0]
            )
          }
        })
      })
    } else {
      return response(res, 'Profile not found', null, null, 400)
    }
  })
}

exports.updateProfile = (req, res) => {
  const user_id = parseInt(req.authUser.id)
  let filename = null
  const { fullname = null, phonenumber = null, first_name = null, last_name = null } = req.body

  if (req.file) {
    filename = req.file.path
  }
  // profileModel.updateProfileAuth(user_id, filename, fullname, phonenumber, first_name, last_name,  (err, results)=> {
  //   if (err) {
  //     return errorResponse(res, `Failed to update: ${err.message}`, null, null, 400);
  //   }
  //   return response(res, 'Profile updated', results.rows[0]);
  // });
  profileModel.getProfileByUserId(user_id, (results) => {
    if (results[0].picture !== null && results[0].picture !== undefined) {
      const nameFolder = results[0].picture.split('/')[7]
      const nameFileFull = results[0].picture.split('/')[results[0].picture.split('/').length - 1]
      const nameFile = nameFileFull.split('.')[0]
      cloudinary.uploader.destroy(`${nameFolder}/${nameFile}`, (err, resultsDelete) => {
        if (err) {
          return errorResponse(err, res)
        } else {
          authModel.deleteImage(user_id, (err, results) => {
            profileModel.updateProfileAuth(
              user_id,
              filename,
              fullname,
              phonenumber,
              first_name,
              last_name,
              (err, results) => {
                if (err) {
                  return errorResponse(res, `Failed to update: ${err.message}`, null, null, 400)
                }
                return response(res, 'Profile updated', results.rows[0])
              }
            )
          })
        }
      })
    } else {
      profileModel.updateProfileAuth(
        user_id,
        filename,
        fullname,
        phonenumber,
        first_name,
        last_name,
        (err, results) => {
          if (err) {
            return errorResponse(res, `Failed to update: ${err.message}`, null, null, 400)
          }
          return response(res, 'Profile updated', results.rows[0])
        }
      )
    }
  })
}

exports.updateProfileName = (req, res) => {
  const user_id = parseInt(req.authUser.id)
  const { first_name = null, last_name = null } = req.body

  profileModel.updateProfileName(user_id, first_name, last_name, (err, results) => {
    if (err) {
      return errorResponse(res, `Failed to update: ${err.message}`, null, null, 400)
    }
    return response(res, 'Profile name updated', results)
  })
}

exports.editPassword = (req, res) => {
  const id = parseInt(req.authUser.id)
  userModel.changePassword(id, req.body, (err) => {
    if (err) {
      return errorResponse(err, res)
    } else {
      return response(res, 'Change Password successfully')
    }
  })
}

exports.editPin = (req, res) => {
  const id = parseInt(req.authUser.id)
  const { currentPin, newPin } = req.body
  userModel.getUserById(id, (err, results) => {
    if (results.rows.length > 0) {
      const user = results.rows[0]
      if (currentPin === user.pin) {
        userModel.changePin(id, newPin, (err) => {
          if (err) {
            return errorResponse(err, res)
          } else {
            return response(res, 'Change Pin successfully')
          }
        })
      } else {
        return response(res, 'Current Pin is wrong', null, null, 400)
      }
    } else {
      return response(res, 'User not found', null, null, 400)
    }
  })
}

exports.editPhonenumber = (req, res) => {
  const user_id = parseInt(req.authUser.id)
  profileModel.changePhoneNumber(user_id, req.body, (err, results) => {
    if (err) {
      return errorResponse(err, res)
    } else {
      return response(res, 'Edit phonenumber successfully', results.rows[0])
    }
  })
}

exports.changePasswordTest = (req, res) => {
  const id = parseInt(req.authUser.id)
  const { currentPassword, newPassword } = req.body
  userModel.getUserById(id, (err, results) => {
    if (results.rows.length < 1) {
      return response(res, 'User not found', null, null, 400)
    }
    const user = results.rows[0]
    bcrypt
      .compare(currentPassword, user.password)
      .then((cpRes) => {
        if (cpRes) {
          userModel.changePassword(id, newPassword, (err) => {
            if (err) {
              return errorResponse(err, res)
            } else {
              return response(res, 'Change Password successfully')
            }
          })
        } else {
          return response(res, 'Current Password is wrong', null, null, 400)
        }
      })
      .catch(() => {
        return response(res, 'Password not match', null, null, 400)
      })
  })
}

exports.joinUserAndProfile = (req, res) => {
  const id = parseInt(req.authUser.id)
  authModel.getUserAndProfile(id, (results) => {
    return response(res, 'user with profile', results[0])
  })
}

exports.joinHistoryTransactions = (req, res) => {
  const id = parseInt(req.authUser.id)
  authModel.getJoinHistoryTransactions(id, (results) => {
    return response(res, 'history transaction', results)
  })
}

exports.joinHistoryTransactionsMk2 = (req, res) => {
  const id = parseInt(req.authUser.id)
  const { limit = parseInt(LIMIT_DATA), page = 1, sort_by = 'DESC' } = req.query
  const offset = (page - 1) * limit
  authModel.getJoinHistoryTransactionsMk2(id, limit, sort_by, offset, (err, results) => {
    if (results.length < 1) {
      return res.redirect('/404')
    }
    const pageInfo = {}

    authModel.getCountJoinHistoryTransactions(id, (err, totalData) => {
      pageInfo.totalData = totalData
      pageInfo.totalPage = Math.ceil(totalData / limit)
      pageInfo.currentPage = parseInt(page)
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null
      return response(res, 'List history Transaction User', results, pageInfo)
    })
  })
}

exports.joinHistoryNotif = (req, res) => {
  const id = parseInt(req.authUser.id)
  const { limit = parseInt(LIMIT_DATA), page = 1, sort_by = 'DESC' } = req.query
  const offset = (page - 1) * limit
  notifModel.getJoinNotifs(id, limit, sort_by, offset, (err, results) => {
    if (results.length < 1) {
      return res.redirect('/404')
    }
    const pageInfo = {}

    notifModel.getJoinNotifsCount(id, (err, totalData) => {
      pageInfo.totalData = totalData
      pageInfo.totalPage = Math.ceil(totalData / limit)
      pageInfo.currentPage = parseInt(page)
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null
      return response(res, 'List history Notifications User', results, pageInfo)
    })
  })
}

exports.getAllNotifs = (req, res) => {
  const id = parseInt(req.authUser.id)
  const { sort_by = 'DESC' } = req.query
  notifModel.getAllNotifs(id, sort_by, (err, results) => {
    if (results.length < 1) {
      return res.redirect('/404')
    }
    return response(res, 'all list notifications user', results)
  })
}

exports.readAllNotif = (req, res) => {
  const id = parseInt(req.authUser.id)
  notifModel.readAllNotifs(id, (err) => {
    if (err) {
      return errorResponse(res, 'Failed to read all your notifications', null, null, 400)
    }
    return response(res, 'read all your notifications')
  })
}

exports.countNotifications = (req, res) => {
  const id = parseInt(req.authUser.id)
  notifModel.getJoinNotifsCount(id, (err, totalData) => {
    if (totalData < 1) {
      return res.redirect('/404')
    } else {
      return response(res, 'List history Notifications User', totalData)
    }
  })
}

exports.readNotification = (req, res) => {
  const { id } = req.params
  notifModel.readNotif(id, (err, result) => {
    if (result[0].is_read === true) {
      return response(res, 'Notification already read', null, null, 404)
    } else {
      return response(res, 'Notification read', result)
    }
  })
}

exports.searchSortProfile = (req, res) => {
  const {
    searchBy = '',
    search = '',
    sort_by = 'id',
    sort_type = 'ASC',
    limit = parseInt(LIMIT_DATA),
    page = 1
  } = req.query

  const offset = (page - 1) * limit
  profileModel.searchSortProfile(searchBy, search, sort_by, sort_type, limit, offset, (results) => {
    if (results.length < 1) {
      return res.redirect('/404')
    }
    const pageInfo = {}

    profileModel.countAllProfile(search, (err, totalData) => {
      pageInfo.totalData = totalData
      pageInfo.totalPage = Math.ceil(totalData / limit)
      pageInfo.currentPage = parseInt(page)
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null
      return response(res, 'List all Profile search', results, pageInfo)
    })
  })
}

exports.searchSortProfileMk2 = (req, res) => {
  const id = parseInt(req.authUser.id)
  const { search = '', sort = 'first_name', limit = parseInt(LIMIT_DATA), page = 1 } = req.query

  const offset = (page - 1) * limit
  authModel.searchSortUsers(search, sort, limit, offset, id, (results) => {
    // if (results === undefined) {
    //   return res.redirect('/404');
    // } else
    if (results.length < 1) {
      return res.redirect('/404')
    }
    const pageInfo = {}

    authModel.countSearchSortUsers(search, id, (err, totalData) => {
      pageInfo.totalData = totalData
      pageInfo.totalPage = Math.ceil(totalData / limit)
      pageInfo.currentPage = parseInt(page, 10)
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null
      return response(res, 'List all Profile search', results, pageInfo)
    })
  })
}

exports.getProfileById = (req, res) => {
  const { user_id } = req.params
  authModel.getProfileById(user_id, (results) => {
    return response(res, 'Profile search', results)
  })
}

exports.getInfoTokenBytId = (req, res) => {
  const { user_id } = req.params
  notifModel.getDataById(user_id, (err, results) => {
    if (results.rows.length < 1) {
      return res.redirect('/404')
    } else {
      return response(res, 'user id notif exits', results.rows[0])
    }
  })
}
