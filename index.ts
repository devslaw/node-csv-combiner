import * as readline from 'readline';
import {createReadStream} from 'fs';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/map'
import * as fs from 'fs';
import * as os from 'os';
import {EventEmitter} from 'events';

export class csvCombiner {

    fileExportDir: string;

    constructor(fileExportDir: string) {
        this.fileExportDir = fileExportDir;
    }

    combine(files: Array<{ filePath: string, columns: string[] | number[] }>) {
        return new Observable(observer => {
            const readStreams = [];
            const lineReaders = [];
            const arrOfObs$ = [];
            const combinedFileDir = this.fileExportDir;
            const combinedFileName = new Date().getTime().toString().concat('_combined.csv');
            const combinedFile = fs.createWriteStream(combinedFileDir.concat(combinedFileName), {flags: 'a'});
            const eventEmitter = new EventEmitter();

            files.map((file, index) => {
                readStreams[index] = createReadStream(file.filePath);
                lineReaders[index] = readline.createInterface({
                    input: readStreams[index]
                });

                arrOfObs$[index] = Observable.fromEvent(lineReaders[index], 'line')
                    .takeUntil(Observable.fromEvent(lineReaders[index], 'close'))
                    .concat(Observable.interval(10)
                        .map((emptyLine: any) => emptyLine = '')
                        .takeUntil(Observable.fromEvent(eventEmitter, 'processFinished')));
            });

            const zip$ = (a$) => Observable.zip(...arrOfObs$);
            zip$(arrOfObs$).subscribe(lines => {
                    if (lines.join('') === '') {
                        eventEmitter.emit('processFinished');
                    } else {
                        const combinedFileLine: Array<string> = [];
                        lines.map((line: string, index) => {
                            const file: any = files[index];
                            file.columns.map(columnIndex => {
                                const arrLine = line.split(',');
                                combinedFileLine.push(arrLine[columnIndex]);
                            });
                        });
                        combinedFile.write(combinedFileLine.join(',').concat(os.EOL), 'utf8');
                    }
                },
                error => observer.error(error),
                () => observer.next(combinedFileDir.concat(combinedFileName))
            );
        });
    }
}