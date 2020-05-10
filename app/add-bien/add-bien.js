const remote = require('electron').remote;

// Identification des balises nécessaire pour la suite
const formName = document.getElementById('form-name');
const formCity = document.getElementById('form-city');
const formSurface = document.getElementById('form-surface');
const formDescription = document.getElementById('form-description');
const formPhoto = document.getElementById('form-photo');
const formSend = document.getElementById('form-send');
const formPrice = document.getElementById('form-price');

function aVendreOuALouer(etat) {
    if (etat) {
        return "A vendre";
    }
    if (!etat) {
        return "A louer";
    }
}

function venduOuLouer(etat) {
    if (etat) {
        return document.getElementById('form-price').value + " Euros";
    }
    if (!etat) {
        return document.getElementById('form-price').value + " Euros / mois";
    }
}

function estReserve(etat) {
    if (etat) {
        return "Réservé";
    }
    if (!etat) {
        return "A réserver";
    }
}

console.log(formSend)

formSend.addEventListener('click', function () {

    alert("Le bien " + formName.value + " a bien été ajouté.");

    let bien = {
        name: formName.value,
        city: formCity.value,
        type: aVendreOuALouer(document.querySelector('#form-sell').checked),
        surface: formSurface.value,
        price: venduOuLouer(document.querySelector('#form-sell').checked),
        description: formDescription.value,
        photo: formPhoto.value,
        book: estReserve(document.querySelector('#form-booked').checked)
    }

    let biensArray = [];

    if (localStorage.getItem('biens') !== null) {
        biensArray = JSON.parse(localStorage.getItem('biens'));
    }

    biensArray.push(bien);
    localStorage.setItem("biens", JSON.stringify(biensArray));

    remote.getCurrentWindow().getParentWindow().send('bien-added');

    // On ferme la fenêtre après avoir enregistré l'animal
    window.close();
})