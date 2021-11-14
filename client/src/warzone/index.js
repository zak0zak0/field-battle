import React from 'react'
import { BuyMenu } from './BuyMenu';
import BattleZone from './BattleZone';
import './warzone.css';
import { BuyMenuProvider } from './context';

const Warzone = () => (
    <BuyMenuProvider>
        <div className='block'>
            <BuyMenu />
            <BattleZone />
            <button>Ready</button>
        </div>
    </BuyMenuProvider>
);

export default Warzone;