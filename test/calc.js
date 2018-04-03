module.exports = (() => {
    'use strict';

    function Calculator() {}

    Calculator.prototype.add = (a, b) => {
        return a + b;
    };
    Calculator.prototype.subtract = (a, b) => {
        return a - b;
    };
    Calculator.prototype.divide = (a, b) => {
        return a / b;
    };
    Calculator.prototype.multiply = (a, b) => {
        return a * b;
    };

    return Calculator;

})();
