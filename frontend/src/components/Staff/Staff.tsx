import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Staff: React.FC = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        setTimeout(()=> {navigate('/trainee');}, 3000);
    }, []);
    return (< TextField
        autoFocus
        margin="dense"
        id="pass"
        label="Password"
        type="password"
        fullWidth
        variant="outlined"
        value={"Welcome to Staff Page"}/>
    );
}
export default Staff;