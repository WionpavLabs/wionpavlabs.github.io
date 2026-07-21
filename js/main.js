// ORTAK COMPONENT YÜKLEYİCİ

async function loadComponent(id, file){

    const element = document.getElementById(id);

    if(!element) return;

    const response = await fetch(file);

    const html = await response.text();

    element.innerHTML = html;

}


// Arka planı yükle

loadComponent(
    "background-container",
    "components/background.html"
);
function toggleMenu(){

    const menu = document.getElementById("navMenu");

    menu.classList.toggle("active");

    sessionStorage.setItem(
        "menuState",
        menu.classList.contains("active") ? "open" : "closed"
    );
}


function closeMenu(){

    const menu = document.getElementById("navMenu");

    menu.classList.remove("active");

    sessionStorage.setItem(
        "menuState",
        "closed"
    );
}
/* ==========================
   WION SLIDER
========================== */

document.addEventListener("DOMContentLoaded", () => {

    const track = document.querySelector(".wion-track");
    const slides = document.querySelectorAll(".wion-slide");
    const dots = document.querySelectorAll(".wion-dot");

    if (!track || slides.length === 0) return;

    let current = 0;
    let startX = 0;
    let endX = 0;
    let autoSlide;

    function showSlide(index){

        if(index < 0){
            index = slides.length - 1;
        }

        if(index >= slides.length){
            index = 0;
        }

        current = index;

        track.style.transform =
            `translateX(-${current * 100}%)`;

        dots.forEach(dot=>{
            dot.classList.remove("active");
        });

        dots[current].classList.add("active");

    }

    function nextSlide(){

        showSlide(current + 1);

    }

    function prevSlide(){

        showSlide(current - 1);

    }

    function startAuto(){

        autoSlide = setInterval(nextSlide,5000);

    }

    function stopAuto(){

        clearInterval(autoSlide);

    }

    dots.forEach((dot,index)=>{

        dot.addEventListener("click",()=>{

            stopAuto();

            showSlide(index);

            startAuto();

        });

    });

    /* TELEFON SWIPE */

    track.addEventListener("touchstart",(e)=>{

        startX = e.touches[0].clientX;
         endX = startX;

        stopAuto();

    });

    track.addEventListener("touchmove",(e)=>{

        endX = e.touches[0].clientX;

    });

    track.addEventListener("touchend",()=>{

        if(startX - endX > 60){

            nextSlide();

        }

        if(endX - startX > 60){

            prevSlide();

        }

        startAuto();

    });

    /* MOUSE DRAG */

    let mouseDown = false;

    track.addEventListener("mousedown",(e)=>{

        mouseDown = true;

        startX = e.clientX;
 endX = startX;
        stopAuto();

    });

    window.addEventListener("mouseup",(e)=>{

        if(!mouseDown) return;

        mouseDown = false;

        endX = e.clientX;

        if(startX - endX > 60){

            nextSlide();

        }

        if(endX - startX > 60){

            prevSlide();

        }

        startAuto();

    });

    showSlide(0);

    startAuto();

});

// YENİ AKTİF MENÜ SİSTEMİ (PAGE BASED)

function setActiveMenu(){

    const links = document.querySelectorAll("#navMenu a");
    const currentPage = window.location.pathname.split("/").pop();
    const hash = window.location.hash;

    links.forEach(link=>{

        const href = link.getAttribute("href");

        link.classList.remove("active-menu");

        // 🔥 Eğer hash varsa SADECE hash bazlı çalış
        if(hash){
            if(href === hash){
                link.classList.add("active-menu");
            }
        } else {
            // hash yoksa page bazlı
            if(
                href === currentPage ||
                (currentPage === "" && href === "index.html")
            ){
                link.classList.add("active-menu");
            }
        }

    });
}
window.addEventListener("hashchange", setActiveMenu);
// sadece sayfa yüklendiğinde çalışır


document.addEventListener("click", (e)=>{

    const img = e.target.closest(".wion-slide img");

    if(img){

        const viewer = document.getElementById("imageViewer");
        const viewerImg = document.getElementById("viewerImg");

        viewerImg.src = img.src;
        viewer.classList.add("active");

    }


    if(e.target.closest(".viewer-close")){

        const viewer = document.getElementById("imageViewer");
        const viewerImg = document.getElementById("viewerImg");

        viewer.classList.remove("active");
        viewerImg.src = "";

    }

});

document.addEventListener("DOMContentLoaded", () => {

    const viewer = document.getElementById("imageViewer");

    if(viewer){
        viewer.onclick = (e)=>{
            if(e.target === viewer){
                viewer.classList.remove("active");
            }
        };
    }

});


   


       



window.addEventListener("pageshow", function(){

    const menu = document.getElementById("navMenu");

    if(!menu) return;

    const state = sessionStorage.getItem("menuState");

    if(state === "open"){
        menu.classList.add("active");
    }

    if(state === "closed"){
        menu.classList.remove("active");
    }

});


window.addEventListener("DOMContentLoaded", () => {
    setActiveMenu();
});


document.addEventListener("click", function(e){

    const link = e.target.closest("#navMenu a");

    if(!link) return;

    const href = link.getAttribute("href");

    if(!href.startsWith("http")){

        e.preventDefault();

        if(href.startsWith("#")){
            window.location.hash = href;
            return;
        }

        window.location.assign(href);
    }

});
