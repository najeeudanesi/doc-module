import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./assets/css/general.css"
import "./assets/css/index.css"
import "./assets/css/pages-icons.css"
import "./assets/css/pages-sidebar.css"

import Homepage from './components/home';
import { Toaster } from 'react-hot-toast';

import { MyProvider } from './contexts';
import PageLayout from './components/layouts/PageLayout';
import NotFound from './components/pages/NotFound';

// Define a component for the 404 page

function App() {
  return (
    <MyProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/doctor/*" element={<PageLayout />} />
            {/* Render the NotFound component for unmatched routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster position='top-right' />
      </div>
    </MyProvider>
  );
}

export default App;
