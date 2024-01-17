/*
 * Title: Learn WebGL #11 - Lighting
 * Author: Darius @ InventBox <inventboxtutorial@gmail.com>
 */


var host = document.body;

const connectionString = 'mongodb://localhost:27017';

let tempEl = document.createElement("div");
tempEl.className="glavniDiv";
tempEl.id = "glavniDiv";
host.appendChild(tempEl);

let glavniDiv = document.getElementById("glavniDiv");


tempEl = document.createElement("canvas");
glavniDiv.appendChild(tempEl);
const _c = document.getElementsByTagName('canvas')[0];
_c.width = window.innerWidth;
_c.height = window.innerHeight;

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

// F|L|B|R|T|U
const vertexData = [

    // Front
    0.5, 0.5, 0.5, // top right 
    0.5, -.5, 0.5, // bottom right
    -.5, 0.5, 0.5, // top left
    -.5, 0.5, 0.5, // top left
    0.5, -.5, 0.5, // bottom right
    -.5, -.5, 0.5, // bottom left

    // Left
    -.5, 0.5, 0.5,
    -.5, -.5, 0.5,
    -.5, 0.5, -.5,
    -.5, 0.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, -.5,

    // Back
    -.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, 0.5, -.5,
    0.5, 0.5, -.5,
    -.5, -.5, -.5,
    0.5, -.5, -.5,

    0.5, 0.5, -.5,
    0.5, -.5, -.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -.5, -0.5,
    0.5, -.5, 0.5,

    // Top
    0.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, -.5,

    // Underside
    0.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, -.5,
];

const colorData =
[
    0.8208771372239099,
    0.8377264682056472,
    0.5595970833259835,
    0.8208771372239099,
    0.8377264682056472,
    0.5595970833259835,
    0.8208771372239099,
    0.8377264682056472,
    0.5595970833259835,
    0.8208771372239099,
    0.8377264682056472,
    0.5595970833259835,
    0.8208771372239099,
    0.8377264682056472,
    0.5595970833259835,
    0.8208771372239099,
    0.8377264682056472,
    0.5595970833259835,
    0.6383697899098857,
    0.7542970804033661,
    0.15987469526874187,
    0.6383697899098857,
    0.7542970804033661,
    0.15987469526874187,
    0.6383697899098857,
    0.7542970804033661,
    0.15987469526874187,
    0.6383697899098857,
    0.7542970804033661,
    0.15987469526874187,
    0.6383697899098857,
    0.7542970804033661,
    0.15987469526874187,
    0.6383697899098857,
    0.7542970804033661,
    0.15987469526874187,
    0.4748058969160487,
    0.1434985986967683,
    0.33132941767944335,
    0.4748058969160487,
    0.1434985986967683,
    0.33132941767944335,
    0.4748058969160487,
    0.1434985986967683,
    0.33132941767944335,
    0.4748058969160487,
    0.1434985986967683,
    0.33132941767944335,
    0.4748058969160487,
    0.1434985986967683,
    0.33132941767944335,
    0.4748058969160487,
    0.1434985986967683,
    0.33132941767944335,
    0.6797687963970465,
    0.497134726814609,
    0.8521957428261815,
    0.6797687963970465,
    0.497134726814609,
    0.8521957428261815,
    0.6797687963970465,
    0.497134726814609,
    0.8521957428261815,
    0.6797687963970465,
    0.497134726814609,
    0.8521957428261815,
    0.6797687963970465,
    0.497134726814609,
    0.8521957428261815,
    0.6797687963970465,
    0.497134726814609,
    0.8521957428261815,
    0.18835062149041593,
    0.3262350267153872,
    0.6784154021153825,
    0.18835062149041593,
    0.3262350267153872,
    0.6784154021153825,
    0.18835062149041593,
    0.3262350267153872,
    0.6784154021153825,
    0.18835062149041593,
    0.3262350267153872,
    0.6784154021153825,
    0.18835062149041593,
    0.3262350267153872,
    0.6784154021153825,
    0.18835062149041593,
    0.3262350267153872,
    0.6784154021153825,
    0.5548753105818753,
    0.9993365733813392,
    0.9789370174013655,
    0.5548753105818753,
    0.9993365733813392,
    0.9789370174013655,
    0.5548753105818753,
    0.9993365733813392,
    0.9789370174013655,
    0.5548753105818753,
    0.9993365733813392,
    0.9789370174013655,
    0.5548753105818753,
    0.9993365733813392,
    0.9789370174013655,
    0.5548753105818753,
    0.9993365733813392,
    0.9789370174013655
];

const { mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } = glMatrix;

// Construct an Array by repeating `pattern` n times
function repeat(n, pattern) {
    return [...Array(n)].reduce(sum => sum.concat(pattern), []);
}


// F|L|B|R|T|U
const normalData = [
    ...repeat(6, [0, 0, 1]),    // Z+
    ...repeat(6, [-1, 0, 0]),   // X-
    ...repeat(6, [0, 0, -1]),   // Z-
    ...repeat(6, [1, 0, 0]),    // X+
    ...repeat(6, [0, 1, 0]),    // Y+
    ...repeat(6, [0, -1, 0]),   // Y-
]

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

// SHADER PROGRAM
// ==============
let uniformLocations;
(function shaderProgram() {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
    precision mediump float;

    const vec3 lightDirection = normalize(vec3(0, 1.0, 1.0));
    const float ambient = 0.1;

    attribute vec3 position;
    attribute vec3 normal;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vBrightness;

    uniform mat4 matrix;
    uniform mat4 normalMatrix;

    void main() {        
        vec3 worldNormal = (normalMatrix * vec4(normal, 1)).xyz;
        float diffuse = max(0.0, dot(worldNormal, lightDirection));
        vBrightness = ambient + diffuse;
        vColor = color*vBrightness;

        gl_Position = matrix * vec4(position, 1);
    }
    `);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, `
    precision mediump float;

    varying float vBrightness;
    varying vec3 vColor;

    void main() {
        gl_FragColor = vec4(vColor,1.0);
    }
    `);
    gl.compileShader(fragmentShader);
    console.log(gl.getShaderInfoLog(fragmentShader));

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    const positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const normalLocation = gl.getAttribLocation(program, `normal`);
    gl.enableVertexAttribArray(normalLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(program, `color`);
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);

    uniformLocations = {
        matrix: gl.getUniformLocation(program, `matrix`),
        normalMatrix: gl.getUniformLocation(program, `normalMatrix`),
    };
})();


// MATRICES
// ========
const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, 
    75 * Math.PI / 180, // vertical field-of-view (angle, radians)
    canvas.width / canvas.height, // aspect W/H
    1e-4, // near cull distance
    1e4 // far cull distance
);

const mvMatrix = mat4.create();
const mvpMatrix = mat4.create();

mat4.translate(viewMatrix, viewMatrix, [0, 0.1, 2]);
mat4.invert(viewMatrix, viewMatrix);

const normalMatrix = mat4.create();

// ANIMATION LOOP
// ==============

function animate() {
    requestAnimationFrame(animate);

    mat4.rotateX(modelMatrix, modelMatrix, Math.PI/200);
    mat4.rotateY(modelMatrix, modelMatrix, Math.PI/400);

    mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
    mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);

    mat4.invert(normalMatrix, mvMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
    
    gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
    
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

animate();