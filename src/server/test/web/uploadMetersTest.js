const { expect } = require('chai');
const { validateGap, validateVariation, validateMaxError, validateArea, isValidAreaUnit } = require('../../services/csvPipeline/uploadMeters.js');

//const validateMaxError = uploadMeters.validateMaxError;
//const validateArea = uploadMeters.validateArea;


/*VALIDATE GAP
If ''
If undefined...
If null
If "50"
If "potato"
If -5
If 50
*/

describe('validateGap Logic', function() {
    //Valid
    it("Should pass if gap is empty", function() {
        const result = validateGap('',0);
        expect(result.value).to.equal(true);
        expect(result.gapMsg).to.equal('');
    });

    it("Should pass if gap is null", function() {
        const result = validateGap(null, 0);
        expect(result.value).to.equal(true);
        expect(result.gapMsg).to.equal('');
    });

    it("Should pass if gap is undefined", function() {
        const result = validateGap(undefined, 0);
        expect(result.value).to.equal(true);
        expect(result.gapMsg).to.equal('');
    });
    it("Should pass if gap is a numeric string", function() {
        const result = validateGap("50", 0);
        expect(result.value).to.equal(true)
        expect(result.gapMsg).to.equal('');
    });

    it("Should pass if gap is a positive number",function() {
        const result = validateGap(50, 0);
        expect(result.value).to.equal(true);
        expect(result.gapMsg).to.equal('');
    });

    it("Should pass if gap is Infinity", function() {
        const result = validateGap(Infinity, 0);
        expect(result.value).to.equal(true);
        expect(result.gapMsg).equal('');
    })

    //Invalid

    it("Should throw an error if gap value is a string like potato", function() {
        const result = validateGap("potato", 0);
        expect(result.value).to.equal(false);
        expect(result.gapMsg).to.include('is not a number');
    });

    it("Should throw an error if gap is a negative number", function() {
        const result = validateGap(-5, 0);
        expect(result.value).to.equal(false);
        expect(result.gapMsg).to.include('cannot be negative');
    });

});

//VALIDATE VARIATION

describe("Validate variation logic", function() {
    //Valid
    it("Should pass if variation value is empty", function() {
        const result = validateVariation('', 0);
        expect(result.value).to.equal(true);
        expect(result.variationMsg).to.equal('');
    });

    it("Should pass if variation value is undefined", function() {
        const result = validateVariation(undefined, 0);
        expect(result.value).to.equal(true);
        expect(result.variationMsg).to.equal('');
    });

    it("Should pass if variation value is null", function() {
        const result = validateVariation(null, 0);
        expect(result.value).to.equal(true);
        expect(result.variationMsg).to.equal('');
    });
    
    it("Should pass if variation value is a numeric string", function() {
        const result = validateVariation("40", 0);
        expect(result.value).to.equal(true);
        expect(result.variationMsg).to.equal('');
    });

    it("Should pass if validateVariation is a number", function() {
        const result = validateVariation(40, 0);
        expect(result.value).to.equal(true);
        expect(result.variationMsg).to.equal('');
    });

    //Invalid
    it("Should not pass if variation value is a non-numeric string", function() {
        const result = validateVariation("stringy", 0);
        expect(result.value).to.equal(false);
        expect(result.variationMsg).to.include('is not a number');
    });

    it("Should not pass if variation value is negative", function() {
        const result = validateVariation(-6, 0);
        expect(result.value).to.equal(false);
        expect(result.variationMsg).to.include('cannot be negative');
    });

});

//VALIDATE MAX ERROR

