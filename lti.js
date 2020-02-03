//TODO: Write native gunzipping into script or use the 'pako' npm package
const parseString = require('xml2js').parseString
const findInFiles = require('find-in-files')
const config = require('./config')
const fs = require('fs')
const zlib = require('zlib')
const axios = require('axios')
const print = console.log
const { ConcurrencyManager } = require('axios-concurrency')

const MAX_CONCURRENT_REQUESTS = 3
const manager = ConcurrencyManager(axios, MAX_CONCURRENT_REQUESTS)

const domain = 'wcln'
const course = 52




// const getDirectories = srcPath => fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory())

const headers = {
  headers: {
    Authorization: "Bearer " + config.token
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

    let assignments = await axios.get(`https://${domain}.instructure.com/api/v1/courses/${course}/assignments?per_page=100`, headers)
      .then(response => {return response.data})

      submissions = assignments.map(async assignment => {
        try {
        found = lti.find(item => {
          decoded = item.name.replace(/&amp;/, '&')
          return decoded === assignment.name
        })
        if (found === undefined) {
          return
        } else {
          axios.put(`https://${domain}.instructure.com/api/v1/courses/${course}/assignments/${assignment.id}`,{
            "assignment": {
              "id": assignment.id,
              "description": assignment.description,
              "due_at": assignment.due_at,
              "unlock_at": assignment.unlock_at,
              "lock_at": assignment.lock_at,
              "points_possible": assignment.points_possible,
              "grading_type": assignment.grading_type,
              "assignment_group_id": assignment.assignment_group_id,
              "grading_standard_id": assignment.grading_standard_id,
              "created_at": assignment.created_at,
              "updated_at": assignment.updated_at,
              "peer_reviews": assignment.peer_reviews,
              "automatic_peer_reviews": assignment.automatic_peer_reviews,
              "position": assignment.position,
              "grade_group_students_individually": assignment.grade_group_students_individually,
              "anonymous_peer_reviews": assignment.anonymous_peer_reviews,
              "group_category_id": assignment.group_category_id,
              "post_to_sis": assignment.post_to_sis,
              "moderated_grading": assignment.moderated_grading,
              "omit_from_final_grade": assignment.omit_from_final_grade,
              "intra_group_peer_reviews": assignment.intra_group_peer_reviews,
              "anonymous_instructor_annotations": assignment.anonymous_instructor_annotations,
              "graders_anonymous_to_graders": assignment.graders_anonymous_to_graders,
              "grader_count": assignment.grader_count,
              "grader_comments_visible_to_graders": assignment.grader_comments_visible_to_graders,
              "final_grader_id": assignment.final_grader_id,
              "grader_names_visible_to_final_grader": assignment.grader_names_visible_to_final_grader,
              "allowed_attempts": assignment.allowed_attempts,
              "secure_params": assignment.secure_params,
              "course_id": assignment.course_id,
              "name": assignment.name,
              "submission_types": ["external_tool"],
              "has_submitted_submissions": assignment.has_submitted_submissions,
              "due_date_required": assignment.due_date_required,
              "max_name_length": assignment.max_name_length,
              "in_closed_grading_period": assignment.in_closed_grading_period,
              "is_quiz_assignment": assignment.is_quiz_assignment,
              "can_duplicate": assignment.can_duplicate,
              "original_course_id": assignment.original_course_id,
              "original_assignment_id": assignment.original_assignment_id,
              "original_assignment_name": assignment.original_assignment_name,
              "original_quiz_id": assignment.original_quiz_id,
              "workflow_state": assignment.workflow_state,
              "muted": assignment.muted,
              "html_url": assignment.html_url,
              "has_overrides": assignment.has_overrides,
              "needs_grading_count": assignment.needs_grading_count,
              "sis_assignment_id": assignment.sis_assignment_id,
              "integration_id": assignment.integration_id,
              "integration_data": assignment.integration_data,
              "published": assignment.published,
              "unpublishable": assignment.publishable,
              "only_visible_to_overrides": assignment.only_visible_to_overrides,
              "locked_for_user": assignment.locked_for_user,
              "submissions_download_url": assignment.submissions_download_url,
              "post_manually": assignment.post_manually,
              "anonymize_students": assignment.anonymize_students,
              "assignment_overrides": assignment.assignment_overrides,
              "publishable": assignment.publishable,
              "hidden": assignment.hidden,
              "submission_type": assignment.submission_type,
              "allowed_extensions": assignment.allowed_extensions,
              "turnitin_enabled": assignment.turnitin_enabled,
              "vericite_enabled": assignment.vericite_enabled,
              "external_tool_tag_attributes": {
                "url": `https://wcln.ca/local/lti/index.php?id=${found.id}&type=book`,
                "content_type": "",
                "content_id": "",
                "new_tab": "0"
              },
              "similarityDetectionTool": assignment.similarityDetectionTool,
              "configuration_tool_type": assignment.configuration_tool_type,
              "peer_review_count": assignment.peer_review_count,
              "peer_reviews_assign_at": assignment.peer_review_count,
              "notify_of_update": assignment.notify_of_update
            }
          } ,headers).then(response => console.log(response.status))
        }
      } catch (e) {
        console.error(e)
      }
    })
  } catch (e) {
    console.error(e)
  }
})();
