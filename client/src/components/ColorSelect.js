import React from 'react';
import './color-select.css';


const defaultColors = [
    '#FF0000',
    '#FF9900',
    '#A83731',
    '#00CCFF',
    '#FFFF00',
    '#009900',
    '#0000EE',
    '#00FF00',
];

function ColorCell({ selected, color, onClick }) {
    return (
        <td style={{ backgroundColor: color }}
            onClick={onClick}
            className={`colors-table-cell ${selected ? "selected" : ""}`}></td>
    );
}

export default class ColorTable extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    state = {
        active: null
    }

    onClick(index, color) {
        if (this.props.onSelect) {
            this.props?.onSelect(color);
        } else {
            this.setState({
                active: index
            });
        }
    }

    componentDidMount() {
        if (this.props.selected) {
            const index = defaultColors.indexOf(this.props.selected);
            if (index > -1) {
                this.setState({
                    active: index
                })
            }
        }
    }

    getSelectedIndex() {
        if (this.props.selected) {
            return defaultColors.indexOf(this.props.selected);
        }
        else {
            return this.state.active;
        }

    }

    buildColorTable() {
        const tds = defaultColors.map((color, index) => (
            <ColorCell key={index} color={color} onClick={() => this.onClick(index, color)} selected={this.getSelectedIndex() === index} />
        ))

        const rows = 2;
        const columns = 4;

        const trs = []

        for (let i = 0; i < rows; i++) {
            trs.push(
                <tr key={i}>
                    {tds.slice(i * columns, (i + 1) * columns)}
                </tr>
            );
        }
        return trs;
    }

    render() {
        return (
            <table className='colors-table'>
                <tbody>
                    {this.buildColorTable()}
                </tbody>
            </table>
        )
    }
}