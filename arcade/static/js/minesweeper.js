const board = document.querySelector("#grid");
const btn = document.querySelector("#btn");
let columns = 10;
let rows = 8;
let blockSize = "5vw";
let bombs = 10;
const DR = [-1, -1, 0, 1, 1, 1, 0, -1];
const DC = [0, 1, 1, 1, 0, -1, -1, -1];
let first = true;
let running = true;
let flags = bombs;
let flagging = false;
let gameMode = document.querySelector("#levels");
let themes = document.querySelector("#themes")
let flagCount = document.querySelector("#flagBox h1");
let hBlockMultiplier = 0.75;
let vBlockMultiplier = 1.8;
const mql = window.matchMedia("(min-height: 830px)");
const mql2 = window.matchMedia("(orientation:portrait)");
let BGcolor1 = "rgb(189, 189, 189)";
let BGcolor2 = "rgb(189, 189, 189)";

let startTime;
let stopwatch;
let time = document.querySelector("#timer p")
let milliseconds = 0;
let seconds = 0;
let minutes = 0;

let grid = Array.from(Array(rows), row => Array(columns));
//free, clear, bomb
//free = starting spaces that you get
//clear = you work to actually clear it
//bomb = you lose
//cleared = background cleared

function settings(col, row, block, NumBombs){
    columns = col;
    rows = row;
    blockSize = block;
    bombs = NumBombs;
    flags = bombs;
}

function changeBlockSize(mql){
    if(mql.matches){
        blockSize = `${Number(blockSize.split("vw")[0]) * hBlockMultiplier}vw`;
        
    }
}

function changeOrientation(mql2){
    if(mql2.matches){
        tempR = rows;
        rows = columns;
        columns = tempR;
        blockSize = `${Number(blockSize.split("vw")[0]) * vBlockMultiplier}vw`;
    }
}

changeBlockSize(mql);
changeOrientation(mql2);
mql.addEventListener("change", changeBlockSize);
mql2.addEventListener("change", changeOrientation);

createBoard();

function newGame(){
    while(board.firstChild){
        board.removeChild(board.firstChild);
    }

    createBoard();
    board.style.width = `calc(${blockSize} * ${columns})`;
    running = true;
    grid = Array.from(Array(rows), row => Array(columns));
    first = true;
    flags = bombs;
    flagCount.textContent = `Flags: ${flags}`;

    clearInterval(stopwatch);
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    time.textContent = `0:00:000`;
}

function timer(){
    let currTime = new Date;

    let difference = Array.from((currTime - startTime).toString());
    milliseconds = Number(difference.slice(difference.length-3, difference.length).join(""));

    seconds = Number(difference.slice(0, difference.length-3).join(""));
    if(seconds >= ((minutes+1) *60)){
        minutes++
    }
    seconds -= (minutes * 60)
    time.textContent = `${minutes}:${seconds}:${milliseconds}`;
}

document.querySelector("html").style.backgroundColor = "rgb(189, 189, 189)";

themes.addEventListener("change", ()=>{
    let selected = themes.selectedOptions[0]
    themes.style.backgroundColor = selected.value;

    if(selected.textContent === "Mario"){
        document.querySelector("html").style.backgroundColor = "brown";
        document.querySelector("html").style.backgroundImage = "url(/static/images/marioB.jpg)";
        BGcolor1 = "rgb(67, 176, 71)";
        BGcolor2 = "rgb(251, 208, 0)";
    } else if(selected.textContent === "Classic"){
        document.querySelector("html").style.backgroundImage = "";
        document.querySelector("html").style.backgroundColor = "rgb(189, 189, 189)";
        BGcolor1 = "rgb(189, 189, 189)";
        BGcolor2 = "rgb(189, 189, 189)";
    }
    newGame();
});

gameMode.addEventListener("change", ()=>{
    gameMode.style.backgroundColor = gameMode.selectedOptions[0].value;
    let level = gameMode.selectedOptions[0].textContent;
    switch(level){
        case "easy":
            settings(10, 8, "5vw", 10);
            break;
        case "medium":
            settings(15,11, "4vw", 20);
            break;
        case "hard":
            settings(20, 13, "3.5vw", 40);
            break;
        case "expert":
            settings(30,16, "2.5vw", 99);
            break;
        case "impossible":
            settings(33,17, "2.3vw", 150);
            break;
    }
    changeBlockSize(mql);
    changeOrientation(mql2)

    newGame();
});


