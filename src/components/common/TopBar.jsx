import styled from "styled-components";
import {AppBar, Tab, Tabs} from "@mui/material";
import logo from "../../assets/logo.png";
import {useSnapshot} from "valtio";
import {paramProxy} from "../../utils/CommonUtils.js";


const Container = styled(AppBar)`
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

export const routeState = paramProxy({
    route: 'home'
})


export function TopBar() {

    const {route} = useSnapshot(routeState)

    return <Container position="sticky" className={"animate__animated animate__slideInDown animate__faster"}>
        <div class="content">
            <div className="logo">
                <img src={logo} alt="logo"/>
            </div>
            <h2>
                MixFile
            </h2>
            <div class="tabs">
                <Tabs value={route} onChange={(event, value) => {
                    routeState.route = value
                }}>
                    <Tab label="主页" value={'home'}/>
                    <Tab label="WebDAV" value={'webdav'}/>
                </Tabs>
            </div>
        </div>
    </Container>
}