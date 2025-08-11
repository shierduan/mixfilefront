import {Breadcrumbs} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import styled from "styled-components";
import {Link, useLocation} from "react-router-dom";

const Container = styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    border-radius: 10px;

    a {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 16px;
        color: rgba(67, 4, 116, 0.86);
        transition: .3s;
        text-decoration: none;
        border-radius: 10px;
        padding: 2px 7px;

        &:hover {
            background-color: rgba(142, 42, 254, 0.18);
        }
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
        <Container className={'shadow no-select'}>
            <Breadcrumbs aria-label="breadcrumb">
                {crumbs}
            </Breadcrumbs>
        </Container>
    );
}

export default NavBar;