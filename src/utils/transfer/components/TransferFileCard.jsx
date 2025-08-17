import styled from "styled-components";

export const TransferFileCard = styled.div`
    display: flex;
    padding: 10px;
    justify-content: center;
    width: 100%;
    gap: 10px;
    flex-direction: column;
    color: #8e2afe;
    word-break: break-all;
    border: 2px solid rgba(142, 42, 254, 0.6);
    border-radius: 10px;
    transition: .3s;
    background-color: rgba(229, 207, 254, 0.25);

    &.error {
        color: #f64141;
        border: 2px solid #f64141;
    }

    &.done {
        cursor: pointer;

        &:hover {
            background-color: rgba(142, 42, 254, 0.23);
        }
    }

    p {
        overflow: hidden;
        white-space: nowrap;
        font-weight: bold;
        text-overflow: ellipsis;
    }
`