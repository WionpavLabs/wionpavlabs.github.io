/* =========================================================
   MEDVORTEX — KALICI TEMA SİSTEMİ
   Tema seçimi tüm sayfalarda korunur.
========================================================= */

(function () {

    const THEME_KEY = "medvortex-theme";


    /* -----------------------------------------------------
       KAYITLI TEMAYI SAYFA AÇILIR AÇILMAZ AL
    ----------------------------------------------------- */

    function getSavedTheme() {

        return localStorage.getItem(THEME_KEY) || "dark";

    }


    /* -----------------------------------------------------
       TEMAYI UYGULA
    ----------------------------------------------------- */

    function applyTheme(theme) {

        const body = document.body;

        if (!body) return;


        if (theme === "light") {

            body.classList.add("light-theme");

        } else {

            body.classList.remove("light-theme");

        }


        updateThemeButton(theme);

    }


    /* -----------------------------------------------------
       TEMA BUTONUNU GÜNCELLE
    ----------------------------------------------------- */

    function updateThemeButton(theme) {

        const button = document.getElementById("themeToggle");

        if (!button) return;


        const icon = button.querySelector(".theme-toggle-icon");

        const text = button.querySelector(".theme-toggle-text");


        if (theme === "light") {

            button.setAttribute(
                "aria-label",
                "Koyu temaya geç"
            );

            button.setAttribute(
                "aria-pressed",
                "true"
            );


            if (icon) {
                icon.textContent = "☾";
            }


            if (text) {
                text.textContent = "Dark Theme";
            }


        } else {

            button.setAttribute(
                "aria-label",
                "Açık temaya geç"
            );

            button.setAttribute(
                "aria-pressed",
                "false"
            );


            if (icon) {
                icon.textContent = "☀";
            }


            if (text) {
                text.textContent = "Light Theme";
            }

        }

    }


    /* -----------------------------------------------------
       SAYFA YÜKLENDİĞİNDE KAYITLI TEMAYI UYGULA
    ----------------------------------------------------- */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            const savedTheme = getSavedTheme();

            applyTheme(savedTheme);

        }
    );


    /* -----------------------------------------------------
       TEMA BUTONU
       Buton component olarak sonradan yüklense bile çalışır.
    ----------------------------------------------------- */

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest("#themeToggle");


            if (!button) return;


            const currentTheme =
                getSavedTheme();


            const newTheme =
                currentTheme === "light"
                    ? "dark"
                    : "light";


            localStorage.setItem(
                THEME_KEY,
                newTheme
            );


            applyTheme(newTheme);

        }
    );


})();
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
    }, 


article3: {
        current: "EN",

        EN: {
            title: "📄 3. Sleepmaxxing: The Science Behind a Viral Sleep Optimization Trend Read PDF",
            download: "⬇️ 3. Sleepmaxxing: The Science Behind a Viral Sleep Optimization Trend Download PDF",
            file: "yazilar/Sleepmaxxing The Science Behind a Viral Sleep Optimization Trend.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 3. Sleepmaxxing: Viral Bir Uyku Optimizasyonu Akımının Ardındaki Bilim PDF Oku",
            download: "⬇️ 3. Sleepmaxxing: Viral Bir Uyku Optimizasyonu Akımının Ardındaki Bilim PDF İndir",
           file: "yazilar/Sleepmaxxing Viral Bir Uyku Optimizasyonu Akımının Ardındaki Bilim.pdf",
            flag: "🇹🇷"
        }
    },

