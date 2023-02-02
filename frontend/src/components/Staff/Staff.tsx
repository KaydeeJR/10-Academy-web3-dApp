// TODO: FETCH ACCOUNT BALANCE, MINT NFT 
// TODO: USE ENUMS TO STORE ACCEPTED/REJECTED STATUS VALUES
import './Staff.css';
import { useState } from 'react';
import axios from 'axios';

import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { red } from '@mui/material/colors';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MyAlgoConnect from '@randlabs/myalgo-connect';
import algosdk from 'algosdk';

// DUMMY TABLE DATA
interface Column {
    id: 'email' | 'challenge'|'date';
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (value: number) => string;
}
const columns: readonly Column[] = [
    { id: 'email', label: 'Trainee Email', minWidth: 170 },
    { id: 'challenge', label: 'Weekly Challenge', minWidth: 100 },
    { id: 'date', label: 'Date Requested', minWidth: 100 }
];
interface Data {
    name: string;
    challenge: number;
    date: string;

}
function createDataPoint(name: string, challenge: number, date:string): Data {
    return { name, challenge, date };
}
const testRows = [
    createDataPoint('Janerose', 6, formatDate(new Date())),
    createDataPoint('example1', 8, formatDate(new Date())),
    createDataPoint('example2', 1, formatDate(new Date()))
];

function formatDate(dateObject: Date){
    const year: string = (dateObject.getFullYear()).toString();
    // month is an integer that ranges from 0 to 11
    const month: string = (dateObject.getMonth() + 1).toString();
    const dayOfMonth: string = dateObject.getDate().toString();
    const dateString:string = dayOfMonth.concat(" - ".concat(month.concat(" - ".concat(year))));
    return dateString; 
}

function uploadFileMetadata() { }


