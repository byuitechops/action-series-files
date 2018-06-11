/***************************************************************************
 * Files Report Videos
 * Description: Report each file that is a video type for logging purposes
 ***************************************************************************/
const fileType = require('../fileType.js');

module.exports = (course, file, callback) => {
    try {




        /* If the item is marked for deletion, do nothing */
        if (file.techops.delete === true) {
            callback(null, course, file);
            return;
        }

        if (fileType(file.display_name) === 'video') {
            file.techops.log('Videos in Course Files', {
                'Filename': file.display_name,
                'ID': file.id
            });
        }

        callback(null, course, file);
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, file);
    }
};

module.exports.details = {
    title: 'files-report-videos'
}