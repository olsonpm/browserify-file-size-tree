#!/usr/bin/env node

'use strict';
/* --execute=node-- */


//---------//
// Imports //
//---------//

var commander = require('commander')
    , BFST = require('../lib-core/index.js');


//------//
// Init //
//------//

var bfstInst = new BFST();


//------//
// Main //
//------//

commander
    .version('0.0.1')
    .usage('<file>')
    .parse(process.argv);

if (commander.args.length != 1) {
    console.log(commander.helpInformation());
    return;
}

bfstInst.Entrance(commander.args[0])
    .GenerateFileSizeTree();
