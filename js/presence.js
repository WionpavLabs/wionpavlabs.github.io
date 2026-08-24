/* =========================================================
   WIONPAV LABS — LIVE PRESENCE
   Aktif ziyaretçi + bulunduğu sayfa
========================================================= */

import {
    initializeApp,
    getApps
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    onDisconnect,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyBXuNbsz3W26q1EueNLWhSIUKS4SIViw4k",

    authDomain:
        "yorum-sistemimm.firebaseapp.com",

    databaseURL:
        "https://yorum-sistemimm-default-rtdb.europe-west1.firebasedatabase.app",

    projectId:
        "yorum-sistemimm",

    storageBucket:
        "yorum-sistemimm.appspot.com",

    messagingSenderId:
        "1048692198462",

    appId:
        "1:1048692198462:web:59fcfb7f0a29723d68156f"

};


/* =========================================================
   FIREBASE BAŞLAT
========================================================= */

const app =
    getApps().length > 0
        ? getApps()[0]
        : initializeApp(firebaseConfig);


const db =
    getDatabase(app);


/* =========================================================
   ZİYARETÇİ ID
========================================================= */

let visitorId =
    sessionStorage.getItem(
        "wionpav-session-id"
    );


if (!visitorId) {

    visitorId =
        crypto.randomUUID();

    sessionStorage.setItem(
        "wionpav-session-id",
        visitorId
    );

}


/* =========================================================
   SAYFA BİLGİSİ
========================================================= */

function getPageName() {

    const path =
        window.location.pathname;

    const file =
        path.split("/").pop();

    if (!file || file === "") {

        return "index.html";

    }

    return decodeURIComponent(file);

}


/* =========================================================
   PRESENCE REFERANSI
========================================================= */

const presenceRef =
    ref(
        db,
        "presence/" + visitorId
    );


/* =========================================================
   AKTİFLİK KAYDI
========================================================= */

async function setPresence() {

    const data = {

        online: true,

        page:
            getPageName(),

        url:
            window.location.pathname +
            window.location.search +
            window.location.hash,

        title:
            document.title,

        lastSeen:
            Date.now()

    };


    try {

        /*
         * Bağlantı koparsa Firebase
         * bu kullanıcıyı otomatik siler.
         */

        await onDisconnect(
            presenceRef
        ).remove();


        /*
         * Kullanıcıyı aktif olarak kaydet.
         */

        await set(
            presenceRef,
            data
        );


        console.log(
            "🟢 Wionpav canlı ziyaretçi:",
            data
        );

    }
    catch (error) {

        console.error(
            "❌ Presence hatası:",
            error
        );

    }

}


/* =========================================================
   30 SANİYEDE BİR SON GÖRÜLMEYİ GÜNCELLE
========================================================= */

setInterval(
    async function () {

        try {

            await set(
                presenceRef,
                {

                    online: true,

                    page:
                        getPageName(),

                    url:
                        window.location.pathname +
                        window.location.search +
                        window.location.hash,

                    title:
                        document.title,

                    lastSeen:
                        Date.now()

                }
            );

        }
        catch (error) {

            console.error(
                "Presence güncelleme hatası:",
                error
            );

        }

    },
    30000
);


/* =========================================================
   SAYFA GİDİLDİĞİNDE TEMİZLE
========================================================= */

window.addEventListener(
    "pagehide",
    function () {

        /*
         * Normal durumda onDisconnect
         * Firebase tarafından temizleyecek.
         */

        remove(
            presenceRef
        ).catch(() => {});

    }
);


/* =========================================================
   BAŞLAT
========================================================= */

setPresence();
