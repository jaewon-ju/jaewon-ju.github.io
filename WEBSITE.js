let slides =document.querySelectorAll("#slides > img");
let prev = document.getElementById("prev");
let next = document.getElementById("next");
let current = 0;

next.onclick = nextImg;
prev.onclick = prevImg;

function nextImg(){
    if(current ==2){
        current = 0;
    } else{
        current += 1;
    }
    showImg(current);
}

function prevImg(){
    if(current ==0){
        current = 2;
    } else{
        current -= 1;
    }
    showImg(current);
}

function showImg(current){
    for(let i=0; i<slides.length; i++){
        slides[i].style.display= "none";
    }
    slides[current].style.display = "block";
}