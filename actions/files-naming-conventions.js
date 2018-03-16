const path = require('path');
const fileType = require('../fileType.js');

var documentExtensions = [
    '.doc',
    '.docx',
    '.pdf',
    '.xls',
    '.xlsx',
    '.csv',
    '.odt',
    '.ods',
    '.txt',
    '.dat',
    '.log',
    '.mdb',
    '.sav',
    '.sql',
    '.tar',
    '.xlr',
    '.wpd',
    '.wks',
    '.wps',
    '.xlsm',
    '.rtf',
    '.xps',
    '.ppt',
    '.pptx',
    '.pps',
];

var imageExtensions = [
    '.png',
    '.jpeg',
    '.gif',
    '.bmp',
    '.ai',
    '.ico',
    '.jpg',
    '.ps',
    '.psd',
    '.svg',
    '.tif',
    '.tiff',
];

var videoExtensions = [
    '.avi',
    '.wmv',
    '.mpg',
    '.mpeg',
    '.swf',
    '.mov',
    '.mp4',
];

var audioExtensions = [
    '.aif',
    '.cda',
    '.mid',
    '.midi',
    '.mp3',
    '.wav',
    '.ogg',
    '.wma',
    '.wpl',
];

var templateExtensions = [
    'dashboard.jpg',
    'homeImage.jpg',
    'courseBanner.jpg'
];

module.exports = (course, file, callback) => {

    /* If the item is marked for deletion, do nothing */
    if (file.techops.delete === true) {
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

        var type = fileType(file);

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

};
