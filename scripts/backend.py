"""
ENDPOINTS:
Connects front end to Algorand SDK
"""
import kmd_client
import algo_test_account
from flask import Flask, request, jsonify
from flask_cors import CORS


# create an instance of the Flask class
app = Flask(__name__)
CORS(app)

@app.route('/trainee_opt_in', methods=['GET', 'POST'])
def opt_in_for_cert():
    # the trainee can opt-in to NFT using their public key
    if request.method == 'GET':
        print(request)
        # result of opt-in request
        # return the created item
        return jsonify({
            "status": "success",
            "item": request.get_json()
        })
        # return jsonify({"status": "success", "message": "Post item!"})
    elif request.method == 'POST':
        pass
        # initiate opt-in request
        # public_address = 
        
        
        # res = extract_job_det.extract_job_desc()
        #if '--SEPARATOR--' in res:
        #    res = res.replace('--SEPARATOR--', '')
        
        # return jsonify({"status": "success", "brand_description": res})
        # return jsonify({"status": "sucess", "message": "Get Route for items!"})
        return jsonify({
                "status": "success",
                "message": "Hello, world!"
                })

@app.route('/account_details', methods=['POST','GET'])
def account_details():
    # create account or get account details
    if request.method == 'POST':
        user_email = request.json['username']
        pword = request.json['password']
        wallet = kmd_client.wallet_details(user_email, pword)
        wal_mnemonic = wallet.get_mnemonic()
        pub_address = algo_test_account.get_public_from_mnemo(wal_mnemonic)
        print(pub_address)
        return jsonify({"public address": pub_address})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
    