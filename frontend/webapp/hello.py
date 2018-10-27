from flask import Flask, url_for
from flask import request, after_this_request
from flask import render_template, make_response
import requests
import json
app = Flask(__name__)

media_rep_dic = {'JTBC': 'JTBCMediaComm',
'MBC': 'MBCKobaco',
'KBS': 'KBSKobaco',
'TVChosun': 'TVChosunMediaRep',
'SBS': 'SBSMediaCreate',
'TVN': 'Mezzomedia'}

contract_status = {
  "AWAITING_APPROVAL": 'warning',
  "APPROVED": 'primary',
  "COMMITTED": 'success',
  "REJECTED": 'danger'
}

@app.route('/contract')
def contract():
    return render_template('contract.html')

@app.route('/handle_data', methods=['POST'])
def handle_data():
    media_array = request.form.getlist('media')
    print(request.form.getlist('media'))
    ad_type = request.form['adType']
    ad_title = request.form['adTitle']
    ad_duariotn = request.form['adDuration']
    return result(ad_type, ad_title, ad_duariotn, media_array)
    # your code
    # return a response

@app.route('/submit_transaction', methods=['POST'])
def submit_transaction():
    ad_type = request.form['type']
    ad_title = request.form['title']
    ad_duariotn = request.form['duration']

    time_array = request.form.getlist('adtimes')
    day_array = request.form.getlist('addays')
    media_array = request.form.getlist('medias')

    print(request.form.getlist('adtimes'))
    print(request.form.getlist('addays'))
    print(request.form.getlist('medias'))

    url = "http://localhost:3000/api/InitialApplication"

    payload_arr = [
        {
            "$class": "org.example.biznet.InitialApplication",
            "contractId": "",
            "owner": "Samsung",
            "adagency": "Jaeil",
            "mediarep": media_rep_dic.get(media_name),
            "mediaagent": media_name,
            "adDetails": {
                "$class": "org.example.biznet.AdDetails",
                "adType": ad_type,
                "title": ad_title,
                "duration": ad_duariotn
            },
            "days": day_array[i],
            "times": time_array[i],
            "programTitle": "나혼자산다",
            "timestamp": "2018-10-27T13:43:41.520Z"
        }
        for i, media_name in enumerate(media_array)
    ]
    
    headers = {
        'Content-Type': "application/json",
        'Accept': "application/json"
    }

    for i,payload in enumerate(payload_arr):
        print(payload)
        payload['contractId'] = str(i) + "-test"
        pinput = json.dumps(payload)
        response = requests.request("POST", url, data=pinput, headers=headers)
        print(response)

    return contracts()

    # return result(ad_type, ad_title, ad_duariotn, media_array)
    # your code
    # return a response


def result(ad_type, ad_title, ad_duration, media_array):
    return render_template('result.html', title=ad_title, type=ad_type, duration=ad_duration, medias=media_array)

@app.route('/contracts')
def contracts():
    url = 'http://localhost:3000/api/AdContract'
    headers = {'Accept': "application/json"}
    response = requests.get(url,headers=headers)
    result_json = response.json()
    return render_template('contracts.html', results = result_json, status_dic = contract_status)


@app.route('/hello')
def hello():
    name="aaa"
    return render_template('hello.html',name=name)

@app.route('/world')
def world():
    name="aaa"
    return render_template('world.html',name=name)

@app.route('/tube')
def tube():
    name="aaa"
    return render_template('youtube.html',name=name)


@app.route('/view', methods=['POST'])
def post_view_data():
    print(request.data)
    print("??")
    print(request.json)
    return request.data


@app.route('/user/<name>')
def show_user_profile(name):
    username = request.cookies.get('username')
    
    if username is None:

        # when the response exists, set a cookie with the language
        @after_this_request
        def remember_language(response):
            response.set_cookie('username','aaaa')
    else:
        resp = make_response(render_template('hello.html', name=username))

    resp.set_cookie('username', name)
    return resp

@app.route('/post/<int:post_id>')
def show_post(post_id):
    # show the post with the given id, the id is an integer
    return 'Post %d' % post_id

@app.route('/path/<path:subpath>')
def show_subpath(subpath):
    # show the subpath after /path/
    return 'Subpath %s' % subpath


# Converter Types
# string	(default) accepts any text without a slash
# int	accepts positive integers
# float	accepts positive floating point values
# path	like string but also accepts slashes
# uuid	accepts UUID strings