function randColor(){
    return Math.floor(Math.random() * 256);
}

board.addEventListener("contextmenu", e =>{
    e.preventDefault();
})

function firstClear(spot){
    grid[spot[0]][spot[1]] = "free";
    let around = [];

    for(let d = 0; d < DR.length; d++){
        new_r = spot[0]+DR[d];
        new_c = spot[1] + DC[d];
        if(new_r >= 0 && new_r < rows && new_c >= 0 && new_c < columns){
            around.push([new_r, new_c]);
        }
    }

    let num = Math.floor(Math.random() * around.length);
    grid[around[num][0]][around[num][1]] = "free";
    around.splice(num, 1);
    
    for(let place of around){
        if(Math.random() < 0.5){
            grid[place[0]][place[1]] = "free";
        }
    }

    for(let r = 0; r < rows; r++){
        for(let c = 0; c <columns; c++){
            if(grid[r][c] === "free"){
                for(let d = 0; d< DR.length; d++){
                    new_r = r + DR[d];
                    new_c = c + DC[d];
                    if(new_r >= 0 && new_r < rows && new_c >= 0 && new_c < columns && grid[new_r][new_c] !== "free"){
                        grid[new_r][new_c] = "clear";
                    }
                }
            }
        }
    }
}

function checkWin(){
    //if not bomb && background is not none then not win 
    for(let r = 0; r < rows; r++){
        for(let c = 0; c< columns; c++){
            let square = document.getElementById(`${r},${c}`);
            if(square.style.backgroundImage !== "none" && grid[r][c] !== "bomb"){
                return false
            }
        }
    }
    return true;
}

function plantBombs(bombs, spot){
    firstClear(spot);
    const coordinates = [];
    while(bombs > 0){
        let row = Math.floor(Math.random() * rows);
        let column = Math.floor(Math.random() * columns);
        if(grid[row][column] === undefined){
            grid[row][column] = "bomb";
            let place = document.getElementById(`${row},${column}`);
            let bomb = document.createElement("img");
            bomb.setAttribute("class", "bomb");
            bomb.setAttribute("src", "/static/images/bomb.png");
            bomb.style.width = `${blockSize}`;
            bomb.style.height = `${blockSize}`;
            bomb.style.transform = "scale(0.8)";
            place.append(bomb);
            coordinates.push([row,column]);
            bombs--;
        }
    }

    for(let point of coordinates){
        for(let d = 0; d< DR.length; d++){

            incR = point[0] + DR[d];
            incC = point[1] + DC[d];
            if(incR >= 0 && incR < rows && incC >= 0 && incC < columns && grid[incR][incC] !== "bomb"){
                if([undefined, "free", "clear"].includes(grid[incR][incC])){
                    grid[incR][incC] = 1;
                } else{
                    grid[incR][incC] += 1
                }
            }
        }
    }

    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(Number.isFinite(grid[r][c])){
                let num = document.createElement("div");
                num.style.fontSize = blockSize;
                num.style.width = blockSize;
                num.style.height = blockSize;
                num.style.lineHeight = blockSize;
                num.setAttribute("class", "num");
                let numBlock = document.getElementById(`${r},${c}`);
                num.textContent = `${grid[r][c]}`;

                switch(grid[r][c]){
                    case 1:
                        num.style.color = "blue";
                        break;
                    case 2:
                        num.style.color = "green";
                        break;
                    case 3:
                        num.style.color = "red";
                        break;
                    case 4:
                        num.style.color = "purple";
                        break;
                    case 5:
                        num.style.color = "maroon";
                        break;
                    case 6:
                        num.style.color = "turquoise";
                        break;
                    case 7:
                        num.style.color = "black";
                        break;
                    case 8:
                        num.style.color = "gray";
                        break;
                }
                numBlock.append(num);
            }
        }
    }
}

