let hdVideoUrl = null;
let mp4VideoUrl = null;
let mp3AudioUrl = null;

// ট্রান্সলেশন ডাটা (সরল উদাহরণ)
const translations = {
    en: {
        title: "Download TikTok Videos Instantly",
        desc: "Paste your TikTok video URL and download in HD, MP4, or MP3 format without watermarks!",
        hd: "HD Video Download",
        audio: "Audio Extraction",
        watermark: "Watermark-Free",
        name: "Name",
        description: "Description",
        download: "Download",
        getApp: "Get App",
        why: "Why SnipTok?",
        about: "About",
        terms: "Terms",
        contact: "Contact",
        copyright: "&copy; 2025 SnipTok. All Rights Reserved."
    },
    bn: {
        title: "টিকটক ভিডিও তাৎক্ষণিকভাবে ডাউনলোড করুন",
        desc: "আপনার টিকটক ভিডিও URL পেস্ট করুন এবং ওয়াটারমার্ক ছাড়া HD, MP4 বা MP3 ফরম্যাটে ডাউনলোড করুন!",
        hd: "HD ভিডিও ডাউনলোড",
        audio: "অডিও নির্যাস",
        watermark: "ওয়াটারমার্ক-মুক্ত",
        name: "নাম",
        description: "বিবরণ",
        download: "ডাউনলোড",
        getApp: "অ্যাপ নিন",
        why: "কেন SnipTok?",
        about: "সম্পর্কে",
        terms: "শর্তাবলী",
        contact: "যোগাযোগ",
        copyright: "&copy; ২০২৫ SnipTok। সব অধিকার সংরক্ষিত।"
    },
    hi: {
        title: "तुरंत टिकटॉक वीडियो डाउनलोड करें",
        desc: "अपना टिकटॉक वीडियो URL पेस्ट करें और वॉटरमार्क के बिना HD, MP4 या MP3 प्रारूप में डाउनलोड करें!",
        hd: "HD वीडियो डाउनलोड",
        audio: "ऑडियो निष्कर्षण",
        watermark: "वॉटरमार्क-मुक्त",
        name: "नाम",
        description: "विवरण",
        download: "डाउनलोड",
        getApp: "ऐप प्राप्त करें",
        why: "क्यों SnipTok?",
        about: "के बारे में",
        terms: "शर्तें",
        contact: "संपर्क",
        copyright: "&copy; 2025 SnipTok। सर्वाधिकार सुरक्षित।"
    },
    ar: {
        title: "قم بتنزيل فيديوهات تيك توك فورًا",
        desc: "انسخ رابط فيديو تيك توك الخاص بك ونزّله بجودة HD أو MP4 أو MP3 بدون علامات مائية!",
        hd: "تنزيل فيديو HD",
        audio: "استخراج الصوت",
        watermark: "خالي من العلامات المائية",
        name: "الاسم",
        description: "الوصف",
        download: "تنزيل",
        getApp: "احصل على التطبيق",
        why: "لماذا SnipTok?",
        about: "حول",
        terms: "الشروط",
        contact: "اتصل",
        copyright: "&copy; 2025 SnipTok. جميع الحقوق محفوظة."
    }
    // বাকি ভাষাগুলোর জন্য ডাটা যোগ করতে পারেন
};

