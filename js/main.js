// ORTAK COMPONENT YÜKLEYİCİ

async function loadComponent(id, file){

    const element = document.getElementById(id);

    if(!element) return;

    const response = await fetch(file);

    const html = await response.text();

    element.innerHTML = html;
if(id === "menu-container"){

    const menu = document.getElementById("navMenu");
    const toggle = document.getElementById("menuToggle");

    if(menu){

        const state = sessionStorage.getItem("menuState");
        const navigating = sessionStorage.getItem("navigating");

        if(navigating === "true"){

            menu.classList.remove("active");
            toggle?.classList.remove("active");
            sessionStorage.removeItem("navigating");

        }
        else if(state === "open"){

            menu.classList.add("active");
            toggle?.classList.add("active");

        }
        else{

            menu.classList.remove("active");
            toggle?.classList.remove("active");

        }
    }
}
}
// Arka planı yükle

loadComponent(
    "background-container",
    "components/background.html"
);
function toggleMenu(){

    const menu = document.getElementById("navMenu");
    const toggle = document.getElementById("menuToggle");

    menu.classList.toggle("active");
    toggle.classList.toggle("active");

    sessionStorage.setItem(
        "menuState",
        menu.classList.contains("active") ? "open" : "closed"
    );
}

function closeMenu(){

    const menu = document.getElementById("navMenu");
    const toggle = document.getElementById("menuToggle");

    if(menu) menu.classList.remove("active");
    if(toggle) toggle.classList.remove("active");

    sessionStorage.setItem("menuState","closed");
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

    const link = e.target.closest("#navMenu a");

  if(link){

    const menu = document.getElementById("navMenu");

    if(menu){
        menu.classList.remove("active");
    }

    sessionStorage.setItem("navigating","true");

}

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
document.addEventListener("DOMContentLoaded", setActiveMenu);

const languages = {
    article1: {
        current: "EN",

        EN: {
            title: "📄 1. The Relationship Between Short Video-Based Social Media Use, Dopamine Signaling, and Depressive Symptoms Read PDF",
            download: "⬇️ 1. The Relationship Between Short Video-Based Social Media Use, Dopamine Signaling, and Depressive Symptoms Download PDF",
            file: "yazilar/The Relationship Between Short Video-Based Social Media Use, Dopamine Signaling, and Depressive Symptoms.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 1. Kısa Video Tabanlı Sosyal Medya Kullanımı, Dopamin Sinyallemesi ve Depresif Belirtiler Arasındaki İlişki PDF Oku",
            download: "⬇️ 1. Kısa Video Tabanlı Sosyal Medya Kullanımı, Dopamin Sinyallemesi ve Depresif Belirtiler Arasındaki İlişki PDF İndir",
            file: "yazilar/Kısa Video Tabanlı Sosyal Medya Kullanımı, Dopamin Sinyallemesi ve Depresif Belirtiler Arasındaki İlişki.pdf",
            flag: "🇹🇷"
        }
    }
,
    article2: {
        current: "EN",

        EN: {
            title: "📄 2. Generative Artificial Intelligence Chatbots in Mental Health: Current Evidence, Clinical Applications, Risks, and Future Perspectives Read PDF",
            download: "⬇️ 2. Generative Artificial Intelligence Chatbots in Mental Health: Current Evidence, Clinical Applications, Risks, and Future Perspectives Download PDF",
            file: "yazilar/Generative Artificial Intelligence Chatbots in Mental Health Current Evidence, Clinical Applications, Risks, and Future Perspectives.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 2. Ruh Sağlığında Üretken Yapay Zekâ Sohbet Robotları: Güncel Kanıtlar, Klinik Uygulamalar, Riskler ve Gelecek Perspektifleri PDF Oku",
            download: "⬇️ 2. Ruh Sağlığında Üretken Yapay Zekâ Sohbet Robotları: Güncel Kanıtlar, Klinik Uygulamalar, Riskler ve Gelecek Perspektifleri PDF İndir",
           file: "yazilar/Ruh Sağlığında Üretken Yapay Zekâ Sohbet Robotları: Güncel Kanıtlar, Klinik Uygulamalar, Riskler ve Gelecek Perspektifler.pdf",
            flag: "🇹🇷"
        }
    }


article3: {
        current: "EN",

        EN: {
            title: "📄 3. Sleepmaxxing: The Science Behind a Viral Sleep Optimization Trend Read PDF",
            download: "⬇️ 3. Sleepmaxxing: The Science Behind a Viral Sleep Optimization Trend Download PDF",
            file: "yazilar/Sleepmaxxing The Science Behind a Viral Sleep Optimization Trend.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 3. Sleepmaxxing: Viral Bir Uyku Optimizasyonu Akımının  Ardındaki Bilim PDF Oku",
            download: "⬇️ 3. Sleepmaxxing: Viral Bir Uyku Optimizasyonu Akımının  Ardındaki Bilim PDF İndir",
           file: "yazilar/Sleepmaxxing Viral Bir Uyku Optimizasyonu Akımının  Ardındaki Bilim.pdf",
            flag: "🇹🇷"
        }
    }
};

function toggleLanguage(article){

    const item = languages[article];

    item.current = item.current === "EN" ? "TR" : "EN";

    const lang = item[item.current];

    // Başlık
    document.getElementById(article + "-title").innerHTML = lang.title;
    document.getElementById(article + "-title").href = lang.file;

    // İndirme butonu
    const downloadBtn = document.getElementById(article + "-download");
    downloadBtn.href = lang.file;
    downloadBtn.innerHTML = lang.download;

    // Dil butonu
document.getElementById(article + "-lang").textContent = lang.flag;
}
