const async = require("async");
const mongoose = require("mongoose");
const Users = require("../models/users");
const responseUtilities = require("../helpers/sendResponse");
const web3Service = require("../helpers/web3Service");



const getAllUsers = function (data, response, cb) {
	if (!cb) {
		cb = response;
	}
	
	let findData = {
		role:'USER',
	};

	let projection = {
		_id: 1,
		role: 1,
		provider: 1,
		emailVerified: 1,
		isActive: 1,
		createdAt: 1,
		userName: 1,
		accountId: 1,
		email: 1,
		name: 1,
	};
	
	let limit = parseInt(process.env.pageLimit);
	let skip = 0;
	if (data.currentPage) {
	  skip = data.currentPage > 0 ? (data.currentPage - 1) * limit : 0;
	}
  

	Users.find(findData,projection) .skip(skip).limit(limit).sort({ createdAt: -1 }).exec((err, res) => {
		if (err) {
			console.error(err);
			return cb(
				responseUtilities.responseStruct(
					500,
					null,
					"getAllUsers",
					null,
					data.req.signature
				)
			);
		}
		Users.countDocuments(findData, (err, count) => {
			if (err) {
			  console.error(err);
			  return cb(
				responseUtilities.responseStruct(
				  500,
				  null,
				  "getAllUsers",
				  null,
				  null
				)
			  );
			}
			return cb(
			  null,
			  responseUtilities.responseStruct(
				200,
				"Users fetched successfuly",
				"getAllUsers",
				{ Users:res,count: count,pageLimit:limit},
				null
			  )
			);
		  });
	});

	
}
exports.getAllUsers = getAllUsers;
