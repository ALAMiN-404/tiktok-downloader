from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route("/download", methods=["POST"])
def download():
    data = request.get_json()
    url = data.get("url")
    if not url:
        return jsonify({"success": False, "error": "No URL provided"}), 400

    try:
        # Using SnapTik API endpoint
        snap_tik_url = "https://snaptik.app/abc.php"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        payload = {"url": url}

        response = requests.post(snap_tik_url, data=payload, headers=headers, allow_redirects=True)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            download_link = soup.find("a", {"class": "download-link"})["href"] if soup.find("a", {"class": "download-link"}) else None
            thumbnail = soup.find("img", {"class": "thumbnail"})["src"] if soup.find("img", {"class": "thumbnail"}) else None
            title = soup.find("h1", {"class": "video-title"}).text if soup.find("h1", {"class": "video-title"}) else "N/A"

            if download_link:
                return jsonify({
                    "success": True,
                    "hd_video_url": download_link if "hd" in download_link.lower() else None,
                    "video_url": download_link,
                    "audio_url": None,  # SnapTik doesn't provide direct audio link, can be extracted separately if needed
                    "thumbnail": thumbnail,
                    "info": {
                        "title": title,
                        "description": "N/A"
                    }
                })
            else:
                return jsonify({"success": False, "error": "No download link found"}), 400
        else:
            return jsonify({"success": False, "error": f"API Error: {response.status_code}"}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
