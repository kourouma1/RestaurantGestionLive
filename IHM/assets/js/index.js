





 document.querySelector('.form-toggle').addEventListener('click', function () {
     const form = document.querySelector('.reservation-form');
     form.style.display = form.style.display === 'none' || form.style.display === '' ? 'block' : 'none';
     this.textContent = form.style.display === 'block' ? 'Cliquez ici pour masquer le formulaire' : 'Cliquez ici pour réserver une table';
 });

 document.getElementById('reservationForm').addEventListener('submit', function (event) {
     event.preventDefault();
     alert('Votre réservation a été soumise avec succès !');
     this.reset();
 });





// Afficher le bouton flottant lorsque l'utilisateur fait défiler la page
window.onscroll = function() {
   var button = document.getElementById("backToTopBtn");
   if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
       button.style.display = "block";
   } else {
       button.style.display = "none";
   }
};

// Fonction pour revenir en haut de la page
function scrollToTop() {
   window.scrollTo({ top: 0, behavior: 'smooth' });
}







// fonction de remplissage de formulaire


function alt(id,plat,garniture,instruc,quantite) {
   alert('jojlsjl')
   document.getElementById('id').value  = id
   document.getElementById('dish').value =plat
   document.getElementById('additions').value =garniture
   document.getElementById('specialInstructions').value =instruc
   document.getElementById('quantity').value = quantite
   console.log(document.getElementById('id'))
   console.log(document.getElementById('dish'));
   
   
}




let selectedClientId = null;

function openDeleteModal(id) {
    console.log("une suppression effectuer !");
    
    console.log(id);
    
 selectedClientId = id;
 document.getElementById("openModal").click(); // Ouvre le modal
}


document.getElementById("confirmDelete").addEventListener("click", function () {

//pour lenvoi de id du commande a suprimer
if (selectedClientId) {
   console.log("suppression preparer !");
   
    fetch("/cmmds/"+ selectedClientId,{method: "DELETE"})
    .then(response => response.json())
    .then((data) => {
        window.location.href= data.routeRacine 
        console.log("Réponse serveur :", data);
        
        })
    .catch(error => console.log("Erreur:", error))
    
    selectedClientId = null;
    let modal = new bootstrap.Modal(document.getElementById("confirmModal"));
    modal.hide();
    console.log("suppression terminer !");
  }

});
