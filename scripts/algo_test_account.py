from algosdk import account, mnemonic

def generate_algorand_keypair():
    """
    function that creates an account in Algorand blockchain
    """
    private_key, address = account.generate_account()
    print("Address: {}".format(address))
    print("Private key: {}".format(private_key))
    print("Password: {}".format(mnemonic.from_private_key(private_key)))