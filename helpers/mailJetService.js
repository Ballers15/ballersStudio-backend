const mailjet = require('node-mailjet').connect(process.env.MAILJET_APIKEY_PUBLIC, process.env.MAILJET_APIKEY_PRIVATE)
const request = require("request");


exports.checkContactByMailId = function (data, res, cb) {
    if (!cb) {
        cb = res;
    }


    const request = mailjet
        .get("contactdata", { 'version': 'v3' })
        .request(
            { "ContactEmail": data.email }
        )
    request
        .then((result) => {
            result.body = JSON.parse(JSON.stringify(result.body));
            // console.log(result.body)
            cb(null, result.body)
        })
        .catch((err) => {
            console.log(err.statusCode)
            // console.log(err)

            cb(err)
        })

}


exports.addContactToMailJet = function (data, res, cb) {
    if (!cb) {
        cb = res;
    }

    const request = mailjet
        .post("contact", { 'version': 'v3' })
        .request({
            "Email": data.email
        })
    request
        .then((result) => {
            result.body = JSON.parse(JSON.stringify(result.body));
            cb(null, result.body)


        })
        .catch((err) => {
            // console.log(err.statusCode)
            cb(err)

        })
}



exports.addMailToContactList = function (data, res, cb) {
    if (!cb) {
        cb = res;
    }

   
    let listId =data.listId;
   
    console.log("LIST",listId)
    const request = mailjet
        .post("contact", { 'version': 'v3' })
        .id(data.mailJetId)
        .action("managecontactslists")
        .request({
            "ContactsLists": [
                {
                    "Action": "addforce",
                    "ListID": listId
                }
            ]
        })
    request
        .then((result) => {
            // console.log(result.body)
            cb(null, result.body)

        })
        .catch((err) => {
            // console.log(err.statusCode)
            cb(err)

        })

}