const Staff: React.FC = () => {
    // PURESTAKE PARAMETERS
    const baseServer =  "https://testnet-algorand.api.purestake.io/ps2/v2/"
    
    const port = '';
    const token = {
        'x-api-key': "J4Kvs1vx9c2pLLpMcnbjp4JgC735TPrQ3rXVmc0s"
     };
    //  ALGO WALLET
    const myAlgoWallet = new MyAlgoConnect();
    // INSTANTIATING THE CLIENT
    const algodClient = new algosdk.Algodv2(token, baseServer, port);
    const [fileSelected, setFileSelected] = useState<File>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [creatorAddress, setCreator] = useState("");
    const [unitName, setUnitName] = useState(""); // e.g. "ALICEART"
    const [assetName,setAssetName] = useState(""); // e.g. "Alice's Artwork@arc3"
    const [assetUrl, setAssetUrl] = useState(""); // e.g. "https://path/to/my/nft/asset/metadata.json"
    const[assetMetadataUrl, setMetadataUrl] =useState("");
    // const managerAddr = undefined;
    // const reserveAddr = undefined;
    // const freezeAddr = undefined;
    // const clawbackAddr = undefined;
    const defaultFrozen = false;
    const total = 1; // NFTs have totalIssuance of exactly 1
    const decimals = 0; // NFTs have decimals of exactly 0

    const pinataConfig = {
        root: 'https://api.pinata.cloud',
        headers: {
            'pinata_api_key': process.env.REACT_APP_API_KEY,
            'pinata_secret_api_key': process.env.REACT_APP_API_SECRET
        }
    };
    const handleIssueNFT = async () => {
        try {
            const accounts = await myAlgoWallet.connect();
            const addresses = accounts.map(account => account.address);
            //Check account balance    
            const accountInfo = await algodClient.accountInformation(addresses[0]).do();
            const startingAmount = accountInfo.amount;
            console.info("Account balance: %d microAlgos", startingAmount);
            setCreator(addresses[0]);
        } catch (err) {
            console.error(err);
        }
    }
    const handleCreateNft = async () => {
        const params = await algodClient.getTransactionParams().do();
        const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
            from: creatorAddress,
            total,
            decimals,
            assetName,
            unitName,
            assetURL: assetUrl,
            assetMetadataHash: assetMetadataUrl,
            defaultFrozen,
            freeze: creatorAddress,
            manager: creatorAddress,
            clawback: creatorAddress,
            reserve: creatorAddress,
            suggestedParams: params,
        });
        // const rawSignedTxn = txn.signTxn(alice.sk);
        // const tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
        // let assetID = null;
        // // wait for transaction to be confirmed
        // const confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
        // //Get the completed Transaction
        // console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
        // assetID = confirmedTxn["asset-index"];
        // // console.log("AssetID = " + assetID);
    }
    const handleClickOpen = () => {
        setDialogOpen(true); 
    };

    const handleClose = () => {
        setDialogOpen(false);
        handleIssueNFT();
        // reset input textfields to empty values
        setCreator('');
        setAssetName('');
        setAssetUrl('');
        setMetadataUrl('');
        setUnitName('');
    };

    // UPLOAD FILE FROM DISK
    function handleFileUpload(selectedFiles) {
        console.info(selectedFiles[0].name);
        console.info(selectedFiles[0]);
        setFileSelected(selectedFiles[0])
    }
    // PINATA API
    const pinFileToPinata = async () => {
        const url = `${pinataConfig.root}/pinning/pinFileToIPFS`;
        // produces a IPFS hash 
        if (fileSelected !== undefined) {
            const formData = new FormData();
            formData.append('file', fileSelected);
            const pinataBody = {
                options: {
                    cidVersion: 0,
                },
                metadata: {
                    name: fileSelected.name,
                    keyvalues: { organization: '10Academy' }
                }
            }
            formData.append('pinataOptions', JSON.stringify(pinataBody.options));
            formData.append('pinataMetadata', JSON.stringify(pinataBody.metadata));
            try {
                const response = await axios({
                    method: 'post',
                    url: url,
                    data: formData,
                    headers: pinataConfig.headers
                });
                console.log(response.data);
            } catch (error) {
                console.log(error)
            }
        }
    }

    // const testPinataConnection = async () => {
    //     try {
    //         const url = `${pinataConfig.root}/data/testAuthentication`
    //         const res = await axios.get(url, { headers: pinataConfig.headers });
    //         console.log(res.data);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // STYLED BUTTON
    const BootstrapButton = styled(Button)({
        padding: '6px 12px',
        border: '3px solid',
        width: 250,
        height: 50,
        display: 'block',
        margin: 'auto',
        fontSize: 'large',
        color: 'black',
        borderColor: red[500],
        '&:hover': {
            backgroundColor: red[700],
        },
    });

    return (
        <div>
             <h2 className={'title-text'}>Staff</h2>
            <div>
                <div className='row-component'>
                    {/* FILE SELECTOR */}
                    <input type="file" onChange={(e) => handleFileUpload(e.target.files)} />
                    {/* UPLOAD BUTTON */}
                    <BootstrapButton onClick={pinFileToPinata}>UPLOAD TO PINATA</BootstrapButton>
                </div>
                <h2 className={'title-text'}>Opt In requests from trainees</h2>
            </div>
            <Paper className='table' sx={{ overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{
                                    minWidth
                                        : column.minWidth
                                }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {testRows.map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                    <BootstrapButton onClick={handleClickOpen}>ISSUE NFT</BootstrapButton>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </TableContainer>
            </Paper>

            {/* DIALOG BOX */}
            <Dialog open={dialogOpen} onClose={handleClose} keepMounted>
                <DialogTitle id="nft-list-dialog"> {"NFTs"} </DialogTitle>
                < DialogContent >
                    <DialogContentText>
                        Create NFTs
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="creator"
                        label="Asset Creator"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={creatorAddress}
                        onChange={e => {
                            setCreator(e.target.value)
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="unit_name"
                        label="Unit Name e.g. ALICEART"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={unitName}
                        onChange={e => {
                            setUnitName(e.target.value)
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="asset_name"
                        label="Asset Name e.g. Alice's Artwork@arc3"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={assetName}
                        onChange={e => {
                            setAssetName(e.target.value)
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="asset_url"
                        label="Asset URL"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={assetUrl}
                        onChange={e => {
                            setAssetUrl(e.target.value)
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="metadata_url"
                        label="Metadata URL"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={assetMetadataUrl}
                        onChange={e => {
                            setMetadataUrl(e.target.value)
                        }}
                    />
                    <BootstrapButton autoFocus onClick={handleCreateNft} color="error" >
                        Mint
                    </BootstrapButton>
                </DialogContent>
                < DialogActions>
                    <Button autoFocus onClick={handleClose} color="error" >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default Staff;