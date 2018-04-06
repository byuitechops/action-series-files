module.exports = (course, file, callback) => {

    /* Pages to be deleted, in LOWER case */
    var doomedItems = [
        /smallBanner.jpg/i,
        /largeBanner.jpg/i,
        /world\s*map.jpg/i,
        /guidelines\s*for\s*button/gi,
        /course\s*search\s*tool/gi,
        /course\s*maintenance\s*request/gi,
        /copyright\s*permission/gi,
        /copyediting\s*style\s*sheet/gi,
        /discussion\sforums/gi,
        /setup\s*notes\s*for\s*development\s*team/gi,
        /how\s*to\s*understand\s*due\s*date(s)*/gi,
        /course\s*schedule\d*\D*archived)?/gi,
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

    /* If the file is one of the doomed items or is in the list of USED files, delete it */
    if (typeof found != 'undefined' ||
        (course.info.usedFiles &&
            course.info.usedFiles.includes(file.display_name) &&
            file.display_name.includes('.html'))) {
        action();
    } else {
        callback(null, course, file);
    }

};