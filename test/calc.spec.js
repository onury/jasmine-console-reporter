
const Calculator = require('./calc');

(function () {
    'use strict';

    describe('Calculator Suite', function () {
        var calculator,
            a = 10,
            b = 2;

        beforeAll(function () {
            calculator = new Calculator();
        });

        it('should add numbers', function () {
            var result = calculator.add(a, b);
            expect(result).toEqual(11);
            // this is a custom matcher implemented within our helper.
            expect(result).toBePositive();
        });
        it('should execute async spec...', function (done) {
            var result = calculator.add(a, b);
            setTimeout(function () {
                expect(result).toEqual(12);
                done();
            }, 2000);
        });
        it('should subtract numbers', function () {
            var result = calculator.subtract(a, b);
            expect(result).toEqual(8);
            // this is another custom matcher implemented within our helper.
            expect(result).toBePositive();
            pending();
        });
        // it('should divide numbers', function () {
        //     var result = calculator.divide(a, b);
        //     expect(result).toEqual(0); // should be 5 so this will throw
        // });
        it('should multiply numbers', function () {
            var result = calculator.multiply(a, b);
            expect(result).toEqual(20);
            pending('this is the pending reason');
        });

    });

})();
