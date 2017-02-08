'use strict';

let inPath = '/Users/phelm/Code/pimloc/image-resize/test/';
let outPath = '/Users/phelm/Code/pimloc/image-resize/resized';
let minWidth = 512;
let minHeight = 512;
let quality = 90;

let gm = require('gm');
let walk = require('walkdir');
let path = require('path');
let mkdirp = require('mkdirp');

let mkdirpOnce = (path, cb) => {
  this.made = this.made || [];
  if (this.made.indexOf(path) < 0){
    this.made.push(path);
    mkdirp(path, cb);
  } else {
    cb();
  }
};

walk(inPath)
  .on('file', (file, stat) => {
    let relative = path.relative(inPath, file);
    let outPathObj = path.parse(path.join(outPath, relative));
    let outDir = outPathObj.dir;
    let fullOutPath = path.join(outPathObj.dir, outPathObj.name + '.jpg');
    mkdirpOnce(outDir, () => {
      gm(file)
        .resize(
          minWidth,
          minHeight,
          '^ >'
        )
        .noProfile()
        .quality(90)
        .write(fullOutPath,
          (err) => {
            if (err){
              console.log('SKIPPED', file);
            } else {
              console.log('DONE   ', file);
            }
          }
        );
    });
  });




