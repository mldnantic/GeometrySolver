const connectionString = 'mongodb://localhost:27017';
const socket = io();
const camheight = 3;
var userID = "";
var userName = "";



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

function commentSection(bodyID)
{
    let userInteraction = document.createElement("div");
    userInteraction.className = "userInteraction";
    userInteraction.id = "userInteraction";
    host.appendChild(userInteraction);
    
    var btnKomentar = document.createElement("button");
    btnKomentar.innerHTML="Send";
    btnKomentar.onclick =async (ev) =>{
        let komentar = document.getElementById("commentText");
        
        if(komentar.value!="")
        {
            let comment = {
                user: userName,
                content: komentar.value
            }
    
            socket.emit("comment",comment);
            
            let sadrzaj = komentar.value;
            komentar.value="";
            komentar.focus();
            var newCmt = {
                id: bodyID,
                user: userName,
                content: sadrzaj
            };
            fetch("/addComment", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCmt),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error("Error registering user:", error);
            });
        }

    }
    userInteraction.appendChild(btnKomentar);
    
    var komentar = document.createElement("input");
    komentar.placeholder = "Type your comment here...";
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
drawPoprecni();

//brisemo postojecu komponentu i pravimo prazan div
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
userLabel.innerHTML = "Username:";
divTmp.appendChild(userLabel);

var usernameInput = document.createElement("input");
usernameInput.id = "usernameInput";
divTmp.appendChild(usernameInput);

registerLoginDiv.appendChild(divTmp);
divTmp = document.createElement("div");

