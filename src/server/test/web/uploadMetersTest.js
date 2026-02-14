/**
 * This file tests specifically uploadMeters.js. It's used for unit testing, not integration testting
 * and thus, only includes tests for isValidDate(), validateYear(), correctDateTimeFormat(), and isDuplicate().
 */
const { equal } = require('assert');
const { isValidDate, validateYear, correctDateTimeFormat, isDuplicate } = require('../../services/csvPipeline/uploadMeters');
const { assert } = require('chai');
const moment = require('moment');

// test for validate year
describe ("test validateYear", function() {
    let currentDate;
    let inMinRange;
    let outMinRange;
    let outMaxRange;
    
    this.beforeEach(() => {
        currentDate = moment().toDate();
        inMinRange = "1920-10-02";
        outMinRange = "0000-11-31";
        outMaxRange = "2031-05-20";
    });

    it("current date check", function() {
        const result = validateYear(currentDate);
        assert.equal(result, true);
    });
    it("1920 check", function() {
        const result = validateYear(inMinRange);
        assert.equal(result, true);
    });
    it("2031 check", function() {
        const result = validateYear(outMaxRange);
        assert.notEqual(result, true);
    });
    it("0000 check", function() {
        const result = validateYear(outMinRange);
        assert.equal(result, false);
    });
    it("9999 check", function() {
        const result = validateYear("9999-12-28");
        assert.equal(result, false);
    });
    it("valid undefined", function() {
        const result = validateYear(undefined);
        assert.equal(result, false);
    });
    it("valid null", function() {
        const result = validateYear(null);
        assert.equal(result, false);
    });
});

describe("correctDateTimeFormat test", function() {
    const dateTest1 = "2-10-0000";
    const dateTest2 = "2-1-2026";
    const dateTest3 = "2-10-3000";
    const dateTest4 = "2-10-0001";
    const dateTest5 = "2-10-9999";
    const dateTest6 = moment().format("YYYY-MM-DD"); // test current date
    const dateTest7 = moment().format("MM-DD-YYYY"); // test current date
    
    it("check 0000 -> should be valid", function() {
        const result = correctDateTimeFormat(dateTest1).value;
        assert.equal(result, true);
    });
    it("check valid date", function() {
        const result = correctDateTimeFormat(dateTest2).value;
        assert.equal(result, true);
    });
    it("check future date", function() {
        const result = correctDateTimeFormat(dateTest3).value;
        assert.equal(result, true);
    });
    it("check 0001", function() {
        const result = correctDateTimeFormat(dateTest4).value;
        assert.equal(result, true);
    });
    it("check 9999", function() {
        const result = correctDateTimeFormat(dateTest5).value;
        assert.equal(result, true);
    });
    it("check current date", function() {
        const result = correctDateTimeFormat(dateTest6).value;
        assert.equal(result, true);
    });
    it("test time format", function(){ 
        const result = correctDateTimeFormat("1998-09-30 10:2:3").value;
        assert.equal(result, true);
    });
    it("test valid date format", function(){ 
        const result = correctDateTimeFormat("1998-09-31 10:2:3").value;
        assert.equal(result, false);
    });
    it("test valid time format", function(){ 
        const result = correctDateTimeFormat("1998-09-30 10:200:300").value;
        assert.equal(result, false);
    });
    it("test valid time format nuance (60 should be 59)", function(){ 
        const result = correctDateTimeFormat("1998-09-30 10:60:59").value;
        assert.equal(result, false);
    });
    it("test valid connectors - and :", function(){ 
        const result = correctDateTimeFormat("1998 09 30 10 60 59").value;
        assert.equal(result, false);
    });
    it("test valid undefined", function(){ 
        const result = correctDateTimeFormat(undefined).value;
        assert.equal(result, false);
    });
    it("test valid null", function(){ 
        const result = correctDateTimeFormat(null).value;
        assert.equal(result, false);
    });
});

// test for is valid date
describe("test isValidDate", function() {
    it("2-10-1920, 10-1-2025 expects true", function () {
        const result = isValidDate("2-10-1920", "10-1-2025").value; 
        assert.equal(result, true);
    });
    it("2-10-0000, 10-1-2025 expects false", function () {
        const result = isValidDate("2-10-0000", "10-1-2025").value; 
        assert.notEqual(result, true);
    });
    it("02-10-1800, 10-1-2025 expects true", function () {
        const result = isValidDate("02-10-1800", "10-1-2025").value; 
        assert.equal(result, true);
    });
    it("10-2-2026, 10-2-2027 expects false", function() {
        const result = isValidDate("10-2-2026", "10-2-2027").value;
        assert.notEqual(result, true);
    });
    it("2000-09-32, 2022-09-3 expects false", function() {
        const result = isValidDate("2000-09-32", "2022-09-3").value;
        assert.notEqual(result, true);
    });
    it("2000-09-15 24:59:59, 2000-09-16 23:59:59 expects false (hours should be 23:59:59 max)", function() {
        const result = isValidDate("2000-09-15 24:59:59", "2000-09-16 23:59:59").value;
        assert.equal(result, false);
    });
    it("2000-09-15 23:59:59, 2000-09-15 23:59:58 expects false (max date before min date)", function() {
        const result = isValidDate("2000-09-15 23:59:59", "2000-09-15 23:59:58").value;
        assert.equal(result, false);
    });
    it("2000-09-15 23:59:58, 2000-09-15 23:59:59 expects true (max date after min date)", function() {
        const result = isValidDate("2000-09-15 23:59:58", "2000-09-15 23:59:59").value;
        assert.equal(result, true);
    });
    it("test random string", function() {
        const result = isValidDate("random string is here 1234:1381237").value;
        assert.equal(result, false);
    });
    it("test random number", function() {
        const result = isValidDate(12323498).value;
        assert.equal(result, false);
    });
    it("test valid undefined", function() {
        const result = isValidDate(undefined, undefined).value;
        assert.equal(result, false);
    });
    it("test valid null", function() {
        const result = isValidDate(null, null).value;
        assert.equal(result, false);
    });
});

describe("test isDuplicate", function() {
    it("number out of 1 to 9 range", function() {
        const before = isDuplicate(0);
        assert.equal(before, false);
        const after = isDuplicate(10);
        assert.equal(after, false);
        const negative = isDuplicate(-10);
        assert.notEqual(negative, true);
    });
    
    it("number within 1 to 9 range", function() {
        const low = isDuplicate(2);
        assert.equal(low, true);
        const high = isDuplicate(8);
        assert.equal(high, true);
    });
    
    it("test edges 1 and 9", function() {
        const one = isDuplicate(1);
        assert.equal(one, true);
        const nine = isDuplicate(9);
        assert.equal(nine, true);
    });
    it("valid undefined", function() {
        const result = isDuplicate(undefined);
        assert.equal(result, false);
    });
    it("valid null", function() {
        const result = isDuplicate(null);
        assert.equal(result, false);
    });
});