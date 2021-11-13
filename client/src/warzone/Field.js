import React, { useRef } from 'react';

export default function Field({ className }) {
    const canvasRef = useRef();

    return (
        <div className={`field-block ${className ?? ""}`}>
            <canvas ref={canvasRef} width="470" height="470" />
        </div>
    )
}