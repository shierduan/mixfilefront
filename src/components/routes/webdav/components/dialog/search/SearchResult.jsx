import styled from "styled-components";
import DialogDiv from "../../../../../common/base/DialogDiv.jsx";
import {Link, useNavigate} from "react-router-dom";
import {formatFileSize, run} from "../../../../../../utils/CommonUtils.jsx";
import {MixFileChip} from "../../../../../mixformats/StyleContainers.jsx";
import {Button} from "@mui/material";
import {dialogList} from "../../../../../../utils/DialogContainer.jsx";

const Container = styled(DialogDiv)`
    a {
        text-decoration: none;
        color: inherit;
    }
`

function SearchResult({files}) {

    const navigate = useNavigate()

    const content = run(() => {
        if (files.length === 0) {
            return <p>没有搜索到任何文件</p>
        }
        return (<>
            {
                files.map(({name, size, path, isFolder}) => {

                    const description = run(() => {
                        if (isFolder) {
                            return <p>文件夹</p>
                        }
                        return <p>{formatFileSize(size)}</p>
                    })

                    return <Link to={path} target="_blank">
                        <MixFileChip
                            key={path}
                        >
                            <div class="content shadow">
                                <h4 className={'text-hide'}>{name}</h4>
                                {description}
                            </div>
                        </MixFileChip>
                    </Link>
                })
            }
        </>)
    })

    return (
        <Container>
            <h3>搜索结果</h3>
            <div class="content">
                {content}
            </div>
            <Button
                variant="outlined"
                onClick={() => {
                    dialogList.pop()
                }}>
                关闭
            </Button>
        </Container>
    );
}

export default SearchResult;