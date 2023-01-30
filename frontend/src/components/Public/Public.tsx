import TextField from '@mui/material/TextField';
const Public: React.FC = () => {

    return (< TextField
        autoFocus
        margin="dense"
        id="pass"
        label="Password"
        type="password"
        fullWidth
        variant="outlined"
        value={"Welcome to Public Page"} />
    );
}
export default Public;