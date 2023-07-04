const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const aside = document.querySelector("aside");
const banner = document.querySelector("#banner");
const button = document.querySelector("#icon-container");

const vLines = 7; // blocks in x-axis
const hLines = 11; // blocks in y-axis
let height = canvas.height = window.innerHeight * (0.75);
let width = canvas.width = (window.innerHeight * (0.75)/hLines) * vLines;
banner.style.width = `${width}px`;

let bg = ["/static/images/land.jpg", "/static/images/sky.jpg", "/static/images/space.jpg", "/static/images/outerSpace.jpg"];
let currLvl = 1;
let blockCount = 3;
let blocks = [];
let blockSize = width/vLines;
let points = 0;
let dragLvl = 8; 
let dragged = 0;
let start = false;
let startingRate = 500 //11th lvl = moves 1 block every 75ms

let grid = Array.from(Array(hLines), row => Array(vLines).fill(false));

let rAf;

let img = new Image();
img.src = "/static/images/brick.jpeg"
function drawBlock(x, y){
    ctx.drawImage(img, 0,0, 612, 612, x * blockSize, y * blockSize, blockSize, blockSize);
}

class Block{

    constructor(velocity, pos, level){
        this.vel = velocity;
        this.pos = pos;
        this.lvl = level;
    }
}

let topBackground = new Image();
topBackground.src = bg[0];
let bottomBackground = new Image();
bottomBackground.src = bg[0];
function drawBackground(url, coord){
    ctx.drawImage(url, 0,0, url.width, url.height, coord[0] * blockSize, coord[1] * blockSize, width, height);
}

function lines(){
    for(let v = 1; v <= vLines; v++){
        ctx.beginPath();
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.lineWidth = 1;
        ctx.moveTo(v * (width/vLines), 0);
        ctx.lineTo(v * (width/vLines), height);
        ctx.stroke();
    }

    for(let h = 1; h <= hLines; h++){
        ctx.beginPath();
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.lineWidth = 1;
        ctx.moveTo(0, h * (height/hLines));
        ctx.lineTo(width, h * (height/hLines));
        ctx.stroke();
    }
}

function background(){
    drawBackground(topBackground, [0, -(hLines - ((dragLvl-1) * dragged) % hLines)]);
    drawBackground(bottomBackground, [0, ((dragLvl-1) * dragged) % hLines]);
}

let timePassed;
let rate = startingRate; //moves 1 block every __ ms //higher rate doesn't do fast left & right glitch, lower = more prone to fast glitch
let looped = 0;
function draw(timeStamp){
    timePassed = timeStamp;
    background();
    lines();

    if(!blocks.length){
        let vel = (Math.random() > 0.5) ? -1: 1;
        let start = Math.floor(Math.random() * ((vLines - 1) + (blockCount - 1) + (blockCount - 1)))-(blockCount-1);

        for(let x = 0; x < blockCount; x++){
            let block = new Block(vel, start+x, currLvl);
            blocks.push(block);
        }

    } else if(timeStamp >= looped * rate){
        for(let block of blocks){
            if(blocks.indexOf(block) === 0 && (block.pos + block.vel > (vLines-1) || block.pos + block.vel < -(blockCount-1))){
                for(let b of blocks){
                    b.vel *= -1;
                }
            }
            block.pos+= block.vel;
        }
        looped ++;
    }

    for(let block of blocks){
        drawBlock(block.pos, hLines - block.lvl);
    }

    for(let r = 0; r < grid.length; r++){
        for(let c = 0; c < grid[r].length; c++){
            if(grid[r][c]){
                drawBlock(c,r);
            }

        }
    }

    rAf = requestAnimationFrame(draw);
}

draw();

function drag(){
    (Math.floor(points/hLines)+1 >= bg.length) ? topBackground.src = bg[bg.length-1]: topBackground.src = bg[Math.floor(points/hLines)+1];
    (Math.floor(points/hLines) >= bg.length) ? bottomBackground.src = bg[bg.length-1]: bottomBackground.src = bg[Math.floor(points/hLines)];


    let row = grid[grid.length - dragLvl];
    grid = Array.from(Array(hLines), row=> Array(vLines).fill(false));
    grid[grid.length-1] = row;
    currLvl = 1;
    dragged++;
}

function place(){

    for(let block of blocks){
        if(block.pos >= 0 && block.pos <= vLines-1){
            grid[hLines - block.lvl][block.pos] = true;
            if(block.lvl >= 2){
                if(!grid[hLines - block.lvl + 1][block.pos]){
                    blockCount--;
                    grid[hLines - block.lvl][block.pos] = false;
                }
            }
        } else{
            blockCount--;
        }
    }

    if(currLvl === dragLvl){
        drag();
    }

    if(blockCount >= 1){
        points++;
        aside.textContent = `Tower Height: ${points} blocks`
    } else{
        end();
    }
// reset rate when below stage 3 and take set blocks

    if(points % 11 === 0 && points < 3 * hLines){
        rate = startingRate;
        looped = Math.ceil(timePassed/rate);
        blockCount = Math.min(3- (points/hLines), blockCount);
    } else if(points >= 3 * hLines){
        rate *= 0.95;
        blockCount = 1;
    } else{
        rate *= (75/startingRate) ** (1/11);
    }

    blocks.length = 0;
    currLvl++; 
}

function begin(){
    start = true;
    document.querySelector("#banner").style.display = "none";
    button.style.display = "none";
    canvas.style.filter = "none";

    if(points >= 1){
        points = 0;
        grid = Array.from(Array(hLines), row => Array(vLines).fill(false));
        currLvl = 1;
        aside.textContent = "Tower Height: 0 blocks";
        rate = startingRate;
        blockCount = 3;
        bottomBackground.src = bg[0];
        topBackground.src = bg[0];
        dragged = 0;
        draw();
    }
}

function end(){

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    const serverUrl = "http://127.0.0.1:8000/game/towers/"
    const request = new Request(serverUrl, { headers: { 'X-CSRFToken': getCookie("csrftoken") } })
    fetch(request, {
        method: "POST",
        mode: "same-origin",
        credentials: "same-origin",
        body: JSON.stringify({
            score: points.toString()
        })
    }).then(response => {
        console.log(response)
    }).catch(err => {
        console.log(err)
    });

    start = false;
    document.querySelector("#banner").style.display = "block";
    document.querySelector("#text").textContent = `Your building was ${points} blocks high!!!`;

    button.style.display = "grid";
    document.querySelector("#icon").setAttribute("class", "fa-solid fa-arrow-rotate-right")
    canvas.style.filter = "blur(1px)";
    looped = 1;
}

window.addEventListener("keydown", (e)=>{
    if(!start){
        begin();
    } else{
        if(e.key === " "){
            place();
        }
    }
});
canvas.addEventListener("click", ()=>{
    if(!start){
        begin();
    } else{
        place();
    }
});

button.addEventListener("click", begin)

window.addEventListener("resize", ()=>{
    height = canvas.height = window.innerHeight * (0.75);
    width = canvas.width = (window.innerHeight * (0.75)/hLines) * vLines;
    blockSize = width/vLines;
    banner.style.width = `${width}px`;
});