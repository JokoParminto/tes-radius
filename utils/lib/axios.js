const axios = require('axios')

exports.notif = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    Authorization: 'key=AAAA1mL9H98:APA91bGAmH2dlPUqELsa4nlrTlYjCMVQioS4SaqtwosPYWkMxYTGvfooY7-XTIY55uMHm76b_Zv36KMfIVRTRQIBI80OMBiIJtSlP0LLxzp_ahvTC5ocdGG1lL1Z41mkRn4FgvhGuOnd'
  }
})