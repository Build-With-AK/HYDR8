import { Outlet } from "react-router-dom";

import React, { Fragment } from 'react'
import AuraNavbar from "../components/Nav";
import Footer from "../components/Footer";

const PublicLayout = () => {
    return (
        <Fragment>
            <AuraNavbar />
            <Outlet />
            <Footer />
        </Fragment>
    )
}

export default PublicLayout;