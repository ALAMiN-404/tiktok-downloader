from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/static/<path:path>")
def serve_static(path):
    return app.send_static_file(path)

@app.route("/download", methods=["POST"])
def download():
    data = request.get_json()
    tiktok_url = data.get("url")

    if not tiktok_url:
        return jsonify({"success": False, "error": "No URL provided!"})

    print(f"Processing URL: {tiktok_url}")  # Debug log

    # Try TikWM API
    try:
        api_url = "https://tikwm.com/api/"
        payload = {"url": tiktok_url, "hd": 1}
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0"
        }
        response = requests.post(api_url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        result = response.json()

        if result.get("code") == 0:
            video_url = result["data"].get("play")
            hd_video_url = result["data"].get("hdplay")
            audio_url = result["data"].get("music")
            thumbnail = result["data"].get("cover")
            info = {
                "id": result["data"].get("id", "N/A"),
                "title": result["data"].get("title", "N/A"),
                "description": result["data"].get("desc", "N/A")
            }
            if not video_url:
                raise ValueError("Video link not found")
            print("TikWM Success")  # Debug log
            return jsonify({
                "success": True,
                "video_url": video_url,
                "hd_video_url": hd_video_url,
                "audio_url": audio_url,
                "thumbnail": thumbnail,
                "info": info
            })
    except Exception as e:
        print(f"TikWM Error: {str(e)}")  # Debug log
        # Fallback to ssstik.io API
        try:
            api_url = "https://ssstik.io/abc?url=dl"
            payload = {"id": tiktok_url}
            headers = {"User-Agent": "Mozilla/5.0"}
            response = requests.post(api_url, data=payload, headers=headers, timeout=10)
            response.raise_for_status()
            result = response.json()

            if result.get("success"):
                video_url = result.get("result", {}).get("nowatermark")
                audio_url = result.get("result", {}).get("music")
                thumbnail = result.get("result", {}).get("thumbnail")
                info = {
                    "id": result.get("result", {}).get("id", "N/A"),
                    "title": result.get("result", {}).get("title", "N/A"),
                    "description": result.get("result", {}).get("description", "N/A")
                }
                print("ssstik.io Success")  # Debug log
                return jsonify({
                    "success": True,
                    "video_url": video_url,
                    "audio_url": audio_url,
                    "thumbnail": thumbnail,
                    "info": info
                })
            else:
                print(f"ssstik.io Error: {result.get('error', 'Unknown error')}")  # Debug log
                return jsonify({"success": False, "error": "ssstik.io download failed"})
        except Exception as e2:
            print(f"ssstik.io Error: {str(e2)}")  # Debug log
            return jsonify({"success": False, "error": f"TikWM and ssstik.io failed: {str(e2)}"})

if __name__ == "__main__":
    app.run(debug=True)
