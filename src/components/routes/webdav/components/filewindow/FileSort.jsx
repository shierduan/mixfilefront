import styled from "styled-components";
import {FILE_SORTS, selectedFiles} from "./FileWindow.jsx";
import {reverseSort} from "../../../../../utils/CommonUtils.jsx";

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px;
    font-weight: bold;
    color: rgb(133, 105, 153);

    span {
        cursor: pointer;
        user-select: none;
    }

    .file-name {
        display: flex;
        gap: 20px;
        align-items: center;

        .name {
            width: 430px;
            max-width: 50vw;
        }
    }

    .date {
        @media (max-width: 767px) {
            display: none;
        }
    }
`

function FileSort({setSort, sort, children}) {

    const {name, size, date} = FILE_SORTS

    const handleSort = (field) => {
        if (sort === field) {
            setSort({
                func: reverseSort(field.func)
            });
            return;
        }
        setSort(field);
    };


    return (
        <Container>
            <div class={'file-name'}>
                {children}
                <span class="name" onClick={() => handleSort(name)}>
                    {selectedFiles.length > 0 ? `已选中${selectedFiles.length}个文件` : '名称'}
                </span>
                <span onClick={() => handleSort(size)}>大小</span>
            </div>
            <span class={'date'} onClick={() => handleSort(date)}>修改时间</span>
        </Container>
    );
}

export default FileSort;