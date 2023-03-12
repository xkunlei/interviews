import assert from "assert";
import { detectPatterns, initRareIdSetDict } from "../RareId";

(async () => {
    await initRareIdSetDict();
    console.log("init finished, start to test.");
    assert.deepEqual(detectPatterns("333.bit"), new Set(["AAA", "999"]));
    assert.deepEqual(detectPatterns("2112.bit"), new Set(["ABBA", "10K"]));
    assert.deepEqual(detectPatterns("45555.bit"), new Set(["ABBBB", "100K"]));
    assert.deepEqual(detectPatterns("888000.bit"), new Set(["AAABBB", "XXX000"]));
    assert.deepEqual(
        detectPatterns("0098.bit"),
        new Set(["10K", "AABC", "0XXX", "00XX"])
    );
    assert.deepEqual(detectPatterns("0x9832.bit"), new Set(["0x10K"]));
    assert.deepEqual(
        detectPatterns("0311.bit"),
        new Set(["ABCC", "0XXX", "10K", "MMDD"])
    );
    console.log("The test is done and test cases all pass.");
})();