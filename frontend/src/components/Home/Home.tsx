import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { red } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';   

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const Home: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        // Runs after login button is clicked
        // N/B: MUST have a running instance of Strapi with local authentication provided.
        event.preventDefault();
        // make a POST request to the Strapi backend's registration endpoint with the user name, email and password
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
                if (error.response.status === 400) {
                    // USER ALREADY EXISTS SO HANDLE AUTHORIZATION
                    handleAuthorization()
                }
                else {
                    console.log(error.response.status)
                }
            });
        handleClose()
    };

    const handleAuthorization = () => {
        // make a POST request to the Strapi backend's authentication endpoint with the user name, email and password
        axios
            .post('http://localhost:1337/api/auth/local', {
                identifier: userEmail,
                password,
            })
            .then(response => {
                // Response from the Strapi backend is logged to the console
                // console.log('User profile ID', response.data.user.id);
                console.log('User role', response.data.user["user_role"]);
                switch (response.data.user["user_role"]) {
                    case "Trainee":
                        navigateToTrainees();
                        break;
                    case "Staff":
                        navigateToStaff();
                        break;
                    case "Public":
                        navigateToPublic();
                        break;
                    default:
                        navigateHome();
                        break;
                }
            })
            .catch(error => {
                // Erros from the Strapi backend are logged to the console
                console.log(error.response.status)
            });
    }

    const handleClickOpen = () => {
        setDialogOpen(true);
        // reset input textfields to empty values
        setUserEmail('')
        setPassword('')
        setUserName('')
    };

    const handleClose = () => {
        setDialogOpen(false);
        // reset input textfields to empty values
        setUserEmail('');
        setPassword('');
        setUserName('');
    };

    const navigateToStaff = () => {
        // navigate to Staff page
        navigate('/staff');
    };

    const navigateHome = () => {
        // navigate to Home page
        navigate('/');
    };

    const navigateToTrainees = () => {
        // navigate to Trainees page
        // navigate('/trainees', { replace: true });     
        navigate('/trainees');
    };
    const navigateToPublic = () => {
        // navigate to Public page
        navigate('/public');
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