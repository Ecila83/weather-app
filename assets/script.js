
const villeAdresse = document.getElementById('ville__adresse');
const villeButton = document.getElementById('ville__button');
const previsionsMeteo = document.getElementById('previsionsMeteo');
const villeComplete = document.getElementById('ville__complete');

const villeAdresse2 = document.getElementById('ville2__adresse');
const villeButton2 = document.getElementById('ville2__button');
const previsionsMeteo2 = document.getElementById('previsionsMeteo2');


async function obtenirDonneesMeteo(ville) {
    const cleApi = 'bf1a733eb58df0e14bb400e330ad9d9a';
    const urlApi = `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${cleApi}&units=metric`;

    const reponse = await fetch(urlApi);

    if (!reponse.ok) {
        throw new Error(`Impossible de récupérer les données météorologiques pour ${ville}`);
    }

    return await reponse.json();
}

function afficherPrevisionsMeteo(donnees, ville, container) {
    const previsionsContainer = container || document.getElementById('previsionsMeteo');

    if (!donnees || !donnees.list || donnees.list.length === 0) {
        if (previsionsContainer) {
            previsionsContainer.innerHTML = 'Aucune information météorologique disponible.';
        }
        return;
    }

    previsionsContainer.innerHTML = '';

    const datesAffichees = new Set();

    for (const previsionsJour of donnees.list) {
        const datePrevision = new Date(previsionsJour.dt * 1000).toLocaleDateString('fr-FR');
        const temperatureCelsius = previsionsJour.main.temp;

        if (!datesAffichees.has(datePrevision)) {
            const jourElement = document.createElement('div');
            jourElement.classList.add('jour');

            jourElement.innerHTML =
                `
                <h2> ${ville} </h2>
                <h3>le ${datePrevision}</h3>
                <p>Conditions météorologiques : ${previsionsJour.weather[0].description}</p>
                <p>Température : ${temperatureCelsius.toFixed(0)} °C</p>
                <p>Humidité : ${previsionsJour.main.humidity}%</p>
                <p>Vitesse du vent : ${previsionsJour.wind.speed} m/s</p>
                `;

            previsionsContainer.appendChild(jourElement);
            datesAffichees.add(datePrevision);

            if (datesAffichees.size >= 5) {
                break;
            }
        }
    }
}

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


document.getElementById('ville__button').addEventListener('click', async function (event) {
    event.preventDefault();

    const ville = villeAdresse.value.trim();
    if (!ville) {
        alert("Veuillez entrer une ville valide.");
        return;
    }

    try {
        const donneesMeteo = await obtenirDonneesMeteo(ville);
        afficherPrevisionsMeteo(donneesMeteo, ville);

        
        ajouterVilleLocalStorage(ville);
    } catch (erreur) {
        alert(`Erreur lors de la récupération des informations météorologiques : ${erreur}`);
    }
    villeAdresse.value = '';
});


function ajouterVilleLocalStorage(ville, container) {
    if (typeof(Storage) !== "undefined") {
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
        afficherPrevisionsMeteo(donneesMeteo, ville, previsionsMeteo);
        ajouterVilleLocalStorage(ville);
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

document.getElementById('ville2__button').addEventListener('click', async function (event) {
    event.preventDefault();

    const ville = villeAdresse2.value.trim();
    if (!ville) {
        alert("Veuillez entrer une ville valide.");
        return;
    }

    try {
        const donneesMeteo = await obtenirDonneesMeteo(ville);
        afficherPrevisionsMeteo(donneesMeteo, ville, previsionsMeteo2);
        ajouterVilleLocalStorage(ville);
    } catch (erreur) {
        alert(`Erreur lors de la récupération des informations météorologiques : ${erreur}`);
    }

    villeAdresse2.value = '';
});