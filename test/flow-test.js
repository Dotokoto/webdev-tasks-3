const sinon = require('sinon');
const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('assert');

const flow = require('../lib/flow.js');

const fs = require('fs');
const directory = '../cats';


describe('Flow.js library', function () {
    describe('Serial', function () {
        it('should call callback when functions array is empty', function () {
            var spy = sinon.spy();
            flow.serial([], spy);
            expect(spy.calledOnce);
        });
        it('should call callback when no functions left', function () {
            var spy = sinon.spy();
            flow.serial([
                function () {},
                function () {}
            ], spy);
            expect(spy.calledOnce);
        });
        it('should call second function with result of first function', function () {
            var spy = sinon.spy();
            var funcs = [
                function (cb) {
                    cb(null, 'hello');
                },
                spy
            ];
            flow.serial(funcs, function () {
                return 1;
            });
            expect(spy.calledWithExactly(null, 'hello'));
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
            expect(callback.calledWithExactly('error'));
        });
        it('should not call second function if first function return error', function () {
            var spy = sinon.spy();
            var funcs = [
                function (cb) {
                    cb('error', 1);
                },
                spy
            ];
            flow.serial(funcs, function () {
                return 1;
            });
            expect(spy.notCalled);
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
            expect(spy.calledWithExactly(null, 3));
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
            flow.serial(funcs, function () {});
            expect(spy1.calledOnce);
            expect(spy2.calledOnce);
            expect(spy3.calledOnce);
        });
    });
    describe('Parallel', function () {
        it('should call callback if functions array is empty', function () {
            var spy = sinon.spy();
            flow.parallel([], spy);
            expect(spy.calledOnce);
        });
        it('should call callback when no functions left', function () {
            var spy = sinon.spy();
            flow.parallel([
                function () {},
                function () {}
            ], spy);
            expect(spy.calledOnce);
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
            expect(callback.calledWithExactly('error'));
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
            expect(spy1.calledOnce);
            expect(spy2.calledOnce);
            expect(spy3.calledOnce);
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
            expect(spy.calledWithExactly(null, [1, 2, 3]));
        });

    });
    describe('Map', function () {
        it('should call callback when no functions left', function () {
            var spy = sinon.spy();
            flow.map([], [], spy);
            expect(spy.calledOnce);
        });
    });
});
