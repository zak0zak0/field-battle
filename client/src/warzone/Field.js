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

    const drawUnit = (unit) => {
        const drawing = new Image();
        drawing.src = `images/${unit.image}`;
        drawing.onload = function () {
            ctx.current.drawImage(drawing, unit.x - unit.size / 2, unit.y - unit.size / 2, unit.size, unit.size);
        };
    }

    useEffect(async () => {
        if (!player) {
            return;
        }
        ctx.current = canvasRef.current.getContext('2d');
        ui.current = uiRef.current.getContext('2d');
        eventSource.on('place-unit', drawUnit);

        const units = (await (await fetch('/units')).json()).units ?? [];
        for (let unit of units) {
            drawUnit(unit);
        }

    }, []);

    const onClick = async e => {
        if (!player) {
            return;
        }
        if (!activeUnit) {
            return;
        }
        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        await fetch('/units/place', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                unit: activeUnit,
                x,
                y
            })
        });
    }

    return (
        <div ref={divRef} className={`field-block ${className ?? ""}`} onClick={onClick}>
            <canvas ref={uiRef} width="470" height="470" style={{ zIndex: 2 }} />
            <canvas ref={canvasRef} width="470" height="470" style={{ zIndex: 1, marginTop: '-470px', position: 'relative', top: '-15px' }} />
        </div>
    )
}