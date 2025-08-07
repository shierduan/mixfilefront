import {createTheme, ThemeProvider} from "@mui/material";
import {routeState, TopBar} from "./common/TopBar.jsx";
import Home from "./routes/home/Home.jsx";
import {ToastContainer} from "react-toastify";
import {DialogContainer} from "../utils/DialogContainer.jsx";
import WebDav from "./routes/webdav/WebDAV.jsx";
import {useSnapshot} from "valtio";
import Footer from "./common/Footer.jsx";

const theme = createTheme({
    palette: {
        primary: {
            main: 'rgba(142,42,254,0.63)',
        },
    },
});

const ROUTES = {
    'home': Home,
    'webdav': WebDav,
}


export function App() {

    const {route} = useSnapshot(routeState)

    const Page = ROUTES[route]

    return (
        <ThemeProvider theme={theme}>
            <TopBar/>
            <Page/>
            <ToastContainer/>
            <DialogContainer/>
            <Footer/>
        </ThemeProvider>
    );
}