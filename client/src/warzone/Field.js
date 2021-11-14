import React, { useEffect, useRef } from 'react';
import useWebsockets from '../websockets/useWebsockets';
import { useBuyMenu } from './context';

export default function Field({ className, player }) {
    const divRef = useRef();
    const canvasRef = useRef();
    const uiRef = useRef();
    const ui = useRef();
    const ctx = useRef();
    const { activeUnit } = useBuyMenu();
    const { eventSource, sendMessage } = useWebsockets();

    useEffect(() => {
        if (!player) {
            return;
        }
        ctx.current = canvasRef.current.getContext('2d');
        ui.current = uiRef.current.getContext('2d');
        eventSource.on('place-unit', unit => {
            const drawing = new Image();
            drawing.src = `images/${unit.image}`;
            drawing.onload = function () {
                ctx.current.drawImage(drawing, unit.x - unit.size / 2, unit.y - unit.size / 2, unit.size, unit.size);
            };
        });
    }, []);

    const onClick = e => {
        if (!player) {
            return;
        }
        if (!activeUnit) {
            return;
        }
        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        sendMessage({
            type: 'TRY_PLACE_UNIT',
            unit: activeUnit,
            x,
            y
        });
    }

    return (
        <div ref={divRef} className={`field-block ${className ?? ""}`} onClick={onClick}>
            <canvas ref={uiRef} width="470" height="470" style={{ zIndex: 2 }} />
            <canvas ref={canvasRef} width="470" height="470" style={{ zIndex: 1, marginTop: '-470px', position: 'relative', top: '-15px' }} />
        </div>
    )
}