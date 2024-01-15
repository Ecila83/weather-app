document.getElementById('ville__button').addEventListener('click', async function (event) {
    event.preventDefault();
    const ville = document.getElementById('ville__adresse').value;

    try {
        const donneesMeteo = await obtenirDonneesMeteo(ville);
        afficherPrevisionsMeteo(donneesMeteo, ville);
    } catch (erreur) {
        console.error('Erreur lors de la récupération des informations météorologiques :', erreur);
    }
});

async function obtenirDonneesMeteo(ville) {
    const cleApi = 'bf1a733eb58df0e14bb400e330ad9d9a';
    const urlApi = `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${cleApi}`;

    const reponse = await fetch(urlApi);

    if (!reponse.ok) {
        throw new Error(`Impossible de récupérer les données météorologiques pour ${ville}`);
    }

    return await reponse.json();
}

function afficherPrevisionsMeteo(donnees, ville) {
    const previsionsMeteo = document.getElementById('previsionsMeteo');

    if (!donnees || !donnees.list || donnees.list.length === 0) {
        previsionsMeteo.innerHTML = 'Aucune information météorologique disponible.';
        return;
    }

    previsionsMeteo.innerHTML = '';

    const datesAffichees = new Set();

    for (const previsionsJour of donnees.list) {
        const datePrevision = new Date(previsionsJour.dt_txt).toLocaleDateString('fr-FR');
        const temperatureCelsius = previsionsJour.main.temp - 273.15;

        if (!datesAffichees.has(datePrevision)) {
            const jourElement = document.createElement('div');
            jourElement.classList.add('jour');

            jourElement.innerHTML =
                `
                <h2> ${ville} le ${datePrevision}</h2>
                <p>Conditions météorologiques : ${previsionsJour.weather[0].description}</p>
                <p>Température : ${temperatureCelsius.toFixed(2)} °C</p>
                <p>Humidité : ${previsionsJour.main.humidity}%</p>
                <p>Vitesse du vent : ${previsionsJour.wind.speed} m/s</p>
                `;

            previsionsMeteo.appendChild(jourElement);
            datesAffichees.add(datePrevision);
        }
    }
}


