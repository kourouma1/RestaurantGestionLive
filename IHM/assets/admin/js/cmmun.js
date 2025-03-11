
            // Récupérer les éléments du DOM
const modal = document.getElementById("clientModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.querySelector(".close");
const clientForm = document.getElementById("clientForm");

// Ouvrir le modal
openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

// Fermer le modal
closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Fermer le modal si l'utilisateur clique en dehors du modal
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Gérer la soumission du formulaire
clientForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Récupérer les valeurs du formulaire
    const clientName = document.getElementById("clientName").value;
    const clientEmail = document.getElementById("clientEmail").value;
    const clientPhone = document.getElementById("clientPhone").value;

    // Ici, vous pouvez ajouter le code pour traiter les données du client
    console.log("Nom:", clientName);
    console.log("Email:", clientEmail);
    console.log("Téléphone:", clientPhone);

    // Fermer le modal après la soumission
    modal.style.display = "none";

    // Réinitialiser le formulaire
    clientForm.reset();
});
   

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".navbar").classList.add("show");
});