/******************************************************************************
 * Files Delete
 * Description: Create an array of file names and set their delete 
 * attribute on the TechOps class to true. If the delete attribute is set to 
 * true, the file will be deleted in action-series-master main.js 
 ******************************************************************************/
module.exports = (course, file, callback) => {
    try {
        //only add the platforms your grandchild should run in
        var validPlatforms = ['online', 'pathway'];
        var validPlatform = validPlatforms.includes(course.settings.platform);

        /* Pages to be deleted, in LOWER case */
        var doomedItems = [
            /smallBanner\.jpg/i,
            /largeBanner\.jpg/i,
            /world\s*map\.jpg/i,
            /guidelines\s*for\s*button/gi,
            /course\s*search\s*tool/gi,
            /course\s*maintenance\s*request/gi,
            /copyright\s*permission/gi,
            /copyediting\s*style\s*sheet/gi,
            /discussion\sforums/gi,
            /setup\s*notes\s*for\s*development\s*team/gi,
            /how\s*to\s*understand\s*due\s*date(s)*/gi,
            /course\s*schedule/gi,
            new RegExp(`${course.info.courseName}banner`, 'i'),
            new RegExp(`${course.info.courseName}thumbnail`, 'i'),
        ];

        /* The test returns TRUE or FALSE - action() is called if true */
        var found = doomedItems.find(item => item.test(file.display_name));

        /* This is the action that happens if the test is passed */
        function action() {
            file.techops.delete = true;
            file.techops.log('Files Deleted', {
                'Title': file.display_name,
                'ID': file.id
            });
            callback(null, course, file);
        }

        function checkDupe() {
            if (!course.info.usedFiles) {
                return false;
            }
            var usedFiles = course.info.usedFiles.map(usedFile => usedFile.name);
            return usedFiles.includes(file.display_name) &&
                file.display_name.includes('.html');
        }

        /* Conditions - if any are met, skip this item */
        if (checkDupe() === true || (found !== undefined && validPlatform === true)) {
            action();
        } else {
            callback(null, course, file);
        }
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, file);
    }
};

module.exports.details = {
    title: 'files-delete'
}