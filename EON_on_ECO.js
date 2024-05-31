// main

var url = document.location.href;

if (url.substr(0,30) == "http://eco.url/"){
  
  var data = lire_cookie('donnees_eon');
  
  var check_initial = lire_cookie('initial_eon');
  var check_creation = lire_cookie('creation_eon');
  var check_go_assign = lire_cookie('go_assign_eon');
  var check_wait = lire_cookie('wait_eon');
  var check_go_affect = lire_cookie('go_affect_eon');
  var check_final = lire_cookie('final_eon');

  if (data != ""){
     if (check_initial != ""){
        supprimer_cookie("initial_eon");
        creer_cookie("creation_eon","x");
       document.getElementById("create_link").click();
     }
  }else{
    if (check_initial != ""){
        supprimer_cookie("initial_eon");
     }
    make_btn();
  }
  
  if (check_creation != ""){
     if (url == "http://eco.url/secure/CreateIssue!default.jspa"){
          window.onload = function () {
                document.getElementById("issuetype").value = parseInt(45);
                document.getElementById("Suivant>>").click();
          }
     }else if (url == "http://eco.url/secure/CreateIssue.jspa"){
          window.onload = function () {
                var commentaire = "";
                var equipe = "SEP-SUPPORT";
  
                var alertes = data.split('||');
  
                // s'il n'y a plus d'alertes à créer, suppression du cookie est arrêt de la fonction
                if (alertes[0] === undefined){
                     supprimer_cookie("donnees_eon");
                     document.location.href = document.location.href;
                }
            
               // récupération des données de la première alerte
               var elements = alertes[0].split('--');
               var elements_bis;
               var serveur = elements[0];
               var serveur_corps = serveur;
               var service = elements[1];
               var service_corps = service;
               var status_information = elements[2];
               var duree = elements[3];
               var statut = elements[4];
               var actions_tags = elements[5].split(',');
               var actions_tags_bis;
               var actions_valeurs = elements[6].split(',');
               var actions_valeurs_bis;
  
               var nb_actions = actions_tags.length;
               var nb_actions_bis;
    
                // suppression de l'alerte du tableau
                alertes.splice(0,1);
            
                var nb_alertes = alertes.length;
                var i;
                var j;
                var similarite1;
                var similarite2;
                var similarite3;
            
                // recherche de redondance du serveur
                var serveur_occurrences = trouve_positions(alertes,serveur);
                var serveur_nombre = serveur_occurrences.length;
                if (serveur_nombre > 9){
                   if(confirm("Attention : " + serveur_nombre + " alertes sur le serveur " + serveur + ".\n" + "Est-ce un problème ?\nOK = Oui et adapter l'action\nAnnuler = Non et créer les tickets normalement")){
                      if(confirm("OK = Créer un ticket unique pour toutes les alertes\nAnnuler = Ne pas créer de ticket pour ces alertes")){
                            // créer un ticket unique pour toutes les alertes
                            for(i=0 ; i < serveur_nombre; i++){
                               j = serveur_occurrences[i];
                               elements_bis = alertes[j].split('--');
                               service_corps = elements_bis[1] + "\n" + service_corps;
                               alertes.splice(j,1);
                            }
                            status_information = "";
                      }else{
                           // ne pas créer de tickets pour ces alertes
                           for(i=0 ; i < serveur_nombre; i++){
                               j = serveur_occurrences[i];
                               alertes.splice(j,1);
                           }
                           document.location.href = document.location.href;
                      }
                   }
                }else{
                    // recherche de redondance partielle (similarité) du couple service/description pour rassembler en un seul ticket
                    var service_occurrences = trouve_positions_similaires(alertes,service,0.8);
                    var service_nombre = service_occurrences.length;
                    for(i=0; i < service_nombre; i++){
                          j = service_occurrences[i];
                          elements_bis = alertes[j].split('--');
                          similarite1 = similarity(elements_bis[1],service);
                          similarite2 = similarity(elements_bis[2],status_information);
                          similarite3 = (similarite1+similarite2)/2;
                          if (similarite3 > 0.8){
                             serveur_corps = elements_bis[0] + "\n" + serveur_corps;
                             alertes.splice(j,1);
                          }
                    }
                }
              
               // prise en compte des actions pour cas particuliers
                for (i=0 ; i < nb_actions ; i++){
                    if (actions_tags[i] == "commentaire"){
                         commentaire = "\n\n" + actions_valeurs[i];
                    }
                    if (actions_tags[i] == "affecter"){
                         equipe = actions_valeurs[i];
                    }
                }
  
               // mise à jour du cookie
               var neodata = alertes.join('||');
               creer_cookie("donnees_eon",neodata);
            
               // saisie du formulaire
               document.getElementById("customfield_10060:1").value = 581364;
               document.getElementById("customfield_10060:2").value = 581380;
               document.getElementById("summary").value =  "#incidentEON# - STATUT " + statut + " - " + serveur + " - " + service;
               document.getElementById("description").value = "Bonjour,\n\nMerci de prendre en compte.\n\n*SERVEUR :* " + serveur_corps + "\n\n*SERVICE :* " + service_corps + "\n\n*CURRENT STATUS :* " + statut + "\n\n*STATUT INFORMATION :* " + status_information + "\n\nDepuis " + duree + commentaire + "\n\nCordialement,\nSUPPORT-N1";
               document.getElementById("priority").value = "1";
               document.getElementById("customfield_10001").value = "SEP";
               document.getElementById("customfield_10723").value = resolv_date();
       
               supprimer_cookie("creation_eon");
               creer_cookie("for_service",equipe);
               creer_cookie("go_assign_eon","x");
               document.getElementsByName('Créer la demande')[0].click();
          }
      }
  }

  if (check_go_assign != ""){
      if (url.substr(0,36) == "http://eco.url/secure"){
          supprimer_cookie("go_assign_eon");
          creer_cookie("wait_eon","x");
      }
  }
  
  if (check_wait != ""){
    var aleatime = Math.floor(Math.random() * (9000 - 3000 + 1)) + 1000;
    setTimeout(function(){
            supprimer_cookie("wait_eon");
            creer_cookie("go_affect_eon","x");
            var equipe = lire_cookie("for_service");
            creer_cookie("service",equipe);
            supprimer_cookie("for_service");
            document.getElementById("action_id_61").click();
    }, aleatime);
  }
  
  if (check_go_affect != ""){
     if (url.substr(0,36) == "http://eco.url/secure"){
          supprimer_cookie("go_affect_eon");
          creer_cookie("final_eon","x");
      }
  }
  
  if (check_final != ""){
     supprimer_cookie("final_eon");
     creer_cookie("initial_eon","x");
     document.location.href = "http://eco.url/secure/Dashboard.jspa";
  }
  
  
}


