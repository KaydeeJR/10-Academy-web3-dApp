import React from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Pages from './components/Pages';


const App: React.FC = () => {
  return (
    <div>
      <Header />
      <Pages />
      <Footer />
    </div>
  );
};

export default App;