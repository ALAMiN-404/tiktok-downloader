from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route("/download", methods=["POST"])
def download():
    data = request.get_json()
    url = data.get("url")
    if not url:
        return jsonify({"success": False, "error": "No URL provided"}), 400

    try:
        # Replace with actual TikTok downloader API
        response = requests.get(f"https://api.example.com/download?url={url}")
        data = response.json()
        return jsonify({
            "success": True,
            "hd_video_url": data.get("hd_url"),
            "video_url": data.get("sd_url"),
            "audio_url": data.get("mp3_url"),
            "thumbnail": data.get("thumbnail"),
            "info": {"title": data.get("title"), "description": data.get("description")}
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
