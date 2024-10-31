import React, {useState} from "react";
import Header from "../Header";
import LoginPopup from "../LoginPopup";
import RegisterPopup from "../RegisterPopup";
import HeroSection from "../HeroSection";

const WelcomePage = () => {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isRegisterOpen, setRegisterOpen] = useState(false);

    return (
        <div>
            <Header setLoginOpen={setLoginOpen} setRegisterOpen={setRegisterOpen} />
            <main>
                <HeroSection/>
            </main>

            <LoginPopup open={isLoginOpen} onClose={() => setLoginOpen(false)} />
            <RegisterPopup open={isRegisterOpen} onClose={() => setRegisterOpen(false)} />
        </div>
    );
};

export default WelcomePage;
