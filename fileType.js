const path = require('path');

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

module.exports = (file) => {
    var ext = path.extname(file.display_name);
    if (documentExtensions.includes(ext)) return 'document';
    if (imageExtensions.includes(ext)) return 'image';
    if (videoExtensions.includes(ext)) return 'video';
    if (audioExtensions.includes(ext)) return 'audio';
    if (templateExtensions.includes(ext)) return 'template';
    return null;
};