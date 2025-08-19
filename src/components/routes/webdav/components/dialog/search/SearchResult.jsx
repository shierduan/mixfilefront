import styled from "styled-components";
import {Link} from "react-router-dom";
import {formatFileSize, run} from "../../../../../../utils/CommonUtils.jsx";
import {MixFileChip, MixFileDataContainer} from "../../../../../common/base/DataContainers.jsx";
import {Button} from "@mui/material";
import {dialogList} from "../../../../../../utils/DialogContainer.jsx";
import VirtualList from "../../../../../common/base/VirtualList.jsx";

const Container = styled(MixFileDataContainer)`
    a {
        text-decoration: none;
        color: inherit;
    }
`

function SearchResult({files}) {


    const content = run(() => {

        if (files.length === 0) {
            return <p>没有搜索到任何文件</p>
        }

        return (<>
            <VirtualList
                rowCount={files.length}
                rowHeight={100}
                rowRenderer={(ctx) => {
                    const {
                        index, // Index of row
                        isScrolling, // The List is currently being scrolled
                        isVisible, // This row is visible within the List (eg it is not an overscanned row)
                        key, // Unique key within array of rendered rows
                        parent, // Reference to the parent List (instance)
                        style, // Style object to be applied to row (to position it);
                        // This must be passed through to the rendered row element.
                    } = ctx
                    const file = files[index];


                    const {name, size, time, shareInfoData, isFolder, path} = file

                    const description = run(() => {
                        if (isFolder) {
                            return <p>文件夹</p>
                        }
                        return <p>{formatFileSize(size)}</p>
                    })


                    return (
                        <Link to={path} target="_blank" style={style} key={key}>
                            <MixFileChip
                                key={path}
                            >
                                <div class="content shadow">
                                    <h4 className={'text-hide'}>{name}</h4>
                                    {description}
                                </div>
                            </MixFileChip>
                        </Link>
                    );
                }
                }
            />
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