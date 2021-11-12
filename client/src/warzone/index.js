import React from 'react'
import { BuyMenu } from './BuyMenu';
import BattleZone from './BattleZone';

const Warzone = () => (
    <div className='block'>
        <BuyMenu />
        <BattleZone />
        <button>Ready</button>
    </div>
);

export default Warzone;