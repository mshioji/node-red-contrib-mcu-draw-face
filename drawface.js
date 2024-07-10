//drawface.js

import {Node} from "nodered";

import Timer from "timer";
import Poco from "commodetto/Poco";
import {Outline} from "commodetto/outline";

let render, colors, face_current, timerID, timer;

class DrawFaceNode extends Node {
    #face_default
	onStart(config) {
		super.onStart(config);
        this.name = config.name;
        this.#face_default = JSON.parse(config.face);

        render = new Poco(screen);

        const black = render.makeColor(0, 0, 0);
        const white = render.makeColor(255, 255, 255);
        const gray  = render.makeColor(127, 127, 127);
    
        colors = {
            black, white, gray
        };
        
        face_current = deepCopy(this.#face_default);
        drawFace(face_current);
        timer = false;
	}

	onMessage(msg, done) {
        if (msg.payload.cmd != null){
            let face_temp = deepCopy(face_current);

            switch (msg.payload.cmd){
                case "default":
                    face_current = deepCopy(this.#face_default);
                    drawFace(face_current);
                    break;
                case "blink":
                    face_temp.eye.right.drawMode = "stroke";
                    face_temp.eye.left.drawMode = "stroke";
                    face_temp.eye.right.arcEnd = 180;
                    face_temp.eye.left.arcEnd = 180;
                    face_temp.eye.right.h = face_temp.eye.right.w /2;
                    face_temp.eye.left.h = face_temp.eye.left.w /2;
                    drawFace(face_temp);
                    setTimeout(function () {
                        drawFace(face_current);
                    }, 300);
                    break;
                case "wink":
                    face_temp.eye.right.drawMode = "stroke";
                    face_temp.eye.right.arcEnd = 180;
                    drawFace(face_temp);
                    setTimeout(function () {
                        drawFace(face_current);
                    }, 1000);
                    break;
                case "smile":
                    face_temp.mouth.shape = "line";
                    face_temp.mouth.line.curveStrength = 30;
                    drawFace(face_temp);
                    setTimeout(function () {
                        drawFace(face_current);
                    }, 1000);
                    break;
                case "frown":
                    face_temp.mouth.shape = "line";
                    face_temp.mouth.line.curveStrength = -30;
                    face_temp.eye.right.w = 50;
                    face_temp.eye.right.rotation = -20;
                    face_temp.eye.right.arcEnd = 180;
                    face_temp.eye.right.lineWidth = 5;
                    face_temp.eye.right.drawMode = "stroke";
                    face_temp.eye.left.w = 50;
                    face_temp.eye.left.rotation = 20;
                    face_temp.eye.left.arcEnd = 180;
                    face_temp.eye.left.lineWidth = 5;
                    face_temp.eye.left.drawMode = "stroke";
                    drawFace(face_temp);
                    setTimeout(function () {
                        drawFace(face_current);
                    }, 1000);
                    break;
                case "talk":
                    if(timer == false){
                        timer = true;
                        timerID = Timer.repeat(function () {
                            face_temp.mouth.oval.w = (Math.random() * 60) + 10;
                            face_temp.mouth.oval.h = (Math.random() * 40) + 10;
                            face_temp.mouth.shape = "oval";
                            drawFace(face_temp);
                        }, 300);
                    }
                    break;
                case "talk_stop":
                    if(timer == true){
                        timer = false;
                        Timer.clear(timerID);
                        drawFace(face_current);
                    }
                    break;
                default:
                    null;
            }
        }

        else if (msg.payload.face != null) {
            mergeDeep(face_current, msg.payload.face);
            drawFace(face_current);
        }

        msg.payload = {};
        msg.payload.face = face_current;
        return msg;
	}

	static type = "drawface";
	static {
		RED.nodes.registerType(this.type, this);
	}
};

function drawFace(face){
    render.begin();
    render.fillRectangle(colors.black, 0, 0, render.width, render.height);

    const eyeRight = face.eye.right;
    if (eyeRight.enable) {
        const x = eyeRight.x;
        const y = eyeRight.y;
        const w = eyeRight.w;
        const h = eyeRight.h;
        const rotation = eyeRight.rotation;
        const arcstart = eyeRight.arcStart;
        const arcend = eyeRight.arcEnd;
        const lineWidth = eyeRight.lineWidth;
        const drawMode = eyeRight.drawMode;

        if (drawMode == "fill"){
            const eye_path_right = new Outline.CanvasPath;
            eye_path_right.ellipse(
                x,
                y,
                w/2,
                h/2,
                rotation * Math.PI / 180,
                arcstart * Math.PI / 180,
                arcend * Math.PI / 180
            );
            eye_path_right.closePath();
            const eye = Outline.fill(eye_path_right);
            render.blendOutline(
                colors.white,
                255,
                eye,
                render.width / 2 - face.eye.pupillary_distance / 2,
                face.eye.vPos
            );
        }
        else if  (drawMode == "stroke"){
            const eye_path_right = new Outline.CanvasPath;
            eye_path_right.ellipse(
                x,
                y,
                w/2,
                h/2,
                rotation * Math.PI / 180,
                arcstart * Math.PI / 180,
                arcend * Math.PI / 180
            );
            eye_path_right.closePath();
            const eye = Outline.stroke(eye_path_right, lineWidth, Outline.LINECAP_ROUND);

            render.blendOutline(
                colors.white,
                255,
                eye,
                render.width / 2 - face.eye.pupillary_distance / 2,
                face.eye.vPos
            );
        }
    }
    const eyeLeft = face.eye.left;
    if (eyeLeft.enable) {
        const x = eyeLeft.x;
        const y = eyeLeft.y;
        const w = eyeLeft.w;
        const h = eyeLeft.h;
        const rotation = eyeLeft.rotation;
        const arcstart = eyeLeft.arcStart;
        const arcend = eyeLeft.arcEnd;
        const lineWidth = eyeLeft.lineWidth;
        const drawMode = eyeLeft.drawMode;

        if (drawMode == "fill"){
            const eye_path_right = new Outline.CanvasPath;
            eye_path_right.ellipse(
                x,
                y,
                w/2,
                h/2,
                rotation * Math.PI / 180,
                arcstart * Math.PI / 180,
                arcend * Math.PI / 180
            );
            eye_path_right.closePath();
            const eye = Outline.fill(eye_path_right);
            render.blendOutline(
                colors.white,
                255,
                eye,
                render.width / 2 + face.eye.pupillary_distance / 2,
                face.eye.vPos
            );
        }
        else if  (drawMode == "stroke"){
            const eye_path_right = new Outline.CanvasPath;
            eye_path_right.ellipse(
                x,
                y,
                w/2,
                h/2,
                rotation * Math.PI / 180,
                arcstart * Math.PI / 180,
                arcend * Math.PI / 180
            );
            eye_path_right.closePath();
            const eye = Outline.stroke(eye_path_right, lineWidth, Outline.LINECAP_ROUND);

            render.blendOutline(
                colors.white,
                255,
                eye,
                render.width / 2 + face.eye.pupillary_distance / 2,
                face.eye.vPos
            );
        }
    };
    const mouthCenter = face.mouth;
    if (mouthCenter.enable) {
        if (mouthCenter.shape== "line") {
            const x = mouthCenter.line.x;
            const y = mouthCenter.line.y;
            const w = mouthCenter.line.w;
            const lineWidth = mouthCenter.line.lineWidth;
            const curveStrength = mouthCenter.line.curveStrength;

            const mouth_path = new Outline.CanvasPath;
            mouth_path.moveTo(-w / 2, y);
            mouth_path.quadraticCurveTo(x, curveStrength, w / 2, y);
            mouth_path.closePath();
            const mouth = Outline.stroke(mouth_path,lineWidth,Outline.LINECAP_ROUND);
            render.blendOutline(
                colors.white,
                255,
                mouth,
                render.width / 2,
                face.mouth.vPos
                );
        }
        else if (mouthCenter.shape == "oval"){
            const x = mouthCenter.oval.x;
            const y = mouthCenter.oval.y;
            const w = mouthCenter.oval.w;
            const h = mouthCenter.oval.h;
            const rotation = mouthCenter.oval.rotation;
            const arcStart = mouthCenter.oval.arcStart;
            const arcEnd = mouthCenter.oval.arcEnd;
            const drawMode = mouthCenter.oval.drawMode;
            const lineWidth = mouthCenter.oval.lineWidth;

            const mouth_path = new Outline.CanvasPath;
            mouth_path.ellipse(
                x,
                y,
                w/2,
                h/2,
                rotation * Math.PI / 180,
                arcStart * Math.PI / 180,
                arcEnd * Math.PI / 180
                );
            mouth_path.closePath();
            if (drawMode == "fill"){
                const mouth = Outline.fill(mouth_path,);
                render.blendOutline(
                    colors.white,
                    255,
                    mouth,
                    render.width / 2,
                    face.mouth.vPos
                );
            }
            else if (drawMode == "stroke"){
                const mouth = Outline.stroke(
                    mouth_path,
                    lineWidth,
                    Outline.LINECAP_ROUND
                );
                render.blendOutline(
                    colors.white,
                    255,
                    mouth,
                    render.width / 2,
                    face.mouth.vPos
                );
            }
        }
    }
    render.end();
};

function mergeDeep(target, source) {
    for (let key in source) {
        if (source[key] instanceof Object && key in target) {
            target[key] = mergeDeep(target[key], source[key]);
        } 
        else {
            target[key] = source[key];
        }
    }
    return target;
};

function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    const objCopy = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            objCopy[key] = deepCopy(obj[key]);
        }
    }
    return objCopy;
};
