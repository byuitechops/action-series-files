const fileType = require('../fileType.js');

module.exports = (course, file, callback) => {
    try {
        //only add the platforms your grandchild should run in
        var validPlatforms = ['online', 'pathway'];
        var validPlatform = validPlatforms.includes(course.settings.platform);

        /* If the item is marked for deletion, do nothing */
        if (file.techops.delete === true || validPlatform !== true) {
            callback(null, course, file);
            return;
        }

        var courseCode = course.info.fileName.split(' ');
        courseCode = courseCode[0] + courseCode[1];
        courseCode = courseCode.toLowerCase().replace(/\s+/g, '');
        courseCode = courseCode.replace(/:/g, '');

        function action() {

            /* Get each part of the current file name */
            var words = file.display_name.toLowerCase().split(' ');
            var adjustedName;

            if (words.length == 1) {
                adjustedName = file.display_name;
            } else {
                /* For each word, make it camelCase */
                words.forEach((word, index) => {
                    if (index != 0) {
                        words[index] = word.charAt(0).toUpperCase() + word.slice(1);
                    }
                });

                adjustedName = words.join('');
            }

            var type = fileType(file.display_name);

            if (type !== null && type !== 'template') {
                var originalName = file.display_name;
                file.display_name = `${courseCode}_${type}_${adjustedName}`;
            } else {
                callback(null, course, file);
                return;
            }

            file.techops.log('File Names Changed', {
                'Name': originalName,
                'New Name': file.display_name,
                'ID': file.id
            });
            callback(null, course, file);
        }

        action();
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, file);
    }
};