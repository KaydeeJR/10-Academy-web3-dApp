// PAGES ARE NOT LOADING CONTENT
import { BrowserRouter as Router } from 'react-router-dom';
import Staff from './Staff/Staff';
import Trainee from './Trainee/Trainee';
import Public from './Public/Public';
import Home from './Home/Home';
import { Route, Routes } from 'react-router-dom';

const Pages: React.FC = () => {
    return (
        <Router>
            <Routes>
                < Route path="/" element={< Home />} />
                < Route path="/staff" element={< Staff />} />
                < Route path="/trainee" element={< Trainee />} />
                < Route path="/public" element={< Public />} />
            </Routes>
        </Router>
    );
};
export default Pages;