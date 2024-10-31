import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from '../NavBar';
import SectionHero from '../SectionHero';

const MainPage = () => {
    return (
        <Router>
            <div>
                <NavBar />
                <main>
                    <SectionHero />
                </main>
            </div>
        </Router>
    );
};

export default MainPage;
