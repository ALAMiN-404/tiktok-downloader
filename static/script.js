let hdVideoUrl = null;
let mp4VideoUrl = null;
let mp3AudioUrl = null;
let adCompleted = false;

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
                <a href="#" class="download-btn ad-icon" onclick="showHdAd()"><i class="fas fa-ad"></i> Download HD</a>
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

function showHdAd() {
    const hdAdPopup = document.getElementById("hdAdPopup");
    const closeAd = document.getElementById("closeAd");
    const ad = document.getElementById("hdAd");

    hdAdPopup.style.display = "block";
    adCompleted = false;

    // Simulate ad completion (adjust based on AdSense API)
    const checkAdStatus = setInterval(() => {
        const adIframe = document.querySelector("#hdAdPopup ins iframe");
        if (adIframe && !adIframe.style.display && adCompleted) {
            clearInterval(checkAdStatus);
            closeAd.style.display = "block"; // Already visible, no change needed
        }
    }, 1000);

    // AdSense event listener (placeholder; replace with actual AdSense event)
    window.addEventListener("adsbygoogle", function(e) {
        if (e.detail && e.detail.type === "adCompleted") {
            adCompleted = true;
        }
    });

    closeAd.onclick = () => {
        if (adCompleted) {
            if (hdVideoUrl) {
                const link = document.createElement("a");
                link.href = hdVideoUrl;
                link.download = "";
                link.target = "_blank";
                link.click();
                hdAdPopup.style.display = "none";
            }
        } else {
            alert("Please watch the ad fully to download!");
            // Do not close the popup if ad is not completed
        }
    };
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
    document.querySelector(".popup-content").classList.toggle("dark-mode");
    document.querySelector(".ad-content").classList.toggle("dark-mode");
    document.querySelector("footer").classList.toggle("dark-mode");
}
