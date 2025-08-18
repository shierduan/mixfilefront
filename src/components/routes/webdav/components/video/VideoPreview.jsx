import {useEffect, useRef} from 'react';
import styled from "styled-components";
import ArtPlayer from 'artplayer';
import useApi from "../../../../../hooks/useApi.jsx";
import {getParentPath, notifyMsg, sha256} from "../../../../../utils/CommonUtils.jsx";
import useProxyState from "../../../../../hooks/useProxyState.js";
import {parsePropfindXML} from "../../utils/WebDavUtils.jsx";
import {FILE_SORTS, webDavState} from "../../state/WebDavState.js";
import {NEXT_ICON, PREV_ICON} from "./Icons.js";
import {useLocation, useNavigate} from "react-router-dom";
import {useSnapshot} from "valtio";
import useLocalState from "../../../../../hooks/useLocalState.js";
import {NativeSelect} from "@mui/material";
import useDeepCompareEffect from "../../../../../hooks/useDeepCompareEffect.js";

const Container = styled.div`
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;

    .video-title {
        top: -50px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        padding: 15px;
        width: 100%;
        position: absolute;
        transition: .3s;
    }

    .art-control-show {
        .video-title {
            background-color: rgba(0, 0, 0, 0.27);
            top: 0px;
        }
    }

    > .video {
        width: min(85vw, 1000px);
        height: min(48vw, 562px);
        border-radius: 10px;
        overflow: hidden;
    }

    > .select {
        padding: 10px;
        width: 100%;
        max-width: 1000px;

        .MuiNativeSelect-root {
            width: 100%;
        }
    }
`

function VideoPreview({file}) {
    const {url, name, etag} = file;
    useSnapshot(webDavState)

    const player = useRef(null);

    const path = useLocation()

    const state = useProxyState({
        videoFile: file,
        videoList: [],
        currentFileIndex: 0,
    })

    useDeepCompareEffect(() => {
        state.videoFile = file;
    }, [etag])

    const videoCache = useLocalState('video-cache', {
        history: []
    })

    useEffect(() => {
        const art = player.current
        if (art) {
            art.once('video:canplay', () => {
                const history = videoCache.history;
                const prevHistory = history.find((it) => it.key === sha256(etag))
                if (prevHistory) {
                    notifyMsg('已恢复上次播放位置', {
                        icon: null,
                        position: 'bottom-center'
                    })
                    art.seek = Math.max(prevHistory.time - 2, 0)
                }
            })
        }
    }, [player.current, etag])

    useEffect(() => {
        const art = player.current;
        if (art) {
            art.switch = file.url
            art.layers.update({
                name: 'title',
                html: `<div class="video-title">(${state.currentFileIndex + 1}) ${file.name}</div>`,
            })
        }
    }, [state.currentFileIndex, player.current])

    useDeepCompareEffect(() => {
        state.currentFileIndex = state.videoList.findIndex((it) => it.href === file.href)
    }, [state.videoList, etag])


    const artRef = useRef();

    useApi({
        method: 'PROPFIND',
        path: `api/${getParentPath()}`,
        headers: {
            depth: 1
        },
        callback(data) {
            const files = parsePropfindXML(data)
            if (files.length === 0) {
                return;
            }

            //去掉目录文件
            files.shift()

            //去掉存档文件
            files.pop()
            //去掉文件夹
            const videos = files.filter((it) => !it.isFolder)
            videos.sort(FILE_SORTS.name.func)
            state.videoList = videos
            const art = player.current
            if (videos.length > 1 && art) {
                const controls = art.controls;

                function nextVideo() {
                    const nextIndex = (state.currentFileIndex + 1) % state.videoList.length;
                    const item = state.videoList[nextIndex]
                    navigate(`${getParentPath()}/${encodeURIComponent(item.name)}`)
                }

                art.on("video:ended", nextVideo)

                controls.update({
                    name: "previous-button",
                    index: 10,
                    position: "left",
                    html: PREV_ICON,
                    tooltip: "上一集",
                    click: function () {
                        const prevIndex = (state.currentFileIndex - 1 + state.videoList.length) % state.videoList.length;
                        const item = state.videoList[prevIndex]
                        navigate(`${getParentPath()}/${encodeURIComponent(item.name)}`)
                    },
                })
                controls.update({
                    name: "next-button",
                    index: 11,
                    position: "left",
                    html: NEXT_ICON,
                    tooltip: "下一集",
                    click: nextVideo,
                })

            }
        }
    })

    const navigate = useNavigate()


    useEffect(() => {
        const art = new ArtPlayer({
            url,
            container: artRef.current,
            setting: true,
            fullscreen: true,
            fullscreenWeb: window.innerWidth > 768,
            pip: window.innerWidth > 768,
            theme: '#ae6afa',
            aspectRatio: true,
            playbackRate: true,
            flip: true,
            volume: 0.7,
            autoplay: true,
            controls: [],
        });
        art.on('video:timeupdate', (event) => {
            const history = videoCache.history;
            const time = art.video.currentTime
            if (time < 2) {
                return
            }
            if (history.length > 500) {
                history.shift()
            }
            const historyKey = sha256(state.videoFile.etag)
            const prevHistoryIndex = history.findIndex((it) => it.key === historyKey)
            if (prevHistoryIndex > -1) {
                history.splice(prevHistoryIndex, 1)
            }
            history.push({
                key: historyKey,
                time,
            })
        })
        player.current = art
        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        };
    }, []);

    return (
        <Container>
            <div class="video shadow" ref={artRef}/>
            <div class="select">
                <NativeSelect
                    id="video-native-select"
                    value={file.name}
                    onChange={(e) => {
                        navigate(`${getParentPath()}/${encodeURIComponent(e.target.value)}`)
                    }}
                >
                    {state.videoList.map((it) => (
                        <option key={it.href} value={it.name}>
                            {it.name}
                        </option>
                    ))}
                </NativeSelect>
            </div>
        </Container>
    );
}

export default VideoPreview;