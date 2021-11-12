export class User {
    id;
    name;
    team;
    color;
    ready;

    constructor(id) {
        this.id = id;
    }

    toString() {
        return `"${this.name}" id=${this.id}`;
    }
}