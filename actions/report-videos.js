const path = require('path');

module.exports = (course, file, callback) => {
    /* If the item is marked for deletion, do nothing */
    if (file.techops.delete === true) {
        callback(null, course, file);
        return;
    }

    //array of file extensions that we are checking for 
    var videoFilesExtensions = [
        '.avi',
        '.wmv',
        '.mpg',
        '.mpeg',
        '.swf',
        '.mov',
        '.mp4',
    ];

    if (videoFilesExtensions.contains(path.extname(file))) {
        //only need to log for now.
        file.techops.log(`Videos in course: `, {
            'File Name': path.basename(file),
            'File Location': path.dirname(file)
        });
    }

    callback(null, course, file);
};