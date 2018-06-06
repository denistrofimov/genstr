#!/usr/bin/env node

/**
 * Created by denistrofimov on 08.08.16.
 */

const localizable = require('./lib/localizable');
const synchronize_plists = require('./lib/synchronize_plists');

const directory = process.cwd();
const command = process.argv.slice(2)[0];
const arg = process.argv.slice(2)[1];


switch (command) {
    case 'sync-version':
        synchronize_plists(directory, arg);
        break;
    case 'strings':
        console.log(localizable(directory));
        break;
}
