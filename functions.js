export function media(array) {
    if (array.length === 0) return 0; 
    let sum = array.reduce((acc, value) => acc + value, 0); 
    return sum / array.length;
}
