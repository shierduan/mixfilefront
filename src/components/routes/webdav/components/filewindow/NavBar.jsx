import {Breadcrumbs} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import styled from "styled-components";
import ParamLink from "../../../../common/ParamLink.jsx";
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

    .MuiBreadcrumbs-separator {
        font-size: 16px;
    }

    a {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 16px;
        color: rgba(67, 4, 116, 0.86);
    }

    .MuiBreadcrumbs-li {
        display: flex;
        align-items: center;
    }

    .MuiSvgIcon-root {
        color: rgba(142, 42, 254, 0.44);
        font-size: 24px;
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