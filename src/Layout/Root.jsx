import React from 'react';
import Footer from '../Components/Footer';
import { Outlet } from 'react-router';
import Navbar from '../Components/Navbar';

const Root = () => {
    return (
        <div>
            <Navbar />
            <div className="pb-20 md:pb-0">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Root;