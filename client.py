import glob
import json
from pathlib import Path
import shutil
import requests
import flask as F
from flask import Flask, send_file

URL = ' http://pollen-server.ngrok.io/'
#URL = 'http://127.0.0.1:8000'
ROOT_IN = Path('input')
ROOT_OUT = Path('output')
shutil.rmtree(str(ROOT_IN), ignore_errors=True)
shutil.rmtree(str(ROOT_OUT), ignore_errors=True)
ROOT_IN.mkdir(parents=True, exist_ok=True)
ROOT_OUT.mkdir(parents=True, exist_ok=True)

app = Flask(__name__)

def send_images(images_paths):
    files = {

        path: open(path, 'rb')
        for path in glob.glob(images_paths + "/*.png")
        # for path in images_paths
    }
    print("files to send {}".format(files))
   # response = requests.post(url=f'{URL}/predict', files=files)
    response = requests.post(url='{}/predict'.format(URL), files=files)
    print(response.status_code)
    print(response.text)

    return json.loads(response.text)


def download_file(server_path, local_path):
    #response = requests.get(url=f'{URL}/download?path={str(server_path)}')
    response = requests.get(url='{}/download?path={}'.format(URL, str(server_path)))
    print(server_path, local_path)
    with open(str(ROOT_OUT / local_path), 'wb') as fout:
        fout.write(response.content)

@app.route('/')
def main():
    # images_paths = {Path('frontend-input/')}
    images_paths = 'frontend-input/'
    response = send_images(images_paths)
    print(response)
    # return 0
    for bboxed_image_server_path in response['images_with_bboxes']:
        download_file(
            bboxed_image_server_path,
            Path(bboxed_image_server_path).name)

    download_file(
        server_path=Path(response['report']),
        local_path=Path(response['report']).name)
    return {
        'status': 'ok'
    }

#if __name__ == '__main__':
#    main()

app.run(port=8001, threaded=False, host="0.0.0.0")

