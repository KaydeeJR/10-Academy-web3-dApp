import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import './Staff.css';
import { useState } from 'react';
import Checkbox from "@material-ui/core/Checkbox";
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';


interface Column {
    id: 'email' | 'challenge' | 'accepted';
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (value: number) => string;
}
const columns: readonly Column[] = [
    { id: 'email', label: 'Trainee Email', minWidth: 170 },
    { id: 'challenge', label: 'Weekly Challenge', minWidth: 170 },
    { id: 'accepted', label: 'Accepted', minWidth: 170 }
];
interface Data {
    email: string;
    challenge: number;
    // 0 or -1 = NOT YET APPROVED; 1 = REJECTED
    accepted: number;
}
function createDataPoint(email: string, challenge: number, accepted: number): Data {
    return { email, challenge, accepted };
}
const testRows = [
    createDataPoint('janerosenyams@gmail.com', 6, 0)
];
function fetchAsset() {
    //     // // Alternatively use the JWT key
    //     // const pinata = new pinataSDK({ pinataJWTKey: 'yourPinataJWTKey'});
    //     // // Alternatively, use the api keys by specifying your api key and api secret
    //     // const pinata = new pinataSDK({ pinataApiKey: 'yourPinataApiKey', pinataSecretApiKey: 'yourPinataSecretApiKey' });

    //     // pinata.testAuthentication().then((result) => {
    //     //     //handle successful authentication here
    //     //     console.log(result);
    //     }).catch((err) => {
    //         //handle error here
    //         console.log(err);
    //     });
    // // }
}
async function uploadMediaToPinata() {
    //     // // Alternatively use the JWT key
    //     // const pinata = new pinataSDK({ pinataJWTKey: 'yourPinataJWTKey'});
    //     // // Alternatively, use the api keys by specifying your api key and api secret
    //     // const pinata = new pinataSDK({ pinataApiKey: 'yourPinataApiKey', pinataSecretApiKey: 'yourPinataSecretApiKey' });

    //     // pinata.testAuthentication().then((result) => {
    //     //     //handle successful authentication here
    //     //     console.log(result);
    //     }).catch((err) => {
    //         //handle error here
    //         console.log(err);
    //     });
    // // }
}

async function testAuthenticationToPinata(checkedBox) {
    const url = `https://api.pinata.cloud/data/testAuthentication`;
    const pinataApiKey = process.env.REACT_APP_API_KEY;
    const pinataSecretApiKey = process.env.REACT_APP_API_SECRET;
    // if (checkedBox) {
    //     setSelected(1);
    // Use the api keys to test connection to pinata
    return axios
        .get(url, {
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey
            }
        })
        .then(function (response) {
            //handle your response here
            if (response.status === 200) {
                //  successful connection to Pinata
                fetchAsset()
            }
        })
        .catch(function (error) {
            //handle error here
            console.info(error);
        });
    // }
};

const Staff: React.FC = () => {
    const [selected, setSelected] = useState<number[]>([]);
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
    return (
        <div>
            <div>
                <h2 className={'title-text'}>Opt In requests from trainees</h2>
                {/* UPLOAD BUTTON */}
                <BootstrapButton onClick={uploadMediaToPinata}>UPLOAD</BootstrapButton>
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.email}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                    <Checkbox onClick={() => testAuthenticationToPinata(selected.indexOf(row.accepted) !== -1)} checked={selected.indexOf(row.accepted) !== -1} />
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </TableContainer>
            </Paper>
        </div>
    );
}
export default Staff;