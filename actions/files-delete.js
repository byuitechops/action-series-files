module.exports = (course, file, callback) => {

    /* If the item is marked for deletion, do nothing */
    if (file.techops.delete === true) {
        callback(null, course, file);
        return;
    }

    /* Pages to be deleted, in LOWER case */
    var doomedItems = [
        /smallBanner.jpg/i,
        /largeBanner.jpg/i,
        /world\s*map.jpg/gi,
        /${course.info.courseName}banner/gi,
        /${course.info.courseName}thumbnail/gi,
    ];

    /* The test returns TRUE or FALSE - action() is called if true */
    var found = doomedItems.find(item => item.test(file.display_name));

    /* This is the action that happens if the test is passed */
    function action() {
        file.techops.delete = true;
        course.log('Files Deleted', {
            'Title': file.display_name,
            'ID': file.id
        });
        callback(null, course, file);
    }

    /* If the file is one of the doomed items or is in the list of USED files, delete it */
    if (typeof found != 'undefined' || (course.info.usedFiles && course.info.usedFiles.includes(file.display_name))) {
        action();
    } else {
        callback(null, course, file);
    }

};
