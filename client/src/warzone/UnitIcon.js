import React from 'react';

export default function UnitIcon({ unit }) {
    return (
        <div className="unit-icon" onClick={() => console.log(unit.name)}>
            <div className='unit-icon-img'>
                <img src={`images/${unit.image}`} alt={unit.name} title={unit.name} height={48} width={48} />
            </div>
            <span className='unit-icon-armor'>{unit.armor}</span>
            <span className='unit-icon-price'>{`$${unit.price}`}</span>
        </div>
    )
}