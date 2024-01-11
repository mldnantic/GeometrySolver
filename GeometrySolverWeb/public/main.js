
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

const canvas = document.querySelector("canvas");
const gl = canvas.getContext('webgl');


if(!gl)
{
    throw new Error("WEBGL NOT SUPPORTED");
}

// alert("Dobrodosli u GeometrySolver :D");

var menu = document.createElement("div");
menu.className="menuDiv";
menu.id="menuDiv";
glavniDiv.appendChild(menu);

let naziv = document.createElement("h1");
naziv.innerHTML="GeometrySolver";
menu.appendChild(naziv);




 // Create label element
 var label = document.createElement("label");
 label.setAttribute("for", "shapes");
 label.textContent = "Select a shape:";

 // Create select element
 var select = document.createElement("select");
 select.id = "shapes";
 menu.appendChild(select);
//  select.onchange=(ev)=>drawShape(select.value);

//  btnRacuni.onclick=(ev)=>this.vidiRacune(this.id);

 // Create option elements and append them to the select element

 var option2 = document.createElement("option");
 option2.value = "trapezoid";
 option2.textContent = "Trapezoid";
 select.appendChild(option2);


 var option3 = document.createElement("option");
 option3.value = "rectangle";
 option3.textContent = "Rectangle";
 select.appendChild(option3);


 var option1 = document.createElement("option");
 option1.value = "triangle";
 option1.textContent = "Triangle";
 select.appendChild(option1);


 // Append label and select elements to the body
menu.appendChild(label);
menu.appendChild(select);

///  a
var aDiv = document.createElement("div");
let aLabel = document.createElement("label");
aLabel.innerHTML = "a: ";
aDiv.appendChild(aLabel);

var a = document.createElement("input");
a.id = "aInput"
a.type = "number";
aDiv.appendChild(a);

menu.appendChild(aDiv);

/// b
var bDiv = document.createElement("div");
let bLabel = document.createElement("label");
bLabel.innerHTML = "b: ";
bDiv.appendChild(bLabel);

var b = document.createElement("input");
b.id = "bInput"
b.type = "number";
bDiv.appendChild(b);
menu.appendChild(bDiv);

/// h

var hDiv = document.createElement("div");
let hLabel = document.createElement("label");
hLabel.innerHTML = "h: ";
hDiv.appendChild(hLabel);

var h = document.createElement("input");
h.id = "hInput"
h.type = "number";
hDiv.appendChild(h);
menu.appendChild(hDiv);

