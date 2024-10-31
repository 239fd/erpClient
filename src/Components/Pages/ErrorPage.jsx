import NavBar from "../NavBar";
import React from "react";
import ErrorImage from "../Images/ErrorPage.svg"

const ErrorPage = () => {
    return(
        <div>
            <NavBar/>
            <main>
                <img src={ErrorImage} alt="Ошибка"/>
            </main>
        </div>
    )
}

export default ErrorPage;