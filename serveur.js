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



// midolware pour la recuperation des donnee venan d'une page a partie d'un formulaire

serv.use(bodyParser.urlencoded({ extended: false }));

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

//==========================================================================================================================================================



//=================GESTION COMPLETE DU COTE ADMIN==========================//

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



//===================================gestion de recuperation de la page index Clients======V
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
//=========================================================================


// ===========Route pour traiter l'inscription d'un client==========//V

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

//===================================================================
//route pour le formulaire de connexion admin
serv.get('/admin/login', (req, res) => {
    res.status(200).render('admin/login',{message : ''})
});


// Route pour traiter la soumission du formulaire de connection
serv.post('/admin', async (req, res) => {
    const { email, password } = req.body;


    // Requête SQL pour vérifier les informations de connexion
    const query = 'SELECT * FROM users WHERE email = ? ';
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).send('Erreur du serveur');
        }
        if (results.length > 0) {
            const user = results[0]
            const isMatch = await bcrypt.compare(password, user.mot_de_passe)
            if (isMatch) {

                req.session.userIdadmin = user.IDuser

                if (req.session.userIdadmin) {

                   
                    // 🔸 Récupérer toutes les commandes======================//

                    const query = 'SELECT * FROM commandes ORDER BY id DESC LIMIT 10';
                    const query2 = 'SELECT * FROM reservations ORDER BY id DESC LIMIT 10';
                    let results2
                    db.query(query, [req.session.userId], (err, results1) => {
                        if (err) {
                            return res.status(500).json({ error: "Erreur lors de la récupération des commandes" });
                        }
                        let results = results1
                        //=============recupeeration=========================//
                        db.query(query2, [req.session.userId], (err, results2) => {
                            if (err) {
                                return res.status(500).json({ error: "Erreur lors de la récupération des reservations" });
                            }
                            results2 = results2
                            return res.status(200).render('admin/index', { results, results2 })

                        })

                    })


                } else {
                    console.log('non autoriser raison de session vide');
                    res.status(301).render('admin/login', { message: "Infraction !" })
                }
            } else {
                console.log('Mots de passe Incorrect !')
                res.status(301).render('admin/login', { message: "mots de passe incorrect !" })
            }

        } else {
            res.status(301).render('admin/login', { message: "mots de passe incorrect !" })
            console.log("Email ou mot de passe incorrect")
            console.log(email)



        }
    });
});

////===================================================fin


//==========admin clients===============///


serv.get('/admin/clients', (req, res) => {
    const sql = 'SELECT * FROM clients'

    db.query(sql, (err, val1) => {
        if (err) {
            console.log("erreur de recuperation des clients")
        }
        //console.log(val1);
        res.status(200).render('admin/clients', { val1 })
    })
})


//pour lactualisation automatique
serv.get('/client/act', (req,res)=>{
    const sql = 'SELECT * FROM clients'

    db.query(sql, (err, val1) => {
        if (err) {
            console.log("erreur de recuperation des clients")
        }
        ///console.log(val1);
        res.status(200).render('admin/sync/tabclient', { val1 })
    })
})


//==================gestion page client cote admin===============//
serv.post('/admin/clients/add',(req,res) =>{
    //recuperation des donnee depuis le formulaire
    const { nom, email, phone, residence } = req.body;
    const query = 'INSERT INTO clients (nom, email, telephone, adresse) VALUES (?, ?, ?, ?)'
    db.query(query, [nom,email,phone,residence], async (err, results) => {
        if (err) {
            console.log("erreur d'ajout ");
            return res.status(500).render('/pages/erreur');
        }else{
            console.log("ajout effectuer !");
            return res.status(200).redirect('/admin/clients')
           
            
        }
    })
})



// Route DELETE pour supprimer un commande
serv.delete("/cmmds/:id", (req, res) => {
    const commandeId = req.params.id;
    console.log(commandeId);
    
    const sql = "DELETE FROM commandes WHERE id = ?";
    
    db.query(sql, [commandeId], (err, result) => {
      if (err) {
        console.error("Erreur lors de la suppression:", err);
        res.status(500).json({ message: "Erreur serveur" });
      } else {
        res.status(202).json({routeRacine : '/page/'});
        console.log("suppression effectuer "+commandeId);
          
      }
    });
  });


//==================================fin gestion clients ===================================================///




//============== Les actions delete,modification du cote admin Commande================

