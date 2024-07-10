// mcu_drawface.js

module.exports = function(RED) {
    function DrawFaceNode(config) {
        RED.nodes.createNode(this,config);
        this.face_default = JSON.parse(config.face);

		this.on('input', (msg, send, done) => {
            msg.payload = {};
            msg.payload.face = this.face_default;
            send(msg);
			done();
		});
    }
    RED.nodes.registerType("drawface", DrawFaceNode);
}
