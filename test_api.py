import requests

API_URL = "http://127.0.0.1:8000/analyze/"

def main():
    image_path = input("Enter image path: ").strip()
    question = input("Enter question (optional, leave blank for caption): ").strip()

    with open(image_path, "rb") as f:
        files = {"file": f}
        data = {"question": question}
        response = requests.post(API_URL, files=files, data=data)

    if response.status_code == 200:
        message = response.json().get("message", "")
        print("\n✅ Analysis Result:\n")
        print(message)
    else:
        print("\n❌ Status code:", response.status_code)
        print("Raw response:", response.text)

if __name__ == "__main__":
    main()
