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
// AKTİF MENÜ TAKİBİ

window.addEventListener("scroll",()=>{

    const sections = document.querySelectorAll("section[id], header[id], footer[id]");
    const menuLinks = document.querySelectorAll("#navMenu a");

    let current = "";

    sections.forEach(section=>{

        const sectionTop = section.offsetTop - 150;

        if(window.scrollY >= sectionTop){

            current = section.getAttribute("id");

        }

    });


    menuLinks.forEach(link=>{

        link.classList.remove("active-menu");


        if(link.getAttribute("href") === "#" + current){

            link.classList.add("active-menu");

        }

    });

});
