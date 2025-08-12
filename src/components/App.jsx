import {createTheme, ThemeProvider} from "@mui/material";
import {TopBar} from "./common/nav/TopBar.jsx";
import Home from "./routes/home/Home.jsx";
import {DialogContainer} from "../utils/DialogContainer.jsx";
import WebDav from "./routes/webdav/WebDAV.jsx";
import Footer from "./common/Footer.jsx";
import {HashRouter, Outlet, Route, Routes} from "react-router-dom";
import FileSelect from "./common/FileSelect.jsx";
import {Toaster} from "react-hot-toast";
import './App.scss'
import UploadTipBar from "./common/nav/UploadTipBar.jsx";


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
            <UploadTipBar/>
            <Outlet/>
            <Toaster/>
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