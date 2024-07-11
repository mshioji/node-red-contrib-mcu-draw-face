var helper = require("node-red-node-test-helper");
var drawFaceNode = require("../mcu_drawface.js");

describe('drawFaceNode', function () {

    afterEach(function () {
        helper.unload();
    });

    it('should be loaded', function (done) {
        var flow = [{ id: "n1", type: "draw-face", name: "test name" }];
        helper.load(drawFaceNode, flow, function () {
            var n1 = helper.getNode("n1");
            n1.should.have.property('name', 'test name');
            done();
        });
    });
});