describe("Validate Max Error Logic", function() {
    //Valid
    it("Should pass if max error value is undefined", function() {
        const result = validateMaxError(undefined, 0);
        expect(result.value).to.equal(true);
        expect(result.maxErrorMsg).to.equal('');
    });

    it("Should pass if max error value is null", function() {
        const result = validateMaxError(null, 0);
        expect(result.value).to.equal(true);
        expect(result.maxErrorMsg).to.equal('');
    });

    it("Should pass if max error value is empty", function() {
        const result = validateMaxError('', 0);
        expect(result.value).to.equal(true);
        expect(result.maxErrorMsg).to.equal('');
    });

    it("Should pass if max error value is a numeric string", function() {
        const result = validateMaxError("30", 0);
        expect(result.value).to.equal(true);
        expect(result.maxErrorMsg).to.equal('');
    });

    it("Should pass if max error value is a number", function() {
        const result = validateMaxError(5, 0);
        expect(result.value).to.equal(true);
        expect(result.maxErrorMsg).to.equal('');
    });

    it("Should pass if max error value is a floating point integer", function() {
        const result = validateMaxError(20.5, 0);
        expect(result.value).to.equal(true);
        expect(result.maxErrorMsg).to.equal('');
    });

    it("Should pass if max error value is 0", function() {
        const result = validateMaxError(0, 0);
        expect(result.value).to.equal(true);
        expect(result.maxErrorMsg).to.equal('');
    });

    it("Should pass if max error value is 75", function() {
        const result = validateMaxError(75, 0);
        expect(result.value).to.equal(true);
        expect(result.maxErrorMsg).to.equal('');
    });

    //Invalid
    it("Should not pass if max error value is a non numeric string", function() {
        const result = validateMaxError("po", 0);
        expect(result.value).to.equal(false);
        expect(result.maxErrorMsg).to.include("not a number");
    });

    it("Should not pass if max error value includes numbers and letters", function() {
        const result = validateMaxError("50e", 0);
        expect(result.value).to.equal(false);
        expect(result.maxErrorMsg).to.include("not a number");
    });

    //Will not pass if "three"
    it("Should not pass if max error value is numeric string words", function() {
        const result = validateMaxError("three", 0);
        expect(result.value).to.equal(false);
        expect(result.maxErrorMsg).to.include("not a number");
    });

    it("Should not pass if max error value is a negative number", function() {
        const result = validateMaxError(-3, 0);
        expect(result.value).to.equal(false);
        expect(result.maxErrorMsg).to.include("must be between 0 and 75");
    });

    it("Should not pass if max error value is greater than 75", function() {
        const result = validateMaxError(76, 0);
        expect(result.value).to.equal(false);
        expect(result.maxErrorMsg).to.include("must be between 0 and 75");
    });

    it("Should not pass if max errr value is Infinity", function() {
        const result = validateMaxError(Infinity, 0);
        expect(result.value).to.equal(false);
        expect(result.maxErrorMsg).to.include("must be between 0 and 75");
    });
});

describe("Validate Area Logic", function() {
    //Valid
    it("Should pass if area value is empty", function() {
        const result = validateArea('',0, 0);
        expect(result.value).to.equal(true);
        expect(result.areaMsg).to.equal('');
    });

    it("Should pass if area value is zero", function() {
        const result = validateArea(0, 0, 0);
        expect(result.value).to.equal(true);
        expect(result.areaMsg).to.equal('');
    });

    it("Should pass if area value is empty and area unit is empty", function() {
        const result = validateArea('', '', 0);
        expect(result.value).to.equal(true);
        expect(result.areaMsg).to.equal('');
    });

    it("Should pass if area value is null and area unit is null", function() {
        const result = validateArea('', '', 0);
        expect(result.value).to.equal(true);
        expect(result.areaMsg).to.equal('');
    });

    it("Should pass if area value is undefined and area unit is undefined", function() {
        const result = validateArea(undefined, undefined, 0);
        expect(result.value).to.equal(true);
        expect(result.areaMsg).to.equal('');
    });

    it("Should pass if area value is a number and area unit is a sq ft", function() {
        const result = validateArea(50, 'sq ft', 0);
        expect(result.value).to.equal(true);
        expect(result.areaMsg).to.equal('');
    });

    it("Should pass if area value is a number and area unit is a sq m", function() {
        const result = validateArea(50, 'sq m', 0);
        expect(result.value).to.equal(true);
        expect(result.areaMsg).to.equal('');
    });



    //Invalid
    it("Should not pass if area value is a number and area unit is none", function() {
        const result = validateArea(5, 'none', 0);
        expect(result.value).to.equal(false);
        expect(result.areaMsg).to.include("When Area Unit is 'none', Area Value must be exactly 0");
    });

    it("Should not pass if area value is a number and area unit is empty", function() {
        const result = validateArea(5, '', 0);
        expect(result.value).to.equal(false);
        expect(result.areaMsg).to.include("When Area Unit is 'none', Area Value must be exactly 0");
    });

    it("Should not pass if area value is a number and area unit is undefined", function() {
        const result = validateArea(5, undefined, 0);
        expect(result.value).to.equal(false);
        expect(result.areaMsg).to.include("When Area Unit is 'none', Area Value must be exactly 0");
    });
});

describe("Validate Area Unit Logic", function() {
    //Valid
    it("Should pass if area unit is none", function() {
        const result = isValidAreaUnit("none", 0);
        expect(result.value).to.equal(true);
    });
    //Invalid
    it("Should not pass if area unit is None", function() {
        const result = isValidAreaUnit("None", 0);
        expect(result.value).to.equal(false);
    });

});



