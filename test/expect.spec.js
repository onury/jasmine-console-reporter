(function () {
    'use strict';

    describe('Expectation Stack Test', function () {

        it('should output expectation message (issue #3)', function () {
            throw new Error('some message');
            expect(false).toEqual(true);
        });

    });

})();
