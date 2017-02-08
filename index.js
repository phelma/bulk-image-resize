'use strict';

let inPath = '/Users/phelm/Code/pimloc/image-resize/test/';
let outPath = '/Users/phelm/Code/pimloc/image-resize/resized';
let minWidth = 512;
let minHeight = 512;
let quality = 90;
let parallel = 2;


let gm = require('gm');
let walk = require('walkdir');
let path = require('path');
let mkdirp = require('mkdirp');
let async = require('async');

let results = {
  started: 0,
  complete: 0,
  good: 0,
  bad: 0
};

let q = async.queue((task, cb) => {
  results.started ++;
  let relative = path.relative(inPath, task.file);
  let outPathObj = path.parse(path.join(outPath, relative));
  let outDir = outPathObj.dir;
  let fullOutPath = path.join(outPathObj.dir, outPathObj.name + '.jpg');
  mkdirpOnce(outDir, () => {
    gm(task.file)
      .resize(
        minWidth,
        minHeight,
        '^ >'
      )
      .noProfile()
      .quality(quality)
      .write(fullOutPath,
        (err) => {
          if (err){
            results.bad ++;
          } else {
            results.good ++;
          }
          if (++ results.complete % 100 === 0){
            console.log(`\n\n
              Started  : ${results.started}
              Complete : ${results.complete}
                    ✅  : ${results.good}
                    ❌  : ${results.bad}
            `);
          }
          cb();
        }
      );
  });
}, parallel);

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
    q.push({file});
  });




