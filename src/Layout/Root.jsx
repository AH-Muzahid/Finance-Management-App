import React, { Suspense } from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import FloatingAddButton from '../Components/FloatingAddButton';
import PageSkeleton from '../Components/PageSkeleton';

const Root = () => {
    return (
        <div>
            <Navbar />
            <div className="pb-20 md:pb-0">
                <Suspense fallback={<PageSkeleton />}>
                    <Outlet />
                </Suspense>
            </div>
            <FloatingAddButton />
            <Footer />
        </div>
    );
};

export default Root;