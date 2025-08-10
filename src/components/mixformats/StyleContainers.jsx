import styled from "styled-components";

export const MixFileDataContainer = styled.div`
    display: flex;
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    justify-content: center;
    width: 500px;
    max-width: 95vw;
    flex-wrap: wrap;
    gap: 10px;
    flex-direction: column;
    color: #8e2afe;
    word-break: break-all;
    overflow: hidden;

    > .content {
        gap: 10px;
        height: 50vh;
        width: 100%;

        > div {
            overflow: auto;
        }
    }

    button {
        max-width: 100%;
        font-size: max(.6rem, 14px);
    }
`

export const MixFileChip = styled.div`
    cursor: pointer;
    padding: 5px;
    width: 100%;
    height: 100%;
    max-width: 90vw;

    > .content {
        display: flex;
        flex-direction: column;
        gap: 10px;
        background-color: rgba(229, 207, 254, 0.25);
        transition: .3s;
        padding: 10px;
        width: 100%;
        height: 100%;
        border: 2px solid rgba(142, 42, 254, 0.6);
        border-radius: 10px;

        p {
            font-weight: bold;
        }

        &:hover {
            background-color: rgba(210, 172, 254, 0.5);
        }
    }
`