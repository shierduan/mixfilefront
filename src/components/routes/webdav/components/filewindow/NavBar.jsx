import {Breadcrumbs} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import styled from "styled-components";
import ParamLink from "../../../../common/ParamLink.js";
import {useSnapshot} from "valtio";
import {webDavState} from "./FileWindow.jsx";

const Container = styled.div`
    width: 100%;
    max-width: 1200px;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    border-radius: 10px;

    a {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .MuiSvgIcon-root {
        font-size: 20px;
    }
`


function NavBar(props) {

    const {path} = useSnapshot(webDavState)

    const segments = path.split('/').filter(Boolean)

    let lastSegment = ''

    const crumbs = segments.map((segment, index) => {
        lastSegment += `/${segment}`
        return <ParamLink
            params={{
                path: lastSegment
            }}
            key={index}
        >
            {segment}
        </ParamLink>
    })

    return (
        <Container className={'shadow'}>
            <Breadcrumbs aria-label="breadcrumb">
                <ParamLink
                    params={{
                        path: ''
                    }}
                >
                    <HomeIcon fontSize="inherit"/>
                    ROOT
                </ParamLink>
                {crumbs}
            </Breadcrumbs>
        </Container>
    );
}

export default NavBar;