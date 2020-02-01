//TODO: Write native gunzipping into script or use the 'pako' npm package
const parseString = require('xml2js').parseString
const findInFiles = require('find-in-files')
const token = require('./config')
const fs = require('fs')
const zlib = require('zlib')
const print = console.log

const domain = ''



// const getDirectories = srcPath => fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory())

const headers = {
  headers: {
    "User-Agent": "Request-Promise",
    Authorization: "Bearer " + token
   }
};

(async () => {
  try {
    const idRegex = /(?<=<lti id=").*\d(?=">)/
    const nameRegex = /(?<=<name>).*(?=<\/name>)/

    const lti = []

    await findInFiles
    .find({'term': "(?=<lti id).*?<\/name>", 'flags': 'gms'}, './Physics_11_(ph11)-20191121-0109-nu', '.xml$')
    .then(results => {
        for (var result in results) {
            var res = results[result];
            let id = res.matches[0].match(idRegex)
            let name = res.matches[0].match(nameRegex)
            data = {
              id: id[0],
              name: name[0]
            }
            lti.push(data)
        }
    });

    //get list of assignments
    //search assignment on name
    //once assignment is found change submission type to external tool
    //once submission type is changed, insert lti id into post request
    //lti creations should be complete
    console.log(lti)







  } catch (e) {
    console.error(e)
  }
})();

// axios.post(`https://${domain}.instructure.com/api/v1/courses/${course.course_id}/external_tools`, {
//   data :{
//     name: course.name,
//     consumer_key: course.key,
//     shared_secret: course.secret,
//     url: course.url,
//     domain: course.domain,
//     custom_fields: {
//       template_id: template_id,
//       group_id: group_id
//     }
//   }
// }, headers )