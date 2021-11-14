import React from 'react';
import { useBuyMenu } from './context';

export default function UnitIcon({ unit }) {
    const { setActiveUnit } = useBuyMenu();

    return (
        <div className="unit-icon" onClick={() => setActiveUnit(unit)}>
            <div className='unit-icon-img'>
                <img src={`images/${unit.image}`} alt={unit.name} title={unit.name} height={48} width={48} />
            </div>
            <span className='unit-icon-armor'>{unit.armor}</span>
            <span className='unit-icon-price'>{`$${unit.price}`}</span>
        </div>
    )
}