let villesEnregistrees

export function chargerVillesDepuisLocalStorage(datalist) {
    if(villesEnregistrees === undefined) {
        villesEnregistrees = JSON.parse(localStorage.getItem('villes')) || [];
    }

    datalist.innerHTML = '';

    villesEnregistrees.forEach((ville) => {
        const option = document.createElement('option');
        option.value = ville;
        datalist.appendChild(option);
    });
}

export function ajouterVilleLocalStorage(ville, datalistElm) {
    if (!villesEnregistrees.includes(ville)) {
        villesEnregistrees.push(ville);

        villesEnregistrees = villesEnregistrees.slice(-5);

        localStorage.setItem('villes', JSON.stringify(villesEnregistrees));
    }

    chargerVillesDepuisLocalStorage(datalistElm);
}
