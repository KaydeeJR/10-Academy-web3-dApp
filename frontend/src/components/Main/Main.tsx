import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { red } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import axios from 'axios';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// import { useHistory } from 'react-router';

// interface Props {
//     setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
// }
// function userExists(email:string) {
// 	var results = api.db.query('users', {
// 		email: email
// 	});
// 	if (results.length === 1) {
// 		return true;
// 	}
// 	return false;
// }
const Home: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    // const history = useHistory();

    const handleSubmit = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        // Runs after login button is clicked
        // N/B: MUST have a running instance of Strapi with local authentication provided.
        event.preventDefault();
        // make a POST request to the Strapi backend's authentication endpoint with the user email and password
        axios
      .post('http://localhost:1337/api/auth/local/register', {
        username: userName,
        email: userEmail,
        password,
      })
      .then(response => {
        // Response from the Strapi backend is logged to the console
        console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);
      })
      .catch(error => {
        // Erros from the Strapi backend are logged to the console
        console.log('An error occurred:', error.response);
        console.log(typeof error)
        // setErrorMessage(error)
      });
      handleClose()
    };

    const handleClickOpen = () => {
        setDialogOpen(true);
        // reset input textfields to empty values
        setUserEmail('')
        setPassword('')
        setUserName('')
        setErrorMessage('')
    };

    const handleClose = () => {
        setDialogOpen(false);
        // reset input textfields to empty values
        setUserEmail('')
        setPassword('')
        setUserName('')
        setErrorMessage('')
    };

    const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
        // STYLING THE LOG IN BUTTON
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        width: 150,
        height: 50,
        display: 'block',
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'large',
        '&:hover': {
            backgroundColor: red[700],
        },
    }));

    return (
        <main>
            {/* LOG IN BUTTON */}
            <ColorButton onClick={handleClickOpen}>Log In</ColorButton>

            {/* DIALOG BOX */}
            <Dialog open={dialogOpen} onClose={handleClose} keepMounted>
                <DialogTitle id="login-dialog"> {"Log In"} </DialogTitle>
                < DialogContent >
                    <DialogContentText>
                        Please log in
                    </DialogContentText>
                    {/* 3 TEXT FIELDS THAT ACCEPT USER NAME, EMAIL AND PASSWORD */}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="user"
                        label="User Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={userName}
                        onChange={e => {
                            setUserName(e.target.value)
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={userEmail}
                        onChange={e => {
                            setUserEmail(e.target.value)
                        }}
                    />
                    < TextField
                        autoFocus
                        margin="dense"
                        id="pass"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value)
                        }}
                    />
                </DialogContent>
                < DialogActions>
                    <Button autoFocus onClick={handleClose} color="error" >
                        Close
                    </Button>
                    <Button autoFocus onClick={handleSubmit} color="success" >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </main>
    );
};

export default Home;