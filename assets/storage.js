export function ajouterVilleLocalStorage(ville, datalistElm) {
    const villesEnregistrees = JSON.parse(localStorage.getItem('villes')) || [];

    if (!villesEnregistrees.includes(ville)) {
        villesEnregistrees.push(ville);

        const villesLimitees = villesEnregistrees.slice(-5);

        localStorage.setItem('villes', JSON.stringify(villesLimitees));
    }

    chargerVillesDepuisLocalStorage(datalistElm);
}

export function chargerVillesDepuisLocalStorage(datalist) {
    const villesEnregistrees = JSON.parse(localStorage.getItem('villes')) || [];

    datalist.innerHTML = '';

    villesEnregistrees.forEach((ville) => {
        const option = document.createElement('option');
        option.value = ville;
        datalist.appendChild(option);
    });
}


