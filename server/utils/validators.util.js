function DNIValidator(value) {

    const validChars = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const dniRegxp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
    const nieRegxp = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;

    if(!dniRegxp.test(value) && !nieRegxp.test(value)) return false;
    
    const letter = value.substr(-1);
    const ifNie = value
        .replace(/^[X]/, '0')
        .replace(/^[Y]/, '1')
        .replace(/^[Z]/, '2');

    const num = parseInt(ifNie.substr(0, 8)) % 23;

    if (validChars.charAt(num) === letter) return true;
    return false;

}

function dateBeforePresentValidator(stringDate) {
    const dateObject = new Date(stringDate);
    const datePresent = new Date(); 
    console.log(dateObject.getTime() - datePresent.getTime());
    const isDateAfterPresent = dateObject.getTime() >= datePresent.getTime() ?
                               true : false;

    return isDateAfterPresent;
}


module.exports = {
    DNIValidator,
    dateBeforePresentValidator
}