"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const chai = require("chai");
describe('CSV combiner', () => {
    it('it should create a new combined csv file and return path', (done) => {
        const combiner = new index_1.csvCombiner(__dirname + '/files/');
        combiner.combine([{ filePath: __dirname + '/files/dataset1.csv', columns: [0, 3, 4] },
            { filePath: __dirname + '/files/dataset2.csv', columns: [1, 2, 3] }])
            .subscribe(path => {
            chai.expect(path).to.be.a('string');
            done();
        });
    });
});
//# sourceMappingURL=test.spec.js.map