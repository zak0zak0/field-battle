export class UsersManager {
    socketMap = new Map();
    userMap = new Map();

    users() {
        return this.userMap.values();
    }

    sockets() {
        const arrays = Array.from(this.socketMap, ([_, value]) => value);
        return [].concat.apply([], arrays);
    }

    user(id, user) {
        this.userMap.set(id, user);
    }

    set(id, ws) {
        if (!this.socketMap.has(id)) {
            this.socketMap.set(id, []);
        }
        const items = this.socketMap.get(id);
        if (items.includes(ws)) {
            return;
        }
        items.push(ws);
    }

    get(id) {
        return {
            sockets: this.socketMap.get(id),
            user: this.userMap.get(id)
        }
    }

    delete(id, ws) {
        const items = this.socketMap.get(id);
        const index = items.indexOf(ws);
        if (index > -1) {
            items.splice(index, 1);
        }
        if (!items.length) {
            this.socketMap.delete(id);
            this.userMap.delete(id);
        }
    }
}

export const manager = new UsersManager();