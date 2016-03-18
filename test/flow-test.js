const sinon = require('sinon');
const flow = require('../lib/flow.js');

describe('Flow.js library', function () {
    describe('Serial', function () {
        it('should call callback when functions array is empty', function () {
            var spy = sinon.spy();
            flow.serial([], spy);
            sinon.assert.calledOnce(spy);
        });
        it('should call callback when no functions left', function () {
            var spyCb = sinon.spy(function () {
                sinon.assert.spyCb.calledAfter(spySerial1);
                sinon.assert.spyCb.calledAfter(spySerial2);
            });
            var spySerial1 = sinon.spy(function (cb) {
                setTimeout(function () {
                    cb(null, 1);
                }, 200);
            });
            var spySerial2 = sinon.spy(function (cb) {
                setTimeout(function () {
                    cb(null, 1);
                }, 500);
            });
            flow.serial([
                spySerial1,
                spySerial2
            ], spyCb);
        });
        it('should call second function with result of first function', function () {
            var spy = sinon.spy(function (data, cb) {
                setTimeout(function () {
                    cb(null);
                    sinon.assert.spy.calledWithExactly(null, '1');
                }, 700);
            });
            var funcs = [
                function (cb) {
                    setTimeout(function () {
                        cb(null, '1');
                    }, 200);
                },
                spy
            ];
            flow.serial(funcs, function () {});

        });
        it('should call main callback if first function return error', function () {
            var serial2 = sinon.spy(function (cb) {
                setTimeout(function () {
                    cb(null, 2);
                }, 100);
            });
            var callback = sinon.spy(function () {
                sinon.assert.callback.calledWith('error');
                sinon.assert.notCalled(serial2);
            });
            var funcs = [
                function (cb) {
                    setTimeout(function () {
                        cb(true, 1);
                    }, 50);
                },
                serial2
            ];
            flow.serial(funcs, callback);
        });
        it('should run all functions in array and pass last result to callback', function () {
            var funcs = [
                function (cb) {
                    setTimeout(function () {
                        cb(null, 1);
                    }, 150);
                },
                function (data, cb) {
                    setTimeout(function () {
                        cb(null, data + 2);
                    }, 100);
                },
                function (data, cb) {
                    setTimeout(function () {
                        cb(null, data + 3);
                    }, 50);
                }
            ];
            var spy1 = sinon.spy(funcs[0]);
            var spy2 = sinon.spy(funcs[1]);
            var spy3 = sinon.spy(funcs[2]);
            var spy = sinon.spy(function () {
                sinon.assert.calledOnce(spy1);
                sinon.assert.calledOnce(spy2);
                sinon.assert.calledOnce(spy3);
                sinon.assert.spy.calledWithExactly(null, 6);
            });
            flow.serial(funcs, spy);
        });
    });
    describe('Parallel', function () {
        it('should call callback if functions array is empty', function () {
            var spy = sinon.spy();
            flow.parallel([], spy);
            sinon.assert.calledOnce(spy);
        });
        it('should call main callback if one of the functions return error', function () {
            var spyCb = sinon.spy(function () {
                assert(spyCb.calledWith('error'));
            });
            var funcs = [
                function (cb) {
                    setTimeout(function () {
                        cb('error', 1);
                    }, 150);
                },
                function (cb) {
                    setTimeout(function () {
                        cb(null, 2);
                    }, 50);
                }
            ];
            flow.parallel(funcs, spyCb);
        });
        it('should run all functions in array and call main callback' +
            ' with array of results of all functions', function () {
            var spy1 = sinon.spy(
                function (cb) {
                    setTimeout(function () {
                        cb(null, 1);
                    }, 100);
                }
            );
            var spy2 = sinon.spy(
                function (cb) {
                    setTimeout(function () {
                        cb(null, 2);
                    }, 50);
                }
            );
            var spy3 = sinon.spy(
                function (cb) {
                    setTimeout(function () {
                        cb(null, 3);
                    }, 150);
                }
            );
            var funcs = [
                spy1,
                spy2,
                spy3
            ];
            var spyCb = sinon.spy(function (err, results) {
                sinon.assert.spyCb.calledAfter(spy1);
                sinon.assert.spyCb.calledAfter(spy2);
                sinon.assert.spyCb.calledAfter(spy3);
                sinon.assert.spyCb.calledWithExactly(null, [1, 2, 3]);
            });
            flow.parallel(funcs, spyCb);
        });
    });
    describe('Map', function () {
        it('should call callback when values array is empty', function () {
            var spy = sinon.spy();
            flow.map([], function () {}, spy);
            sinon.assert.calledOnce(spy);
        });
        it('should call function with all values', function () {
            var spy = sinon.spy(function (err, value) {
                setTimeout(function () {}, value);
            });
            flow.map(
                [100, 50, 150],
                spy,
                function () {
                    sinon.assert.calledThrice(spy);
                    sinon.assert.spy.calledWith(1);
                    sinon.assert.spy.calledWith(2);
                    sinon.assert.spy.calledWith(3);
                }
            );
        });
        it('should call callback with array of results of all function calls', function () {
            var spy = sinon.spy(function () {
                assert(spy.calledWithExactly(null, [1,2,3]));
            });
            flow.map(
                [1, 2, 3],
                function (value, cb) {
                    setTimeout(function () {
                        cb(null, value);
                    });
                },
                spy);
        });

    });
});