// ---------------------------------------------------------------------------------------------------------------------------------------

// intégration du bouton global dans le bandeau haut d'ECO

function make_btn(){
  var btn = document.createElement("BUTTON");
  var t = document.createTextNode("Tous incidents EON");
  btn.appendChild(t);
  btn.style.cssText = "border: none;margin: 10px 10px;font-size: 14px;display: inline-block;color: white;padding: 5px 5px;text-align: center;background-color: #66B3DA;";
  document.getElementById("header-top").appendChild(btn);
  
    btn.onclick = function(){
      gui();
    }

}

// affichage des sélecteurs de fichier et bouton de chargement

function gui(){
  
  var dive = document.createElement("div");
  dive.id = "dive";
  dive.align = "center";
  dive.style = "background-color:white";
  document.getElementById("header-top").appendChild(dive);

  var h = document.createElement("h1");
  h.id = "h";
  h.style = "color:black";
  h.innerHTML = "~~~~~~~~~~~~~~~~~~~~~Automate EON~~~~~~~~~~~~~~~~~~~~~";
 
  var p = document.createElement("p");
  p.id = "p";
  p.innerHTML = "<strong>Charger le fichier <em>eon.json</em> :</strong>";

  var data_file = document.createElement("input");
  data_file.type = "file";
  data_file.id = "data_file";
  data_file.accept = ".json";
  
  var pp = document.createElement("p");
  pp.id = "pp";
  pp.innerHTML = "<strong>Charger le fichier <em>eon_parametres.txt</em> :</strong>";
  
  var config_file = document.createElement("input");
  config_file.type = "file";
  config_file.id = "config_file";
  config_file.accept = ".txt";
  
  var ppp = document.createElement("p");
  ppp.id = "pp";
  ppp.innerHTML = "<br/>";
  
  var bout = document.createElement("BUTTON");
  bout.appendChild(document.createTextNode("Démarrer"));
  bout.id = "bout";
  bout.onclick = function(){
    charger_parametres();
  }
  
  document.getElementById("dive").appendChild(h);
  document.getElementById("dive").appendChild(p);
  document.getElementById("dive").appendChild(data_file);
  document.getElementById("dive").appendChild(pp);
  document.getElementById("dive").appendChild(config_file);
  document.getElementById("dive").appendChild(ppp);
  document.getElementById("dive").appendChild(bout);
  
}

