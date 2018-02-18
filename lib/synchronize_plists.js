const utils = require('./utils');
const plist = require('plist');
const fs = require('fs');
const _ = require('lodash');

module.exports = function synchronize_plists(directory, version) {
    const files = utils.fetch_files_recursive(directory, ['plist'], ['Pods']);
    _.each(files, file => {
        let obj = plist.parse(fs.readFileSync(file, 'utf8'));
        if (obj.CFBundleVersion){
            obj.CFBundleVersion = version;
            fs.writeFileSync(file, plist.build(obj));
        }
    });
};