import styled from "styled-components";
import AddIcon from '@mui/icons-material/Add';
import {Fab} from "@mui/material";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import {addDialog} from "../../../../../utils/DialogContainer.jsx";
import NewFolder from "./NewFolder.jsx";

const Container = styled.div`
    width: 100%;
    height: 60px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0px 20px;
    gap: 20px;
    background-color: rgba(142, 42, 254, 0.21);

    svg {
        color: rgba(142, 42, 254, 0.77);
    }
`

const fabs = [
    {
        name: '上传文件',
        icon: <AddIcon/>,
        onClick() {

        }
    }, {
        name: '新建文件夹',
        icon: <CreateNewFolderIcon/>,
        onClick() {
            addDialog(<NewFolder/>)
        }
    }
]

function ActionBar(props) {

    return (
        <Container className={'shadow'}>
            {
                fabs.map(it =>
                    <Fab
                        size={'small'}
                        title={it.name}
                        key={it.name}
                        onClick={it.onClick}
                        sx={{
                            zIndex: 'unset'
                        }}
                    >
                        {it.icon}
                    </Fab>
                )
            }
        </Container>
    );
}

export default ActionBar;