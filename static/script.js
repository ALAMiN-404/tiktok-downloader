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
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
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
                <a href="#" class="download-btn" onclick="downloadMp4()"><i class="fas fa-video"></i> Download MP4 (SD)</a>
                <a href="#" class="download-btn" onclick="downloadMp3()"><i class="fas fa-music"></i> Download MP3</a>
                <a href="#" class="download-btn" onclick="downloadHd()"><i class="fas fa-hd"></i> Download HD</a>
            `;
        } else {
            resultDiv.innerHTML = `<p style='color: red;'>Error: ${data.error}</p>`;
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        resultDiv.innerHTML = `<p style='color: red;'>Error: ${error.message}. Check console for details.</p>`;
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

function shareLink() {
    if (navigator.share) {
        navigator.share({
            title: "SnipTok",
            text: "Download TikTok videos easily with SnipTok!",
            url: window.location.href
        }).catch(console.error);
    } else {
        alert("Sharing not supported on this device.");
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    document.querySelector("header").classList.toggle("dark-mode");
    document.querySelector(".container").classList.toggle("dark-mode");
    document.querySelector(".hero").classList.toggle("dark-mode");
    document.querySelector(".features").classList.toggle("dark-mode");
    document.querySelector("footer").classList.toggle("dark-mode");
}

// Paste/Clear Button Functionality
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("tiktokLink");
    const pasteClearBtn = document.getElementById("pasteClearBtn");

    function updateButtonText() {
        if (input.value.trim() === "") {
            pasteClearBtn.textContent = "Paste";
        } else {
            pasteClearBtn.textContent = "Clear";
        }
    }

    pasteClearBtn.addEventListener("click", () => {
        if (pasteClearBtn.textContent === "Paste") {
            navigator.clipboard.readText().then(text => {
                if (text) {
                    input.value = text;
                    updateButtonText();
                }
            }).catch(err => console.error("Clipboard access error:", err));
        } else if (pasteClearBtn.textContent === "Clear") {
            input.value = "";
            updateButtonText();
        }
    });

    input.addEventListener("input", updateButtonText);
    updateButtonText(); // Initial check
});
