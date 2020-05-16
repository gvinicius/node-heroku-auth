const mailjet = require ('node-mailjet')
  .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)
const emailSender = {};

emailSender.run = function(subject, body, receiver) {
  const request = mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      "Messages":[
        {
          "From": {
            "Email": process.env.MJ_SENDER,
            "Name": 'Node App'
          },
          "To": [
            {
              "Email": receiver,
              "Name": "Dear user"
            }
          ],
          "Subject": subject,
          "TextPart": body
        }
      ]
    })
  request
    .then((result) => {
      return true;
    })
    .catch((err) => {
      return error;
    })
}

module.exports = emailSender;
