(function () {
    'use strict';

    describe('Activity Test', function () {

        // if jasmine is not configured otherwise, this will timeout if more
        // than 5 seconds.

        it('should display activity', function (done) {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 1000);
        });

    });

})();
