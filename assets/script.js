
const villeAdresse = document.getElementById('ville__adresse');
const villeButton = document.getElementById('ville__button');
const previsionsMeteo = document.getElementById('previsionsMeteo');
const villeComplete = document.getElementById('ville__complete');

const villeAdresse2 = document.getElementById('ville2__adresse');
const villeButton2 = document.getElementById('ville2__button');
const previsionsMeteo2 = document.getElementById('previsionsMeteo2');

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function cleanCityName(fullCityName) {
    const tmp = fullCityName.split(',')
    const tmp2 = [tmp.shift(), tmp.pop()].filter(x => x).map(capitalize)
    return tmp2.join(',')

}


async function obtenirDonneesMeteo(ville) {
    const cleApi = 'bf1a733eb58df0e14bb400e330ad9d9a';
    const urlApi = `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${cleApi}&units=metric`;

    const reponse = await fetch(urlApi);

    if (!reponse.ok) {
        throw new Error(`Impossible de récupérer les données météorologiques pour ${ville}`);
    }

    return await reponse.json();
}


function afficherPrevisionsMeteo(donnees, ville, container, image) {
    const previsionsContainer = container || document.getElementById('previsionsMeteo');

    if (!donnees || !donnees.list || donnees.list.length === 0) {
        if (previsionsContainer) {
            previsionsContainer.innerHTML = 'Aucune information météorologique disponible.';
        }
        return;
    }

    previsionsContainer.style.backgroundImage = `url('${image}')`;
    previsionsContainer.innerHTML = ''

    const datesAffichees = new Set();

    for(const previsionsJour of donnees.list) {
        const datePrevision = new Date(previsionsJour.dt * 1000).toLocaleDateString('fr-FR');
        const temperatureCelsius = previsionsJour.main.temp;
        const conditionsIcon = previsionsJour.weather[0].icon;
        const iconurl = "http://openweathermap.org/img/w/" + conditionsIcon + ".png";

        if (!datesAffichees.has(datePrevision)) {
            const jourElement = document.createElement('div');
            jourElement.classList.add('jour');

            jourElement.innerHTML =
                `
                <h2> ${cleanCityName(ville)} </h2>
                <h3>${datePrevision}</h3>
                <p>${previsionsJour.weather[0].description}</p>
                <img src="" class="openweather-icon">
                <p class=temperature>${temperatureCelsius.toFixed(0)} °C</p>
                <p>Humidité : ${previsionsJour.main.humidity}%</p>
                <p>Vent : ${previsionsJour.wind.speed} m/s</p>
                `;

            jourElement.querySelector('.openweather-icon').src = iconurl

            datesAffichees.add(datePrevision);

            previsionsContainer.appendChild(jourElement);

            if(datesAffichees.size >= 5) {
                break
            }
        }
    }
}



document.addEventListener('DOMContentLoaded', () => {
    chargerVillesDepuisLocalStorage(document.getElementById('ville__complete'));
    chargerVillesDepuisLocalStorage(document.getElementById('ville2__complete'));
    document.getElementById('previsionsMeteo').parentElement.classList.add('ville-container');
    document.getElementById('previsionsMeteo2').parentElement.classList.add('ville2-container');
});

async function entreeVille(cityName) {
    const params = new URLSearchParams({
        q: cityName,
        format: "json",
        limit: 5,
        featureType: "city"
    });

    const url = `https://nominatim.openstreetmap.org/search?${params}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const datalist = document.getElementById('ville__complete');
        datalist.innerHTML = '';

        data.forEach((result) => {
            const option = document.createElement('option');
            option.value = result.display_name;
            datalist.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors de la recherche d\'autocomplétion :', error);
    }
}

let gererChargeKeyup = null;

document.getElementById('ville__adresse').addEventListener('keyup', (e) => {
    const input = e.target;

    if (input.value.length < 3) {
        return;
    }

    if (gererChargeKeyup !== null) {
        clearTimeout(gererChargeKeyup);
    }

    gererChargeKeyup = setTimeout(() => {
        entreeVille(input.value);
        gererChargeKeyup = null;
    }, 400);
});


function ajouterVilleLocalStorage(ville, container) {
    if (typeof (Storage) !== "undefined") {
        const villesEnregistrees = JSON.parse(localStorage.getItem('villes')) || [];

        if (!villesEnregistrees.includes(ville)) {
            villesEnregistrees.push(ville);

            const villesLimitees = villesEnregistrees.slice(-5);

            localStorage.setItem('villes', JSON.stringify(villesLimitees));

            chargerVillesDepuisLocalStorage(container);
        }
    } else {
        console.error("LocalStorage n'est pas pris en charge dans ce navigateur.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    chargerVillesDepuisLocalStorage();
});

function chargerVillesDepuisLocalStorage(container) {
    const villesEnregistrees = JSON.parse(localStorage.getItem('villes')) || [];

    const datalist = container || document.getElementById('ville__complete');
    datalist.innerHTML = '';

    const villesAffichees = villesEnregistrees.slice(-5);

    villesAffichees.forEach((ville) => {
        const option = document.createElement('option');
        option.value = ville;
        datalist.appendChild(option);
    });
}

villeButton.addEventListener('click', (event) => {
    event.preventDefault();
    traiterSoumissionVille(villeAdresse, previsionsMeteo);
});

villeButton2.addEventListener('click', (event) => {
    event.preventDefault();
    traiterSoumissionVille(villeAdresse2, previsionsMeteo2);
});

async function traiterSoumissionVille(villeAdresse, previsionsMeteo) {
    const ville = villeAdresse.value.trim();
    if (!ville) {
        alert("Veuillez entrer une ville valide.");
        return;
    }

    try {
        const donneesMeteo = await obtenirDonneesMeteo(ville);
        const imageVille = await obtenirImageVille(ville);

        afficherPrevisionsMeteo(donneesMeteo, ville, previsionsMeteo, imageVille);
        ajouterVilleLocalStorage(ville, document.getElementById('ville__complete'));

        previsionsMeteo.parentElement.classList.add('ville-container');
    } catch (erreur) {
        alert(`Erreur lors de la récupération des informations météorologiques : ${erreur}`);
    }

    villeAdresse.value = '';
}

document.getElementById('ville2__adresse').addEventListener('keyup', (e) => {
    const input = e.target;

    if (input.value.length < 3) {
        return;
    }

    if (gererChargeKeyup !== null) {
        clearTimeout(gererChargeKeyup);
    }

    gererChargeKeyup = setTimeout(() => {
        entreeVille(input.value);
        gererChargeKeyup = null;
    }, 400);
});


async function obtenirImageVille(ville) {
    const cleApiImage = 'H4wROuyTTghwfppzg5xg3EI9Ec5NslLEb51MPkY-71c';
    const url = ` https://api.unsplash.com/search/photos?client_id=${cleApiImage}&page=1&query=${ville};`
   
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.results && data.results.length > 0) {
            const image = data.results[0].urls.small;
            return image;
        } else {
            console.error('Aucune image trouvée pour la ville :', ville);
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'image :', error);
        return null;
    }
}