// ------------------------------------------------------------------------------------------------------------------------------------------

// chargement des paramètres et sauvegarde dans un cookie

function charger_parametres(){
  
 var configFile = document.getElementById("config_file").files[0];
 if (configFile === undefined){
   alert("Erreur : le fichier de paramètres ('parametres.eon') n'a pas été chargé !");
   return;
 }
 var reader_config = new FileReader();
 reader_config.onload = function(e) {
   var contenu_config = reader_config.result;
   objo = JSON.parse(contenu_config);
   
   creer_cookie('parametres_eon',JSON.stringify(objo),0);
   
   supprimer_cookie("donnees_eon");

 }
 
 reader_config.readAsText(configFile);
 charger_donnees();
}


// chargement et extraction JSON des données

function charger_donnees(){
  
 var dataFile = document.getElementById("data_file").files[0];
 if (dataFile === undefined){
   alert("Erreur : le fichier de données ('eon.json') n'a pas été chargé !");
   return;
 }
 var reader_data = new FileReader();
 reader_data.onload = function(e) {
   var contenu_data = reader_data.result;
   obj = JSON.parse(contenu_data);
    
   var jk = 0;
   for (alerte in obj){
        jk = jk+1;
        var serveur =  obj[alerte].host_name;
        var service = obj[alerte].description;
        var status_information = obj[alerte].plugin_output;
        var date_stamp = obj[alerte].last_state_change;
        var statut_id = obj[alerte].state;
   
   // aide interprétation JSON EON :
   // serveur = "host_name"
   // service = "description"
   // statut = "state" (1= warning, 2= critical)
   // status information = "plugin_output"
   // durée (timestamp à convertir) = "last_state_change" (à priori)
   
       var time_valid = purge_alerte(date_stamp);
       if (time_valid == true){
           var objcheck = check_alerte(serveur,service,status_information,date_stamp,statut_id);
           var cas = objcheck.cas;
           if (cas == "normal"){
              var actions_tags = [];
              var actions_valeurs = [];
              prenez_un_cookie(serveur,service,status_information,date_stamp,statut_id,actions_tags,actions_valeurs);
          }else if (cas == "exception"){
              var actions_tags = objcheck.actions_tags;
              var actions_valeurs = objcheck.actions_valeurs;
              prenez_un_cookie(serveur,service,status_information,date_stamp,statut_id,actions_tags,actions_valeurs);
          }
      }
   }

 }
 reader_data.readAsText(dataFile);
 creer_cookie("initial_eon","x");
 window.open(document.location.href);
}



// purge des alertes de moins d'1 heure

