const sinon = require('sinon');
const should = require('chai').should();
const assert = require('assert');

const flow = require('../lib/flow.js');

const fs = require('fs');
const directory = '../cats';


describe('Flow.js library', function () {
    describe('Serial', function () {
        it('should call callback when functions array is empty', function () {
            var spy = sinon.spy();
            flow.serial([], spy);
            assert(spy.calledOnce);
        });
        it('should call callback when no functions left', function () {
            var spy = sinon.spy();
            flow.serial([
                function (cb) {
                    cb();
                },
                function (data, cb) {
                    cb();
                }
            ], spy);
            assert(spy.calledOnce);
        });
        it('should call second function with result of first function', function () {
            var spy = sinon.spy();
            var funcs = [
                function (cb) {
                    cb(null, 'hello');
                },
                spy
            ];
            flow.serial(funcs, function () {});
            assert(spy.calledWith('hello'));
        });
        it('should call main callback if first function return error', function () {
            var callback = sinon.spy();
            var funcs = [
                function (cb) {
                    cb('error', 1);
                },
                function (cb) {
                    cb(null, 2);
                }
            ];
            flow.serial(funcs, callback);
            assert(callback.calledWith('error'));
        });
        it('should not call second function if first function return error', function () {
            var spy = sinon.spy();
            var funcs = [
                function (cb) {
                    cb('error', 1);
                },
                function (cb) {
                    cb(null, 2);
                },
                spy
            ];
            flow.serial(funcs, function () {
                return 1;
            });
            assert(spy.notCalled);
        });
        it('should pass last result to callback', function () {
            var funcs = [
                function (cb) {
                    cb(null, 1);
                },
                function (data, cb) {
                    cb(null, 2);
                },
                function (data, cb) {
                    cb(null, 3);
                }
            ];
            var spy = sinon.spy();
            flow.serial(funcs, spy);
            assert(spy.calledWithExactly(null, 3));
        });
        it('should run all functions in array', function () {
            var funcs = [
                function (cb) {
                    cb(null, 1);
                },
                function (data, cb) {
                    cb(null, 2);
                },
                function (data, cb) {
                    cb(null, 3);
                }
            ];
            var spy1 = sinon.spy(funcs[0]);
            var spy2 = sinon.spy(funcs[1]);
            var spy3 = sinon.spy(funcs[2]);
            flow.serial([spy1, spy2, spy3], function () {});
            assert(spy1.calledOnce);
            assert(spy2.calledOnce);
            assert(spy3.calledOnce);
        });
    });
    describe('Parallel', function () {
        it('should call callback if functions array is empty', function () {
            var spy = sinon.spy();
            flow.parallel([], spy);
            assert(spy.calledOnce);
        });
        it('should call callback when no functions left', function () {
            var spy = sinon.spy();
            flow.parallel([
                function (cb) {
                    cb();
                },
                function (cb) {
                    cb();
                }
            ], spy);
            assert(spy.calledOnce);
        });
        it('should call main callback if first function returns error', function () {
            var callback = sinon.spy();
            var funcs = [
                function (cb) {
                    cb('error', 1);
                },
                function (cb) {
                    cb(null, 2);
                }
            ];
            flow.parallel(funcs, callback);
            assert(callback.called);
        });
        it('should run all functions in array', function () {
            var spy1 = sinon.spy();
            var spy2 = sinon.spy();
            var spy3 = sinon.spy();
            var funcs = [
                spy1,
                spy2,
                spy3
            ];
            flow.parallel(funcs, function () {});
            assert(spy1.calledOnce);
            assert(spy2.calledOnce);
            assert(spy3.calledOnce);
        });
        it('should call main callback with array of results of all functions', function () {
            var spy = sinon.spy();
            var funcs = [
                function (cb) {
                    cb(null, 1);
                },
                function (cb) {
                    cb(null, 2);
                },
                function (cb) {
                    cb(null, 3);
                }
            ];
            flow.parallel(funcs, spy);
            assert(spy.calledWithExactly(null, [1, 2, 3]));
        });

    });
    describe('Map', function () {
        it('should call callback when values array is empty', function () {
            var spy = sinon.spy();
            flow.map([], function () {}, spy);
            assert(spy.calledOnce);
        });
        it('should call callback when no values left', function () {
            var spy = sinon.spy();
            flow.map(
                [1, 2],
                function (value, cb) {
                    cb(null, value);
                },
            spy);
            assert(spy.calledOnce);
        });
        it('should call function with all values', function () {
            var spy = sinon.spy();
            flow.map(
                [1, 2, 3],
                spy,
                function () {}
            );
            assert(spy.calledThrice);
            assert(spy.calledWith(1));
            assert(spy.calledWith(2));
            assert(spy.calledWith(3));
        });
        it('should call callback with array of results of all function calls', function () {
            var spy = sinon.spy();
            flow.map(
                [1, 2, 3],
                function (value, cb) {
                    cb(null, value);
                },
                spy);
            assert(spy.calledWithExactly(null, [1,2,3]));
        });

    });
});
