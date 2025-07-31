let hdVideoUrl = null;

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
            // Directly trigger downloads for SD and audio
            if (data.video_url) {
                const sdLink = document.createElement("a");
                sdLink.href = data.video_url;
                sdLink.download = "";
                sdLink.target = "_blank";
                sdLink.click();
            }
            if (data.audio_url) {
                const audioLink = document.createElement("a");
                audioLink.href = data.audio_url;
                audioLink.download = "";
                audioLink.target = "_blank";
                audioLink.click();
            }
            resultDiv.innerHTML = `
                <p>Downloads started!</p>
                <a href="#" onclick="showHdAd()">Download Video (HD)</a>
            `;
        } else {
            resultDiv.innerHTML = `<p style='color: red;'>Error: ${data.error}</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        resultDiv.innerHTML = `<p style='color: red;'>Error: ${error.message}. Try again!</p>`;
    }
}

function showHdAd() {
    const hdAdOverlay = document.getElementById("hdAdOverlay");
    const adTimer = document.getElementById("adTimer");
    const skipTimer = document.getElementById("skipTimer");
    const skipAdButton = document.getElementById("skipAd");
    let timeLeft = 30;

    hdAdOverlay.style.display = "block";
    adTimer.textContent = timeLeft;
    skipTimer.textContent = timeLeft;

    const timer = setInterval(() => {
        timeLeft--;
        adTimer.textContent = timeLeft;
        skipTimer.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            skipAdButton.disabled = false;
            skipAdButton.onclick = () => {
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
    }, 1000);
}
