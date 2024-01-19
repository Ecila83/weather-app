import { cleanCityName, temporisateur } from './utils.js';
import { ajouterVilleLocalStorage, chargerVillesDepuisLocalStorage } from './storage.js';
import { entreeVille, obtenirDonneesMeteo, obtenirImageVille, mettreAJourFondEcran } from './api.js';
import {} from './dark-mode.js'

function afficherPrevisionsMeteo(donnees, ville, previsionsContainer) {
    if (!donnees || !donnees.list || donnees.list.length === 0) {
        if (previsionsContainer) {
            previsionsContainer.innerHTML = 'Aucune information météorologique disponible.';
        }
        return;
    }

    previsionsContainer.innerHTML = ''

    const datesAffichees = new Set();

    for (const previsionsJour of donnees.list) {
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

            if (datesAffichees.size >= 5) {
                break
            }
        }
    }
}

async function traiterSoumissionVille(formElm, villeAdresse, previsionsMeteo, datalistElm) {
    const ville = villeAdresse.value.trim();
    if (!ville) {
        alert("Veuillez entrer une ville valide.");
        return;
    }

    try {
        const donneesMeteo = await obtenirDonneesMeteo(ville);
        afficherPrevisionsMeteo(donneesMeteo, ville, previsionsMeteo);
        ajouterVilleLocalStorage(ville, datalistElm);

        const imageVille = await obtenirImageVille(ville);
        mettreAJourFondEcran(formElm, imageVille);
    } catch (erreur) {
        alert(`Erreur lors de la récupération des informations météorologiques : ${erreur}`);
    }

    villeAdresse.value = '';
}

function initRechercheVille(formElm, affichageParentElm) {
    const inputElm = formElm.querySelector('input')
    const buttonElm = formElm.querySelector('button')
    const datalistElm = formElm.querySelector('datalist')
    const affichageElm = affichageParentElm.querySelector('div')

    chargerVillesDepuisLocalStorage(datalistElm)

    buttonElm.addEventListener('click', (event) => {
        event.preventDefault();
        traiterSoumissionVille(formElm, inputElm, affichageElm, datalistElm);
    });

    const entreeVilleTemporise = temporisateur(400, entreeVille)

    inputElm.addEventListener('keyup', (e) => {
        if (inputElm.value.length < 3) {
            return;
        }

        entreeVilleTemporise(inputElm.value, datalistElm)
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initRechercheVille(document.getElementById('ville'), document.getElementById('ville-container'))
    initRechercheVille(document.getElementById('ville2'), document.getElementById('ville2-container'))
})