async function downloadVideo() {
    const url = document.getElementById("tiktokLink").value.trim();
    const resultDiv = document.getElementById("result");
    
    if (!url) {
        resultDiv.innerHTML = `<p style='color: red;'>${translations[localStorage.getItem("language") || "en"].pleaseEnter || "Please enter a valid TikTok URL!"}</p>`;
        return;
    }

    resultDiv.innerHTML = "<p>Processing, please wait...</p>";

    try {
        const response = await fetch("/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            hdVideoUrl = data.hd_video_url;
            mp4VideoUrl = data.video_url;
            mp3AudioUrl = data.audio_url;
            const info = data.info || { id: "N/A", name: "N/A", description: "N/A" };
            resultDiv.innerHTML = `
                <p><strong>${translations[localStorage.getItem("language") || "en"].name}:</strong> ${info.name}</p>
                <p><strong>${translations[localStorage.getItem("language") || "en"].description}:</strong> ${info.description}</p>
                ${data.thumbnail ? `<img src="${data.thumbnail}" alt="Video Preview">` : ""}
                <p>${translations[localStorage.getItem("language") || "en"].chooseFormat || "Choose your download format:"}</p>
                <a href="#" onclick="downloadMp4()">${translations[localStorage.getItem("language") || "en"].download} MP4 (SD)</a>
                <a href="#" onclick="downloadMp3()">${translations[localStorage.getItem("language") || "en"].download} MP3</a>
                <a href="#" onclick="downloadHd()">${translations[localStorage.getItem("language") || "en"].download} HD</a>
            `;
        } else {
            resultDiv.innerHTML = `<p style='color: red;'>Error: ${data.error}</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        resultDiv.innerHTML = `<p style='color: red;'>Error: ${error.message}. Try again!</p>`;
    }
}

function downloadMp4() {
    if (mp4VideoUrl) {
        const link = document.createElement("a");
        link.href = mp4VideoUrl;
        link.download = "";
        link.target = "_blank";
        link.click();
    }
}

function downloadMp3() {
    if (mp3AudioUrl) {
        const link = document.createElement("a");
        link.href = mp3AudioUrl;
        link.download = "";
        link.target = "_blank";
        link.click();
    }
}

function downloadHd() {
    if (hdVideoUrl) {
        const link = document.createElement("a");
        link.href = hdVideoUrl;
        link.download = "";
        link.target = "_blank";
        link.click();
    }
}

function toggleDrawer() {
    const drawer = document.getElementById("sideDrawer");
    drawer.classList.toggle("open");
}

// ড্রয়ারের বাইরে ক্লিক করলে বন্ধ
document.addEventListener("click", function (event) {
    const drawer = document.getElementById("sideDrawer");
    const menuIcon = document.querySelector(".menu-icon");
    if (!drawer.contains(event.target) && !menuIcon.contains(event.target) && drawer.classList.contains("open")) {
        drawer.classList.remove("open");
    }
});

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const elements = document.querySelectorAll('.dark-mode');
    elements.forEach(el => el.classList.toggle('dark-mode'));
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function changeLanguage(langCode) {
    localStorage.setItem("language", langCode);
    // স্ট্যাটিক টেক্সট আপডেট
    document.querySelector('.hero h2').textContent = translations[langCode].title;
    document.querySelector('.hero p').textContent = translations[langCode].desc;
    document.querySelectorAll('.feature-card h3')[0].textContent = translations[langCode].hd;
    document.querySelectorAll('.feature-card h3')[1].textContent = translations[langCode].audio;
    document.querySelectorAll('.feature-card h3')[2].textContent = translations[langCode].watermark;
    document.querySelectorAll('.feature-card p')[0].textContent = "Download TikTok videos in high-definition for stunning quality.";
    document.querySelectorAll('.feature-card p')[1].textContent = "Extract MP3 audio from TikTok videos for music lovers.";
    document.querySelectorAll('.feature-card p')[2].textContent = "Download clean videos without TikTok watermarks.";
    document.querySelector('.features h2').textContent = translations[langCode].why;
    document.querySelectorAll('footer nav a')[0].textContent = translations[langCode].about;
    document.querySelectorAll('footer nav a')[1].textContent = translations[langCode].terms;
    document.querySelectorAll('footer nav a')[2].textContent = translations[langCode].contact;
    document.querySelector('footer p').innerHTML = translations[langCode].copyright;
    document.querySelector('.get-app a').textContent = translations[langCode].getApp;
    // Result সেকশন আপডেট করতে হলে ডায়নামিকলি চেক করবেন
}

// পেজ লোড হলে থিম ও ল্যাঙ্গুয়েজ সেট করা
window.onload = function() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        const elements = document.querySelectorAll('.dark-mode');
        elements.forEach(el => el.classList.add('dark-mode'));
    }
    const savedLang = localStorage.getItem("language") || "en";
    document.getElementById("languageSelect").value = savedLang;
    changeLanguage(savedLang);
};
