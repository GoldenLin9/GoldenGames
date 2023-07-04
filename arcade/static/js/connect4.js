const board = document.querySelector("#board");
const rows = 6;
const columns = 7;
let player1 = true;
const DR = [-1, -1, 0, 1, 1, 1, 0, -1];
const DC = [0, 1, 1, 1, 0, -1, -1, -1];
let win;
let won = false;
const button = document.querySelector("button");
let root = document.documentElement;

let grid = Array.from(Array(rows), row => Array(columns));

function isTie(){
    for(let row of grid){
        for(let column of row){
            if(column === undefined){
                return false;
            }
        }
    }
    return true;
}

function connect(type){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if(grid[r][c] !== undefined && grid[r][c] === type){
                for(let i = 0; i < DR.length; i++){
                    let check = [];
                    for(let v = 1; v <= 3; v++){
                        new_r = r + (v * DR[i]);
                        new_c = c + (v * DC[i]);
                        if(new_r >= 0 && new_r < rows && new_c >= 0 && new_c < columns && grid[new_r][new_c] === type){
                            check.push(grid[new_r][new_c]);
                        }
                    }
                    if(check.length === 3){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

for(let r = 0; r < rows; r++){
    for(let c = 0; c< columns; c++){
        const box = document.createElement("div");
        box.style.width = `calc((50vw / ${columns})`;
        box.style.height = `calc(75vh / ${rows})`;
        box.style.backgroundColor = "royalblue";

        const circle = document.createElement("div");
        circle.setAttribute("class", "circle");
        circle.setAttribute("id", `${r},${c}`)
        circle.style.width = `calc((50vw / ${columns})`;
        circle.style.height = `calc(75vh / ${rows})`;
        circle.style.backgroundColor = "orange";
        circle.style.borderRadius = "50%";
        circle.style.transform = "scale(0.8)";

        box.append(circle);
        board.append(box);
    }
}

board.addEventListener("mousedown", (e)=>{
    if(e.target.getAttribute("class") === "circle" && !(won)){
        let spot = e.target.getAttribute("id").split(",").map( num => Number(num));

        const position = spot[0] === (grid.length  - 1) || grid[spot[0] + 1][spot[1]] != undefined; //if on bottom row or ontop of another circle
        const place = e.target.style.backgroundColor === "orange"; //if on a orange circle and not on another color
    
        if(position && place){ //if 
            if(player1 === true){ //could check if background color !== orange, then put, fixes replacement
                e.target.style.backgroundColor = "turquoise";
                 //raise alert if placed circle is not above another circle
                grid[spot[0]][spot[1]] = "turquoise";
                win = connect("turquoise");
                player1 = false;

                if(!(win) && !(player1)){
                    root.style.setProperty("--color2", "rgba(0,0,0,0)");
                    root.style.setProperty("--color1", "rgba(0,0,0,0.5)");
                }
            } else if(player1 === false){
                e.target.style.backgroundColor = "firebrick";
                grid[spot[0]][spot[1]] = "firebrick";
                win = connect("firebrick");
                player1 = true;

                if(!(win) && player1){
                    root.style.setProperty("--color1", "rgba(0,0,0,0)");
                    root.style.setProperty("--color2", "rgba(0,0,0,0.5)");
                }
            }
            if(win){
                if(!(player1)){
                    document.querySelector("#player1 h1").textContent = " Player 1 has won!!!"
                } else if(player1){
                    document.querySelector("#player2 h1").textContent = "Player 2 has won!!!"
                }
                won = true;
                document.querySelector("button").style.visibility = "visible";
            }

            if(isTie()){
                document.querySelector("button").style.visibility = "visible";
                (player1) ? root.style.setProperty("--color1", "rgba(0,0,0,0.5)"):root.style.setProperty("--color2", "rgba(0,0,0,0.5)");
            }

        } else{
            if(!(position)){
                alert(`PLACE YOUR CIRCLE ON THE BOTTOMOST ROW OR ON TOP ON ANOTHER CIRCLE`)
            } else if (!(place)){
                alert(`DON'T TAKE SOMEONE ELSE'S SPOT 😠`)
            }
        }
    }
});

button.addEventListener("click", ()=>{
    document.querySelector("button").style.visibility = "hidden";
    player1 = true;
    won = false;
    let circles = document.querySelectorAll(".circle");
    let circles_lst = Array.from(circles);
    for(let circle of circles_lst){
        circle.style.backgroundColor = "orange";
    }
    grid = Array.from(Array(rows), row => Array(columns));
    document.querySelector("#player1 h1").textContent = " Player 1";
    document.querySelector("#player2 h1").textContent = "Player 2";
})