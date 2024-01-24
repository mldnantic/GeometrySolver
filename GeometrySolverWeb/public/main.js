const connectionString = 'mongodb://localhost:27017';
const socket = io();
var userID = "";

let host = document.body;

let notificationsDiv = document.createElement("div");
notificationsDiv.className="notificationsDiv";
notificationsDiv.id="notificationsDiv";
host.appendChild(notificationsDiv);

let naziv = document.createElement("h1");
naziv.innerHTML="GeometrySolver";
notificationsDiv.appendChild(naziv);

let notification = document.createElement("div");
notification.className = "notification";
notification.id = "notification";
notificationsDiv.appendChild(notification);


let glavniDiv = document.createElement("div");
glavniDiv.className="glavniDiv";
glavniDiv.id = "glavniDiv";
host.appendChild(glavniDiv);

function commentSection()
{
    let userInteraction = document.createElement("div");
    userInteraction.className = "userInteraction";
    userInteraction.id = "userInteraction";
    host.appendChild(userInteraction);
    
    var btnKomentar = document.createElement("button");
    btnKomentar.innerHTML="Posalji";
    btnKomentar.onclick =async (ev) =>{
            //todo post comment
        // if(!komentar.value=="")
        // {
        //     const newUser = {
        //         username: usernameInput.value
        //     };
    
        //     fetch("http://localhost:3000/addUser", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(newUser),
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log("User registered successfully:", data);
        //         // You can update your WebGL rendering here if needed
        //     })
        //     .catch(error => {
        //         console.error("Error adding figure:", error);
        //     });
        // }
        }
    userInteraction.appendChild(btnKomentar);
    
    var komentar = document.createElement("input");
    komentar.placeholder = "Unesite komentar...";
    komentar.id = "commentText";
    userInteraction.appendChild(komentar);
    
    var commentList = document.createElement("textarea");
    commentList.id="commentList";
    commentList.readOnly = true;
    userInteraction.appendChild(commentList);    
}


let canvas = document.createElement("canvas");
glavniDiv.appendChild(canvas);
const _c = document.getElementsByTagName('canvas')[0];
_c.width = window.innerWidth;
_c.height = window.innerHeight;

canvas = document.querySelector("canvas");
const gl = canvas.getContext('webgl');

if(!gl)
{
    throw new Error("WEBGL NOT SUPPORTED");
}
// alert("Dobrodosli u GeometrySolver :D");

//unloadovanje struktura za matrice jer drugacije ne radi
const { mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } = glMatrix;

var vertexData= [
    //koordinatne ose
	// 1.0, 0.0, 0.0,
	// 0.0, 0.0, 0.0,
	// 0.0, 1.0, 0.0,
	// 0.0, 0.0, 0.0,
	// 0.0, 0.0, 1.0,
    // 0.0, 0.0, 0.0
];

var colorData = [
    //boje x,y,z ose
    // 1.0, 0.0, 0.0,
    // 1.0, 0.0, 0.0,
    // 0.0, 1.0, 0.0,
    // 0.0, 1.0, 0.0,
    // 0.0, 0.0, 1.0,
    // 0.0, 0.0, 1.0,
];

var normalData = [
    //normalizovan vektor za svaku stranu 3D modela
];

function drawPoprecni()
{
    let poprecni = document.createElement("canvas");
    poprecni.className="poprecniPresek";
    poprecni.id="poprecniPresek";
    glavniDiv.appendChild(poprecni);
}

function redraw(componentID,componentClassName)
{
    var component = document.getElementById(componentID);
    var parent = component.parentNode;
    parent.removeChild(component);

    component = document.createElement("div");
    component.className=componentClassName;
    component.id=componentID;
    parent.appendChild(component);

    return component;
}

var menu = document.createElement("div");
menu.className="menuDiv";
menu.id="menuDiv";
glavniDiv.appendChild(menu);

let registerLoginDiv = document.createElement("div");
registerLoginDiv.className = "registerLoginDiv";
registerLoginDiv.id = "registerLoginDiv";
menu.appendChild(registerLoginDiv);

