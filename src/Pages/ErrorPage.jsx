import NavBar from "../Components/NavBar";
import React from "react";
import ErrorImage from "../Components/Images/ErrorPage.svg"
import "../Styles/ErrorPage.css"


const ErrorPage = () => {
    return(
        <div>
            <NavBar/>
            <section>
                <img src={ErrorImage} alt="Ошибка" style={{ width: "38%" }} />
            </section>
        </div>
    )
}

export default ErrorPage;