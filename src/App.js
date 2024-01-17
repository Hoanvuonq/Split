import React, { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './Scss/main.scss';
import Home from './components/pages/Home';
import FactorAuth from './components/pages/FactorAuth';

function App() {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/factor-auth" element={<FactorAuth />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;