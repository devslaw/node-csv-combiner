"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
const fs_1 = require("fs");
const Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/of");
require("rxjs/add/observable/interval");
require("rxjs/add/observable/zip");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/operator/takeUntil");
require("rxjs/add/operator/concat");
require("rxjs/add/operator/map");
const fs = require("fs");
const os = require("os");
const events_1 = require("events");
class csvCombiner {
    constructor(fileExportDir) {
        this.fileExportDir = fileExportDir;
    }
    combine(files) {
        return new Observable_1.Observable(observer => {
            const readStreams = [];
            const lineReaders = [];
            const arrOfObs$ = [];
            const combinedFileDir = this.fileExportDir;
            const combinedFileName = new Date().getTime().toString().concat('_combined.csv');
            const combinedFile = fs.createWriteStream(combinedFileDir.concat(combinedFileName), { flags: 'a' });
            const eventEmitter = new events_1.EventEmitter();
            const emptyOb = Observable_1.Observable.interval(10);
            files.map((file, index) => {
                readStreams[index] = fs_1.createReadStream(file.filePath);
                lineReaders[index] = readline.createInterface({
                    input: readStreams[index]
                });
                arrOfObs$[index] = Observable_1.Observable.fromEvent(lineReaders[index], 'line')
                    .takeUntil(Observable_1.Observable.fromEvent(lineReaders[index], 'close'))
                    .concat(Observable_1.Observable.interval(10)
                    .map((emptyLine) => emptyLine = '')
                    .takeUntil(Observable_1.Observable.fromEvent(eventEmitter, 'processFinished')));
            });
            const zip$ = (a$) => Observable_1.Observable.zip(...arrOfObs$);
            zip$(arrOfObs$).subscribe(lines => {
                if (lines.join('') === '') {
                    eventEmitter.emit('processFinished');
                }
                else {
                    const combinedFileLine = [];
                    lines.map((line, index) => {
                        const file = files[index];
                        file.columns.map(columnIndex => {
                            const arrLine = line.split(',');
                            combinedFileLine.push(arrLine[columnIndex]);
                        });
                    });
                    combinedFile.write(combinedFileLine.join(',').concat(os.EOL), 'utf8');
                }
            }, error => observer.error(error), () => observer.next(combinedFileDir.concat(combinedFileName)));
        });
    }
}
exports.csvCombiner = csvCombiner;
//# sourceMappingURL=index.js.map