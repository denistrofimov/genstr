#!/usr/bin/env node

/**
 * Created by denistrofimov on 08.08.16.
 */

var fs = require('fs');
var _ = require('lodash');
var path = require('path');


var localizedStringComment = /NSLocalizedString\("([^"]*)",\s*"([^"]*)"\s*\)/mg;
var localizedStringNil = /NSLocalizedString\("([^"]*)",\s*nil\s*\)/mg;

var localizedStringCommentSwift = /NSLocalizedString\("([^"]*)",\s*comment:\s*"([^"]*)"\s*\)/mg;
var localizedStringNilSwift = /NSLocalizedString\("([^"]*)",\s*comment:\s*nil\s*\)/mg;

var localized = /Localized\("([^"]*)"[^\n\r]*\)/gm;
var localizedSwift2 = /"([^"]*)".localized\(\)/gm;
var localizedSwift4 = /"([^"]*)".localized/gm;
var localizedSwift2WithFormat = /"([^"]*)".localizedFormat\([^\n\r]*\)/gm;

var matches = [localizedStringComment, localizedStringNil, localizedStringCommentSwift, localizedStringNilSwift, localized, localizedSwift2, localizedSwift4, localizedSwift2WithFormat];

var utils = require('./lib/utils');

var directory = process.argv.slice(2)[0] || process.cwd();

var files = utils.fetch_files_recursive(directory, ['swift', 'm']);

var keys = [];

_.each(files, function (file) {

    var data = String(fs.readFileSync(file));

    var match;

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

_.each(_.groupBy(keys, 'file'), function (keys, file) {

    console.log("/** " + file + " */\n");

    _.each(keys, function (key) {

        console.log("\"" + key.key + "\" = \"" + key.key + "\"; " + (key.comment ? "// " + key.comment : "") + "\n");

    });

});