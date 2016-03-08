const sinon = require('sinon');
const should = require('chai').should();
const expect = require('chai').expect;
const assert = require('assert');

const flow = require('../lib/flow.js');

const fs = require('fs');
const directory = '../cats';


describe('Flow.js library', function () {
    describe('Serial', function () {
        it('should call callback when no functions left', function () {
            var spy = sinon.spy();
            flow.serial([], spy);
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
        it('should call callback if first function return error', function () {
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
    });
    describe('Parallel', function () {
        it('should call callback when no functions left', function () {
            var spy = sinon.spy();
            flow.parallel([], spy);
            expect(spy.calledOnce);
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