var btnDiv = document.createElement("div");
menu.appendChild(btnDiv);
var btn = document.createElement("button");
btn.innerHTML="Insert";
btn.onclick = (ev) =>{

    let aa,be,ha;
    
    if(document.getElementById("shapes").value === "rectangle")
    {
        aa = document.getElementById("aInput").value;
        be = document.getElementById("bInput").value;
        ha = -1;
    }

    if(document.getElementById("shapes").value === "triangle")
    {
        aa = document.getElementById("aInput").value;
        be = -1;
        ha = document.getElementById("hInput").value;
    }

    if(document.getElementById("shapes").value === "trapezoid")
    {
        aa = document.getElementById("aInput").value;
        be = document.getElementById("bInput").value;
        ha = document.getElementById("hInput").value;
    }

    const newFigure = {
        a: aa,
        b: be,
        h: ha,
        figura: document.getElementById("shapes").value,
        username: "qwerty"
    };

    fetch("http://localhost:3000/addFigure", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newFigure),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Figure added successfully:", data);
        // You can update your WebGL rendering here if needed
    })
    .catch(error => {
        console.error("Error adding figure:", error);
    });
}
btnDiv.appendChild(btn);
btn = document.createElement("button");
btn.innerHTML="Get";
btn.onclick = (ev) =>{

    fetch('/getFigures')
        .then(response => response.json())
        .then(data => {
    
            data.forEach(item => {
            let podatak = document.createElement("label");
            podatak.innerHTML=` a: ${item.a}, b: ${item.b} h: ${item.h}, figura: ${item.figura}`;
            menu.appendChild(podatak);
        })
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
btnDiv.appendChild(btn);

 // Get the select element
 var select = document.getElementById("shapes");

 // Attach an onchange event listener
 select.onchange = (ev) => {
   // Get the selected value
   let izabrano = select.value;

   // Get the input element with id "a"
   var a = document.getElementById("aInput");

   // Disable or enable the input based on the selected value
   if (izabrano == "triangle") {
     b.disabled = true;
     b.value = '';
   } else {
     b.disabled = false;
   }
   if (izabrano == "rectangle") {
    h.disabled = true;
    h.value = '';
  } else {
    h.disabled = false;
  }
 };

// Data to be inserted
const dataToInsert = {
    a: 3,
    b: 4,
    h: 5
  };

// // Function to insert data
// async function insertData() {
//     const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
  
//     try {
//       await client.connect();
//       console.log('Connected to the database');
  
//       const database = client.db('AIPS_Baza');
//       const collection = database.collection('geometries');
  
//       // Insert the document
//       const result = await collection.insertOne(dataToInsert);
//       console.log(`Document inserted with ID: ${result.insertedId}`);
//     } finally {
//       await client.close();
//       console.log('Connection closed');
//     }
//   }
  
//   // Execute the insertData function
//   insertData();

// function drawShape() {
//     // Get the selected value
//     var selectedValue = document.getElementById("shapes").value;

//     // Get the canvas and its context
//     var canvas = document.querySelector("canvas");
//     var ctx = canvas.getContext("2d");

//     // Clear the canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw the selected shape
//     if (selectedValue === "triangle") {
//       // Draw a triangle
//       ctx.beginPath();
//       ctx.moveTo(10, 190);
//       ctx.lineTo(150, 10);
//       ctx.lineTo(290, 190);
//       ctx.closePath();
//       ctx.stroke();
//     } else if (selectedValue === "trapezoid") {
//       // Draw a trapezoid
//       ctx.beginPath();
//       ctx.moveTo(50, 190);
//       ctx.lineTo(250, 190);
//       ctx.lineTo(200, 10);
//       ctx.lineTo(100, 10);
//       ctx.closePath();
//       ctx.stroke();
//     } else if (selectedValue === "rectangle") {
//       // Draw a rectangle
//       ctx.strokeRect(50, 50, 200, 100);
//     }
//   }

// function changeShape() {
//     var selectedShape = document.getElementById("shape").value;
    
//     document.getElementById("triangle").style.display = "none";
//     document.getElementById("trapezoid").style.display = "none";
//     document.getElementById("rectangle").style.display = "none";

//     document.getElementById(selectedShape).style.display = "block";
// }




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
    //koordinatne ose
	// 1.0, 0.0, 0.0,
	// 0.0, 0.0, 0.0,
	// 0.0, 1.0, 0.0,
	// 0.0, 0.0, 0.0,
	// 0.0, 0.0, 1.0,
    // 0.0, 0.0, 0.0
    0.0,0.0,0.0
];

const colorData = [
    //boje x,y,z ose
    // 1.0, 0.0, 0.0,
    // 1.0, 0.0, 0.0,
    // 0.0, 1.0, 0.0,
    // 0.0, 1.0, 0.0,
    // 0.0, 0.0, 1.0,
    // 0.0, 0.0, 1.0,
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

function drawGrid()
{
    let density = 4;
    let size = 2.0;
    let factor = size/density;
    
    for (i = 0; i <= density*2; i++)
        {
            gridVertex1 = [size,-0.01,-size+factor*i];
            gridVertex2 = [-size,-0.01,-size+factor*i];
            vertexData.push(...gridVertex1);
            vertexData.push(...gridVertex2);
            gridColor = [0.6,0.6,0.6];
            colorData.push(...gridColor);
            colorData.push(...gridColor);
            gridVertex3 = [size-factor*i,-0.01,size];
            gridVertex4 = [size-factor*i,-0.01,-size];
            vertexData.push(...gridVertex3);
            vertexData.push(...gridVertex4);
            colorData.push(...gridColor);
            colorData.push(...gridColor);
        }
}
// drawGrid();

function drawCircle()
{
    let density = 24;
    let size = 1;
    let theta = (Math.PI*2)/density;
    let cosine = Math.cos(theta);
    let sine = Math.sin(theta);
    circleVertex = [size,0.0,0.0];
    vertexData.push(...circleVertex);
    circleColor = [0.8,0.8,0.8];
    colorData.push(...circleColor);
    for(i=0;i<density;i++)
    {
        circleVertex = [cosine*circleVertex[0]+sine*circleVertex[2],0.0,-sine*circleVertex[0]+cosine*circleVertex[2]];
        vertexData.push(...circleVertex);
        vertexData.push(...circleVertex);
        colorData.push(...circleColor);
        colorData.push(...circleColor);
    }
}
drawCircle();

const { mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } = glMatrix;

// Construct an Array by repeating `pattern` n times
function repeat(n, pattern) {
    return [...Array(n)].reduce(sum => sum.concat(pattern), []);
}

const uvData = repeat(6, [
    1, 1, // top right
    1, 0, // bottom right
    0, 1, // top left

    0, 1, // top left
    1, 0, // bottom right
    0, 0  // bottom left
]);


function loadTexture(url) {
    const texture = gl.createTexture();
    const image = new Image();

    image.onload = e => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);
    };

    image.src = url;
    return texture;
}

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
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertexData.length/3);
}

animate();

