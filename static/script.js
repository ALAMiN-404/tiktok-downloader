let hdVideoUrl = null;
let mp4VideoUrl = null;
let mp3AudioUrl = null;

async function downloadVideo() {
    const url = document.getElementById("tiktokLink").value.trim();
    const resultDiv = document.getElementById("result");
    
    if (!url) {
        resultDiv.innerHTML = "<p style='color: red;'>Please enter a valid TikTok URL!</p>";
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
            const info = data.info || { id: "N/A", name: "N/A", description: "N/A" }; // ID-এর বদলে name
            resultDiv.innerHTML = `
                <p><strong>Name:</strong> ${info.name}</p>
                <p><strong>Description:</strong> ${info.description}</p>
                ${data.thumbnail ? `<img src="${data.thumbnail}" alt="Video Preview">` : ""}
                <p>Choose your download format:</p>
                <a href="#" onclick="downloadMp4()">Download MP4 (SD)</a>
                <a href="#" onclick="downloadMp3()">Download MP3</a>
                <a href="#" onclick="downloadHd()">Download HD</a>
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
    // এখানে থিম স্টোর করার জন্য localStorage ব্যবহার করা যেতে পারে
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

function toggleLanguage() {
    // এখানে ল্যাঙ্গুয়েজ সিলেক্ট লিস্ট খুলবে
    const languages = {
        "bn": "Bangla",
        "hi": "Hindi",
        "ar": "Arabic",
        "en": "English",
        "es": "Spanish",
        "ru": "Russian",
        "fr": "French",
        "de": "German",
        "it": "Italian",
        "ja": "Japanese",
        "ko": "Korean",
        "pt": "Portuguese",
        "zh": "Chinese",
        "tr": "Turkish"
    };
    let languageHTML = "<select onchange='changeLanguage(this.value)'>";
    for (let code in languages) {
        languageHTML += `<option value="${code}">${languages[code]}</option>`;
    }
    languageHTML += "</select>";
    alert(languageHTML); // সরলতার জন্য alert দিয়েছি, পরে UI-তে ইন্টিগ্রেট করতে হবে
}

function changeLanguage(langCode) {
    // এখানে ল্যাঙ্গুয়েজ অনুযায়ী ট্রান্সলেশন লজিক যোগ করবেন
    alert(`Language changed to ${langCode}. Translation logic to be implemented!`);
    // সারা পেজ রিফ্রেশ বা ট্রান্সলেট করার জন্য এখানে কাস্টম ফাংশন লাগবে
    localStorage.setItem("language", langCode);
    location.reload(); // সরলতার জন্য রিফ্রেশ, পরে ডায়নামিক ট্রান্সলেশন যোগ করবেন
}

// পেজ লোড হলে থিম ও ল্যাঙ্গুয়েজ সেট করা
window.onload = function() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") document.body.classList.add("dark-mode");
    const savedLang = localStorage.getItem("language") || "en";
    changeLanguage(savedLang); // ডিফল্ট ল্যাঙ্গুয়েজ সেট করা
};