function purge_alerte(date_stamp){
  
  var objtime = conversion_duree(date_stamp);
  var jours = objtime.jours;
  var heures = objtime.heures;
  
  if (jours < 1 && heures < 1){
    return false;
  }else{
    return true;
  }
   
}

// vérification de l'alerte avec les paramètres

function check_alerte(serveur,service,status_information,date_stamp,statut_id){
  
   var paramstring = lire_cookie("parametres_eon");
   parametres = JSON.parse(paramstring);
  
   var nb_demant = parametres.demanteles.length;
   var nb_exclu = parametres.exclusions.length;
   var nb_except = parametres.exceptions.length;
  
   for (var i=0 ; i < nb_demant ; i++){
     if (serveur == parametres.demanteles[i].serveur){
       return {cas: "KO", actions_tags: "", actions_valeurs: ""};
     }
   }
  
   for (var j=0 ; j < nb_exclu ; j++){
     var nb_conditions_e = parametres.exclusions[j].conditions.length;
     var condition_check_e = false;
     
      for (var m=0; m < nb_conditions_e; m++){
       var tage = parametres.exclusions[j].conditions[m].tag;
       var valeure = parametres.exclusions[j].conditions[m].valeur;
       if (tage == "serveur"){
         if (serveur == valeure){
           condition_check_e = true;
         }else{
           condition_check_e = false;
         }
       }else if (tage == "serveur_contient"){
           var posd = serveur.search(valeure);
            if (posd == -1){
              condition_check_e = false;
            }else{
              condition_check_e = true;
            }
       }else if (tage == "service"){
         if (service == valeure){
           condition_check_e = true;
         }else{
           condition_check_e = false;
         }
       }else if (tage == "service_contient"){
            var pose = service.search(valeure);
            if (pose == -1){
              condition_check_e = false;
            }else{
              condition_check_e = true;
            }
       }else if (tage == "description"){         
         if (status_information == valeure){     
           condition_check_e = true;
         }else if (tage == "description_contient"){
           condition_check_e = false;
         }else {
            var posf = status_information.search(valeure);
            if (posf == -1){
              condition_check_e = false;
            }else{
              condition_check_e = true;
            }
         }
       }
     }
     
     if (condition_check_e == true){
        return {cas: "KO", actions_tags: "", actions_valeurs: ""};
     }
   
   }
  
  
   for (var k=0 ; k < nb_except ; k++){
     var nb_conditions = parametres.exceptions[k].conditions.length;
     var nb_actions = parametres.exceptions[k].actions.length;
     var condition_check = false;
     
     for (var l=0; l < nb_conditions; l++){
       var tag = parametres.exceptions[k].conditions[l].tag;
       var valeur = parametres.exceptions[k].conditions[l].valeur;
       if (tag == "serveur"){
         if (serveur == valeur){
           condition_check = true;
         }else{
           condition_check = false;
         }
       }else if (tag == "serveur_contient"){
           var posa = serveur.search(valeur);
            if (posa == -1){
              condition_check = false;
            }else{
              condition_check = true;
            }
       }else if (tag == "service"){
         if (service == valeur){
           condition_check = true;
         }else{
           condition_check = false;
         }
       }else if (tag == "service_contient"){
            var posb = service.search(valeur);
            if (posb == -1){
              condition_check = false;
            }else{
              condition_check = true;
            }
       }else if (tag == "description"){         
         if (status_information == valeur){     
           condition_check = true;
         }else if (tag == "description_contient"){
           condition_check = false;
         }else {
            var posc = status_information.search(valeur);
            if (posc == -1){
              condition_check = false;
            }else{
              condition_check = true;
            }
         }
       }
     }
     
     if (condition_check == true){
            var actions_tags = [];
            var actions_valeurs = [];
            for (var m=0; m < nb_actions; m++){
              var tag = parametres.exceptions[k].actions[m].tag;
              var valeur = parametres.exceptions[k].actions[m].valeur;
              if (valeur === undefined){
                valeur = "";
              }
              actions_tags[m] = tag;
              actions_valeurs[m] = valeur;
            }
            return {cas: "exception", actions_tags: actions_tags, actions_valeurs: actions_valeurs};
     }
   }
  
   if (condition_check == false){
     return {cas: "normal", actions_tags: "", actions_valeurs: ""};
   }
}

