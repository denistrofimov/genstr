/**
 * Created by denistrofimov on 08.08.16.
 */

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const StringsFile = require('strings-file');
const utils = require('./utils');

const localizedStringComment = /NSLocalizedString\("([^"]*)",\s*"([^"]*)"\s*\)/mg;
const localizedStringNil = /NSLocalizedString\("([^"]*)",\s*nil\s*\)/mg;

const localizedStringCommentSwift = /NSLocalizedString\("([^"]*)",\s*comment:\s*"([^"]*)"\s*\)/mg;
const localizedStringNilSwift = /NSLocalizedString\("([^"]*)",\s*comment:\s*nil\s*\)/mg;

const localized = /Localized\("([^"]*)"[^\n\r]*\)/gm;
const localizedSwift2 = /"([^"]*)".localized\(\)/gm;
const localizedSwift4 = /"([^"]*)".localized/gm;
const localizedSwift2WithFormat = /"([^"]*)".localizedFormat\([^\n\r]*\)/gm;

const matches = [
    localizedStringComment,
    localizedStringNil,
    localizedStringCommentSwift,
    localizedStringNilSwift,
    localized,
    localizedSwift2,
    localizedSwift4,
    localizedSwift2WithFormat];

module.exports = function localizable(directory) {

    const files = utils.fetch_files_recursive(directory, ['swift', 'm'], ['Pods']);

    let keys = [];

    _.each(files, function (file) {
        const data = String(fs.readFileSync(file));
        let match;
        _.each(matches, function (matcher) {
            while ((match = matcher.exec(data)) !== null) {
                keys.push({
                    key: match[1],
                    comment: match[2],
                    file: path.relative(directory, file)
                });
            }
        });
        keys = _.uniqBy(keys, 'key')
    });

    const existing = utils.fetch_files_recursive(directory, ['strings'], ['Pods']);

    let ex = [];

    _.each(existing, file => {
        const data = String(fs.readFileSync(file));
        const entities = StringsFile.parse(data);
        ex.push(...Object.keys(entities));
    });

    return _.chain(keys).groupBy('file').map(function (keys, file) {
        let _keys = _.filter(keys, key => ex.indexOf(key.key) === -1);
        if (!_keys.length)
            return "";
        return _.reduce(_keys, (acc, key) => {
            return acc + `"${key.key}" = "${key.key}"; ${key.comment ? `// ${key.comment}` : ``}\n`;
        }, `/** ${file} */\n\n`) + `\n`;
    }).value().join("");
};