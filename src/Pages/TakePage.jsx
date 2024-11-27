import React, { useEffect, useState } from 'react';
import TableComponent from '../Components/Table';
import NavBar from "../Components/NavBar";
import {Button} from "@mui/material";
import "../Components/Styles/TakePage.css"

const TakePage = () => {
    const [data, setData] = useState([]);


    return (
        <div>
            <NavBar/>
            <main className="main">
                <TableComponent data={data} />

            </main>
       </div>
    );
};

export default TakePage;
