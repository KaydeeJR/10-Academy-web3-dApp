
txn = AssetConfigTxn(sender=accounts[1]['pk'],
                     sp=params,
                     total=1,           // NFTs have totalIssuance of exactly 1
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