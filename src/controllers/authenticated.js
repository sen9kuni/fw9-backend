const response = require('../helpers/standardRespond');
const profileModel = require('../models/profile');
// const transactionModel = require('../models/transactions');
const userModel = require('../models/users');
const authModel = require('../models/authenticated');
const errorResponse = require('../helpers/errorResponse');
const {LIMIT_DATA} = process.env;
const bcrypt = require('bcrypt');

exports.profile = (req, res)=>{
  const user_id = parseInt(req.authUser.id);
  profileModel.getProfileByUserId(user_id, (results)=>{
    return response(res, 'profile user', results[0]);
  });
};

exports.historyTransactions = (req, res) =>{
  const id = parseInt(req.authUser.id);
  const {searchBy='note', search='',sortBy='id',sortType='ASC', limit=parseInt(LIMIT_DATA), page=1} = req.query;
  const offset = (page - 1) * limit;
  authModel.historyTransactions(id, searchBy, search, sortBy, sortType, limit, offset, (err, results)=>{
    if (results.length < 1) {
      return res.redirect('/404');
    }
    const pageInfo = {};

    authModel.countHistoryTransactions(id,searchBy, search, (err, totalData)=>{
      pageInfo.totalData = totalData;
      pageInfo.totalPage = Math.ceil(totalData/limit);
      pageInfo.currentPage = parseInt(page);
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null;
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null;
      return response(res, 'List history Transaction User', results, pageInfo);
    });
  });
};

exports.addPhone = (req, res) => {
  const user_id = parseInt(req.authUser.id);
  profileModel.getProfileByUserIdAuth(user_id, (err, results)=>{
    if (results.rows.length > 0) {
      const profile = results.rows[0];
      if (profile.phonenumber === null) {
        profileModel.updateProfile(profile.id, {phonenumber: req.body.phonenumber}, (err, resultUpdate)=>{
          const profileUpdate = resultUpdate.rows[0];
          if (profileUpdate.id === profile.id) {
            return response(res, 'Add phone number Success');
          }
        });
      } else {
        return response(res, 'Error: phonenumber already set', null, null, 400);
      }
    } else {
      return response(res, 'Error: id does not exists', null, null, 400);
    }
  });
};

exports.transfer = (req, res)=>{
  const sender_id = req.authUser.id;
  const {amount, pin} = req.body;
  userModel.getUserById(sender_id,(err, results)=>{
    if (results.rows.length > 0){
      const user = results.rows[0];
      profileModel.getProfileByUserIdTf(sender_id,(err, results2)=>{
        if(results2.rows.length > 0){
          const profile = results2.rows[0];
          if(parseInt(profile.balance) >= parseInt(amount)){
            if(pin == user.pin){
              authModel.trasfer(sender_id, amount, req.body, (err, results3)=>{
                if (err) {
                  return errorResponse(err, res);
                } else {
                  return response(res, `Transaction is successfully, balance left: Rp.${profile.balance - results3.rows[0].amount}`, results3.rows[0]);
                }
              });
            } else {
              return response(res, 'Wrong input Pin', null, null, 400);
            }
          } else {
            return response(res, 'Balance not enough', null, null, 400);
          }
        }
      });
    } else {
      return response(res, 'User not found', null, null, 400);
    }
  });
};

exports.topUp = (req, res)=>{
  const recipient_id = req.authUser.id;
  const {amount, type_id_trans=2} = req.body;
  profileModel.getProfileByUserIdTf(recipient_id,(err, results1)=>{
    if(results1.rows.length > 0){
      const profile = results1.rows[0];
      authModel.topUp(recipient_id, amount, type_id_trans, req.body, (err, results)=>{
        if (err) {
          return errorResponse(err, res);
        } else {
          return response(res, `TopUp is successfully, balance left: Rp.${parseInt(profile.balance) + parseInt(results.rows[0].amount)}`, results.rows[0]);
        }
      });
    } else {
      return response(res, 'Profile not found', null, null, 400);
    }
  });
};

exports.updateProfile = (req, res)=>{
  const user_id = parseInt(req.authUser.id);
  let filename = null;
  const {fullname=null, phonenumber=null} = req.body;

  if(req.file){
    filename = req.file.filename;
  }
  profileModel.updateProfileAuth(user_id,filename, fullname, phonenumber, (err, results)=> {
    if (err) {
      return errorResponse(res, `Failed to update: ${err.message}`, null, null, 400);
    }
    return response(res, 'Profile updated', results.rows[0]);
  });
};

exports.editPassword = (req, res)=>{
  const id = parseInt(req.authUser.id);
  userModel.changePassword(id, req.body, (err)=>{
    if (err) {
      return errorResponse(err, res);
    }else{
      return response(res, 'Change Password successfully');
    }
  });
};

exports.editPin = (req, res)=>{
  const id = parseInt(req.authUser.id);
  const {currentPin, newPin} = req.body;
  userModel.getUserById(id, (err, results)=>{
    if (results.rows.length > 0) {
      const user = results.rows[0];
      if (currentPin === user.pin) {
        userModel.changePin(id, newPin, (err)=>{
          if (err) {
            return errorResponse(err, res);
          }else{
            return response(res, 'Change Pin successfully');
          }
        });
      } else {
        return response(res, 'Current Pin is wrong', null, null, 400);
      }
    } else {
      return response(res, 'User not found', null, null, 400);
    }
  });
};

exports.editPhonenumber = (req, res)=>{
  const user_id = parseInt(req.authUser.id);
  profileModel.changePhoneNumber(user_id, req.body, (err)=>{
    if (err) {
      return errorResponse(err, res);
    }else{
      return response(res, 'Edit phonenumber successfully');
    }
  });
};

exports.changePasswordTest = (req, res)=>{
  const id = parseInt(req.authUser.id);
  const {currentPassword, newPassword} = req.body;
  userModel.getUserById(id, (err, results)=>{
    if (results.rows.length < 1) {
      return response(res, 'User not found', null, null, 400);
    }
    const user = results.rows[0];
    bcrypt.compare(currentPassword, user.password)
      .then((cpRes)=>{
        if (cpRes){
          userModel.changePassword(id, newPassword, (err)=>{
            if (err) {
              return errorResponse(err, res);
            }else{
              return response(res, 'Change Password successfully');
            }
          });
        } else {
          return response(res, 'Password not match1', null, null, 400);
        }
      })
      .catch(() =>{
        return response(res, 'Password not match', null, null, 400);
      });
  });
};