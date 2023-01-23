"""
KMD = Key Manager Daemon
For storing encrypted keys on disk instead of storing a human-readable 25-word mnemonics.
The Algorand Wallet allows users to hold, transact, and request Algos or other assets built on the Algorand blockchain.

Wallets are collections of addresses and their corresponding keys. 
Every node can have one or more wallet(s), but only one default wallet.
"""
from algosdk import kmd, mnemonic
from algosdk.wallet import Wallet
from algosdk.v2client import algod  
from urllib.error import HTTPError


def connect_kmd_client():
    """
    connect to key manager daemon client
    """
    kmd_address = "http://localhost:4002"
    kmd_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    kmd_client = kmd.KMDClient(kmd_token, kmd_address)
    return kmd_client


def create_user_wallet(wallet_name, wallet_password):
    """
    Parameters: wallet_name, wallet password
    Returns: Wallet object
    
    Create a Wallet object to manage everything including wallet handles, IDs, and passwords 
    """
    client = connect_kmd_client()
    try:
        wallet = Wallet(wallet_name, wallet_password, client)
        return wallet
    except HTTPError:
        print("Bad Request")


def get_account_address(wallet_object):
    """
    Creates an account for the wallet and returns its address
    
    Parameters: wallet_id, wallet_password
    Returns: wallet address
    """
    account_address = wallet_object.generate_key()
    return account_address


def list_wallets():
    """    
    Returns: list of wallet objects
    """
    client = connect_kmd_client()
    wallets = client.list_wallets()
    return wallets


def get_passphrase(wallet_object):
    """
    Parameter: wallet object
    Returns: Mnemonic phrase

    Public/private key pairs are generated from a single master derivation key. 
    
    Just remember the single mnemonic that represents this master derivation key (i.e. the wallet passphrase/mnemonic) to regenerate all of the accounts in that wallet.

    The master derivation key for the wallet will always generate the same addresses in the same order
    """
    # get the wallet's master derivation key
    mdk = wallet_object.export_master_derivation_key()
    # get the backup phrase using the master derivation key
    mnemonic_phrase = mnemonic.from_master_derivation_key(mdk)
    return mnemonic_phrase


def get_public_from_mnemo(mnemonic_str):
    """
    Parameter: 25 word passphrase
    Returns: public key
    """
    return mnemonic.to_public_key(mnemonic=mnemonic_str)


def get_private_from_mnemo(mnemonic_str):
    """
    Parameter: 25 word passphrase
    Returns: private key used to sign transactions
    """
    return mnemonic.to_private_key(mnemonic=mnemonic_str)

def account_information(account_address):
    """
    algod_address is the IP from which API endpoints can be accessed.
    4001 is the default port
    algod_token is an authentication token
    'aaaa.....' is the default value for the sandbox
    
    Parameter: Account address 
    Returns: account information such as address,amount, assets, created-apps, created-assets
    """
    algod_address = "http://localhost:4001" 
    algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"  
    algod_client = algod.AlgodClient(algod_token, algod_address)
    account_info = algod_client.account_info(account_address) 
    return account_info