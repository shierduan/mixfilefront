import {Breadcrumbs} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import styled from "styled-components";
import {Link, useLocation} from "react-router-dom";

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

    const path = useLocation().pathname

    const segments = path.split('/').filter(Boolean)

    let lastSegment = ''

    const crumbs = segments.map((segment, index) => {
        lastSegment += `/${segment}`
        let content = decodeURIComponent(segment)
        if (index === 0) {
            content = <>
                <HomeIcon fontSize="inherit"/>
                ROOT
            </>
        }
        return <Link
            to={lastSegment}
            key={index}
        >
            {content}
        </Link>
    })

    return (
        <Container className={'shadow'}>
            <Breadcrumbs aria-label="breadcrumb">
                {crumbs}
            </Breadcrumbs>
        </Container>
    );
}

export default NavBar;