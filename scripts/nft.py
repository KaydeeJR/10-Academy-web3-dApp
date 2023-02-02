import json
import hashlib
from algosdk.future.transaction import AssetConfigTxn, wait_for_confirmation
from scripts.kmd_wallet import KmdAlgorand
# from closeout_account import closeout_account

# TODO: SAVE asset_id FOR FUTURE USE
# TODO: keep user informed of transaction process

class Nft():
    """
    NFTs are created using a special type of transaction.

    When creating NFTs, specify a few parameters to identify it as an NFT and link the NFT to the metadata so that potential owners have the information they need to validate the integrity of the asset.
    
    Setting 1 as the total amount of units to create for an asset ensures you create precisely one unit of your ASA and which can't be divided.

    Once created, an asset will have a unique ID on the Algorand blockchain and can be viewed on the blockchain using block explorer like Dappflow
    """
    
    def __init__(self) -> None:
        # Initialize class
        self.kmd_algorand_class = KmdAlgorand()
        self.algod_client = self.kmd_algorand_class.set_up_algod_client()
    
    
    def mint_nft(self, sender_account, asset_unit_name, asset_name, asset_url, json_metadata_hash):
        """
        Mints an NFT by converting digital data into crypto collections or digital assets recorded on the blockchain.
        Leaving all addresses as None will result in an NFT that cannot be modified for life
        DefaultFrozen specifies whether the token can be traded by default

        Parameters: 
        
        sender_account: creates the asset and acts as the manager, reserve, freeze, and clawback address
        
        asset_name: string of up to 32-bytes that represents the name of your asset class 
        
        asset_unit_name: a string of up to 8-bytes that specifies the name of a unit of the asset
        
        asset_url: path that shows details about the NFT - may be stored off-chain on a system like IPFS. E.g. "https://gateway.pinata.cloud/ipfs://YOUR_METADATA_CID"

        json_metadata_hash: a hash calculation of a json file retrieved from IPFS 
        """        
        # Get network parameters.
        params = self.fetch_network_parameters()
        
        # uncomment these two lines if you do not want to use suggested params and instead set you own parametes
        # params.fee = 1000
        # params.flat_fee = True
        #         
        # Asset Creation transaction
        txn = AssetConfigTxn(
            sender=sender_account,
            sp=params,
            total=1,
            default_frozen=False,
            unit_name=asset_unit_name,
            asset_name=asset_name,
            manager=sender_account,
            reserve=None,
            freeze=None,
            clawback=None,
            strict_empty_address_check=False,
            url=asset_url, 
            metadata_hash=json_metadata_hash,
            decimals=0)
        
        # Sign with secret key of creator
        signed_txn = txn.sign(sender_account)

        # Send the transaction to the network and retrieve the txid.
        txn_id = self.algod_client.send_transaction(signed_txn)
        
        # Wait for the transaction to be confirmed
        confirmed_txn = wait_for_confirmation(self.algod_client, txn_id, 4)  
        
        try:
            # Fetch account info for the creator
            account_info = self.kmd_algorand_class.query_account_information(sender_account)
            # get asset_id from tx
            # Get the new asset's information from the creator account
            ptx = self.algod_client.pending_transaction_info(txn_id)
            asset_id = ptx["asset-index"]
            self.print_created_asset(self.accounts, asset_id)
            self.print_asset_holding(self.accounts, asset_id)
        except Exception as e:
            print(e)

    def fetch_network_parameters(self):
        """        
        Get network params for transactions before every transaction.
        
        Alternatively, manually set the network parameters:
        params.fee = 1000
        params.flat_fee = True
        """
        params = self.algod_client.suggested_params()
        return params
        

    def access_json_file(self, json_file_CID):
        """
        Accepts a json file that is hosted on IPFS such as Pinata and then calculates the hash for that file
        
        Parameter:        
        
        file_path: path that points to json file on disk 
        """        
        # Reading from file and calculating metadata
        metadataJSON = json.loads(json_file_CID)
        metadataStr = json.dumps(metadataJSON)
        
        hash = hashlib.new("sha512_256")
        hash.update(b"arc0003/amj")
        hash.update(metadataStr.encode("utf-8"))
        json_metadata_hash = hash.digest()
        return json_metadata_hash  


    def destroy_nft(self, owner_account, asset_id):
        """
        Destroy asset
        
        Parameters:
        
        owner_account: only the owner of the NFT can delete it 

        """
        # Get network parameters.
        params = self.fetch_network_parameters()
        
        # Asset destroy transaction
        txn = AssetConfigTxn(sender=owner_account,sp=params,index=asset_id, strict_empty_address_check=False)
        
        # Sign with secret key of creator
        signed_txn = txn.sign(owner_account)
        # Send the transaction to the network and retrieve the txid.
        txn_id = self.algod_client.send_transaction(signed_txn)
        # Wait for the transaction to be confirmed
        confirmed_txn = wait_for_confirmation(self.algod_client, txn_id, 4)
        # try:
        #     self.print_asset_holding(owner_account, asset_id)
        #     self.print_created_asset(owner_account, asset_id)
        # except Exception as e:
        #     logging.exception(e)
        # closeout_account(algod_client, accounts[1] )
        return True


    def fetch_all_created_assets(self, account, asset_id):
        """
        Find asset with specific ID that have been created by an account
        
        Parameters:

        account - account address
        asset_id - the ID of the created asset

        N/B: if you have an indexer instance available it is easier to just use:
        response = myindexer.accounts(asset_id = assetid)
        To get info on the created asset
        account_info['created-assets'][0] 
        """
        account_info = self.kmd_algorand_class.query_account_information(account_address=account)
        idx = 0
        
        for info in account_info['created-assets']:
            # loop through all assets belonging to the address and return True if the asset is found
            scrutinized_asset = account_info['created-assets'][idx]
            idx = idx + 1       
            if (scrutinized_asset['index'] == asset_id):
                json.dumps(info['params'], indent=4)
                return True

    def fetch_all_asset_holdings(self, account): # assetid
        """
        Return all assets that are in possession by a specific account
        
        N/B: If you have an indexer instance then use this:
        response = myindexer.accounts(asset_id = assetid)
        then loop thru the accounts returned and match the account you are looking for
        """
        account_info = self.algodclient.account_info(account)
        # a list to store assets
        assets = []
        idx = 0
        for info in account_info['assets']:
            idx = idx + 1  
            assets.append(info[idx])   
            # scrutinized_asset = account_info['created-assets'][idx]
   
            # if (scrutinized_asset['asset-id'] == assetid):
            #     print("Asset ID: {}".format(scrutinized_asset['asset-id']))
            #     print(json.dumps(scrutinized_asset, indent=4))
            #     break
        return assets
