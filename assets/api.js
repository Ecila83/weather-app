export async function entreeVille(cityName, datalistElm) {
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

        datalistElm.innerHTML = '';

        data.forEach((result) => {
            const option = document.createElement('option');
            option.value = result.display_name;
            datalistElm.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors de la recherche d\'autocomplétion :', error);
    }
}

export async function obtenirDonneesMeteo(ville) {
    const params = new URLSearchParams({
        q: ville,
        appid: 'bf1a733eb58df0e14bb400e330ad9d9a',
        units: "metric"
    });

    const urlApi = `https://api.openweathermap.org/data/2.5/forecast?${params}`;

    const reponse = await fetch(urlApi);

    if (!reponse.ok) {
        throw new Error(`Impossible de récupérer les données météorologiques pour ${ville}`);
    }

    return await reponse.json();
}

export async function obtenirImageVille(ville) {
    const cleApiImage = 'H4wROuyTTghwfppzg5xg3EI9Ec5NslLEb51MPkY-71c';
    const url = `  https://api.unsplash.com/search/photos?page=1&query=${ville.split(',')[0].trim()}&client_id=${cleApiImage};`

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (data && data.results && data.results.length > 0) {
            const image = data.results[0].urls.regular;
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

export function mettreAJourFondEcran(elmForBackground, imageUrl) {
    elmForBackground.style.backgroundImage = `url('${imageUrl}')`;
}

