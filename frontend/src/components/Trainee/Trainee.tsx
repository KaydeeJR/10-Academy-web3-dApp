import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import './Trainee.css';
import MyAlgoConnect from '@randlabs/myalgo-connect';
import { red } from '@mui/material/colors';
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface Column {
    id: | 'challenge' | 'status';
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (value: number) => string;
}
const columns: readonly Column[] = [
    { id: 'challenge', label: 'Weekly Challenge', minWidth: 170 },
    { id: 'status', label: 'Status', minWidth: 170 }
];
interface Data {
    challenge: number;
    // 0 = NOT YET APPROVED; 1 = REJECTED
    status: string;
}
function createDataPoint(challenge: number, status: string): Data {
    return { challenge, status };
}
const testRows = [
    createDataPoint(6, "pending")
];

const Trainee: React.FC = () => {
    const myAlgoWallet = new MyAlgoConnect();
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
    async function handleOptIn(){
        // SHOWS A POP UP THAT PROMPTS THE USER FOR A PASSWORD TO CONNECT TO THEIR WALLET
        try {
            const accounts = await myAlgoWallet.connect();
            const addresses = accounts.map(account => account.address);
            console.info(addresses);
        } catch (err) {
            console.error(err);
        }
};
return (
    <div>
        <h2 className={'title-text'}>Trainee</h2>
        {/* OPT IN BUTTON */}
        <BootstrapButton onClick={handleOptIn}>Opt In</BootstrapButton>

        {/* TABLE THAT SHOWS ALL THE REQUESTS THAT A TRAINEE HAS MADE */}
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
    </div>
);
};
export default Trainee;