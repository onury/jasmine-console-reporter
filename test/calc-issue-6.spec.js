const Calculator = require('./calc');

describe('Calculator (issue #6)', () => {

    it('should be a function', () => {
        expect(typeof Calculator).toEqual('function');
    });

    it('test', () => {
        expect(2).toEqual(2);
    });

    describe('add function', () => {
        let calc;
        beforeEach(() => {
            calc = new Calculator();
        });

        it('should be a function', () => {
            expect(typeof calc.add).toEqual('function');
        });
    });
});
