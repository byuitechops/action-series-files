const fileType = require('../fileType.js');
var warned = false;

module.exports = (course, file, callback) => {

    // FOR TESTING - PLEASE REMOVE IF THIS IS IN FULL TOOL
    if (!course.info.usedFiles) course.info.usedFiles = ['Guidelines for Buttons.html'];
    if (!course.info.unusedFiles) course.info.unusedFiles = [];
    course.info.canvasFolders = {
        media: 96605,
        archive: 96608,
        documents: 96606,
        template: 95921
    };
    // END TESTING

    var type = fileType(file.display_name);

    function action() {
        // ARCHIVE - move unused files into archive
        if (course.info.unusedFiles.includes(file.display_name) && course.info.canvasFolders.archive !== -1) {
            file.folder_id = `${course.info.canvasFolders.archive}`;
            // TEMPLATE - move template files into template folder
        } else if (type === 'template' && course.info.canvasFolders.template !== -1) {
            file.folder_id = `${course.info.canvasFolders.template}`;
            // ARCHIVE - move web files into the archive
        } else if (type === 'web' && course.info.canvasFolders.template !== -1) {
            file.folder_id = `${course.info.canvasFolders.template}`;
            // DOCUMENT - move documents into the documents folder
        } else if (type === 'document' && course.info.canvasFolders.documents !== -1) {
            file.folder_id = `${course.info.canvasFolders.documents}`;
            // MEDIA - move images, audio, and video into the media folder
        } else if ((type === 'image' || type === 'video' || type === 'audio') && course.info.canvasFolders.media !== -1) {
            file.folder_id = `${course.info.canvasFolders.media}`;
            // DELETE - Delete this file
        } else if (type === 'deletable') {
            file.techops.delete = true;
            file.techops.log('Deleted Files', {
                'File Name': file.display_name,
                'ID': file.id,
                'Reason': 'Unusable extension type'
            });

            callback(null, course, file);
            return;

        } else {
            course.warning(`${file.display_name} was not moved into one of the four main folders.`);
            delete file.folder_id;
        }


        if (type !== undefined) {
            file.techops.log('Moved Files', {
                'File Name': file.display_name,
                'ID': file.id,
                'New Location': `${type} folder`
            });
        }

        callback(null, course, file);
    }

    var foldersExist = Object.keys(course.info.canvasFolders).find(key => course.info.canvasFolders[key] !== -1);

    if (foldersExist === undefined && warned === false) {
        course.error(new Error('Some or all of the four main folders (documents, media, template, and archive) do not exist in the course. Cannot move files.'));
        warned = true;
    }

    /* If the file is marked to be deleted or the type is null, then ignore it */
    if (file.techops.delete === true || type === null || foldersExist !== undefined) {
        action();
    } else {
        callback(null, course, file);
    }

};