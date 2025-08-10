import {createTheme, ThemeProvider} from "@mui/material";
import {TopBar} from "./common/TopBar.jsx";
import Home from "./routes/home/Home.jsx";
import {ToastContainer} from "react-toastify";
import {DialogContainer} from "../utils/DialogContainer.jsx";
import WebDav from "./routes/webdav/WebDAV.jsx";
import Footer from "./common/Footer.jsx";
import {HashRouter, Outlet, Route, Routes} from "react-router-dom";
import FileSelect from "./common/FileSelect.jsx";


const theme = createTheme({
    palette: {
        primary: {
            main: 'rgb(175,107,252)',
        },
    },
});

function Layout() {
    return (
        <>
            <TopBar/>
            <Outlet/>
            <ToastContainer/>
            <DialogContainer/>
            <Footer/>
            <FileSelect/>
        </>
    );
}


export function App() {


    return (
        <ThemeProvider theme={theme}>
            <HashRouter>
                <Routes>
                    <Route element={<Layout/>}>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/webdav/*" element={<WebDav/>}/>
                    </Route>
                </Routes>
            </HashRouter>
        </ThemeProvider>
    );
}