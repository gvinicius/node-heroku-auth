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
    });
  console.log(1)
  request
    .then((result) => {
      console.log(2)
      return true;
    })
    .catch((err) => {
      console.log(err)
      return 'error';
    })
}

module.exports = emailSender;
