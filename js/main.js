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

    let currentPage = window.location.pathname
        .split("/")
        .pop();

    // Türkçe karakterli dosya adlarını düzelt
    try {
        currentPage = decodeURIComponent(currentPage);
    } catch(e) {}

    const hash = window.location.hash;

    links.forEach(link => {

        const href = link.getAttribute("href");

        link.classList.remove("active-menu");

        // Hash varsa hash bazlı aktif menü
        if(hash){

            if(href === hash){
                link.classList.add("active-menu");
            }

        } else {

            // Sayfa bazlı aktif menü
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


document.addEventListener("click", (e) => {

    const link = e.target.closest("#navMenu a");

    if (link) {

        const menu = document.getElementById("navMenu");

        if (menu) {
            menu.classList.remove("active");
        }

        sessionStorage.setItem("navigating", "true");

        /* İLETİŞİM LİNKİ */
        if (link.getAttribute("href") === "index.html#iletisim") {

            sessionStorage.setItem("scrollToContact", "true");

        }

    }


    const img = e.target.closest(".wion-slide img");

    if (img) {

        const viewer = document.getElementById("imageViewer");
        const viewerImg = document.getElementById("viewerImg");

        viewerImg.src = img.src;
        viewer.classList.add("active");

    }


    if (e.target.closest(".viewer-close")) {

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
        },
  
    
    research10: {
        current: "EN",

        EN: {
            title: "📄 1. Parkinson's Disease Read PDF",
            download: "⬇️ 1. Parkinson's Disease Download PDF",
            file: "research/Parkinson's Disease.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 1. Parkinson Hastalığı PDF Oku",
            download: "⬇️ 1. Parkinson Hastalığı PDF İndir",
            file: "research/Parkinson Hastalığı.pdf",
            flag: "🇹🇷"
        }
      
    },


     research11: {
        current: "EN",

        EN: {
            title: "📄 2. Alzheimer's Disease Read PDF",
            download: "⬇️ 2. Alzheimer's Disease Download PDF",
            file: "research/Alzheimer's Disease.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 2. Alzheimer Hastalığı PDF Oku",
            download: "⬇️ 2. Alzheimer Hastalığı PDF İndir",
            file: "research/Alzheimer Hastalığı.pdf",
            flag: "🇹🇷"
        }
           },

research12: {
        current: "EN",

        EN: {
            title: "📄 3. Multiple Sclerosis (MS) Read PDF",
            download: "⬇️ 3. Multiple Sclerosis (MS) Download PDF",
            file: "research/Multiple Sclerosis (MS).pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 3. Multipl Skleroz (MS) PDF Oku",
            download: "⬇️ 3. Multipl Skleroz (MS) PDF İndir",
            file: "research/Multipl Skleroz (MS).pdf",
            flag: "🇹🇷"
        }
   },
research13: {
        current: "EN",

        EN: {
            title: "📄 4. Epilepsy Read PDF",
            download: "⬇️ 4. Epilepsy Download PDF",
            file: "research/Epilepsy.pdf",
            flag: "🇬🇧"
        },

        TR: {
            title: "📄 4. Epilepsi PDF Oku",
            download: "⬇️ 4. Epilepsi PDF İndir",
            file: "research/Epilepsi.pdf",
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

       "mental.title":
    "🗣️ Mental Health & Psychiatry Lab",

"mental.subtitle":
    "Research studies in psychiatry and mental health",

"mental.back":
    "← Back to Labs",
   
       "lab.brain.title":
    "Brain & Neurology Lab",

"lab.brain.description":
    "Research focused on the brain, nervous system and neurological disorders.",

"lab.brain.count":
    "4 Studies",

"lab.orthopedics.title":
    "Orthopedics & Musculoskeletal Lab",

"lab.orthopedics.description":
    "Research on bones, joints, muscles, ligaments and movement disorders.",

"lab.orthopedics.count":
    "0 Studies",

"lab.cardiovascular.title":
    "Cardiovascular Lab",

"lab.cardiovascular.description":
    "Research on cardiovascular diseases, heart health and vascular disorders.",

"lab.cardiovascular.count":
    "0 Studies",

"lab.genetics.title":
    "Genetics & Molecular Medicine Lab",

"lab.genetics.description":
    "Research involving genetics, molecular biology and biomarkers.",

"lab.genetics.count":
    "0 Studies",

"lab.infectious.title":
    "Infectious Diseases & Immunology Lab",

"lab.infectious.description":
    "Research on infectious diseases, immunity and immune system disorders.",

"lab.infectious.count":
    "0 Studies",

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
    "Send",

       "home.contact.title":
    "Contact",

"home.contact.description":
    "For questions about Wionpav Labs, academic collaborations, content suggestions, or other inquiries, you can contact us via the email address below.",

"home.contact.response":
    "Your messages will be reviewed as soon as possible.",

       "founder.heading":
    "About the Founder",

       "founder.description": "Ali Bocakkıtay is a medical student at Selçuk University Faculty of Medicine and the founder of the Wionpav Labs platform. He established the platform in 2026 to support the production of reliable knowledge and scientific communication in medicine, health sciences, and scientific research.",

    "founder.interests": "His areas of interest include literature evaluation, scientific writing, evidence-based medicine, and research in the health sciences. Through Wionpav Labs, he aims to contribute to the clear, accessible, and high-quality dissemination of scientific knowledge.",

       "founder.name":
    "Ali Bocakkıtay",

"founder.role":
    "Founder of Wionpav Labs",

"founder.title":
    "Medical Student & Research Enthusiast",

       "vision.title":
    "Vision",

  "vision.description1": "To become a reliable and high-quality scientific platform in medicine, health sciences, and research, making scientific knowledge more accessible and creating value for the health sciences community.",
    
   "vision.description2": "To build a strong and accessible scientific network that supports scientific thinking, research culture, and the production of high-quality knowledge.",
       
"mission.title":
    "Mission",

 "mission.description1": "To produce reliable, up-to-date, and scientifically grounded content in medicine, health sciences, and research, while making scientific literature easier to understand and supporting knowledge sharing.",

   "mission.description2": "To promote scientific research and critical thinking while strengthening knowledge sharing across different disciplines of the health sciences.",

    "projects.title":
    "Projects",

"projects.description":
    "Our projects will be published soon. Stay tuned.",
   
    "publications.title":
    "Publications",
    
    
   /* =========================
   JOIN RESEARCH TEAM
========================= */

"join.title":
    "Join the Research Team",

"join.description":
    "Wionpav Labs supports scientific research and knowledge production in medicine and the health sciences. You can use the form below to contribute to our research or apply with your own research idea.",

"join.fullName":
    "Full Name",

"join.fullNamePlaceholder":
    "Full Name",

"join.field":
    "Field / Department",

"join.fieldPlaceholder":
    "e.g. Medicine, Dentistry, Pharmacy...",

"join.researchAreas":
    "Research Areas of Interest",

"join.neuroscience":
    "Neuroscience",

"join.sleep":
    "Sleep and Sleep Health",

"join.clinical":
    "Clinical Research",

"join.biomedical":
    "Biomedical Research",

"join.aiMedicine":
    "Artificial Intelligence and Medicine",

"join.epidemiology":
    "Epidemiology and Public Health",

"join.systematicReview":
    "Systematic Reviews / Literature Research",

"join.other":
    "Other",

"join.applicationType":
    "How Would You Like to Join?",

"join.contribute":
    "I would like to contribute to Wionpav Labs research",

"join.ownResearch":
    "I am applying with my own research idea",

"join.both":
    "I am interested in both",

"join.researchIdea":
    "Research / Study Proposal",

"join.researchIdeaPlaceholder":
    "Briefly describe your proposed research or study...",

"join.email":
    "Email",

"join.emailPlaceholder":
    "example@email.com",

"join.phone":
    "Phone",

"join.optional":
    "(Optional)",

"join.consent":
    "I agree to have my application evaluated and to be contacted if my application is considered suitable.",

"join.submit":
    "Submit Application",

    "join.phonePlaceholder":
    "+90 5XX XXX XX XX",

"join.submitting":
    "Submitting Application...",

"join.success":
    "Your application has been submitted successfully.\n\nThe Wionpav Labs research team will review your application.",

"join.selectArea":
    "Please select at least one research area.",

"join.error":
    "An error occurred while submitting your application.\nPlease try again later.",

       "lab.brain.title": "Brain & Neurology Lab",
"lab.brain.description": "Research focused on the brain, nervous system and neurological disorders.",
    
   "brain.title": "🧠 Brain & Neurology Lab",
"brain.subtitle": "Research studies in neurology and neuroscience",
"brain.back": "← Back to Labs",

       "home.brand.description":
    "A trusted scientific platform for evidence-based research, scientific knowledge and current developments in medicine and health sciences.",

"home.brand.labs":
    "LABS",

"home.brand.studies":
    "STUDIES",

"home.brand.publications":
    "PUBLICATIONS",
    
    
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

       "mental.title":
    "🗣️ Ruh Sağlığı ve Psikiyatri Laboratuvarı",

"mental.subtitle":
    "Psikiyatri ve ruh sağlığı alanındaki araştırma çalışmaları",

"mental.back":
    "← Laboratuvarlara Dön",
       
"lab.brain.title":
    "Beyin ve Nöroloji Laboratuvarı",

"lab.brain.description":
    "Beyin, sinir sistemi ve nörolojik hastalıklar üzerine araştırmalar.",

"lab.brain.count":
    "4 Çalışma",

"lab.orthopedics.title":
    "Ortopedi ve Kas-İskelet Sistemi Laboratuvarı",

"lab.orthopedics.description":
    "Kemikler, eklemler, kaslar, bağlar ve hareket bozuklukları üzerine araştırmalar.",

"lab.orthopedics.count":
    "0 Çalışma",

"lab.cardiovascular.title":
    "Kardiyovasküler Laboratuvarı",

"lab.cardiovascular.description":
    "Kardiyovasküler hastalıklar, kalp sağlığı ve damar hastalıkları üzerine araştırmalar.",

"lab.cardiovascular.count":
    "0 Çalışma",

"lab.genetics.title":
    "Genetik ve Moleküler Tıp Laboratuvarı",

"lab.genetics.description":
    "Genetik, moleküler biyoloji ve biyobelirteçler üzerine araştırmalar.",

"lab.genetics.count":
    "0 Çalışma",

"lab.infectious.title":
    "Enfeksiyon Hastalıkları ve İmmünoloji Laboratuvarı",

"lab.infectious.description":
    "Enfeksiyon hastalıkları, bağışıklık ve bağışıklık sistemi bozuklukları üzerine araştırmalar.",

"lab.infectious.count":
    "0 Çalışma",

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
    "Gönder",

       "home.contact.title":
    "İletişim",

"home.contact.description":
    "Wionpav Labs ile ilgili sorularınız, akademik iş birlikleri, içerik önerileri veya diğer iletişim talepleriniz için aşağıdaki e-posta adresi üzerinden bizimle iletişime geçebilirsiniz.",

"home.contact.response":
    "İletileriniz en kısa sürede değerlendirilecektir.",

       "founder.heading":
    "Kurucu Hakkında",

      "founder.description": "Ali Bocakkıtay, Selçuk Üniversitesi Tıp Fakültesi öğrencisi ve Wionpav Labs platformunun kurucusudur. Platformu 2026 yılında; tıp, sağlık bilimleri ve bilimsel araştırmalar alanlarında güvenilir bilgi üretimini ve bilimsel iletişimi desteklemek amacıyla kurmuştur.",

    "founder.interests": "İlgi alanları arasında literatür değerlendirmeleri, bilimsel yazım, kanıta dayalı tıp ve sağlık bilimlerinde araştırma yer almaktadır. Wionpav Labs aracılığıyla bilimsel bilginin anlaşılır, erişilebilir ve nitelikli bir biçimde paylaşılmasına katkı sağlamayı amaçlamaktadır.",

"founder.name":
    "Ali Bocakkıtay",

"founder.role":
    "Wionpav Labs Kurucusu",

"founder.title":
    "Tıp Öğrencisi ve Araştırma Meraklısı",
       
   "vision.title":
    "Vizyon",

 "vision.description1": "Tıp, sağlık bilimleri ve araştırma alanlarında güvenilir ve nitelikli bir bilim platformu olmak; bilimsel bilgiye erişimi kolaylaştırarak sağlık bilimleri topluluğuna değer katmak.",

"vision.description2": "Bilimsel düşünceyi, araştırma kültürünü ve nitelikli bilgi üretimini destekleyen güçlü ve erişilebilir bir bilim ağı oluşturmak.",

"mission.title":
    "Misyon",

"mission.description1": "Tıp, sağlık bilimleri ve araştırma alanlarında güvenilir, güncel ve bilimsel temellere dayanan içerikler üretmek; literatürü anlaşılır hale getirerek bilgi paylaşımını desteklemek.",
    "mission.description2": "Bilimsel araştırmaları ve eleştirel düşünmeyi teşvik ederek farklı sağlık bilimleri disiplinleri arasında bilgi paylaşımını güçlendirmek.",
   
   "projects.title":
    "Projeler",

"projects.description":
    "Projelerimiz yakında yayımlanacaktır. Takipte kalın.", 
    
    
   "publications.title":
    "Yayınlar", 
    
 
    /* =========================
   ARAŞTIRMA EKİBİNE KATIL
========================= */

"join.title":
    "Araştırma Ekibine Katıl",

"join.description":
    "Wionpav Labs, tıp ve sağlık bilimleri alanında bilimsel araştırma ve bilgi üretimini desteklemektedir. Araştırmalarımıza katkı sağlamak veya kendi çalışma fikrinizle başvurmak için aşağıdaki formu doldurabilirsiniz.",

"join.fullName":
    "Ad Soyad",

"join.fullNamePlaceholder":
    "Ad Soyad",

"join.field":
    "Bölüm / Alan",

"join.fieldPlaceholder":
    "Örn. Tıp, Diş Hekimliği, Eczacılık...",

"join.researchAreas":
    "İlgi Duyduğunuz Araştırma Alanları",

"join.neuroscience":
    "Nörobilim",

"join.sleep":
    "Uyku ve Uyku Sağlığı",

"join.clinical":
    "Klinik Araştırmalar",

"join.biomedical":
    "Biyomedikal Araştırmalar",

"join.aiMedicine":
    "Yapay Zekâ ve Tıp",

"join.epidemiology":
    "Epidemiyoloji ve Halk Sağlığı",

"join.systematicReview":
    "Sistematik Derleme / Literatür Araştırmaları",

"join.other":
    "Diğer",

"join.applicationType":
    "Nasıl Katılmak İstiyorsunuz?",

"join.contribute":
    "Wionpav Labs araştırmalarına katkı sağlamak istiyorum",

"join.ownResearch":
    "Kendi araştırma / çalışma fikrimle başvuruyorum",

"join.both":
    "Her ikisiyle de ilgileniyorum",

"join.researchIdea":
    "Çalışma / Araştırma Öneriniz",

"join.researchIdeaPlaceholder":
    "Gerçekleştirmek istediğiniz araştırma veya çalışma fikrinizi kısaca açıklayınız...",

"join.email":
    "E-posta",

"join.emailPlaceholder":
    "ornek@email.com",

"join.phone":
    "Telefon",

"join.optional":
    "(İsteğe bağlı)",

"join.consent":
    "Başvurumun değerlendirilmesini ve uygun bulunması halinde benimle iletişime geçilmesini kabul ediyorum.",

"join.submit":
    "Başvuruyu Gönder",

       "join.phonePlaceholder":
    "+90 5XX XXX XX XX",

"join.submitting":
    "Başvuru Gönderiliyor...",

"join.success":
    "Başvurunuz başarıyla gönderildi.\n\nWionpav Labs araştırma ekibi başvurunuzu değerlendirecektir.",

"join.selectArea":
    "Lütfen en az bir araştırma alanı seçiniz.",

"join.error":
    "Başvuru gönderilirken bir hata oluştu.\nLütfen daha sonra tekrar deneyiniz.",
 
"lab.brain.title": "Beyin ve Nöroloji Laboratuvarı",
"lab.brain.description": "Beyin, sinir sistemi ve nörolojik hastalıklara odaklanan araştırmalar.",     
   
    
    "brain.title": "🧠 Beyin ve Nöroloji Laboratuvarı",
"brain.subtitle": "Nöroloji ve sinirbilim alanlarında araştırma çalışmaları",
"brain.back": "← Laboratuvarlara Dön",

       "home.brand.description":
    "Tıp ve sağlık bilimlerinde kanıta dayalı araştırma, bilimsel bilgi ve güncel gelişmeler için güvenilir bir bilimsel platform.",

"home.brand.labs":
    "LAB",

"home.brand.studies":
    "ÇALIŞMA",

"home.brand.publications":
    "YAYIN",
    
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


    /* =========================================
       GLOBAL DİL BUTONU
    ========================================= */

    updateLanguageButton(language);


    /* =========================================
       NORMAL SITE METİNLERİ
    ========================================= */

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


    /* =========================================
       PLACEHOLDER ÇEVİRİLERİ
    ========================================= */

    document.querySelectorAll("[data-i18n-placeholder]").forEach(
        function (element) {

            const key =
                element.getAttribute("data-i18n-placeholder");

            if (
                siteTranslations[language] &&
                siteTranslations[language][key]
            ) {

                element.placeholder =
                    siteTranslations[language][key];

            }

        }
    );


    /* =========================================
       RESEARCH / LAB PDF'LERİ
    ========================================= */

    

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


document.addEventListener("DOMContentLoaded", () => {

    if (
        window.location.pathname.endsWith("index.html") &&
        sessionStorage.getItem("scrollToContact") === "true"
    ) {

        sessionStorage.removeItem("scrollToContact");

        setTimeout(() => {

            const contact = document.getElementById("iletisim");

            if (contact) {

                contact.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }, 300);

    }

});




/* =========================================================
   WIONPAV LABS — TOPLU PDF DİL SİSTEMİ
   Research + Publications
   EN / TR
========================================================= */


/* =========================================================
   RESEARCH DİLİ
========================================================= */

const RESEARCH_LANGUAGE_KEY = "wionpav-research-language";


function getResearchLanguage() {

    return localStorage.getItem(RESEARCH_LANGUAGE_KEY) || "EN";

}


/* =========================================================
   YAYINLAR DİLİ
========================================================= */

const PUBLICATIONS_LANGUAGE_KEY =
    "wionpav-publications-language";


function getPublicationsLanguage() {

    return localStorage.getItem(
        PUBLICATIONS_LANGUAGE_KEY
    ) || "EN";

}


/* =========================================================
   RESEARCH BUTONLARINI GÜNCELLE
========================================================= */

function updateResearchLanguageButtons(language) {

    const buttons = document.querySelectorAll(
        "#mentalResearchLanguageToggle, #brainResearchLanguageToggle"
    );

    buttons.forEach(button => {

        const text =
            button.querySelector(".research-language-text");

        const icon =
            button.querySelector(".research-language-icon");


        if (language === "TR") {

    if (text) {
        text.textContent = "TR";
    }

    if (icon) {
        icon.textContent = "🇹🇷";
    }

    button.setAttribute(
        "aria-label",
        "Çalışmaları İngilizceye geçir"
    );

} else {

    if (text) {
        text.textContent = "EN";
    }

    if (icon) {
        icon.textContent = "🇬🇧";
    }

    button.setAttribute(
        "aria-label",
        "Çalışmaları Türkçeye geçir"
    );

}

    });

}


/* =========================================================
   TÜM RESEARCH PDF'LERİNİ DEĞİŞTİR
========================================================= */

function applyResearchLanguage(language) {

    if (typeof languages === "undefined") {
        return;
    }


    Object.keys(languages).forEach(function(article) {

        /*
         * Sadece research PDF'leri
         */
        if (!article.startsWith("research")) {
            return;
        }


        const item = languages[article];

        if (!item || !item[language]) {
            return;
        }


        const lang = item[language];


        /* PDF OKU */

        const title =
            document.getElementById(
                article + "-title"
            );

        if (title) {

            title.textContent = lang.title;
            title.href = lang.file;

        }


        /* PDF İNDİR */

        const download =
            document.getElementById(
                article + "-download"
            );

        if (download) {

            download.textContent =
                lang.download;

            download.href =
                lang.file;

        }


        /* Eski bireysel buton varsa */

        const individualButton =
            document.getElementById(
                article + "-lang"
            );

        if (individualButton) {

            individualButton.textContent =
                lang.flag;

        }

    });


    updateResearchLanguageButtons(language);

}


/* =========================================================
   TÜM YAYINLARI TEK BUTONLA DEĞİŞTİR
========================================================= */

function applyPublicationsLanguage(language) {

    if (typeof languages === "undefined") {
        return;
    }


    Object.keys(languages).forEach(function(article) {

        /*
         * SADECE article1, article2, article3, article4
         */
        if (!article.startsWith("article")) {
            return;
        }


        const item = languages[article];

        if (!item || !item[language]) {
            return;
        }


        const lang = item[language];


        /* PDF OKU */

        const title =
            document.getElementById(
                article + "-title"
            );

        if (title) {

            title.textContent =
                lang.title;

            title.href =
                lang.file;

        }


        /* PDF İNDİR */

        const download =
            document.getElementById(
                article + "-download"
            );

        if (download) {

            download.textContent =
                lang.download;

            download.href =
                lang.file;

        }


        /*
         * Eski tek tek dil butonları
         * HTML'de kaldıysa güncellenir.
         */

        const individualButton =
            document.getElementById(
                article + "-lang"
            );

        if (individualButton) {

            individualButton.textContent =
                lang.flag;

        }

    });


    updatePublicationsLanguageButton(language);

}


/* =========================================================
   YAYINLAR ÜSTTEKİ TEK BUTON
========================================================= */

function updatePublicationsLanguageButton(language) {

    const button =
        document.getElementById(
            "publicationsLanguageToggle"
        );

    if (!button) return;

    const text =
        button.querySelector(
            ".publications-language-text"
        );

    const icon =
        button.querySelector(
            ".publications-language-icon"
        );


    if (language === "TR") {

        if (text) {
            text.textContent = "TR";
        }

        if (icon) {
            icon.textContent = "🇹🇷";
        }

        button.setAttribute(
            "aria-label",
            "İngilizceye geç"
        );

    } else {

        if (text) {
            text.textContent = "EN";
        }

        if (icon) {
            icon.textContent = "🇬🇧";
        }

        button.setAttribute(
            "aria-label",
            "Türkçeye geç"
        );

    }

}


/* =========================================================
   SAYFA AÇILDIĞINDA RESEARCH + PUBLICATIONS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        /*
         * Research sayfası
         */

        applyResearchLanguage(
            getResearchLanguage()
        );


        /*
         * Yayınlar sayfası
         */

        applyPublicationsLanguage(
            getPublicationsLanguage()
        );

    }
);


/* =========================================================
   RESEARCH TEK BUTON
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "#mentalResearchLanguageToggle, #brainResearchLanguageToggle"
            );

        if (!button) {
            return;
        }


        const currentLanguage =
            getResearchLanguage();


        const newLanguage =
            currentLanguage === "EN"
                ? "TR"
                : "EN";


        localStorage.setItem(
            RESEARCH_LANGUAGE_KEY,
            newLanguage
        );


        applyResearchLanguage(
            newLanguage
        );

    }
);


/* =========================================================
   PUBLICATIONS TEK BUTON
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "#publicationsLanguageToggle"
            );

        if (!button) {
            return;
        }


        const currentLanguage =
            getPublicationsLanguage();


        const newLanguage =
            currentLanguage === "EN"
                ? "TR"
                : "EN";


        localStorage.setItem(
            PUBLICATIONS_LANGUAGE_KEY,
            newLanguage
        );


        applyPublicationsLanguage(
            newLanguage
        );

    }
);