function clear(spot){
    let open = document.getElementById(`${spot[0]},${spot[1]}`);
    if(Number.isFinite(grid[spot[0]][spot[1]])){
        open.style.backgroundImage = "none";

        if(open.querySelector(".num")){
            open.querySelector(".num").style.visibility = "visible";
        }

        grid[spot[0]][spot[1]] = "cleared";
    } else{
        open.style.backgroundImage = "none";
        grid[spot[0]][spot[1]] = "cleared";
        for(let d = 0; d <DR.length; d++){
            newR = spot[0] + DR[d];
            newC = spot[1] + DC[d];
            if(newR >= 0 && newR < rows && newC >= 0 && newC < columns && grid[newR][newC] !== "bomb" && grid[newR][newC] !== "cleared"){
                clear([newR,newC]);
            }
        }
    }
}

function createBoard(){
    flagCount.textContent = `Flags: ${flags}`;
    for(let r = 0; r < rows; r++){
        let row = document.createElement("div");
        row.setAttribute('class', "row");
        for(let c = 0; c < columns; c++){
            let block = document.createElement("div");
            block.style.width = blockSize;
            block.style.height = blockSize;
            (r % 2 === 0 && c % 2 === 1) ? block.style.backgroundColor = `${BGcolor1}`: (r % 2 === 1 && c % 2 === 0) ? block.style.backgroundColor = `${BGcolor1}`: block.style.backgroundColor = 
            `${BGcolor2}`;
            block.style.backgroundSize = blockSize;
            block.setAttribute("class", "block");
            block.setAttribute("id", `${r},${c}`);

            if(themes.selectedIndex === 0){
                block.style.backgroundImage = "url(/static/images/block.png)";
            } else if(themes.selectedIndex === 1){
                block.style.backgroundImage = "url(/static/images/tile.png)";
                block.style.border = "2px solid grey";
            }
            row.append(block);
        }
        board.append(row);
    }
}

function chord(bombNum, coordinate){
    let flagCount = 0;
    let allGood = true;

    for(let i = 0; i<2; i++){
        for(let d = 0; d <DR.length; d++){
            let newR = coordinate[0] + DR[d];
            let newC = coordinate[1] + DC[d];
            if(newR >= 0 && newR < rows && newC >= 0 && newC < columns){
                let place = document.getElementById(`${newR},${newC}`);
                if(i === 0){
                    if(place.querySelector(".flag")){
                        flagCount ++;
                    }
                } else if(i === 1 && flagCount === bombNum){
                    if(place.querySelector(".bomb") && !(place.querySelector(".flag"))){
                        allGood = false;
                    } else if(!(place.querySelector(".flag")) && place.style.backgroundImage !== "none"){
                        clear([newR,newC]);
                    }
                }
            }
        }
    }

    if(!(allGood)){
        explode()
    }
}

// fetch("/minesweeper/", {
//     method: "GET",
//     headers: {
//         "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//         name: "Golden"
//     })
// }).then(res => {
//     return res.json()
//     })
//     .then(data => console.log(data))
//     .catch(error=> console.error("ERROR"))

// axios({
//     "method":"POST",
//     "url": "http://127.0.0.1:8000/minesweeper/post/?key=abc123",
//     "params": {
//         "key": "abc123"
//     },
//     "data": {
//         "firstname": "Golden",
//         "lastname": "Lin"
//     },
//     credential : "same-origin",
// }).then(response => {
//     console.log(response.data);
// }, error => {
//     console.error(error)
// });

