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
    document.getElementById("navMenu").classList.toggle("active");
}
function closeMenu() {
    document.getElementById("navMenu").classList.remove("active");
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

// AKTİF MENÜ TAKİBİ

function updateActiveMenu() {

    const sections = document.querySelectorAll("section[id], header[id], footer[id]");
    const menuLinks = document.querySelectorAll("#navMenu a");

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 200;
        const bottom = top + section.offsetHeight;

        if (window.scrollY >= top && window.scrollY < bottom) {
            current = section.id;
        }

    });

    menuLinks.forEach(link => {
        link.classList.remove("active-menu");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active-menu");
        }
    });

}

// Aktif menü takibi sadece ana sayfada çalışsın
if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/")
) {

const viewer = document.getElementById("imageViewer");
const viewerImg = document.getElementById("viewerImg");

document.querySelectorAll(".wion-slide img").forEach(img=>{

    img.addEventListener("click",()=>{

        viewerImg.src = img.src;

        viewer.classList.add("active");

    });

});

document.querySelector(".viewer-close").onclick = ()=>{

    viewer.classList.remove("active");

};

viewer.onclick = (e)=>{

    if(e.target===viewer){

        viewer.classList.remove("active");

    }

};

const viewer = document.getElementById("imageViewer");
const viewerImg = document.getElementById("viewerImage");
const closeBtn = document.querySelector(".viewer-close");

document.querySelectorAll(".wion-slide img").forEach(img => {

    img.addEventListener("click", () => {

        viewer.classList.add("active");
        viewerImg.src = img.src;

    });

});

closeBtn.addEventListener("click", () => {

    viewer.classList.remove("active");

});

viewer.addEventListener("click", e => {

    if(e.target === viewer){

        viewer.classList.remove("active");

    }

});

document.addEventListener("keydown", e => {

    if(e.key === "Escape"){

        viewer.classList.remove("active");

    }

});
    window.addEventListener("scroll", updateActiveMenu);
    window.addEventListener("load", updateActiveMenu);
}

