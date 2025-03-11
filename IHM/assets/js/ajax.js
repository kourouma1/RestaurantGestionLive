//pour actualisation automatique des tableaux
function actualiserTableau() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/commande/act", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("tb").innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}

//pour la table client 

function actualiserTableau2() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/client/act", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("tbc").innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}



// Rafraîchir toutes les 5 secondes
setInterval(actualiserTableau, 2000);
// Rafraîchir toutes les 5 secondes
setInterval(actualiserTableau2, 2000);