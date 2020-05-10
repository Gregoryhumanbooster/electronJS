// Importation des bibliothèques
const remote = require('electron').remote;
const { BrowserWindow } = require('electron').remote;
const { ipcRenderer } = require('electron');

function addListeners(list) {
    if (list !== null && list.length > 0) {
        list.forEach(function (bien, index) {
            document.getElementById(index).addEventListener('click', () => {
                // Récupération et Parse en JSON de la collection d'objet
                let biensArray = JSON.parse(localStorage.getItem('biens'));
                biensArray[index].book = "Réservé";
                localStorage.setItem('biens', JSON.stringify(biensArray))
                console.log(biensArray);
                // Récupération du bloc html contenant la liste de biens
                const biensListContainer = document.getElementById('biens-list');
                // Création et injection du code html
                showBiensInHtml(biensListContainer, biensArray);
                addListeners(list);
            })
        })
    }
}

function disabled(element, i) {
    if (element === "Réservé") {
        return '<td><button class="booking" id="' + i + '" disabled>'
    } else {
        return '<td><button class="nobooking" id="' + i + '">'
    }
}

// Génération du code html 
let showBiensInHtml = function (container, list) {
    container.innerHTML = '';

    if (list !== null && list.length > 0) {
        list.forEach(function (bien, index) {
            let bienHtml =
                '<tr>' +
                '<th>' + index + '</th>' +
                '<td>' + bien.name + '</td>' +
                '<td>' + bien.city + '</td>' +
                '<td>' + bien.type + '</td>' +
                '<td>' + bien.surface + '</td> ' +
                '<td>' + bien.price + '</td > ' +
                '<td>' + bien.description + '</td>' +
                '<td><img src="' + bien.photo + '" alt="' + bien.name + '"></td>' +
                disabled(bien.book, index) +
                bien.book + '</button></td>' +
                '</tr>';
            container.innerHTML += bienHtml;
        })
    }
}

// Récupération de l'objet biens et transformation en JSON
let biensArray = JSON.parse(localStorage.getItem('biens'));
let biensListContainer = document.getElementById('biens-list');
showBiensInHtml(biensListContainer, biensArray);
addListeners(biensArray);

// Création d'un fenêtre à l'évenement click et chargement de add-bien.html en son sein
const linkAddBien = document.getElementById('link-add-bien');
linkAddBien.addEventListener('click', () => {

    const winAddBien = new BrowserWindow({
        width: 800,
        height: 600,
        maxWidth: 800,
        minWidth: 800,
        maxHeight: 600,
        minHeight: 600,
        parent: remote.getCurrentWindow(),
        webPreferences: {
            nodeIntegration: true
        }
    });

    winAddBien.loadFile('app/add-bien/add-bien.html');

    winAddBien.show();
});

// A l'écoute : à la détection de 'bien-added', récupération de l'objet biens et transformation en JSON
ipcRenderer.on('bien-added', function () {
    let biensArray = JSON.parse(localStorage.getItem('biens'));
    const biensListContainer = document.getElementById('biens-list');
    showBiensInHtml(biensListContainer, biensArray);
    addListeners(biensArray);
});