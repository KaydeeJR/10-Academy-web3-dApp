// TODO: USE ENUMS TO STORE STATUS VALUES
import './Trainee.css';
import { useState } from 'react';

import MyAlgoConnect from '@randlabs/myalgo-connect';
import algosdk from "algosdk";

import { red } from '@mui/material/colors';
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Column {
    id: | 'challenge' | 'status'| 'date';
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (value: number) => string;
}
const columns: readonly Column[] = [
    { id: 'challenge', label: 'Weekly Challenge', minWidth: 170 },
    { id: 'status', label: 'Status', minWidth: 170 },
    { id: 'date', label: 'Date Requested', minWidth: 170 }
];
interface Data {
    date: string;
    challenge: number;
    // 0 = NOT YET APPROVED; 1 = REJECTED
    status: string;
}
function createDataPoint(date: string, challenge: number, status: string): Data {
    return { date, challenge, status };
}
const testRows = [
    createDataPoint(formatDate(new Date()), 6, "pending")
];

function formatDate(dateObject: Date){
    const year: string = (dateObject.getFullYear()).toString();
    // month is an integer that ranges from 0 to 11
    const month: string = (dateObject.getMonth() + 1).toString();
    const dayOfMonth: string = dateObject.getDate().toString();
    const dateString:string = dayOfMonth.concat(" - ".concat(month.concat(" - ".concat(year))));
    return dateString; 
}
const Trainee: React.FC = () => {
    const myAlgoWallet = new MyAlgoConnect({ disableLedgerNano: false });
    const settings = {
        shouldSelectOneAccount: false,
        openManager: false
    };
    const [dialogOpen, setDialogOpen] = useState(false);
    const [traineeAddress, setTraineeAddress] = useState('');
    const [challengeID, setChallengeID] = useState("");
    const [status, setStatus] = useState('pending');
    const BootstrapButton = styled(Button)({
        padding: '6px 12px',
        border: '3px solid',
        width: 150,
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
    const handleClickOpen = () => {
        // fetch address from algorand wallet 
        fetchAlgorandAddress();
    };
    
    const handleClose = () => {
        setDialogOpen(false);
        // reset input textfields to empty values
        setTraineeAddress("");
        setChallengeID("");
    };
    async function fetchAlgorandAddress(){
        setDialogOpen(true);
        // SHOWS A POP UP THAT PROMPTS THE USER FOR A PASSWORD TO CONNECT TO THEIR WALLET
        try {
            // fetching accounts and setting account address
            const accountsSharedByUser = await myAlgoWallet.connect(settings);
            const addresses = accountsSharedByUser.map(account => account.address);
            setTraineeAddress(addresses[0]);
            // fetching account information
            const algodClient = new algosdk.Algodv2('', 'https://node.testnet.algoexplorerapi.io', '');
            // const accountUrl = " https://testnet-api.algonode.cloud/v2/accounts/";
            // const accountInformation = await (await fetch(accountUrl.concat(traineeAddress))).json();
            const accountInformation = await algodClient.accountInformation(traineeAddress).do();
            // const params = await algodClient.getTransactionParams().do();
            console.info(addresses);
            console.info(accountInformation);
            setDialogOpen(true);
        } catch (err) {
            console.error(err);
        }
    }
    async function handleOptIn(){
        
};
return (
    <div>
        <h2 className={'title-text'}>Trainee</h2>
        {/* OPT IN BUTTON */}
        <BootstrapButton onClick={handleClickOpen}>Opt In</BootstrapButton>

        {/* TABLE SHOWING REQUESTS MADE BY TRAINEE */}
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
                            <TableRow hover role="checkbox" tabIndex={-1}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.format && typeof value === 'number' ? column.format(value) : value}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </TableContainer>
        </Paper>
        {/* DIALOG BOX */}
        <Dialog open={dialogOpen} onClose={handleClose} keepMounted>
                <DialogTitle id="nft-opt-in"> {"Opt in request"} </DialogTitle>
                < DialogContent >
                    <DialogContentText>
                        Opt In to receive an NFT
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="address"
                        label="Algorand Address"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={traineeAddress}
                        onChange={e => {
                            setTraineeAddress(e.target.value)
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="challenge"
                        label="Weekly Challenge"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={challengeID}
                        onChange={e => {
                            setChallengeID(e.target.value)
                        }}
                    />
                    <BootstrapButton autoFocus onClick={handleOptIn} color="error" >
                        Send
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
};
export default Trainee;