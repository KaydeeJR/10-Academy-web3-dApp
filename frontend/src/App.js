import React from 'react'; //  { Component } 
import logo from './app logo.png';
import './App.css';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from '@mui/material/Slide'


const upTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function App() {
    const [open, setOpen] = React.useState(false);

    const handleClickToOpen = () => {
        setOpen(true);
    };

    const handleToClose = () => {
        setOpen(false);
    };
    return (
        <div className="App">
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
            </div>
            <h1>Welcome</h1>
            {/* () => {alert('login clicked');} */}
            <Button variant="contained" color="error" size="large" onClick={handleClickToOpen}>
                Login</Button>;
            <Dialog open={open} onClose={handleToClose} TransitionComponent={upTransition}
                keepMounted>
                <DialogTitle id="login-dialog" onClose={handleToClose}>{"Enter login details"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please log in
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="user"
                        label="user"
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="password"
                        type="password"
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleToClose} color="error">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
// }

// export default App;