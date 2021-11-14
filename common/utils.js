export function intersect(a, b) {
    // (x0 - x1)^2 + (y0 - y1)^2 <= (R0 + R1)^2    
    const r1 = a.size / 2;
    const r2 = b.size / 2;
    const summ2 = (r1 + r2) * (r1 + r2);
    const length = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
    return length <= summ2;
}
