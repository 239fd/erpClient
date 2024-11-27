import React from 'react';
import { RouterProvider, createBrowserRouter} from 'react-router-dom';
import WelcomePage from './Pages/WelcomePage';
import ErrorPage from './Pages/ErrorPage';
import MainPage from "./Pages/MainPage";


function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <WelcomePage />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "/main",
                    element: <MainPage/>,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;