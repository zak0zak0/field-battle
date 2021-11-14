import { intersect } from '../common/utils.js';


function checkBorders(unitSize, size, x, y) {
    return x + unitSize / 2 > unitSize
        && y + unitSize / 2 > unitSize
        && x - unitSize / 2 < size - unitSize
        && y - unitSize / 2 < size - unitSize;
}

function sendPlaceUnitMessage(ws, unit) {
    ws.send(JSON.stringify({
        type: 'PLACE_UNIT',
        unit
    }));
}

class UnitsManager {
    size = 470;

    constructor() {
        this.units = [];
    }

    getUnits() {
        return this.units;
    }

    tryPlace(newUnit, x, y) {
        if (!checkBorders(newUnit.size, this.size, x, y)) {
            console.log('tryPlace | out of bounds');
            return false;
        }
        const dummy = {
            ...newUnit,
            x,
            y
        };
        const collision = this.units.find(unit => {
            return intersect(unit, dummy);
        });
        if (collision) {
            console.log(`intersects with ${collision.name} at ${collision.x.toFixed(0)}:${collision.y.toFixed(0)}`);
            return false;
        }
        this.units.push(dummy);
        newUnit.x = dummy.x;
        newUnit.y = dummy.y;
        console.log(`added ${newUnit.name} at ${x.toFixed(0)} ${y.toFixed(0)}`);
        return true;
    }
}

class TeamUnitsManager {
    team1 = new UnitsManager();
    team2 = new UnitsManager();
}

export function getUnitsByTeam(team) {
    return units[team].units;
}

export const units = {
    team1: new UnitsManager(),
    team2: new UnitsManager()
}

export function placeUnit(manager, user, unit, x, y) {
    const team = user.team;
    if (units[team].tryPlace(unit, x, y)) {
        const teammates = Array.from(manager.users()).filter(x => x.team === team);
        const sockets = teammates.map(({ id }) => manager.sockets(id));
        for (let ws of sockets) {
            ws.forEach(s => {
                sendPlaceUnitMessage(s, unit);
            });

        }
    }
}
