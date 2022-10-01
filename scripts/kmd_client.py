from algosdk import kmd, wallet
"""
instantiate KMDClient

The Algorand Wallet allows users to hold, transact, and request Algos or other assets built on the Algorand blockchain.
"""

def connect_kmd_client():
    kmd_address = "http://localhost:4002"
    kmd_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    kmd_client = kmd.KMDClient(kmd_token, kmd_address)
    return kmd_client

#get wallet details
def wallet_details(wallet_name, password, client):
    # key manager
    client = connect_kmd_client()
    # create wallet
    return wallet.Wallet(wallet_name, password, client)