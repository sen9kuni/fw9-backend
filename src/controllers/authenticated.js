const response = require('../helpers/standardRespond');
const profileModel = require('../models/profile');
const transactionModel = require('../models/transactions');
const userModel = require('../models/users');
const authModel = require('../models/authenticated');
const errorResponse = require('../helpers/errorResponse');
const {LIMIT_DATA} = process.env;

exports.profile = (req, res)=>{
  const user_id = parseInt(req.authUser.id);
  profileModel.getProfileByUserId(user_id, (results)=>{
    return response(res, 'profile user', results[0]);
  });
};

// not work yet
exports.searchSortTrans = (req, res) => {
  const search = parseInt(req.authUser.id);
  const {sort_by='', sort_type='ASC', limit=parseInt(LIMIT_DATA), page=1} = req.query;

  const offset = (page - 1) * limit;
  transactionModel.searchSortTranswithAuth(parseInt(search), sort_by, sort_type, limit, offset, (results)=>{
    if (results.length < 1) {
      return res.redirect('/404');
    }
    const pageInfo = {};

    transactionModel.countAllTranswithAuth(search, (err, totalData)=>{
      pageInfo.totalData = totalData;
      pageInfo.totalPage = Math.ceil(totalData/limit);
      pageInfo.currentPage = parseInt(page);
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null;
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null;
      return response(res, 'List all Transaction User', results, pageInfo);
    });
  });
};
// not work yet

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
        return errorResponse(res, 'Error: phonenumber already set', null, null, 400);
      }
    } else {
      return errorResponse(res, 'Error: id does not exists', null, null, 400);
    }
  });
};

exports.transfer = (req, res)=>{
  const sender_id = req.authUser.id;
  authModel.trasfer(sender_id, req.body, (err, results)=>{
    if (err) {
      return errorResponse(err, res);
    } else {
      return response(res, 'Transaction is successfully', results.rows[0]);
    }
  });
};

exports.updateProfile = (req, res)=>{
  const user_id = parseInt(req.authUser.id);
  let filename = null;

  if(req.file){
    filename = req.file.filename;
  }
  profileModel.updateProfileAuth(user_id,filename, req.body, (err, results)=> {
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
  userModel.changePin(id, req.body, (err)=>{
    if (err) {
      return errorResponse(err, res);
    }else{
      return response(res, 'Change Pin successfully');
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