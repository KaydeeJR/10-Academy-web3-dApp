from algosdk.future.transaction import AssetConfigTxn, wait_for_confirmation
from connect_client import connect_to_algod_api
import kmd_client

def get_txn_parameters(algod_client):
    # Get network params for transactions before every transaction
    params = algod_client.suggested_params()
    return params

def create_NFT(admin_pub_key, ):
    """
    CREATES AN NFT
    Creator_pub_key (Admin) => account that creates an asset with a name
    Another account manages, reserves, freezes, and is the clawback address.
    """
    params = 
    txn = AssetConfigTxn(sender=admin_pub_key, sp=params,
                     total=1,
                     default_frozen=False,
                     unit_name="ALICEART",
                     asset_name="Alice's Artwork@arc3",
                     manager="",
                     reserve="",
                     freeze="",
                     clawback="",
                     url="https://path/to/my/nft/asset/metadata.json",
                     metadata_hash=json_metadata_hash,
                     decimals=0)        // NFTs have decimals of exactly 0
