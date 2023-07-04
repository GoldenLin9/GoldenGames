let allPosts = document.querySelectorAll(".post")
let allCommentButton = document.querySelectorAll(".fa-message")
const boxHeight = (allPosts[0].offsetHeight).toString() + "px"
const boxMargin = allPosts.length == 1 ? "0px": ((allPosts[1].getBoundingClientRect()).top - (allPosts[0].getBoundingClientRect()).bottom) + "px"

let test = document.querySelector(".commentForm")
test.style.display = "block"
let formHeight = (test.offsetHeight).toString() + "px"
test.style.display = "none"

let minimizedHeight;
let addedEventListener = false

function post_tab(post){
    return Number(post.querySelector(".comment").className.split(" ")[0].replace("tab",""))
}

function clickExpansion(post, initial, end){
    //querySelect all from inital to end and make display: block

    let icon = post.querySelector("i")
    let posts = Array.from(post.parentElement.querySelectorAll(".post"))

    icon.addEventListener("click", ()=>{
        posts.slice(initial+1, end).forEach(post=>{
            post.style.display = "block"
        })

        post.querySelector("i").remove()
        post.querySelector(".minimize").style.display = "block"

        display_lines()
    })
}

function createExpansion(post){
    let exclude = post.querySelector(".minimize")
    exclude.style.display = "none"

    let head = post.querySelector(".head")

    let expandIcon = document.createElement("i")
    expandIcon.setAttribute("class", "fa-solid fa-up-right-and-down-left-from-center")
    expandIcon.setAttribute("id", "expand_arrow")
    expandIcon.style.cursor = "pointer"

    head.insertBefore(expandIcon, head.firstElementChild)
    minimizedHeight = post.clientHeight
}

function line(initial, end, post, posts){
    let line = post.querySelector(".line")

    line.addEventListener("click", ()=>{
        //minimize everything in front that's lower tab value
        cut = Array.from(posts).slice(initial+1, end)
        cut.forEach(post=> post.style.display = "none")
        
        createExpansion(post)
        clickExpansion(post, initial, end)
        display_lines()
        
    })
}

function draw_line(initial, end, post, collapsed, comments){
    let line = post.querySelector(".line")
    line.style.height = `calc(calc(calc(${boxHeight} * ${(end-initial-collapsed)}) + calc(${boxMargin} * ${end-initial-1})) + calc(${comments} * ${formHeight})`
    
    if(collapsed > 0){
        line.style.height = `calc(${line.style.height} + ${collapsed * minimizedHeight}px)`
    }
}


function display_lines(){
    let roots = document.querySelectorAll(".root")

    for(let root of roots){
        let posts = (Array.from(root.querySelectorAll(".post"))).filter(post => post.style.display !== "none")

        for(let i = 0; i < posts.length; i++){
            curr_tab = post_tab(posts[i])
            let j = i+1
            let collapsed = 0 //eaten that were collapsed so i can account for in drawing line
            let feasted = false
            let comments = posts[i].querySelector(".commentForm").style.display === "block" ? 1:0; //Comments length affected: you and parents
            
            if(j < posts.length){ // if not last post yet
                while(post_tab(posts[i]) < post_tab(posts[j])){ //keep eating until the tab is >= your own
                    posts[j].querySelector(".commentForm").style.display === "block" ? comments+= 1: comments+= 0;

                    if(!feasted){
                        feasted = true
                    }

                    if(posts[j].querySelector(".minimize").style.display == "none"){
                        collapsed++
                    }

                    if(j+1 >= posts.length){ //if not out of range yet
                        break
                    }else if(post_tab(posts[i]) >= post_tab(posts[j+1])){ //and next tab is still less
                        break
                    }

                    j++ //keep eating
                }
            }

            //if you ate something then account for yourself by adding one, but if you didn't eat anything then forget it

            if(feasted){ //already accounted, then skip
                j++ //to account for eating yourself
            }
        
            // i = initial posts, i to j = all the posts that i eats, so collapses all in that range
            draw_line(i, j, posts[i], collapsed, comments)

            if(!addedEventListener){
                line(i,j, posts[i], posts)
            }
        }
    }
    addedEventListener = true;
}

display_lines()

for(let button of allCommentButton){
    button.addEventListener("click", ()=> {
        let commentForm = button.parentElement.parentElement.querySelector(".commentForm")
        commentForm.style.display === "none" ? commentForm.style.display = "block": commentForm.style.display = "none";
        display_lines()
    })
}

for(let form of document.querySelector(".commentForm")){
    form.addEventListener("submit", (e)=>{
        e.preventDefault()
        console.log("prevented")
    })
}