let btnRegister = document.createElement("button");
btnRegister.innerHTML="Register";
btnRegister.onclick =async (ev) =>{
    
    if(!usernameInput.value=="")
    {
        var newUser = {
            username: usernameInput.value
        };
        let notification = document.getElementById("notification");
        await fetch(`/getUserByUsername?username=${usernameInput.value}`)
        .then(response => response.json())
        .then(data => {
                if(data!=null && data.username==usernameInput.value)
                {
                    notification.style.backgroundColor = "rgb(180, 138, 32)";
                    notification.innerHTML = "Account with this username is already registered";
                }
                else
                {
                    fetch("/createUser", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newUser),
                    })
                    .then(response => response.json())
                    .then(data => {
                        notification.style.backgroundColor = "rgb(20, 150, 20)";
                        notification.innerHTML = `Account ${newUser.username} registered successfully`;
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
btnLogin.innerHTML="Login";
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
                userName = data.username;
                notification.style.backgroundColor = "rgb(20, 150, 20)";
                notification.innerHTML = `Welcome ${userName}`;
                modelCreateAndSelect();
                // figureInput();
                redraw("registerLoginDiv","menuDiv");
                let logoffBtn = document.createElement("button");
                logoffBtn.innerHTML = "Log off";
                document.getElementById("registerLoginDiv").appendChild(logoffBtn);

            }
            else
            {
                notification.style.backgroundColor = "rgb(192, 64, 64)";
                notification.innerHTML = `Account with username ${usernameInput.value} doesn't exist`;
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

async function modelCreateAndSelect()
{
    let lbl = document.createElement("label");
    lbl.innerHTML = "New project name:"
    menu.appendChild(lbl);
    let bodyNameInput = document.createElement("input");
    bodyNameInput.id = "bodyName"
    menu.appendChild(bodyNameInput);
    let createBodyBtn = document.createElement("button");
    createBodyBtn.innerHTML="Create project";
    createBodyBtn.onclick =async (ev) =>{

        var newBody = {
            projectname: document.getElementById("bodyName").value,
            creatorID: userID,
            length: 0
        }

        if(document.getElementById("bodyName").value!="")
        {
            await fetch("/createBody", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newBody),
            })
            .then(response => response.json())
            .then(data => {
                if(document.getElementById("figureInput")==null)
                {
                    figureInput(data._id);
                }
                if(document.getElementById("userInteraction")==null)
                {
                    commentSection(data._id);
                }
            })
            .catch(error => {
                console.error("Error registering user:", error);
            });
        }
    };
    menu.appendChild(createBodyBtn);

    let selectModel = document.createElement("select");
    selectModel.id = "bodySelect"
    menu.appendChild(selectModel);
    let renderBtn = document.createElement("button");
    renderBtn.innerHTML="Open project";
    renderBtn.onclick = async (ev) =>{
        drawModel(document.getElementById("bodySelect").value);
    };
    menu.appendChild(renderBtn);
    await fetch("/getAllBodies")
        .then(response => response.json())
        .then(data => {
                data.forEach(item =>{
                        let bodyOption = document.createElement("option");
                        bodyOption.value = item._id;
                        bodyOption.textContent = item.projectname;
                        selectModel.appendChild(bodyOption);
                })
            })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function figureInput(bodyID)
{
    let figureInput = document.createElement("div");
    figureInput.className = "menuDiv";
    figureInput.id="figureInput";
    menu.appendChild(figureInput);
    
    var label = document.createElement("label");
    label.setAttribute("for", "shapes");
    label.textContent = "Select figure:";
    
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
    
    var aDiv = document.createElement("div");
    let aLabel = document.createElement("label");
    aLabel.innerHTML = "a: ";
    aDiv.appendChild(aLabel);
    
    var a = document.createElement("input");
    a.id = "aInput"
    a.type = "number";
    aDiv.appendChild(a);
    
    figureInput.appendChild(aDiv);
    
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

    let divTmp = document.createElement("div");

    let izvrnutaLbl = document.createElement("label");
    izvrnutaLbl.innerHTML = "Inverted:";
    divTmp.appendChild(izvrnutaLbl);
    let izvrnutaCheck = document.createElement("input");
    izvrnutaCheck.id="izvrnuta";
    izvrnutaCheck.className="stiklirano";
    izvrnutaCheck.type = "checkbox";
    divTmp.appendChild(izvrnutaCheck);

    figureInput.appendChild(divTmp);
    
    var aa,be,ha;
    let densityLbl = document.createElement("label");
    densityLbl.innerHTML = "Detail quality:";
    figureInput.appendChild(densityLbl);
    var range = document.createElement("input");
    range.id = "range";
    range.setAttribute("type","range");
    range.setAttribute("min",16);
    range.setAttribute("max",192);
    range.value=192;
    figureInput.appendChild(range);
    
    let btnAddFigure = document.createElement("button");
    btnAddFigure.innerHTML = "Insert figure";
    btnAddFigure.onclick = async (ev) => {
    
        let oblik = document.getElementById("shapes").value;
    
        if(oblik === "rectangle")
        {
            aa = document.getElementById("aInput").value;
            be = document.getElementById("bInput").value;
            ha = -1;
        }
    
        if(oblik === "triangle")
        {
            aa = document.getElementById("aInput").value;
            be = -1;
            ha = document.getElementById("hInput").value;
        }
    
        if(oblik === "trapezoid")
        {
            aa = document.getElementById("aInput").value;
            be = document.getElementById("bInput").value;
            ha = document.getElementById("hInput").value;
        }
        vertexData=[];
        colorData=[];
        normalData=[];
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

        let inverted;
        if(document.getElementById("izvrnuta").checked == true)
        {
            inverted = true;
        }
        else
        {
            inverted = false;
        }

        if(aa==0 || be==0 || ha==0)
        {
            console.log("nepopunjene dimenzije");
        }
        else
        {
            var newFigure = {
                a:aa,
                b:be,
                h:ha,
                tip:oblik,
                izvrnuta:inverted
            }
            await fetch(`/addFigure?id=${bodyID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newFigure),
            })
            .then(response => response.json())
            .then(data => {
                    console.log(data);
                })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
    };
    figureInput.appendChild(btnAddFigure);

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
    if(document.getElementById("poprecniPresek"))
    {
        drawShape();
    }
    };
}

async function drawModel(projectID)
{
    let id = projectID;
    await fetch(`/getBody?id=${id}`)
        .then(response => response.json())
        .then(data => {
            let range_vrednost = 64;
            let cam_height = camheight;
            let base_height = 0;
            data.figures.forEach(f=>{
            console.log(cam_height,base_height);
            vertexData=[];
            colorData=[];
            normalData=[];
            switch(f.tip)
            {
                case "triangle":
                    drawCone(f.a,f.h,range_vrednost,cam_height,base_height);
                    cam_height+=f.h;
                    base_height+=f.h;
                    break;
                case "rectangle":
                    drawCylinder(f.a,f.b,range_vrednost,cam_height,base_height);
                    cam_height+=f.b;
                    base_height+=f.b;
                    break;
                case "trapezoid":
                    drawTruncatedCone(f.a,f.b,f.h,range_vrednost,cam_height,base_height);
                    cam_height+=f.h;
                    base_height+=f.h;
                    break;
            }
            });
            let listaKomentara = document.getElementById("commentList");
            if(listaKomentara==null)
            {
                commentSection(projectID);
                listaKomentara = document.getElementById("commentList");
                data.comments.forEach(cmt=>{
                        listaKomentara.value+=cmt.user+" "+cmt.time+" "+cmt.content+"\n\n";
                        listaKomentara.scrollTop = listaKomentara.scrollHeight;
                    });
            }
            if(document.getElementById("figureInput")==null)
            {
                figureInput(id);
            }
            if(document.getElementById("userInteraction")==null)
            {
                commentSection(id);
            }
            })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

socket.on("message", message =>{
    let notification = document.getElementById("notification");
    notification.style.backgroundColor = "rgb(20, 150, 20)";
    notification.innerHTML = message;
    setTimeout(resetNotification,2000);
});

socket.on("comment",comment=>{
    let listaKomentara = document.getElementById("commentList");
    listaKomentara.value+=comment+"\n\n";
    listaKomentara.scrollTop = listaKomentara.scrollHeight;
});

function drawShape()
{
    var selectedValue = document.getElementById("shapes").value;

    var canvas = document.getElementById("poprecniPresek");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    
    let density = 10;
    let factor = canvas.width/density;
    
    for (i = 0; i <= density; i++)
    {
        ctx.beginPath();
        ctx.moveTo(canvas.width/density,canvas.height/density+factor*i);
        ctx.lineTo((density-1)*canvas.width/density,canvas.height/density+factor*i);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvas.width/density+factor*i,canvas.height/density);
        ctx.lineTo(canvas.width/density+factor*i,(density-1)*canvas.height/density);
        ctx.stroke();
    }

    // if (selectedValue === "triangle") 
    // {
    //     // ctx.beginPath();
    //     // ctx.moveTo(10, 190);
    //     // ctx.lineTo(10, 10);
    //     // ctx.lineTo(290, 190);
    //     // ctx.closePath();
    //     // ctx.stroke();

    //     let offset = 4;

    //     ctx.beginPath();
    //     ctx.moveTo(canvas.width/10,canvas.height-10);
    //     ctx.lineTo(canvas.width/2,canvas.height-10);
    //     ctx.stroke();

    //     ctx.beginPath();
    //     ctx.moveTo(canvas.width/10,canvas.height-10);
    //     ctx.lineTo(canvas.width/10,3*canvas.height/4);
    //     ctx.stroke();

    //     ctx.beginPath();
    //     ctx.moveTo(canvas.width/10,3*canvas.height/4);
    //     ctx.lineTo(canvas.width/10,canvas.height/2);
    //     ctx.stroke();

    //     ctx.beginPath();
    //     ctx.moveTo(canvas.width/10,canvas.height/2);
    //     ctx.lineTo(canvas.width/2,canvas.height-10);
    //     ctx.stroke();

    //     ctx.font = `${canvas.width/24}px Calibri`;
    //     ctx.fillText("2.38", canvas.width/4, canvas.height-10-offset);
    //     ctx.fillText("10.44", canvas.width/10+offset, (canvas.height-canvas.height/4));
    //     ctx.fillText("10.71", canvas.width/3+offset, (canvas.height-canvas.height/4));
    
    // }
    // else if (selectedValue === "trapezoid") 
    // {
    //     ctx.beginPath();
    //     ctx.moveTo(canvas.width/10, canvas.height-10);
    //     ctx.lineTo(canvas.width/2, canvas.height-10);
    //     ctx.lineTo(canvas.width/4, canvas.height/2);
    //     ctx.lineTo(canvas.width/10, canvas.height/2);
    //     ctx.closePath();
    //     ctx.stroke();
    // }
    // else if (selectedValue === "rectangle") 
    // {
    //     ctx.strokeRect(canvas.width/10, canvas.height/2, canvas.width/2-canvas.width/10, canvas.height/2-10);
    // }
}

// function changeShape() {
//     var selectedShape = document.getElementById("shape").value;
    
//     document.getElementById("triangle").style.display = "none";
//     document.getElementById("trapezoid").style.display = "none";
//     document.getElementById("rectangle").style.display = "none";

//     document.getElementById(selectedShape).style.display = "block";
// }

function modelColor()
{
    return [0.6,0.6,0.6];
}

// function drawGrid(rotating)
// {
//     vertexData= [
//         //koordinatne ose
//         1.0, 0.0, 0.0,
//         0.0, 0.0, 0.0,
//         0.0, 1.0, 0.0,
//         0.0, 0.0, 0.0,
//         0.0, 0.0, 1.0,
//         0.0, 0.0, 0.0
//     ];
    
//     colorData = [
//         //boje x,y,z ose
//         1.0, 0.0, 0.0,
//         1.0, 0.0, 0.0,
//         0.0, 1.0, 0.0,
//         0.0, 1.0, 0.0,
//         0.0, 0.0, 1.0,
//         0.0, 0.0, 1.0,
//     ];

//     normalData = [
//         //vektor normale
//         0.0,1.0,0.0,
//         0.0,1.0,0.0,
//         0.0,1.0,0.0,
//         0.0,1.0,0.0,
//         0.0,1.0,0.0,
//         0.0,1.0,0.0,
//     ];

//     let density = 8;
//     let size = 4.0;
//     let factor = size/density;
    
//     for (i = 0; i <= density*2; i++)
//         {
//             gridVertex1 = [size,-0.01,-size+factor*i];
//             gridVertex2 = [-size,-0.01,-size+factor*i];
//             vertexData.push(...gridVertex1);
//             vertexData.push(...gridVertex2);
//             gridColor = [0.6,0.6,0.6];
//             colorData.push(...gridColor);
//             colorData.push(...gridColor);
//             normalData.push(...[0.0,1.0,0.0]);
//             normalData.push(...[0.0,1.0,0.0]);
//             gridVertex3 = [size-factor*i,-0.01,size];
//             gridVertex4 = [size-factor*i,-0.01,-size];
//             vertexData.push(...gridVertex3);
//             vertexData.push(...gridVertex4);
//             colorData.push(...gridColor);
//             colorData.push(...gridColor);
//             normalData.push(...[0.0,1.0,0.0]);
//             normalData.push(...[0.0,1.0,0.0]);
//         }
//     webgl(gl.LINES,rotating);
// }
// drawGrid(true);

// function drawCircle(dense,r)
// {
//     let density = dense;
//     let size = r;
//     let theta = (Math.PI*2)/density;
//     let cosine = Math.cos(theta);
//     let sine = Math.sin(theta);
//     circleVertex = [size,0.0,0.0];
//     vertexData.push(...circleVertex);
//     colorData.push(...modelColor());
//     normalData.push(...[0.0,1.0,0.0]);
//     for(i=0;i<density;i++)
//     {
//         circleVertex = [cosine*circleVertex[0]+sine*circleVertex[2],0.0,-sine*circleVertex[0]+cosine*circleVertex[2]];
//         vertexData.push(...circleVertex);
//         vertexData.push(...circleVertex);
//         colorData.push(...modelColor());
//         colorData.push(...modelColor());
//         normalData.push(...[0.0,1.0,0.0]);
//         normalData.push(...[0.0,1.0,0.0]);
//     }
//     webgl(gl.LINE_STRIP,true);
// }
// drawCircle(10,2.0);

function drawCone(a,h,dense,cam_height,base_height)
{
    console.log(cam_height,base_height);
    if(a==0 || h==0)
    {
        console.log("nepopunjene dimenzije");
    }
    else
    {
        
        let density = dense;
        let size = a;
        
        let theta = (Math.PI*2)/density;
        let cosine = Math.cos(theta);
        let sine = Math.sin(theta);
        circleVertex = [size,base_height,0.0];

        for(i=0;i<=density;i++)
        {
            coneTipVertex = [0.0,h+base_height,0.0];
            vertexData.push(...coneTipVertex);
            colorData.push(...modelColor());
            
            vertexData.push(...circleVertex);
            colorData.push(...modelColor());

            vector1=[circleVertex[0]-coneTipVertex[0],circleVertex[1]-coneTipVertex[1],circleVertex[2]-coneTipVertex[2]];

            circleVertexOld = circleVertex;

            circleVertex = [cosine*circleVertex[0]+sine*circleVertex[2],base_height,-sine*circleVertex[0]+cosine*circleVertex[2]];
            vertexData.push(...circleVertex);
            colorData.push(...modelColor());

            vector2 = [circleVertex[0]-circleVertexOld[0],circleVertex[1]-circleVertexOld[1],circleVertex[2]-circleVertexOld[2]];
            
            // U-vector1, V-vector2
            // Nx = UyVz - UzVy
            // Ny = UzVx - UxVz
            // Nz = UxVy - UyVx
            normalVector = [vector1[1]*vector2[2]-vector1[2]*vector2[1],
            vector1[2]*vector2[0]-vector1[0]*vector2[2],
            vector1[0]*vector2[1]-vector1[1]*vector2[0]];
            let normalMagnitude = Math.sqrt(normalVector[0]*normalVector[0]+normalVector[1]*normalVector[1]+normalVector[2]*normalVector[2]);
            normalVector = [normalVector[0]/normalMagnitude,normalVector[1]/normalMagnitude,normalVector[2]/normalMagnitude];

            normalData.push(...normalVector);
            normalData.push(...normalVector);
            normalData.push(...normalVector);

        }
        webgl(gl.TRIANGLES,false,cam_height);
    }
        
}

function drawCylinder(a,b,dense,cam_height,base_height)
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

        for(i=0;i<=dense;i++)
        {
            if(i==0)
            {
                //prvo teme trouglica
                wrapVertexTop = [radius,height+base_height,0.0];
                vertexData.push(...wrapVertexTop);
                colorData.push(...modelColor());
        
                //drugo teme trouglica
                wrapVertexBottom = [radius,base_height,0.0];
                vertexData.push(...wrapVertexBottom);
                colorData.push(...modelColor());
            }
            else
            {
                vertexData.push(...wrapVertexTop);
                colorData.push(...modelColor());
                vertexData.push(...wrapVertexBottom);
                colorData.push(...modelColor());
            }

            //prvi vektor za cross product: U = p2-p1
            vector1=[wrapVertexBottom[0]-wrapVertexTop[0],wrapVertexBottom[1]-wrapVertexTop[1],wrapVertexBottom[2]-wrapVertexTop[2]];
        
            wrapVertexTopOld = wrapVertexTop;

            //trece teme trouglica
            wrapVertexTop = [cosine*wrapVertexTop[0]+sine*wrapVertexTop[2],height+base_height,-sine*wrapVertexTop[0]+cosine*wrapVertexTop[2]];
            vertexData.push(...wrapVertexTop);
            colorData.push(...modelColor());

            //drugi vektor za cross product: V = p3-p1
            vector2 = [wrapVertexTop[0]-wrapVertexTopOld[0],wrapVertexTop[1]-wrapVertexTopOld[1],wrapVertexTop[2]-wrapVertexTopOld[2]];

            // U-vector1, V-vector2
            // Nx = UyVz - UzVy
            // Ny = UzVx - UxVz
            // Nz = UxVy - UyVx
            normalVector = [vector1[1]*vector2[2]-vector1[2]*vector2[1],
            vector1[2]*vector2[0]-vector1[0]*vector2[2],
            vector1[0]*vector2[1]-vector1[1]*vector2[0]];
            let normalMagnitude = Math.sqrt(normalVector[0]*normalVector[0]+normalVector[1]*normalVector[1]+normalVector[2]*normalVector[2]);
            normalVector = [normalVector[0]/normalMagnitude,normalVector[1]/normalMagnitude,normalVector[2]/normalMagnitude];
            
            //provera da li su normalni vektori jedinicni
            // normalMagnitude = Math.sqrt(normalVector[0]*normalVector[0]+normalVector[1]*normalVector[1]+normalVector[2]*normalVector[2]);
            // console.log(normalMagnitude);

            //cetiri normale jer pushujemo 4 vertexa po ciklusu petlje
            normalData.push(...normalVector);
            normalData.push(...normalVector);
            normalData.push(...normalVector);
            normalData.push(...normalVector);
            
            wrapVertexBottom = [cosine*wrapVertexBottom[0]+sine*wrapVertexBottom[2],base_height,-sine*wrapVertexBottom[0]+cosine*wrapVertexBottom[2]];
            vertexData.push(...wrapVertexBottom);
            colorData.push(...modelColor());
        }
        webgl(gl.TRIANGLE_STRIP,false,cam_height);
    }
}

function drawTruncatedCone(a,b,h,dense,cam_height,base_height)
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

        for(i=0;i<dense;i++)
        {
            if(i==0)
            {
                wrapVertexInner = [inner,height+base_height,0.0];
                wrapVertexOuter = [outer,base_height,0.0];
                vertexData.push(...wrapVertexInner);
                vertexData.push(...wrapVertexOuter);
                colorData.push(...modelColor());
                colorData.push(...modelColor());
            }
            else
            {
                vertexData.push(...wrapVertexInner);
                vertexData.push(...wrapVertexOuter);
                colorData.push(...modelColor());
                colorData.push(...modelColor());
            }

            vector1=[wrapVertexOuter[0]-wrapVertexInner[0],wrapVertexOuter[1]-wrapVertexInner[1],wrapVertexOuter[2]-wrapVertexInner[2]];

            wrapVertexInnerOld = wrapVertexInner;

            wrapVertexInner = [cosine*wrapVertexInner[0]+sine*wrapVertexInner[2],height+base_height,-sine*wrapVertexInner[0]+cosine*wrapVertexInner[2]];
            vertexData.push(...wrapVertexInner);
            colorData.push(...modelColor());

            vector2 = [wrapVertexInner[0]-wrapVertexInnerOld[0],wrapVertexInner[1]-wrapVertexInnerOld[1],wrapVertexInner[2]-wrapVertexInnerOld[2]];

            // U-vector1, V-vector2
            // Nx = UyVz - UzVy
            // Ny = UzVx - UxVz
            // Nz = UxVy - UyVx
            normalVector = [vector1[1]*vector2[2]-vector1[2]*vector2[1],
            vector1[2]*vector2[0]-vector1[0]*vector2[2],
            vector1[0]*vector2[1]-vector1[1]*vector2[0]];
            let normalMagnitude = Math.sqrt(normalVector[0]*normalVector[0]+normalVector[1]*normalVector[1]+normalVector[2]*normalVector[2]);
            normalVector = [normalVector[0]/normalMagnitude,normalVector[1]/normalMagnitude,normalVector[2]/normalMagnitude];

            normalData.push(...normalVector);
            normalData.push(...normalVector);
            normalData.push(...normalVector);
            normalData.push(...normalVector);

            wrapVertexOuter = [cosine*wrapVertexOuter[0]+sine*wrapVertexOuter[2],base_height,-sine*wrapVertexOuter[0]+cosine*wrapVertexOuter[2]];
            vertexData.push(...wrapVertexOuter);
            colorData.push(...modelColor());
        }
        webgl(gl.TRIANGLE_STRIP,false,cam_height);
    }
}

function webgl(glDrawMode,animacija,height)
{


    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, `
    precision mediump float;

    const vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
    const float ambient = 0.2;

    attribute vec3 position;
    attribute vec3 normal;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vBrightness;

    uniform mat4 matrix;
    uniform mat4 normalMatrix;

    void main(){
        vec3 worldNormal = (normalMatrix * vec4(normal, 1)).xyz;
        float diffuse = max(0.0, dot(worldNormal, lightDirection));
        vBrightness = ambient + diffuse;
        vColor = color*vBrightness;

        gl_Position = matrix * vec4(position, 1);
    }
    `);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,`
    precision mediump float;

    varying float vBrightness;
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
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    const uniformLocations = {
        matrix: gl.getUniformLocation(program,`matrix`),
        normalMatrix: gl.getUniformLocation(program, `normalMatrix`),
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


    
    mat4.translate(viewMatrix,viewMatrix,[0.0,10.0,18.0]);
    mat4.invert(viewMatrix,viewMatrix);

    const normalMatrix = mat4.create();

    function animate() {
        // if(height==camheight)
        // {
        //     gl.clearColor(0.612, 0.929, 1.0, 1.0);
        //     gl.clear(gl.COLOR_BUFFER_BIT);
        // }


        mat4.rotateY(modelMatrix, modelMatrix, Math.PI/200);
        mat4.multiply(mvMatrix,viewMatrix,modelMatrix);
        mat4.multiply(mvpMatrix,projectionMatrix,mvMatrix);
        
        mat4.invert(normalMatrix, mvMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);
        gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
        
        gl.drawArrays(glDrawMode, 0, vertexData.length/3);
        
        requestAnimationFrame(animate);
    }

    // mat4.rotateX(modelMatrix, modelMatrix, Math.PI/2);
    if(!animacija)
    {
        if(height==camheight)
        {
            gl.clearColor(0.612, 0.929, 1.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
        mat4.multiply(mvMatrix,viewMatrix,modelMatrix);
        mat4.multiply(mvpMatrix,projectionMatrix,mvMatrix);

        mat4.invert(normalMatrix, mvMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        gl.uniformMatrix4fv(uniformLocations.normalMatrix, false, normalMatrix);
        gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);

        gl.drawArrays(glDrawMode, 0, vertexData.length/3);
    }
    else
    {
        animate();
    }
}