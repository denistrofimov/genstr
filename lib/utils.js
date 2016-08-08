/**
 * Created by denistrofimov on 08.08.16.
 */

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = {

    fetch_files_recursive: fetch_files_recursive

};

function inspect(directory, container) {
    if (!fs.lstatSync(directory).isDirectory())
        return [];
    container = container || [];
    fs.readdirSync(directory).forEach(function (file) {
        file = path.join(directory, file);
        if (fs.lstatSync(file).isDirectory())
            return inspect(file, container);
        container.push(file);
    });
    return container;
}


function fetch_files_recursive(directory, extensions) {

    var extension = new RegExp('\.(' + extensions.join('|') + ")$");

    return _.filter(inspect(directory), function (file) {
        return extension.test(file)
    })

}