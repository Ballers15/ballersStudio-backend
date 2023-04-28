const projectName = 'Ballers';

const User = require("../models/users");


const mailjet = require("node-mailjet").connect(
    process.env.MAILJET_APIKEY_PUBLIC,
    process.env.MAILJET_APIKEY_PRIVATE
  );




let sendMailByTemplate = function (
    from,
    to,
    templateId,
    variables,
    cb
  ) {
    // if (process.env.DEV == "true") {
    //   return cb(null, "Mail Disabled");
  
    // }else{
    // console.log("Email Template called",  from,
    // to,
    // subject,
    // templateId,
    // variables,)
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: `Ballers <${from}>`,
          },
          To: [
            {
              Email: to,
            },
          ],
          TemplateID: templateId,
          TemplateLanguage: true,
          Variables: variables,
        },
      ],
    });
    request
      .then((result) => {
  
        return cb(null, result.body);
      })
      .catch((err) => {
        return cb(err, null);
      });
    // }
  
  };

exports.sendOtpEmailRegistry = function(data, response, cb) {

    if(!cb){
        cb = response;
    }

    let user = {
        email: data.email
    };
    let generatedOTP = data.otp
    var hostUrl = process.env.EMAIL_HOST
  
    let from = process.env.EMAIL_HOST;
    let to = `${user.email}`;
    // let message = `${hostUrl}, email:${user.email}, otp:${generatedOTP}`
    let templateId = 3994422;
    let variables = {
        email: user.email,
        otp: generatedOTP,
      };
    


    sendMailByTemplate(
        from,
        to,
        templateId,
        variables,
        function (error, data) {
          if (error) {
            return cb(error);
          }
          return cb(null, data);
        }
      );
  
};





exports.sendOtpEmailForgotPasswordLink = async function (data, response, cb) {
    if (!cb) {
      cb = response;
    }
  
    let user = {
      email: data.email,
    };
  
    const findData = {
      email: user.email,
    };
  
    const teamLead = await User.findOne(findData);

  
    let hostUrl = process.env.IMAGE_PATH;
    let subject = `Reset Password !!`;
    let from = process.env.EMAIL_HOST;
    let to = `${user.email}`;
    let templateId = 3994564;
    let variables = {
      firstname: teamLead.userName,
      reset_link: data.resetLink,
    };
  
  
    console.log("varaiablesss", variables);
    sendMailByTemplate(
      from,
      to,
      templateId,
      variables,
      function (error, data) {
        if (error) {
          return cb(error);
        }
        return cb(null, data);
      }
    );
  };