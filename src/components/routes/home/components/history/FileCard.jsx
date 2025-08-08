import styled from "styled-components";
import {resolveMixFile} from "../FileResolve.jsx";
import {formatFileSize} from "../../../../../utils/CommonUtils.js";

const CardContainer = styled.div`
    transition: .3s;
    background-color: rgba(210, 172, 254, 0.25);
    display: flex;
    gap: 10px;
    padding: 10px;
    flex-wrap: wrap;
    word-break: break-all;
    border-radius: 5px;
    cursor: pointer;
    color: #8e2afe;
    border: 1px solid rgba(142, 42, 254, 0.53);;
    box-shadow: rgba(75, 82, 86, 0.66) 0px 2px 10px 0px;

    &:hover {
        background-color: rgba(210, 172, 254, 0.5);
    }
`

export function FileCard({item}) {
    const {name, size, time, shareInfoData} = item

    return (
        (<CardContainer className={'animate__animated animate__slideInDown animate__faster'} onClick={() => {
            resolveMixFile(shareInfoData)
        }}>
            <h4 className={'text-hide'}>{name}</h4>
            <p>{formatFileSize(size)}</p>
        </CardContainer>)
    )
}
