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
                <a href="#" onclick="downloadMp4()">Download MP4 (SD)</a>
                <a href="#" onclick="downloadMp3()">Download MP3</a>
                <a href="#" onclick="showHdAd()">Download HD</a>
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
    const hdAdOverlay = document.getElementById("hdAdOverlay");
    const closeAd = document.getElementById("closeAd");

    hdAdOverlay.style.display = "block";
    closeAd.style.display = "none"; // Initially hidden

    const ad = document.querySelector("#hdAdOverlay ins.adsbygoogle");
    if (ad) {
        const checkAdStatus = setInterval(() => {
            // Placeholder: Replace with actual AdSense ad completion event if available
            // This is a workaround; adjust based on AdSense documentation
            const adIframe = document.querySelector("#hdAdOverlay ins iframe");
            if (adIframe && !adIframe.style.display && !closeAd.style.display) {
                clearInterval(checkAdStatus);
                closeAd.style.display = "block";
            }
        }, 1000);

        closeAd.onclick = () => {
            if (hdVideoUrl) {
                const link = document.createElement("a");
                link.href = hdVideoUrl;
                link.download = "";
                link.target = "_blank";
                link.click();
                hdAdOverlay.style.display = "none";
            }
        };
    }
}
