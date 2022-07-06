const response = require('../helpers/standardRespond');
const { validationResult } = require('express-validator');
const errorResponse = require('../helpers/errorResponse');
const profileModel = require('../models/profile');
const upload = require('../helpers/upload').single('picture');
const {LIMIT_DATA} = process.env;

// exports.getAllProfile = (req, res)=>{
//   profileModel.getAllProfile((results)=>{
//     return response(res, 'Message from standard get respones users', results);
//   });
// };

exports.createProfile = (req, res)=>{
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return response(res, 'Error occured', validation.array(), null, 400);
  }

  profileModel.createProfile(req.body, (err, results)=>{
    if (err) {
      return errorResponse(err, res);
    } else {
      return response(res, 'Create profile successfully', results.rows);
    }
  });
};

// base
// exports.editProfile = (req, res)=>{
//   const {id} = req.params;
//   const validation = validationResult(req);

//   if (!validation.isEmpty()) {
//     return response(res, 'Error occured', validation.array(), null, 400);
//   }

//   profileModel.updateProfile(id, req.body, (err, results)=>{
//     if (err) {
//       return errorResponse(err, res);
//     } else {
//       return response(res, 'edit profile successfully', results.rows);
//     }
//   });
// };

// experiment
exports.editProfile = (req, res)=>{
  const {id} = req.params;
  upload(req, res, (err)=>{
    if (err) {
      console.log(err);
      return response(res, `Failed to update: ${err.message}`, null, null, 400);
    }
    profileModel.updateProfile(id, req.file.filename, (err, results)=>{
      return response(res, 'edit profile successfully', results.rows[0]);
    });
  });
};
// experiment

exports.deleteProfile = (req, res)=>{
  const {id} = req.params;
  profileModel.deleteProfile(id, (results)=>{
    return response(res, 'profile deleted', results[0]);
  });
};

exports.getProfileById = (req, res)=>{
  const {id} = req.params;
  profileModel.getProfileById(id, (results)=>{
    return response(res, 'Profile search', results[0]);
  });
};

exports.searchSortProfile = (req, res) => {
  const {searchBy='', search='', sort_by='', sort_type='ASC', limit=parseInt(LIMIT_DATA), page=1} = req.query;

  const offset = (page - 1) * limit;
  profileModel.searchSortProfile(searchBy, search, sort_by, sort_type, limit, offset, (results)=>{
    if (results.length < 1) {
      return res.redirect('/404');
    }
    const pageInfo = {};

    profileModel.countAllProfile(search, (err, totalData)=>{
      pageInfo.totalData = totalData;
      pageInfo.totalPage = Math.ceil(totalData/limit);
      pageInfo.currentPage = parseInt(page);
      pageInfo.nextPage = pageInfo.currentPage < pageInfo.totalPage ? pageInfo.currentPage + 1 : null;
      pageInfo.prevPage = pageInfo.currentPage > 1 ? pageInfo.currentPage - 1 : null;
      return response(res, 'List all Profile search', results, pageInfo);
    });
  });
};