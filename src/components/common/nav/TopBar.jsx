import styled from "styled-components";
import {AppBar, Tab, Tabs} from "@mui/material";
import logo from "../../../assets/logo.png";
import {useLocation, useNavigate} from "react-router-dom";


const Container = styled(AppBar)`
    
    && {
        z-index: 999;
    }

    .content {
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 5px 10px;

        h2 {
            filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
        }

        .tabs {
            button {
                font-weight: bold;
                font-size: 16px;
                color: white;
            }

            .MuiTabs-indicator {
                background-color: rgb(221, 193, 251);
            }
        }

        .logo {
            img {
                width: 50px;
                height: 50px;
                transition: .3s;
                filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));

                &:hover {
                    transform: scale(1.1);
                }
            }
        }
    }
`

const tabRoutes = [
    {value: '/', matchPrefix: '/'},
    {value: '/webdav', matchPrefix: '/webdav'},
    // 以后要加更多tab，只要在这里加一项即可
];

function getCurrentTab(pathname) {
    // 从后往前找，保证更长的前缀优先匹配
    for (let i = tabRoutes.length - 1; i >= 0; i--) {
        const prefix = tabRoutes[i].matchPrefix;
        if (pathname === prefix || pathname.startsWith(prefix + '/')) {
            return tabRoutes[i].value;
        }
    }
    // 如果都不匹配，默认返回 '/'
    return '/';
}


export function TopBar() {

    const location = useLocation();
    const navigate = useNavigate();
    const currentTab = getCurrentTab(location.pathname);


    return <Container position="sticky" className={"animate__animated animate__slideInDown animate__faster"} sx={{
        zIndex: 10,
    }}>
        <div class="content">
            <div className="logo">
                <img src={logo} alt="logo"/>
            </div>
            <h2>
                MixFile
            </h2>
            <div class="tabs">
                <Tabs value={currentTab} onChange={(event, value) => {
                    navigate(value)
                }}>
                    <Tab label="主页" value={'/'}/>
                    <Tab label="WebDAV" value={'/webdav'}/>
                </Tabs>
            </div>
        </div>
    </Container>
}