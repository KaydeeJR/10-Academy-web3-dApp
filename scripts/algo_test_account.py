from algosdk import account, mnemonic
"""
Spinning up the Algorand infrastructure using Algorand Sandbox development environment.
Docker provides:
    an algod instance for connecting to the network
    an indexer instance for querying blockchain data.
APIs are exposed by both instances for client access provided within the SDK.
"""
def generate_algorand_keypair():
    """
    function that creates an account in Algorand blockchain
    """
    private_key, address = account.generate_account()

    print("Address: {}".format(address))
    print("Private key: {}".format(private_key))
    print("Pass phrase: {}".format(mnemonic.from_private_key(private_key)))

def get_public_from_mnemo(mnemonic_str):
    return mnemonic.to_public_key(mnemonic=mnemonic_str)

def get_private_from_mnemo(mnemonic_str):
    return mnemonic.to_private_key(mnemonic=mnemonic_str)