let divTmp = document.createElement("div");

let userLabel = document.createElement("label");
userLabel.innerHTML = "Username: ";
divTmp.appendChild(userLabel);

var usernameInput = document.createElement("input");
usernameInput.id = "usernameInput";
divTmp.appendChild(usernameInput);

registerLoginDiv.appendChild(divTmp);
divTmp = document.createElement("div");

let btnRegister = document.createElement("button");
btnRegister.innerHTML="Registracija";
btnRegister.onclick =async (ev) =>{
    
    if(!usernameInput.value=="")
    {
        const newUser = {
            username: usernameInput.value
        };
        let notification = document.getElementById("notification");
        await fetch(`/getUserByUsername?username=${usernameInput.value}`)
        .then(response => response.json())
        .then(data => {
                if(data!=null && data.username==usernameInput.value)
                {
                    notification.style.backgroundColor = "rgb(180, 138, 32)";
                    notification.innerHTML = "korisnik sa tim imenom vec postoji";
                }
                else
                {
                    fetch("http://localhost:3000/addUser", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newUser),
                    })
                    .then(response => response.json())
                    .then(data => {
                        notification.style.backgroundColor = "rgb(20, 150, 20)";
                        notification.innerHTML = `Korisnik ${newUser.username} je uspesno registrovan`;
                    })
                    .catch(error => {
                        console.error("Error registering user:", error);
                    });
                }
                setTimeout(resetNotification, 2000);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

        
    }
}
divTmp.appendChild(btnRegister);