article4: {
        current: "EN",

        EN: {
            title: "📄 4. Beyond Dopamine: Shared Neurobiology of Behavioral Addictions Read PDF",
            download: "⬇️ 4. Beyond Dopamine: Shared Neurobiology of Behavioral Addictions Download PDF",
            file: "yazilar/Beyond Dopamine: Shared Neurobiology of Behavioral Addictions.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 4. Dopaminin Ötesinde: Davranışsal Bağımlılıkların Ortak Nörobiyolojisi PDF Oku",
            download: "⬇️ 4. Dopaminin Ötesinde: Davranışsal Bağımlılıkların Ortak Nörobiyolojisi PDF İndir",
           file: "yazilar/Dopaminin Ötesinde: Davranışsal Bağımlılıkların Ortak Nörobiyolojisi.pdf",
            flag: "🇹🇷"
        }
    },    
   
   research1: {
        current: "EN",

        EN: {
            title: "📄 1. Bipolar Disorder Read PDF",
            download: "⬇️ 1. Bipolar Disorder Download PDF",
            file: "research/Bipolar Disorder.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 1. Bipolar Bozukluk PDF Oku",
            download: "⬇️ 1. Bipolar Bozukluk PDF İndir",
            file: "research/Bipolar Bozukluk.pdf",
            flag: "🇹🇷"
        }
    },

      research2: {
        current: "EN",

        EN: {
            title: "📄 2. Schizophrenia Read PDF",
            download: "⬇️ 2. Schizophrenia Download PDF",
            file: "research/Schizophrenia.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 2. Şizofreni PDF Oku",
            download: "⬇️ 2. Şizofreni PDF İndir",
            file: "research/Şizofreni.pdf",
            flag: "🇹🇷"
        }
    },

   research3: {
        current: "EN",

        EN: {
            title: "📄 3. Capgras Syndrome Read PDF",
            download: "⬇️ 3. Capgras Syndrome Download PDF",
            file: "research/Capgras Syndrome.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 3. Capgras Sendromu PDF Oku",
            download: "⬇️ 3. Capgras Sendromu PDF İndir",
            file: "research/Capgras Sendromu.pdf",
            flag: "🇹🇷"
        }
    },


    research4: {
        current: "EN",

        EN: {
            title: "📄 4. Cotard Syndrome Read PDF",
            download: "⬇️ 4. Cotard Syndrome Download PDF",
            file: "research/Cotard Syndrome.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 4. Cotard Sendromu PDF Oku",
            download: "⬇️ 4. Cotard Sendromu PDF İndir",
            file: "research/Cotard Sendromu.pdf",
            flag: "🇹🇷"
        }
    },


      research5: {
        current: "EN",

        EN: {
            title: "📄 5. Anxiety Disorders Read PDF",
            download: "⬇️ 5. Anxiety Disorders Download PDF",
            file: "research/Anxiety Disorders.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 5. Kaygı Bozuklukları PDF Oku",
            download: "⬇️ 5. Kaygı Bozuklukları PDF İndir",
            file: "research/Kaygı Bozuklukları.pdf",
            flag: "🇹🇷"
        }
    },



     research6: {
        current: "EN",

        EN: {
            title: "📄 6. Dissociative Disorders Read PDF",
            download: "⬇️ 6. Dissociative Disorders Download PDF",
            file: "research/Dissociative Disorders.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 6. Dissosiyatif Bozukluklar PDF Oku",
            download: "⬇️ 6. Dissosiyatif Bozukluklar PDF İndir",
            file: "research/Dissosiyatif Bozukluklar.pdf",
            flag: "🇹🇷"
        }
    },