/===================Gestion des commandes administrateur================//
serv.get('/admin/commande', (req, res) => {

         // 🔸 Récupérer toutes les commandes

    const query = `
    SELECT 
        cl.nom,
        cl.telephone,
        c.plats,
        c.quantite,
        c.garniture,
        c.date_commande,
        c.id,
        c.statut
       
        
    FROM commandes c
    JOIN clients cl ON c.client_id = cl.id
    ;
`
db.query(query, (err, results1) => {
    if (err) {
        return res.status(500).json({ error: "Erreur lors de la récupération des reservations" });
    }
    return res.status(200).render('admin/commande', { results1 })
     
})

   
});



serv.get('/commande/act', (req, res) => {

    // 🔸 Récupérer toutes les commandes

const query = `
SELECT 
   cl.nom,
   cl.telephone,
   c.plats,
   c.quantite,
   c.garniture,
   c.date_commande,
   c.id,
   c.statut
  
   
FROM commandes c
JOIN clients cl ON c.client_id = cl.id
;
`
db.query(query, (err, results1) => {
if (err) {
   return res.status(500).json({ error: "Erreur lors de la récupération des reservations" });
}
return res.status(200).render('admin/sync/tabcom', { results1 })

})


});


///============== Les actions delete,modification du cote admin ================

// Route pour valider une commande
serv.delete("/im/:id", (req, res) => {
    const commandeId = req.params.id;
    console.log(commandeId);
    
    const sql = "UPDATE commandes SET statut = ? WHERE id=?";
    
    db.query(sql, ["livrer",commandeId], (err, result) => {
      if (err) {
        console.error("Erreur lors de la validation:", err);
        res.status(500).json({ message: "Erreur serveur" });
      } else {
        res.status(202).json({routeRacine : '/admin/commande'});
        
        
      }
    });
  });
  

  // Route pour supprimer  une commande cote admin
serv.delete("/is/:id", (req, res) => {
    const commandeId = req.params.id;
    console.log(commandeId);
    
    const sql = "DELETE FROM commandes  WHERE id=?";
    
    db.query(sql, [commandeId], (err, result) => {
      if (err) {
        console.error("Erreur lors de la l'annulation:", err);
        res.status(500).json({ message: "Erreur serveur" });
      } else {
        res.status(202).json({routeRacine : '/admin/commande'});
        console.log("validation effectuer "+commandeId);
        
      }
    });
  });


  
  // Route pour annuler une commande cote admin
serv.delete("/ia/:id", (req, res) => {
    const commandeId = req.params.id;
    console.log(commandeId);
    
    const sql = "UPDATE commandes SET statut = ? WHERE id=?";
    
    db.query(sql, ["annulée",commandeId], (err, result) => {
      if (err) {
        console.error("Erreur lors de la Suppression:", err);
        res.status(500).json({ message: "Erreur serveur" });
      } else {
        res.status(202).json({routeRacine : '/admin/commande'});
        console.log("validation effectuer "+commandeId);
        
      }
    });
  });
//=============fin=========================//



//===============================================fin=================================================//


//=======================Le menu de propos ================================================///
serv.get('/admin/apropos', (req, res) => {
    res.status(200).render('admin/apropos')
});

//=============fin==========================================================//


//======================= Gestion des reservations admin====================///

serv.get('/admin/reservation', (req, res) => {
    res.status(200).render('admin/reservation')
});

//====================gestion des plat===========================================================//
serv.get('/admin/plat', (req, res) => {
    res.status(200).render('admin/plats')
});


//===========================================================gestion du menu animationDirection: 

serv.get('/admin/menu',(req,res) =>{
    res.status(200).render('admin/menu')
})

serv.get('/commande/act',(req,res) =>{
    // 🔸 Récupérer toutes les commandes

    const query = `
    SELECT 
        cl.nom,
        cl.telephone,
        c.plats,
        c.Quantite,
        c.garniture,
        c.date_commande,
        c.commande_id,
        c.statut
       
        
    FROM commandes c
    JOIN clients cl ON c.client_id = cl.client_id
    ;
`
db.query(query, (err, results1) => {
    if (err) {
        return res.status(500).json({ error: "Erreur lors de la récupération des reservations" });
    }
    return res.status(200).render('admin/sync/tabcom', { results1 })
     
})

})




//===================connexion pour mobile=========================//
serv.get('/mobile/login',(req,res)=>{
    return res.status(200).render("pages/loginmobile",{message : " "})
})



