/***************************************************************************
 * Files Report Videos
 * Description: Report each file that is a video type for logging purposes
 ***************************************************************************/
const fileType = require('../fileType.js');

module.exports = (course, file, callback) => {
    try {
        //only add the platforms your grandchild should run in
        var validPlatforms = ['online', 'pathway', 'campus'];
        var validPlatform = validPlatforms.includes(course.settings.platform);

        /* If the item is marked for deletion or isn't a valid platform type, do nothing */
        if (file.techops.delete === true || validPlatform !== true) {
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