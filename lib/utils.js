/**
 * Created by denistrofimov on 08.08.16.
 */

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = {

    fetch_files_recursive: fetch_files_recursive

};

/**
 *
 * @param directory
 * @param container
 * @param ignore Array<String>
 * @returns {*}
 */
function inspect(directory, container, ignore) {
    if (!fs.lstatSync(directory).isDirectory())
        return [];

    if (ignore && ignore.indexOf(path.basename(directory)) !== -1) {
        // console.log(directory, 'ignored');
        return [];
    }

    container = container || [];
    fs.readdirSync(directory).forEach(function (file) {
        file = path.join(directory, file);
        if (fs.lstatSync(file).isDirectory())
            return inspect(file, container, ignore);
        container.push(file);
    });
    return container;
}


function fetch_files_recursive(directory, extensions, ignore) {

    var extension = new RegExp('\.(' + extensions.join('|') + ")$");

    return _.filter(inspect(directory, [], ignore), function (file) {
        return extension.test(file)
    })

}