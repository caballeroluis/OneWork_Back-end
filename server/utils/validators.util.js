function DNIValidator(value) {

    let validChars = 'TRWAGMYFPDXBNJZSQVHLCKE';
    let dniRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
    let nieRexp = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;

    if(!dniRexp.test(value) || !nieRexp.test(value)) return false;

    let letter = value.substr(-1);
    let ifNie = str
        .replace(/^[X]/, '0')
        .replace(/^[Y]/, '1')
        .replace(/^[Z]/, '2');

    let num = parseInt(ifNie.substr(0, 8)) % 23;

    if (validChars.charAt(num) === letter) return true;
    return false;

}

module.exports = {
    DNIValidator
}