let btnLogin = document.createElement("button");
btnLogin.innerHTML="Prijava";
btnLogin.onclick = async (ev) =>{
    if(!usernameInput.value=="")
    {
    let notification = document.getElementById("notification");
    await fetch(`/getUserByUsername?username=${usernameInput.value}`)
        .then(response => response.json())
        .then(data => {
            if(data!=null)
            {
                userID = data._id;
                notification.style.backgroundColor = "rgb(20, 150, 20)";
                notification.innerHTML = `Dobrodosli, ${data.username}`;
                
                redraw("registerLoginDiv","registerLoginDiv");
            }
            else
            {
                notification.style.backgroundColor = "rgb(192, 64, 64)";
                notification.innerHTML = `Korisnik sa username ${usernameInput.value} ne postoji`;
            }
            setTimeout(resetNotification, 2000);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
}
divTmp.appendChild(btnLogin);
registerLoginDiv.appendChild(divTmp);

function resetNotification()
{
    let notification = document.getElementById("notification");
    notification.style.backgroundColor = "rgb(90, 90, 95)";
    notification.innerHTML = "";
}

let figureInput = document.createElement("div");
figureInput.className = "menuDiv";
figureInput.id="figureInput";
menu.appendChild(figureInput);

 var label = document.createElement("label");
 label.setAttribute("for", "shapes");
 label.textContent = "Izaberite figuru:";

 // Create select element
 var select = document.createElement("select");
 select.id = "shapes";
 figureInput.appendChild(select);
 figureInput.appendChild(label);

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

figureInput.appendChild(select);

///  a
var aDiv = document.createElement("div");
let aLabel = document.createElement("label");
aLabel.innerHTML = "a: ";
aDiv.appendChild(aLabel);

var a = document.createElement("input");
a.id = "aInput"
a.type = "number";
aDiv.appendChild(a);

figureInput.appendChild(aDiv);

/// b
var bDiv = document.createElement("div");
let bLabel = document.createElement("label");
bLabel.innerHTML = "b: ";
bDiv.appendChild(bLabel);

var b = document.createElement("input");
b.id = "bInput"
b.type = "number";
bDiv.appendChild(b);
figureInput.appendChild(bDiv);

var hDiv = document.createElement("div");
let hLabel = document.createElement("label");
hLabel.innerHTML = "h: ";
hDiv.appendChild(hLabel);

var h = document.createElement("input");
h.id = "hInput"
h.type = "number";
hDiv.appendChild(h);
figureInput.appendChild(hDiv);

var aa,be,ha;
var range = document.createElement("input");
range.setAttribute("type","range");
range.setAttribute("min",3);
range.setAttribute("max",24);
range.oninput=(ev)=>
{
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
    let oblik = document.getElementById("shapes").value;
    vertexData=[];
    colorData=[];
    normalData=[];
    range.innerText = this.value;
    switch(oblik)
    {
        case "triangle":
            drawCone(aa,ha,range.value);
            break;
        case "rectangle":
            drawCylinder(aa,be,range.value);
            break;
        case "trapezoid":
            drawTruncatedCone(aa,be,ha,range.value);
            break;
    }
    
}
figureInput.appendChild(range);

var select = document.getElementById("shapes");

select.onchange = (ev) => {

   let izabrano = select.value;

   var a = document.getElementById("aInput");

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

var renderBtn = document.createElement("button");
renderBtn.innerHTML="Prikazi model";
renderBtn.onclick = async (ev) =>{

    await fetch("getAllBodies")
        .then(response => response.json())
        .then(data => {
                data.forEach(item =>{
                    console.log(item.figures[1])
                    let fig = item.figures[1];
                    if(fig.tip == "trapezoid")
                    {
                        vertexData=[];
                        colorData=[];
                        normalData=[];
                        drawTruncatedCone(fig.a,fig.b,fig.h,range.value);
                    }
                    
                })
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
figureInput.appendChild(renderBtn);

async function drawModel()
{
    await fetch("getAllBodies")
        .then(response => response.json())
        .then(data => {
                data.forEach(item =>{
                    console.log(item.figures[1])
                    let fig = item.figures[1];
                    if(fig.tip == "trapezoid")
                    {
                        vertexData=[];
                        colorData=[];
                        normalData=[];
                        drawTruncatedCone(fig.a,fig.b,fig.h,range.value);
                    }
                    
                })
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

socket.on("message", message =>{
    let notification = document.getElementById("notification");
    notification.style.backgroundColor = "rgb(224, 164, 224)";
    notification.innerHTML = message;
    setTimeout(resetNotification,2000);
});

// Data to be inserted
// const dataToInsert = {
//     a: 3,
//     b: 4,
//     h: 5
//   };

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

function modelColor()
{
    return [0.8,0.8,0.8];
}

function drawGrid(rotating)
{
    vertexData= [
        //koordinatne ose
        1.0, 0.0, 0.0,
        0.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 0.0
    ];
    
    colorData = [
        //boje x,y,z ose
        1.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
    ];

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
    webgl(gl.LINES,rotating);
}

function drawCircle(dense,r)
{
    let density = dense;
    let size = r;
    let theta = (Math.PI*2)/density;
    let cosine = Math.cos(theta);
    let sine = Math.sin(theta);
    circleVertex = [size,0.0,0.0];
    vertexData.push(...circleVertex);
    colorData.push(...modelColor());
    for(i=0;i<density;i++)
    {
        circleVertex = [cosine*circleVertex[0]+sine*circleVertex[2],0.0,-sine*circleVertex[0]+cosine*circleVertex[2]];
        vertexData.push(...circleVertex);
        vertexData.push(...circleVertex);
        colorData.push(...modelColor());
        colorData.push(...modelColor());
    }
    webgl(gl.TRIANGLE_FAN,false);
}

function drawCone(a,h,dense)
{
    if(a==0 || h==0)
    {
        console.log("nepopunjene dimenzije");
    }
    else
    {
        let base = a;
        let height = h;
        coneTipVertex = [0.0,h,0.0];
        vertexData.push(...coneTipVertex);
        colorData.push(...modelColor());
        drawCircle(dense,a);
    }
        
}

function drawCylinder(a,b,dense)
{
    if(a==0 || b==0)
    {
        console.log("nepopunjene dimenzije");
    }
    else
    {
        let theta = (Math.PI*2)/dense;
        let cosine = Math.cos(theta);
        let sine = Math.sin(theta);

        let radius = a;
        let height = b;


        wrapVertexTop = [radius,height,0.0];
        wrapVertexBottom = [radius,0.0,0.0];
        vertexData.push(...wrapVertexTop);
        vertexData.push(...wrapVertexBottom);

        normalVector = [0.0,0.0,-1.0];
        normalData.push(normalVector);

        colorData.push(...modelColor());
        colorData.push(...modelColor());

        for(i=0;i<dense;i++)
        {
            wrapVertexTop = [cosine*wrapVertexTop[0]+sine*wrapVertexTop[2],height,-sine*wrapVertexTop[0]+cosine*wrapVertexTop[2]];
            wrapVertexBottom = [cosine*wrapVertexBottom[0]+sine*wrapVertexBottom[2],0.0,-sine*wrapVertexBottom[0]+cosine*wrapVertexBottom[2]];
            vertexData.push(...wrapVertexTop);
            vertexData.push(...wrapVertexBottom);
            colorData.push(...modelColor());
            colorData.push(...modelColor());
            normalData.push(normalVector);
        }
        webgl(gl.TRIANGLE_STRIP,false);
    }
}

function drawTruncatedCone(a,b,h,dense)
{
    if(a==0 || b==0 || h==0)
    {
        console.log("nepopunjene dimenzije");
    }
    else
    {
        let theta = (Math.PI*2)/dense;
        let cosine = Math.cos(theta);
        let sine = Math.sin(theta);

        let outer = a;
        let inner = b;
        let height = h;

        wrapVertexInner = [inner,height,0.0];
        wrapVertexOuter = [outer,0.0,0.0];
        vertexData.push(...wrapVertexInner);
        vertexData.push(...wrapVertexOuter);

        colorData.push(...modelColor());
        colorData.push(...modelColor());

        for(i=0;i<dense;i++)
        {
            wrapVertexInner = [cosine*wrapVertexInner[0]+sine*wrapVertexInner[2],height,-sine*wrapVertexInner[0]+cosine*wrapVertexInner[2]];
            wrapVertexOuter = [cosine*wrapVertexOuter[0]+sine*wrapVertexOuter[2],0.0,-sine*wrapVertexOuter[0]+cosine*wrapVertexOuter[2]];
            vertexData.push(...wrapVertexInner);
            vertexData.push(...wrapVertexOuter);
            colorData.push(...modelColor());
            colorData.push(...modelColor());
        }
        webgl(gl.TRIANGLE_STRIP,false);
    }
}
// Construct an Array by repeating `pattern` n times
function repeat(n, pattern) {
    return [...Array(n)].reduce(sum => sum.concat(pattern), []);
}

function webgl(glDrawMode,animacija)
{

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

// const normalBuffer = gl.createBuffer();
// gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);

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
    gl_FragColor = vec4(vColor, 1.0);
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

// const normalLocation = gl.getAttribLocation(program, `normal`);
// gl.enableVertexAttribArray(normalLocation);
// gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
// gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

const uniformLocations = {
    matrix: gl.getUniformLocation(program,`matrix`),
    // normalMatrix: gl.getUniformLocation(program, `normalMatrix`),
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

function animate() {
    gl.clearColor(0.4, 0.4, 0.4, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    requestAnimationFrame(animate);
    mat4.rotateY(modelMatrix, modelMatrix, Math.PI/400);
    mat4.multiply(mvMatrix,viewMatrix,modelMatrix);
    mat4.multiply(mvpMatrix,projectionMatrix,mvMatrix);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
    gl.drawArrays(glDrawMode, 0, vertexData.length/3);
}

// mat4.rotateX(modelMatrix, modelMatrix, Math.PI/2);
if(!animacija)
{
    gl.clearColor(0.412, 0.412, 0.412, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    mat4.rotateY(modelMatrix, modelMatrix, Math.PI/400);
    mat4.multiply(mvMatrix,viewMatrix,modelMatrix);
    mat4.multiply(mvpMatrix,projectionMatrix,mvMatrix);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
    gl.drawArrays(glDrawMode, 0, vertexData.length/3);
}
else
{
    animate();
}
}