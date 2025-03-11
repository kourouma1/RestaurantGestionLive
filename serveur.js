const express = require('express')
const mysql = require('mysql')
const session = require('express-session')
//const myconnection = require('express-myconnection')
const bodyParser = require('body-parser');
const cors = require("cors");
const bcrypt = require('bcrypt'); // Pour hacher les mots de passe
const serv = express();
const path=require('path')


const modulePath = path.resolve(__dirname + '/serveur.js');
const modules = require(modulePath);

// Définir le répertoire des vues
serv.set("view engine", "ejs");
serv.set('views', __dirname + '/IHM');

//definition du moteur d'affichage



serv.use(express.static('IHM'));

serv.use(session({
    secret: "maCle",
    resave: false,
    cookie: {
        secure: false,             // mettre sur true en production si vous utilisez HTTPS
        maxAge: 24 * 60 * 60 * 1000 // durée de validité du cookie (1 jour ici)
    }
}))


// Middleware pour stocker les informations de session dans req.session
serv.use((req, res, next) => {
    console.log('Session actuelle:', req.session);
    next();
});

// Middleware pour gérer les requêtes CORS
serv.use(express.json());
serv.use(cors());

// midolware pour la recuperation des donnee venan d'une page a partie d'un formulaire

serv.use(bodyParser.urlencoded({ extended: false }));
serv.use(express.static('IHM'));

// les options de Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: 'sql8.freesqldatabase.com',
    user: 'sql8767087',
    password: 'XvACEfpYDi',
    database: 'sql8767087',
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
    } else {
        console.log('Connecté à la base de données MySQL');
    }
});


//La rentrer principale
serv.get('/', (req, res) => {
    res.status(200).render('pages/acceuil', { message: "" })
});





//=================GESTION COMPLETE DU COTE CLIEN==========================//

serv.get('/accueil', (req, res) => {
    res.status(301).redirect('/')
});


// Route pour traiter la soumission du formulaire de connection
serv.post('/login', async (req, res) => {
    const { email, password } = req.body;


    // Requête SQL pour vérifier les informations de connexion
    const query = 'SELECT * FROM clients WHERE email = ? ';
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).render('erre');
        }
        if (results.length > 0) {
            const user = results[0]
            const isMatch = await bcrypt.compare(password, user.mot_de_passe)
            if (isMatch) {
                req.session.useremail = user.email
                req.session.userId = user.id
                idusb = req.session.userId 
                console.log("information correcte...");
                
                res.status(301).redirect('/page/')

            } else {
                console.log('Mots de passe Incorrect !')
                res.status(200).render('pages/acceuil', { message: "mots de passe / email incorrect !" })
            }

        } else {
            res.status(200).render('pages/acceuil', { message: "Les informations sont incorrect  !" })
            console.log("Email ou mot de passe incorrect")
           // console.log(email)
            //console.log(hashedPassword2)
            //  $2b$10$l6.5HOBh8xI7mn18Hly5Me5fs4sL5ITT/tEJZbu1Bw5J3jDHpf2FC


        }
    });
});



//gestion de recuperation de la page index Clients
serv.get('/page/', (req, res) => {


    if (req.session.userId) {

        console.log(req.session.userId);
        console.log(req.session.useremail);
        // 🔸 Récupérer toutes les commandes

        const query = 'SELECT * FROM commandes WHERE client_id=? ORDER BY id DESC LIMIT 5';
        const query2 = 'SELECT * FROM reservations WHERE client_id=?';
        let results2
        db.query(query, [req.session.userId], (err, results1) => {
            if (err) {
                return res.status(500).json({ error: "Erreur lors de la récupération des commandes" });
            }
            let results = results1
            //=============recupeeration
            db.query(query2, [req.session.userId], (err, results2) => {
                if (err) {
                    return res.status(500).json({ error: "Erreur lors de la récupération des reservations" });
                }
                results2 = results2
                return res.status(200).render('pages/index', { results, results2 })

            })

        })


    } else {
        console.log('non autoriser raison de session vide');
        res.status(301).redirect('/')
    }



})


// Route pour traiter l'inscription d'un client
serv.post('/ins', async (req, res) => {
    const { nom, email, tel, ads, pwd } = req.body;

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(pwd, 10);

    // Insérer l'utilisateur dans la base de données
    const query = 'INSERT INTO clients (nom, email, telephone, adresse, mot_de_passe) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nom, email, tel, ads, hashedPassword], (err, results) => {
        if (err) {
            console.log("Une erreur ses produit lors de l'inscription :", err)

            return res.status(500).send('Erreur lors de l\'inscription')
        }

        console.log("la session est cree par defaut avec pour valeur 454")

        res.status(301).redirect("/")
    });
});





//======================FIN DE LA GESTION COTE CLIENT=============================///



//PAGE 404 NOT FUND
serv.use((req, res) => {
    res.status(404).render('erre')
})









serv.listen(8000, (err) => {
    if (err) {
        console.log("erreur l'or du lancement du serveur !");
        
    }
    console.log("Serveur en ecoute sur le port 3001");
    console.log("tapez localhost:3001 dans un navigateur...");

}); 