// sauvegarde des données utiles dans un cookie

function prenez_un_cookie(serveur,service,status_information,date_stamp,statut_id,actions_tags,actions_valeurs){
  
  var objtime = conversion_duree(date_stamp);
  var duree = objtime.duree;
  
  if (statut_id == 1){
    var statut = "WARNING";
  }else{
    var statut = "CRITICAL";
  }
  
  var cedata = serveur + "--" + service + "--" + status_information + "--" + duree + "--" + statut + "--" + actions_tags + "--" + actions_valeurs;
  var exdata = lire_cookie('donnees_eon');

  if (exdata == ""){
    creer_cookie('donnees_eon',cedata);
  }else{
    creer_cookie('donnees_eon',cedata + "||" + exdata);
  }
  
}


// obtention de la durée de l'alerte à partir de la donnée 'date de dernier changement' format timestamp

function conversion_duree(date_stamp){
  
  date_stamp = date_stamp*1000;
  
  var today_date = new Date();
  var today_stamp = today_date.getTime();

  var difference_ms = today_stamp - date_stamp;
  difference_ms = difference_ms/1000;

  var secondes = Math.floor(difference_ms % 60);
  difference_ms = difference_ms/60;

  var minutes = Math.floor(difference_ms % 60);
  difference_ms = difference_ms/60;

  var heures = Math.floor(difference_ms % 24);
  
  var jours = Math.floor(difference_ms/24);
  
  if (jours < 1){
     return {duree: heures + "h " + minutes + "min.", jours: jours, heures: heures};
  }else{
     return {duree: jours + "j, " + heures + "h " + minutes + "min.", jours: jours, heures: heures};
  }
  
}

// création ou édition d'un cookie

function creer_cookie(nom,valeur){
  var d = new Date();
  d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = ";expires="+d.toUTCString();
    document.cookie = nom + "=" + valeur + expires + ";path=/";
}

// suppression d'un cookie

function supprimer_cookie(nom){
  var d = new Date();
  d.setTime(d.getTime() - (365 * 24 * 60 * 60 * 1000));
  var expires = ";expires="+d.toUTCString();
  document.cookie = nom + "=" + expires + ";path=/";
}

// lecture d'un cookie

function lire_cookie(nom){
    var name = nom + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// obtention de la date de résolution attendue du ticket

function resolv_date() {
    var arr_month = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
    var d = new Date();
    if (d.getDay() >= 4) {
        d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
    } else {
        d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    }
    d = d.getDate() + "/" + arr_month[parseInt(d.getMonth())] + "/" + d.getFullYear() + " 01:00 AM";
    return d;
}

// liste des positions d'une valeur dans un tableau

function trouve_positions(tableau,valeur){
	var liste_positions = [];
	var position;
  var fin_boucle = false;
  var indice = 0;

  while (fin_boucle === false){
	  position = tableau.indexOf(valeur,indice);
	  if (position != -1){
		  liste_positions.push(position);
		  indice = position + 1;
	  }else{
		  fin_boucle = true;
	  }
  }
	return liste_positions;
}

// idem pour des valeurs similaires (selon un taux de similarité minimum entre 0 et 1)

function trouve_positions_similaires(tableau,valeur, minimum){
  var liste_positions = [];
  var similarite = 0;
  
  for (var i=0; i < tableau.length; i++){
      similarite = similarity(valeur,tableau[i]);
      if (similarite > minimum){
         liste_positions.push(i);
      }
  }
  return liste_positions;
}

// fonctions mesurant la similarité entre deux chaînes

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
