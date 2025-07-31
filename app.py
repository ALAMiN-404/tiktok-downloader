from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/download", methods=["POST"])
def download():
    data = request.get_json()
    tiktok_url = data.get("url")

    if not tiktok_url:
        return jsonify({"success": False, "error": "কোনো URL দেওয়া হয়নি!"})

    try:
        # TikWM API ব্যবহার করে ভিডিও ডাউনলোড
        api_url = "https://tikwm.com/api/"
        payload = {"url": tiktok_url, "hd": 1}  # HD কোয়ালিটি
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        response = requests.post(api_url, json=payload, headers=headers, timeout=10)
        result = response.json()

        if result.get("code") == 0:
            video_url = result["data"].get("play")  # ওয়াটারমার্ক ছাড়া ভিডিও
            audio_url = result["data"].get("music")  # MP3 অডিও
            return jsonify({"success": True, "video_url": video_url, "audio_url": audio_url})
        else:
            return jsonify({"success": False, "error": "ভিডিও ডাউনলোড করা যায়নি। URL চেক করুন!"})
    except Exception as e:
        return jsonify({"success": False, "error": f"ত্রুটি: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)
