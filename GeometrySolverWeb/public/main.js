const canvas = document.querySelector("canvas");
const gl = canvas.getContext('webgl');

if(!gl)
{
    throw new Error("WEBGL NOT SUPPORTED");
}

// alert("Dobrodosli u GeometrySolver :D");

const vertexDataCube = [
    // Front
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    -.5, -.5, 0.5,

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

    // Right
    0.5, 0.5, -.5,
    0.5, -.5, -.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,
    0.5, -.5, 0.5,
    0.5, -.5, -.5,

    // Top
    0.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, 0.5,
    -.5, 0.5, 0.5,
    0.5, 0.5, -.5,
    -.5, 0.5, -.5,

    // Bottom
    0.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, 0.5,
    -.5, -.5, 0.5,
    0.5, -.5, -.5,
    -.5, -.5, -.5,
];

const vertexData= [
	2.0, 0.0, 0.0,
	0.0 , 0.0, 0.0,
	0.0, 2.0, 0.0,
	0.0, 0.0, 0.0,
	0.0, 0.0, -2.0,
	0.0, 0.0, 0.0,
];

const colorData = [
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
];

function randomColor()
{
    return [Math.random(),Math.random(),Math.random()];
}

// for(let face=0;face<2;face++)
// {
//     let faceColor = randomColor();
//     for(let vertex=0;vertex<2;vertex++)
//     {
//         colorData.push(...faceColor);
//     }
// }

let density = 4;
let size = 2.0;
let factor = size/density;

for (i = 0; i <= density*2; i++)
    {
        gridVertex1 = [size,0.0,-size+factor*i];
        gridVertex2 = [-size,0.0,-size+factor*i];
        vertexData.push(...gridVertex1);
        vertexData.push(...gridVertex2);
        gridColor = [0.6,0.6,0.6];
        colorData.push(...gridColor);
        colorData.push(...gridColor);
        gridVertex3 = [size-factor*i,0.0,size];
        gridVertex4 = [size-factor*i,0.0,-size];
        vertexData.push(...gridVertex3);
        vertexData.push(...gridVertex4);
        colorData.push(...gridColor);
        colorData.push(...gridColor);
    }

const { mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } = glMatrix;

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

uniform mat4 matrix;

void main(){
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader,`
precision mediump float;

varying vec3 vColor;

void main(){
    gl_FragColor = vec4(vColor, 1);
}
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    throw new Error (`Could not compile WebGL program. \n\n${info}`);
}

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix: gl.getUniformLocation(program,`matrix`),
};


const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

mat4.perspective(projectionMatrix,
     75*Math.PI/180,
     canvas.width/canvas.height,
     1e-4,
     1e2);

const mvMatrix =mat4.create();
const mvpMatrix = mat4.create();


mat4.translate(modelMatrix,modelMatrix,[0.0,0.0,0.0]);
mat4.translate(viewMatrix,viewMatrix,[0.0,2.0,5.0]);
mat4.invert(viewMatrix,viewMatrix);

// mat4.rotateX(modelMatrix, modelMatrix, Math.PI/2);

function animate() {
    gl.clearColor(0.4, 0.4, 0.4, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    requestAnimationFrame(animate);
    mat4.rotateY(modelMatrix, modelMatrix, Math.PI/400);
    mat4.multiply(mvMatrix,viewMatrix,modelMatrix);
    mat4.multiply(mvpMatrix,projectionMatrix,mvMatrix);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
    gl.drawArrays(gl.LINES, 0, vertexData.length/3);
}

animate();

