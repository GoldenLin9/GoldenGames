let header = document.querySelector("header h1");
const title = "Golden Games";
let count = 0;
const glowTime = 125;
const aside = document.querySelector("aside");
const main = document.querySelector("main")
const searchBtn = document.querySelector("#search button");
const search = document.querySelector("#search");
const searchBox = document.querySelector("#searchBox");


function displayAside(){
    let side = document.createElement("div");
    let x = document.createElement("img");

    x.setAttribute("id", "sideX");
    x.setAttribute("src", "img/x.png")
    side.setAttribute("id", "side");

    side.append(x);
    side.append(aside);
    document.querySelector("body").append(side);

    x.addEventListener("click", ()=>{
        document.querySelector("#side").remove();
    })
}


window.addEventListener("resize", ()=>{
    if(window.matchMedia("(max-width: 700px)").matches && main.contains(aside)){
        filters.options[0].textContent = "";
        sort.options[0].textContent = ""
        aside.remove();
        if(!(search.querySelector("#hamburger"))){
            let hamburger = document.createElement("button");
            hamburger.setAttribute("id", "hamburger");
            document.querySelector("#center").append(hamburger);
            hamburger.addEventListener("click", displayAside)
        }
    } else if(window.matchMedia("(min-width:701px)").matches && !(main.contains(aside))){ // >680px and 
        filters.options[0].textContent = " -- select an option -- ";
        sort.options[0].textContent = " -- select an option -- "
        main.append(aside);
        document.querySelector("#hamburger").remove();

    }
})


for(let letter of title){
    let single = document.createElement("span");
    single.textContent = letter;
    header.append(single);
}


function deglow(letter){
    letter.style.textShadow = "3px 3px 3px black";
}


function glow(){
    let letter = document.querySelector(`header h1 span:nth-child(${(count % title.length)+1})`);
    if(letter.textContent === " "){
        count++;
        letter = document.querySelector(`header h1 span:nth-child(${(count % title.length)+1})`);
    }
    letter.style.textShadow = "3px 3px 3px white";
    count+= 1;
    setTimeout(deglow, glowTime, letter)
}
setInterval(glow, glowTime);