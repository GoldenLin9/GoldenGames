let header = document.querySelector("header h1");
const title = document.querySelector("#hidden-title").textContent;
let count = 1;
const glowTime = 125;

for(let letter of title.toString()){
    let single = document.createElement("span");
    single.textContent = letter;
    header.append(single);
}


function deglow(letter){
    letter.style.textShadow = "3px 3px 3px black";
}


function glow(){
    if(count >= title.length-1){
        count = 1
    }

    let letter = document.querySelector(`header h1 span:nth-child(${count})`);
    while(letter.textContent === " "){
        count++;
        letter = document.querySelector(`header h1 span:nth-child(${count})`);
    }
    letter.style.textShadow = "3px 3px 3px white";
    count+= 1;
    setTimeout(deglow, glowTime, letter)
}
setInterval(glow, glowTime);