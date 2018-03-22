const fileType = require('../fileType.js');

module.exports = (course, file, callback) => {
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
};