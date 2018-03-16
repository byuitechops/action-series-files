const fileType = require('../fileType.js');

module.exports = (course, file, callback) => {

    var type = fileType(file);

    function action() {

        if (course.info.unusedFiles.includes(file.display_name)) {
            file.parent_folder_id = course.info.canvasFolders.archive;
        } else if (type === 'template') {
            file.parent_folder_id = course.info.canvasFolders.template;
        } else if (type === 'document') {
            file.parent_folder_id = course.info.canvasFolders.documents;
        } else if (type === 'image' || type === 'video' || type === 'audio') {
            file.parent_folder_id = course.info.canvasFolders.media;
        } else {
            delete file.parent_folder_id;
        }

        callback(null, course, file);
    }


    /* If the file is marked to be deleted or the type is null, then ignore it */
    if (file.techops.delete === true || type === null) {
        action();
    } else {
        callback(null, course, file);
    }

};
