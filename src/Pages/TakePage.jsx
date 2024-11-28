import React from 'react';
import DataTable from '../Components/DataTable';
import NavBar from "../Components/NavBar";
import "../Styles/TakePage.css"

const TakePage = () => {
    return (
        <div>
            <NavBar/>
            <div className="Table">
                <DataTable />
            </div>
        </div>
    );
};

export default TakePage;
