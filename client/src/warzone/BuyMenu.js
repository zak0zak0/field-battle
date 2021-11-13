import React, { Component } from 'react';
import UnitIcon from './UnitIcon';
import { Unit } from '../../../common/unit';

export class BuyMenu extends Component {
    state = {
        units: []
    }

    async componentDidMount() {
        const weapons_info = await (await fetch('/data/weapons_info.json')).json();
        const units = weapons_info.weapons;
        const sizes = weapons_info.sizes;
        units.forEach(unit => {
            unit.size = sizes[unit.size.toString()];
            unit.radius = sizes[unit.radius.toString()];
        });
        this.setState({
            units
        })
    }

    render() {
        const { units } = this.state;
        return (
            <div className='block'>
                {units.map(unit => (<UnitIcon key={unit.name} unit={unit} />))}
            </div>
        )
    }
}