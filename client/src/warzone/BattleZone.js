import React from 'react';
import Field from './Field';

export default function BattleZone() {
    return (
        <div className='block warzone'>
            <Field player />
            <Field className={'field-fog'} />
        </div>
    )
}