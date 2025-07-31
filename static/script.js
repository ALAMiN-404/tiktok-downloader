async function downloadVideo() {
    const url = document.getElementById("tiktokLink").value.trim();
    const resultDiv = document.getElementById("result");
    
    if (!url) {
        resultDiv.innerHTML = "<p style='color: red;'>দয়া করে একটি বৈধ টিকটক লিঙ্ক দিন!</p>";
        return;
    }

    resultDiv.innerHTML = "<p>ডাউনলোড হচ্ছে, দয়া করে অপেক্ষা করুন...</p>";

    try {
        const response = await fetch("/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            throw new Error(`HTTP ত্রুটি: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            resultDiv.innerHTML = `
                <p>ডাউনলোড লিঙ্ক তৈরি হয়েছে!</p>
                ${data.thumbnail ? `<img src="${data.thumbnail}" alt="Video Preview">` : ""}
                <a href="${data.video_url}" target="_blank" download>ভিডিও ডাউনলোড (ওয়াটারমার্ক ছাড়া)</a><br>
                ${data.hd_video_url ? `<a href="${data.hd_video_url}" target="_blank" download>এইচডি ভিডিও ডাউনলোড</a><br>` : ""}
                <a href="${data.audio_url}" target="_blank" download>অডিও ডাউনলোড (MP3)</a>
            `;
        } else {
            resultDiv.innerHTML = `<p style='color: red;'>ত্রুটি: ${data.error}</p>`;
        }
    } catch (error) {
        console.error("ত্রুটি:", error);
        resultDiv.innerHTML = `<p style='color: red;'>ত্রুটি: ${error.message}. আবার চেষ্টা করুন!</p>`;
    }
}
