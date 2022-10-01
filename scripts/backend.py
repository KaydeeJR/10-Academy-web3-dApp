"""
ENDPOINTS:
Connects front end to Algorand SDK
"""
import os
import kmd_client
from flask import Flask, request, jsonify


# create an instance of the Flask class
app = Flask(__name__)

# list of items
items = []

@app.route('/trainee_opt_in', methods=['GET', 'POST'])
def opt_in_for_cert():
    """the trainee can opt-in to NFT using their public key"""
    if request.method == 'GET':
        # result of opt-in request
        items.append(request.get_json())
        # return the created item
        return jsonify({
            "status": "success",
            "item": request.get_json()
        })
        # return jsonify({"status": "success", "message": "Post item!"})
    elif request.method == 'POST':
        # initiate opt-in request
        public_address = 
        
        # construct final string from input
        final = f"Company: {company}\nProduct Name: {product_name}\nWhat is it: {type}\nWhy is it unique: {unique_ch}\nDescription:"
        
        # res = extract_job_det.extract_job_desc()
        #if '--SEPARATOR--' in res:
        #    res = res.replace('--SEPARATOR--', '')
        
        # return jsonify({"status": "success", "brand_description": res})
        # return jsonify({"status": "sucess", "message": "Get Route for items!"})
    return jsonify({
                "status": "success",
                "message": "Hello, world!"
                })


@app.route('/account_details', methods=['GET', 'POST'])
def account_details(email_add):
    """Description"""
    if request.method == 'GET':
        # message that account already exists
        # details about account e.g. NFTs
        items.append(request.get_json())
        # return the created item
        return jsonify({
            "status": "success",
            "item": request.get_json()
        })
    elif request.method == 'POST':
        # use login email address to create wallet
        
        # result = extract_job_det.extract_job_desc(final)
        # remove --SEPARATOR-- if x contains it
        #if '--SEPARATOR--' in result:
        #    result = result.replace('--SEPARATOR--', '')
        #return jsonify({"status": "success", "extracted job details": result})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 33507))
    app.run(host='0.0.0.0', debug=True, port=port)