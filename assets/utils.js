function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function cleanCityName(fullCityName) {
    const tmp = fullCityName.split(',')
    const tmp2 = [tmp.shift(), tmp.pop()].filter(x => x).map(capitalize)
    return tmp2.join(',')

}

export function temporisateur(duree, fonction) {
    let timer = null

    return function(...args) {
        if (timer !== null) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            fonction(...args);
            timer = null;
        }, duree);
    }
}
