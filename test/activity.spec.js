(function () {
    'use strict';

    describe('Activity Test', function () {

        // if jasmine is not configured otherwise, this will timeout if more
        // than 5 seconds.
        it('should log ticks', function (done) {
            var ticks = 0,
                maxTicks = 10,
                modLog = 4;
            var timer = setInterval(function () {
                if (ticks >= maxTicks) {
                    clearInterval(timer);
                    timer = null;
                    done();
                    return;
                }
                if (ticks % modLog === 0) {
                    console.log('Log @ ' + ticks + '...');
                }
                ticks++;
            }, 200);
        });

    });

})();
