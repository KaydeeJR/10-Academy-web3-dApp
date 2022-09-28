from algosdk.v2client import algod
from algosdk.future import transaction
import json
import base64


def connect_to_algod_api(private_key, address):
    """
    function that connects to algorand API
    """
    algod_address = "http://localhost:4001"
    algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    algod_client = algod.AlgodClient(algod_token, algod_address)
    return algod_client

def check_balance(algod_client, address):
    """
    function that checks account balance
    address points to an account
    """
    account_info = algod_client.account_info(address)
    print("Account balance: {} microAlgos".format(account_info.get('amount')) + "\n")

def start_transaction(algod_client, address, private_key):
    """
    function that initiates, signs and submits a transaction
    """
    params = algod_client.suggested_params()
    
    receiver = "HZ57J3K46JIJXILONBBZOHX6BKPXEM2VVXNRFSUED6DKFD5ZD24PMJ3MVA"
    note = "Hello World".encode()
    amount_transacted = 1000000

    unsigned_txn = transaction.PaymentTxn(address, params, receiver, amount_transacted, None, note)
    # sign transaction
    signed_txn = unsigned_txn.sign(private_key)
    
    #submit transaction
    txid = algod_client.send_transaction(signed_txn)
    print("Successfully sent transaction with txID: {}".format(txid))
    
    # waiting for confirmation 
    try:
        confirmed_txn = transaction.wait_for_confirmation(algod_client, txid, 4)  
    except Exception as err:
        print(err)
        return

    print("Transaction information: {}".format(
        json.dumps(confirmed_txn, indent=4)))
    print("Decoded note: {}".format(base64.b64decode(
        confirmed_txn["txn"]["txn"]["note"]).decode()))
    print("Starting Account balance: {} microAlgos".format(account_info.get('amount')) )
    print("Amount transfered: {} microAlgos".format(amount_transacted) )    
    print("Fee: {} microAlgos".format(params.fee) ) 

    account_info = algod_client.account_info(address)
    print("Final Account balance: {} microAlgos".format(account_info.get('amount')) + "\n")