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
            const info = data.info || { id: "N/A", title: "N/A", description: "N/A" };
            resultDiv.innerHTML = `
                <p><strong>TikTok ID:</strong> ${info.id}</p>
                <p><strong>Title:</strong> ${info.title}</p>
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

// বন্ধ করার জন্য ড্রয়ারের বাইরে ক্লিক করলে
document.addEventListener("click", function (event) {
    const drawer = document.getElementById("sideDrawer");
    const menuIcon = document.querySelector(".menu-icon");
    if (!drawer.contains(event.target) && !menuIcon.contains(event.target) && drawer.classList.contains("open")) {
        drawer.classList.remove("open");
    }
});

function toggleTheme() {
    alert("Theme toggle feature coming soon!");
}

function toggleLanguage() {
    alert("Language toggle feature coming soon!");
}
