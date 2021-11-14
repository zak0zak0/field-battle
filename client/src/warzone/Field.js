import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import useWebsockets from '../websockets/useWebsockets';
import { useBuyMenu } from './context';
import { intersect } from '../../../common/utils';

export default function Field({ className, player }) {
    const divRef = useRef();
    const canvasRef = useRef();
    const uiRef = useRef();
    const uiCtxRef = useRef();
    const unitCtxRef = useRef();
    const [units, setUnits] = useState([]);
    const [selected, setSelected] = useState(null);
    const { activeUnit } = useBuyMenu();
    const { eventSource } = useWebsockets();

    const drawUnit = (unit) => {
        const drawing = new Image();
        drawing.src = `images/${unit.image}`;
        drawing.onload = function () {
            unitCtxRef.current.drawImage(drawing, unit.x - unit.size / 2, unit.y - unit.size / 2, unit.size, unit.size);
        };
    }

    useEffect(() => {
        if (!player) {
            return;
        }

        const getUnits = async () => {
            const serverUnits = (await (await fetch('/units')).json()).units ?? [];
            setUnits(serverUnits);
        }
        getUnits();
    }, []);

    useEffect(() => {
        if (!player) {
            return;
        }

        unitCtxRef.current = canvasRef.current.getContext('2d');
        uiCtxRef.current = uiRef.current.getContext('2d');

        unitCtxRef.current.clearRect(0, 0, 470, 470);
        for (let unit of units) {
            drawUnit(unit);
        }
        const onPlaceUnit = (unit) => {
            setUnits([...units, unit])
        }
        eventSource.on('place-unit', onPlaceUnit);
        return () => {
            eventSource.off('place-unit', onPlaceUnit);
        }
    }, [units])

    function drawSelection(unit) {
        unitCtxRef.current = canvasRef.current.getContext('2d');
        uiCtxRef.current = uiRef.current.getContext('2d');
        const ui = uiCtxRef.current;
        ui.clearRect(0, 0, 470, 470);
        if (!unit) {
            return;
        }
        ui.beginPath();
        ui.lineWidth = 3;
        ui.strokeStyle = 'red';
        ui.arc(unit.x, unit.y, unit.size / 2 + 7, 0, 2 * Math.PI);
        ui.stroke();
    }

    useEffect(() => {
        drawSelection(selected);
    }, [selected]);

    useEffect(() => {
        if (activeUnit) {
            setSelected(null);
        }

        const contextMenuHandler = (e) => {
            if (!activeUnit && selected) {
                e.preventDefault();
                setSelected(null);
            }
        }
        document.addEventListener('contextmenu', contextMenuHandler);
        return () => {
            document.removeEventListener('contextmenu', contextMenuHandler);
        }
    }, [activeUnit, selected]);

    function selectUnit(x, y) {
        const unit = units.find(unit => intersect(unit, { x, y, size: 1 }));
        if (!unit) {
            return;
        }
        setSelected(unit);
    }

    const onClick = async e => {
        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (!player) {
            return;
        }
        if (!activeUnit) {
            selectUnit(x, y);
            return;
        }
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