research7: {
        current: "EN",

        EN: {
            title: "📄 7. Depression (Depressive Disorder) Read PDF",
            download: "⬇️ 7. Depression (Depressive Disorder) Download PDF",
            file: "research/Depression (Depressive Disorder).pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 7. Depresyon (Depresif Bozukluk) PDF Oku",
            download: "⬇️ 7. Depresyon (Depresif Bozukluk) PDF İndir",
            file: "research/Depresyon (Depresif Bozukluk).pdf",
            flag: "🇹🇷"
        }
    },


   research8: {
        current: "EN",

        EN: {
            title: "📄 8. Fregoli Syndrome Read PDF",
            download: "⬇️ 8. Fregoli Syndrome Download PDF",
            file: "research/Fregoli Syndrome.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 8. Fregoli Sendromu PDF Oku",
            download: "⬇️ 8. Fregoli Sendromu PDF İndir",
            file: "research/Fregoli Sendromu.pdf",
            flag: "🇹🇷"
        }
    },


    research9: {
        current: "EN",

        EN: {
            title: "📄 9. Obsessive-Compulsive Disorder (OCD) Read PDF",
            download: "⬇️ 9. Obsessive-Compulsive Disorder (OCD) Download PDF",
            file: "research/Obsessive-Compulsive Disorder (OCD).pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 9. Obsesif-Kompulsif Bozukluk (OKB) PDF Oku",
            download: "⬇️ 9. Obsesif-Kompulsif Bozukluk (OKB) PDF İndir",
            file: "research/Obsesif-Kompulsif Bozukluk (OKB).pdf",
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





 /* =========================================================
   WIONPAV LABS — GLOBAL SITE TRANSLATIONS
========================================================= */

const siteTranslations = {

    EN: {

        /* =========================
           NAVIGATION
        ========================= */

        "nav.home":
            "Home",

        "nav.about":
            "About",

        "nav.founder":
            "Founder",

        "nav.research":
            "Research",

        "nav.projects":
            "Projects",

        "nav.publications":
            "Publications",

        "nav.join":
            "Join the Research Team",

        "nav.contact":
            "Contact",

        "nav.admin":
            "🔐 Admin Login",


        /* =========================
           RESEARCH
        ========================= */

        "research.heading":
            "Wionpav Labs",

        "research.subtitle":
            "Explore our research areas and scientific studies",

        "lab.mental.title":
            "Mental Health & Psychiatry Lab",

        "lab.mental.description":
            "Research on psychiatric disorders, psychopathology and mental health.",

        "lab.mental.count":
            "9 Studies",

       "home.highlights.title":
    "Highlights",

"home.highlights.description":
    "Selected publications, research insights and highlights from Wionpav Labs.",
   
    "home.updates.title":
    "Updates",

"home.updates.description":
    "You can access our latest published work below. Stay tuned for new content.",

"home.updates.read":
    "Read PDF",

"home.updates.download":
    "Download PDF",
   
    
    "home.comments.title":
    "Comments",

"home.comments.name":
    "Your name",

"home.comments.comment":
    "Your comment",

"home.comments.send":
    "Send"
    
    
    },


    TR: {

        /* =========================
           NAVIGATION
        ========================= */

        "nav.home":
            "Ana Sayfa",

        "nav.about":
            "Hakkımızda",

        "nav.founder":
            "Kurucu",

        "nav.research":
            "Research",

        "nav.projects":
            "Projeler",

        "nav.publications":
            "Yayınlar",

        "nav.join":
            "Araştırma Ekibine Katıl",

        "nav.contact":
            "İletişim",

        "nav.admin":
            "🔐 Yönetici Girişi",


        /* =========================
           RESEARCH
        ========================= */

        "research.heading":
            "Wionpav Labs",

        "research.subtitle":
            "Araştırma alanlarımızı ve bilimsel çalışmalarımızı keşfedin",

        "lab.mental.title":
            "Ruh Sağlığı ve Psikiyatri Laboratuvarı",

        "lab.mental.description":
            "Psikiyatrik bozukluklar, psikopatoloji ve ruh sağlığı üzerine araştırmalar.",

        "lab.mental.count":
            "9 Çalışma",

       "home.highlights.title":
    "Öne Çıkanlar",

"home.highlights.description":
    "Wionpav Labs tarafından seçilen yayınlar, araştırma içgörüleri ve öne çıkan çalışmalar.",
  
    
    "home.highlights.title":
    "Öne Çıkanlar",

"home.highlights.description":
    "Wionpav Labs tarafından seçilen yayınlar, araştırma içgörüleri ve öne çıkan çalışmalar.",

"home.updates.title":
    "Güncellemeler",

"home.updates.description":
    "En son yayımlanan çalışmamıza aşağıdan ulaşabilirsiniz. Yeni içerikler için takipte kalın.",

"home.updates.read":
    "PDF Oku",

"home.updates.download":
    "PDF İndir",



       "home.comments.title":
    "Yorumlar",

"home.comments.name":
    "Adın",

"home.comments.comment":
    "Yorumun",

"home.comments.send":
    "Gönder"
    
    }

};


/* =========================================================
   WIONPAV LABS — GLOBAL LANGUAGE SYSTEM
========================================================= */

const LANGUAGE_KEY = "wionpav-language";


/* =========================================================
   KAYITLI DİLİ AL
========================================================= */

function getSavedLanguage() {

    return localStorage.getItem(LANGUAGE_KEY) || "EN";

}


/* =========================================================
   DİL BUTONUNU GÜNCELLE
========================================================= */

function updateLanguageButton(language) {

    const button =
        document.getElementById("languageToggle");

    if (!button) return;

    const text =
        button.querySelector(".language-toggle-text");

    if (text) {

        text.textContent =
            language === "TR"
                ? "EN"
                : "TR";

    }

    button.setAttribute(
        "aria-label",
        language === "TR"
            ? "Switch to English"
            : "Türkçeye geç"
    );

}


/* =========================================================
   DİLİ UYGULA
========================================================= */

function applyLanguage(language) {

    document.documentElement.lang =
        language === "TR"
            ? "tr"
            : "en";


    updateLanguageButton(language);


    document.querySelectorAll("[data-i18n]").forEach(
        function (element) {

            const key =
                element.getAttribute("data-i18n");


            if (
                siteTranslations[language] &&
                siteTranslations[language][key]
            ) {

                element.textContent =
                    siteTranslations[language][key];

            }

        }
    );

}


/* =========================================================
   SAYFA AÇILDIĞINDA KAYITLI DİLİ UYGULA
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        applyLanguage(
            getSavedLanguage()
        );

    }
);


/* =========================================================
   DİL BUTONU
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("#languageToggle");

        if (!button) return;


        const currentLanguage =
            getSavedLanguage();


        const newLanguage =
            currentLanguage === "TR"
                ? "EN"
                : "TR";


        localStorage.setItem(
            LANGUAGE_KEY,
            newLanguage
        );


        applyLanguage(newLanguage);

    }
);