//=================================================la route pour l'accueil admin==============================//


serv.get('/admin', (req, res) => {

    //=====================

    // 🔸 Récupérer toutes les commandes

    const query = `
        SELECT 
            c.id ,
            c.date_commande,
            c.statut,
            c.plats,
            c.quantite,
            c.garniture,
            cl.id ,
            cl.nom
        FROM commandes c
        JOIN clients cl ON c.client_id  = cl.id
        ORDER BY c.date_commande DESC LIMIT 10;
    `
    const query2 = `
             SELECT 
                 r.id,
                 r.date_reservation,
                 r.statut,
                 r.nombre_personnes,
                 cl.id ,
                 cl.nom,
                 cl.email,
                 cl.telephone
             FROM reservations r
             JOIN clients cl ON r.client_id = cl.id
             ORDER BY r.date_reservation DESC LIMIT 10;
         `;
    let results2
    db.query(query, (err, results1) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération des commandes" });
        }
        let results = results1
        //=============recupeeration===================//
        db.query(query2, (err, results1) => {
            if (err) {
                return res.status(500).json({ error: "Erreur lors de la récupération des reservations" });
            }
            results2 = results1
            return res.status(200).render('admin/accuille', { results, results2 })

        })

    })
    //=====================
    //res.status(200).render('admin/accuille')
})




//======================FIN DE LA GESTION COTE ADMIN=============================///


/*


DEBUT DE LA GESTION COTE client



*/

////===============================GESTION COTE ADMIN===============================///










//============================pour la deconnection====v
serv.get('/decon', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log('erreur de deconnexion de la session .');

        }
        //console.log(req.session.userId );
        console.log('la session a ete bien detruite !');


        res.status(301).redirect('/')

    })
})

//=================page apropos====v
serv.get('/apropos', (req, res) => {
    if (req.session.userId) {
        return res.status(200).render('pages/apropos')
    }

});



///========================================pour effectuer une commande===============///
serv.post('/page/cmd', async (req, res) => {
    const { plat, garni, instruct, qt } = req.body;

    // Hacher le mot de passe
    const id = req.session.userId
    const status = "en cours"

    // Insérerton de la reservation dans la base de données
    const query = 'INSERT INTO commandes (client_id,plats,quantite,garniture,statut,instruc) VALUES (?, ?, ?, ?, ?,?)';
    db.query(query, [id, plat, qt, garni, status, instruct], (err, results) => {
        if (err) {
            console.log("Une erreur ses produit lors de la commande :", err)

            return res.status(500).send('Erreur lors de l\'envoi de la commande')
        }


        res.status(301).redirect('/page/')

    })

});


///=============pour effectuer une reservation===============///
serv.post('/res', async (req, res) => {
    const { date, heure, NBpersonne } = req.body;

    // Hacher le mot de passe
    const id = req.session.userId
    const status = "en cours"

    // Insérer l'utilisateur dans la base de données
    const query = 'INSERT INTO reservations (client_id,date_reservation,heure,nombre_personnes,statut) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [id, date, heure, NBpersonne, status], (err, results) => {
        if (err) {
            console.log("Une erreur ses produit lors de la commande :", err)

            return res.status(500).send('Erreur lors de l\'envoi de la reservation')
        }
        console.log("reservation effectuer correctement...")
        res.status(301).redirect('/page/')


    })


});


// Route DELETE pour supprimer un client
serv.delete("/cmmds/:id", (req, res) => {
    const commandeId = req.params.id;
    console.log(commandeId);
    
    const sql = "DELETE FROM commandes WHERE id = ?";
    
    db.query(sql, [commandeId], (err, result) => {
      if (err) {
        console.error("Erreur lors de la suppression:", err);
        res.status(500).json({ message: "Erreur serveur" });
      } else {
        res.status(202).json({routeRacine : '/page/'});
        console.log("suppression effectuer "+commandeId);
          
      }
    });
  });


////=========================FIN DE LA GESTION ADMIN===================================////



//PAGE 404 NOT FUND
serv.use((req, res) => {
    res.status(404).render('erre')
})









serv.listen( 3001,(err) => {
    if (err) {
        console.log("erreur l'or du lancement du serveur !");
        
    }
    console.log("Serveur en ecoute sur le port 3001");
    console.log("tapez localhost:3001 dans un navigateur...");

}); 