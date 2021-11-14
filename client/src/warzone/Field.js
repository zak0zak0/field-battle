import React, { useEffect, useRef } from 'react';
import useWebsockets from '../websockets/useWebsockets';
import { useBuyMenu } from './context';

export default function Field({ className }) {
    const canvasRef = useRef();
    const ctx = useRef();
    const { activeUnit } = useBuyMenu();
    const { eventSource, sendMessage } = useWebsockets();

    useEffect(() => {
        ctx.current = canvasRef.current.getContext('2d');
    }, []);

    eventSource.on('place-unit', unit => {
        const drawing = new Image();
        drawing.src = unit.image;
        drawing.onload = function () {
            ctx.current.drawImage(drawing, x - unit.size / 2, y - unit.size / 2, unit.size, unit.size);
        };
    });

    const onClick = e => {
        if (!activeUnit) {
            return;
        }
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        sendMessage({
            type: 'PLACE_UNIT',
            unit: activeUnit,
            x,
            y
        });
    }

    return (
        <div className={`field-block ${className ?? ""}`}>
            <canvas ref={canvasRef} width="470" height="470" onClick={onClick} />
        </div>
    )
}