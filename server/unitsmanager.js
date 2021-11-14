function checkBorders(unitSize, size, x, y) {
    return x + unitSize / 2 > unitSize
        && y + unitSize / 2 > unitSize
        && x - unitSize / 2 < size - unitSize
        && y - unitSize / 2 < size - unitSize;
}

function intersect(a, b) {
    // (x0 - x1)^2 + (y0 - y1)^2 <= (R0 + R1)^2    
    const r1 = a.size / 2;
    const r2 = b.size / 2;
    const summ2 = (r1 + r2) * (r1 + r2);
    const length = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
    return length <= summ2;
}

class UnitsManager {
    units = [];
    size = 470;

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

const units = {
    team1: new UnitsManager(),
    team2: new UnitsManager()
}

function sendPlaceUnitMessage(ws, unit) {
    ws.send(JSON.stringify({
        type: 'PLACE_UNIT',
        unit
    }));
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