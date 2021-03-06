const fileType = require('../fileType.js');
var folderWarning = false;
var moveWarning = false;

module.exports = (course, file, callback) => {
    try {
        var type = fileType(file.display_name);

        function action() {
            // ARCHIVE - move unused files into archive
            if (course.info.unusedFiles.includes(file.display_name) &&
                course.info.canvasFolders.archive !== -1 &&
                course.settings.moveUnusedIntoArchive === true) {
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

        var foldersExist = false;

        if (course.settings.moveUnusedIntoArchive === false) {
            if (course.info.canvasFolders[0] !== -1 &&
                course.info.canvasFolders[1] !== -1 &&
                course.info.canvasFolders[2] !== -1) {
                foldersExist = true;
            }
        }

        if (foldersExist === false && folderWarning === false) {
            course.warning('Some or all of the four main folders (documents, media, template, and archive) do not exist in the course. Cannot move files.');
            folderWarning = true;
        }

        if (course.settings.reorganizeFiles === false && moveWarning === false) {
            course.warning('The course folder structure was not reorganized, so files will not be moved. (reorganize-file-structure)');
            moveWarning = true;
        }

        /* Ignore this item if any of the below conditions are true */
        if (file.techops.delete === true ||
            type === null ||
            foldersExist === false ||
            course.settings.reorganizeFiles === false) {
            callback(null, course, file);
        } else {
            action();
        }
    } catch (e) {
        course.error(new Error(e));
        callback(null, course, file);
    }
};

module.exports.details = {
    title: 'files-move'
}