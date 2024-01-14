import React, { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './Scss/main.scss';
import Home from './components/pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;