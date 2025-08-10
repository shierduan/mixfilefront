import {useCallback, useRef, useState} from "react";
import {Menu, MenuItem} from "@mui/material";
import styled from "styled-components";

const Container = styled.div`
`

export default function RightClickMenu({items = [], children, longPressTime = 500}) {
    const [menuPosition, setMenuPosition] = useState(null);
    const timerRef = useRef(null);

    /** 打开菜单 */
    const openMenu = useCallback((x, y) => {
        setMenuPosition({mouseX: x + 2, mouseY: y - 6});
    }, []);

    /** 右键触发（PC） */
    const handleContextMenu = useCallback((event) => {
        event.preventDefault();
        openMenu(event.clientX, event.clientY);
    }, [openMenu]);

    /** 长按触发（手机） */
    const handleTouchStart = useCallback((event) => {
        if (event.touches.length !== 1) return;
        const touch = event.touches[0];
        timerRef.current = setTimeout(() => {
            openMenu(touch.clientX, touch.clientY);
        }, longPressTime);
    }, [longPressTime, openMenu]);

    /** 取消长按（移动手指或松开） */
    const cancelTouch = useCallback(() => {
        clearTimeout(timerRef.current);
    }, []);

    /** 关闭菜单 */
    const handleClose = useCallback(() => {
        setMenuPosition(null);
    }, []);

    return (
        <div
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchEnd={cancelTouch}
            onTouchMove={cancelTouch}
        >
            {children}

            <Menu
                open={menuPosition !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    menuPosition
                        ? {top: menuPosition.mouseY, left: menuPosition.mouseX}
                        : undefined
                }

            >
                {items.map((item, index) => (
                    <MenuItem
                        sx={{
                            fontSize: '15px',
                            width: '100px'
                        }}
                        key={index}
                        onClick={() => {
                            handleClose();
                            item.onClick?.();
                        }}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
