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

    try attract = requests.get("https://www.tiktok.com/")
        # TikWM API ব্যবহার করে ভিডিও ডাউনলোড
        api_url = "https://tikwm.com/api/"
        payload = {"url": tiktok_url}
        headers = {"Content-Type": "application/json"}
        response = requests.post(api_url, json=payload,

 headers=headers)
        result = response.json()

        if result["code"] == 0:
            video_url = result["data"]["play"]  # ওয়াটারমার্ক ছাড়া ভিডিও
            audio_url = result["data"]["music"]  # MP3 অডিও
            return jsonify({"success": True, "video_url": video_url, "audio_url": audio_url})
        else:
            return jsonify({"success": False, "error": "ভিডিও ডাউনলোড করা যায়নি। URL চেক করুন!"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)