'use strict';
/* --execute=node-- */

//---------//
// Imports //
//---------//

var fileTree = require('file-size-tree')
    , b = require('browserify')()
    , bFs = require('fs-bluebird')
    , startsWith = require('starts-with')
    , through = require('through2')
    , lodash = require('lodash')
    , beautify_html = require('js-beautify').html
    , path = require('path')
    , cp = require('cp');


//------//
// Main //
//------//

function BFST() {
    var self = this;

    var my = {
        entrance: null
    };

    self.Entrance = function(entrance_) {
        var res = my.Entrance;
        if (arguments.length > 0) {
            if (entrance_ !== null) {
                BFST.ValidateEntrance(entrance_, true);
            }
            my.Entrance = entrance_;
            res = self;
        }
        return res;
    };
}


//--------------------//
// Validation Methods //
//--------------------//

BFST.ValidateEntrance = function(input, throwErr) {
    var msg = '';
    if (typeof input !== 'string') {
        msg = 'Invalid Argument: <BFST>.ValidateEntrance requires a typeof string argument';
    } else if (!bFs.existsSync(input)) {
        msg = "file: '" + input + "' doesn't exist";
        return;
    }

    if (throwErr && msg) {
        throw new Error(msg);
    }

    return msg;
};


//-----------------------//
// Prototyped Extensions //
//-----------------------//

BFST.prototype.GenerateFileSizeTree = function() {
    var self = this;

    // if file is not absolute and not explicitly relative, then force it to be relative
    if (!startsWith(self.Entrance(), '/')
        && !startsWith(self.Entrance(), './')) {

        self.Entrance('./' + self.Entrance());
    }

    var files = [];
    b.add(self.Entrance());
    b.pipeline.get('deps').push(through.obj(
        function(row, enc, next) {
            files.push(row.file || row.id);
            next();
        }
    ));

    b.bundle(function(err, buf) {
        if (err) {
            throw err;
        }

        // remove the root file which happens to be the last item in the list
        var root = files.pop();

        var ftResult = fileTree(files);
        var totalBytes = attachDirectorySizes(ftResult);
        attachPercentages(ftResult, totalBytes);

        ftResult.sort(function(left, right) {
            return right.size - left.size;
        });

        ftResult = sortTree(ftResult);

        var kb = (totalBytes / 1024).toFixed(2);
        var htmlRes = '<div class="root"><div class="row">';
        htmlRes += '<span class="name">' + root + '</span><span class="size" data-bytes="' + totalBytes + '">' + kb + ' KB</span></div><ul class="children">';
        htmlRes += generateHtml(ftResult);
        htmlRes += '</ul></div>';
        var htmlTemplate = bFs.readFileSync('./template.erb');

        var compiledTemplate = lodash.template(htmlTemplate, {
            imports: {
                fileSizeTree: htmlRes
            }
        })();
        compiledTemplate = beautify_html(compiledTemplate, {
            indent_size: 2
        });
        var rootDest = './file-size-tree';
        bFs.mkdirSync(rootDest);
        bFs.writeFileSync(path.join(rootDest, 'index.html'), compiledTemplate);
        bFs.mkdirSync(path.join(rootDest, 'static'));
        var rootSrc = path.join(__dirname, 'bin/static');
        rootDest = path.join(root, 'resources');
        cp.sync(path.join(rootSrc, 'normalize.css'), path.join(root, 'normalize.css'));
        cp.sync(path.join(rootSrc, 'fonts.css'), path.join(root, 'fonts.css'));
        cp.sync(path.join(rootSrc, 'styles.css'), path.join(root, 'styles.css'));
        cp.sync(path.join(rootSrc, 'jquery-2.1.3.min.js'), path.join(root, 'jquery-2.1.3.min.js'));
        cp.sync(path.join(rootSrc, 'gsap-1.16.1-CSSPlugin.min.js'), path.join(root, 'gsap-1.16.1-CSSPlugin.min.js'));
        cp.sync(path.join(rootSrc, 'gsap-1.16.1-EasePack.min.js'), path.join(root, 'gsap-1.16.1-EasePack.min.js'));
        cp.sync(path.join(rootSrc, 'gsap-1.16.1-TweenLite.min.js'), path.join(root, 'gsap-1.16.1-TweenLite.min.js'));
        cp.sync(path.join(rootSrc, 'main.browserified.js'), path.join(root, 'main.browserified.js'));
        console.log('Finished - open ./file-size-tree/index.html in your favorite browser to see the result.');
    });
};


//-----------------//
// Private Helpers //
//-----------------//

function sortTree(files) {
    files.forEach(function(file) {
        if (file.children) {
            file.children = sortTree(file.children);
        }
    });

    return files.sort(function(left, right) {
        return right.size - left.size;
    });
}

function generateHtml(files) {
    var res = '';

    files.forEach(function(file) {
        var bytes = file.size;
        var kb = (bytes / 1024).toFixed(2);
        if (file.children) {
            res += '<li class="directory">';
            res += '<div class="row"><span class="name">' + file.name + '</span><span class="size" data-bytes="' + bytes + '">' + kb + ' KB</span><span class="percentage">' + file.percentage + '</span>';
            res += '<span class="percentage-bar"><span class="fill"></span></span></div><ul class="children">';
            res += generateHtml(file.children);
            res += '</ul></li>';
        } else {
            res += '<li class="row file"><span class="name">' + file.name + '</span><span class="size" data-bytes="' + bytes + '">' + kb + ' KB</span><span class="percentage">' + file.percentage + '</span></li>';
        }
    });

    return res;
}

function attachDirectorySizes(files) {
    files = files.map(function(file) {
        if (file.children) {
            file.size = attachDirectorySizes(file.children);
        }

        return file;
    });

    return files.reduce(function(prev, cur) {
        return prev + cur.size;
    }, 0);
}

function attachPercentages(files, totalBytes) {
    files = files.map(function(file) {
        if (file.children) {
            attachPercentages(file.children, totalBytes);
        }

        file.percentage = (file.size / totalBytes * 100).toFixed(2);
    });
}


//---------//
// Exports //
//---------//

module.exports = BFST;
