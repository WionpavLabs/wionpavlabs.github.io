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
    window.addEventListener("scroll", updateActiveMenu);
    window.addEventListener("load", updateActiveMenu);
}