function end(condition){
    let endingScreen = document.createElement("div");
    endingScreen.setAttribute("id", "ending");
    endingScreen.style.width = `calc(${blockSize} * ${columns})`;
    endingScreen.style.height = `calc(${blockSize} * ${rows})`
    endingScreen.style.backgroundColor = `rgba(0,0,0,0.7)`;
    let text = document.createElement("p");
    text.setAttribute("id", "text");

    let btn = document.createElement("button");
    btn.setAttribute("id", "endBtn");
    
    if(condition === "lose"){
        text.textContent = "BOOM! The city exploded : (";
        btn.style.backgroundColor = "red";
        text.style.color = "red";
    } else {
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
        
        const serverUrl = "https://golden-games.herokuapp.com/minesweeper/"
        const request = new Request(serverUrl, { headers: { 'X-CSRFToken': getCookie("csrftoken") } })
        fetch(request, {
            method: "POST",
            mode: "same-origin",
            body: JSON.stringify({
                score: time.textContent,
                difficulty: gameMode.selectedOptions[0].textContent
            })
        }).then(response => {
            console.log(response)
        }).catch(err => {
            console.log(err)
        });

        text.textContent = `Hip-Hip Hooray, you saved city from the bombs being set off in `;
        if(minutes !== 0){
            (minutes === 1) ? text.textContent += `${minutes} minute `: text.textContent += `${minutes} minutes `;
        }
        (seconds === 1) ? text.textContent += `${seconds} second and`: text.textContent += `${seconds} seconds and`;
        text.textContent += ` ${milliseconds} milliseconds!!!`;
        btn.style.backgroundColor = "lawngreen";
        text.style.color = "lawngreen";
    }

    function matchings(x){
        if(x.matches){
            text.style.fontSize = "5rem"; //on big screen at least 830px or bigger
        } else{
            text.style.fontSize = "3rem"; //on small screen
        }
    }

    let x = window.matchMedia("(min-height: 900px)");
    matchings(x);

    endingScreen.append(text);
    endingScreen.append(btn);
    document.querySelector("#grid").append(endingScreen);

    btn.addEventListener("click", ()=>{
        endingScreen.remove();
        newGame();
    });
}

function explode(){
    const allBombs = document.querySelectorAll(".bomb");
    for(let bomb of allBombs){
        bomb.style.visibility = "visible";
        bomb.parentElement.style.backgroundImage = "none";
        bomb.parentElement.style.backgroundColor = `rgb(${randColor()},${randColor()},${randColor()})`;
    }
    //BOOM! The city exploded : (
    running = false;
    end("lose");
    clearInterval(stopwatch);
}

board.addEventListener("click", (e)=>{
    if(running && btn.style.backgroundColor !== "red"){

        let blockSpot;
        let numSpot;

        if(e.target.getAttribute("id") !== null){
            blockSpot = e.target.getAttribute("id").split(",").map(num => Number(num));
        } else if(e.target.getAttribute("class") !== null){
            numSpot = Number(e.target.textContent)
        }

        if(first){
            plantBombs(bombs, blockSpot);
            first = false;
            startTime = new Date;
            stopwatch = setInterval(timer, 1);
        }
    
        if(blockSpot !== undefined && grid[blockSpot[0]][blockSpot[1]] === "bomb"){
            clearInterval(stopwatch);
            explode(); //aka lose
        } else if(numSpot){
            let spot = e.target.parentElement.getAttribute("id").split(",").map(num => Number(num));
            //if the number of flags === the number that you clicked, aka num Spot, then call clear(), incorrect chording kills you
            chord(numSpot, spot);
        } else{
            clear(blockSpot);
        }

        let win = checkWin();
        if(win && !(first)){
            clearInterval(stopwatch);
            end("win");
        }
    }

// bomb flashing, Leaderboard for how fast?
// save princess peach mario vs bowser
});

board.addEventListener("mousedown", e =>{
    //not cleared/free on grid and not class num
    if(running && (e.button === 2 || flagging) && !(e.target.style.backgroundImage === "none" || e.target.getAttribute("class") === "num")){
        let taken = e.target.querySelector(".flag");
        if(taken){
            taken.remove();
            flags++;
        }else if(flags > 0){
            let flag = document.createElement("img");
            flag.setAttribute("src", "/static/images/flag.png");
            flag.setAttribute("class", "flag");
            flag.style.width = blockSize;
            flag.style.height = blockSize;
            e.target.append(flag);
            flags--;
        } else if(flags <= 0){
            flagCount.style.color = "red";
            setTimeout(()=>{
                flagCount.style.color = "black";
            }, 200)
        }
        flagCount.textContent = `Flags: ${flags}`;
    } else if(running && e.target.querySelector(".num")){
        let spot = e.target.getAttribute("id").split(",").map(num => Number(num));
        let numSpot = Number(e.target.textContent)
        chord(numSpot, spot);
        let win = checkWin();
        if(win && !(first)){
            clearInterval(stopwatch);
            end("win");
        }
    }
});

btn.addEventListener("click", ()=>{
    if(!(flagging)){
        flagging = true;
        btn.style.backgroundColor = "red";
    } else if(flagging){
        flagging = false;
        btn.style.backgroundColor = "white";
    }
});