const path = require('path');

module.exports = (course, file, callback) => {
    /* If the item is marked for deletion, do nothing */
    if (file.techops.delete === true) {
        callback(null, course, file);
        return;
    }

    //array of file extensions that we are checking for
    var videoExtensions = [
        '.avi',
        '.wmv',
        '.mpg',
        '.mpeg',
        '.swf',
        '.mov',
        '.mp4',
    ];

    if (videoExtensions.includes(path.extname(file.display_name))) {
        file.techops.log('Videos in Course Files', {
            'Filename': file.display_name,
            'ID': file.id
        });
    }

    callback(null, course, file);
};