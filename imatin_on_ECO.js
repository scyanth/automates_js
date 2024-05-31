// main

var url = document.location.href;

if (url.substr(0,30) == "http://eco.url/"){
  
  var data = lire_cookie('incidents_im');
  var noms_blocs_str = lire_cookie('nomsblocs_im');
  
  var check_initial = lire_cookie('initial_im');
  var check_creation = lire_cookie('creation_im');
  var check_go_assign = lire_cookie('go_assign_im');
  var check_wait = lire_cookie('wait_im');
  var check_go_affect = lire_cookie('go_affect_im');
  var check_final = lire_cookie('final_im');

  if (data != ""){
     if (check_initial != ""){
        supprimer_cookie("initial_im");
        creer_cookie("creation_im","x");
       document.getElementById("create_link").click();
     }
  }else{
    if (check_initial != ""){
        supprimer_cookie("initial_im");
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
  
                var incidents = data.split('--');
                var noms_blocs = noms_blocs_str.split(',');
  
                // s'il n'y a plus d'incidents à créer, suppression du cookie est arrêt de la fonction
                if (incidents[0] === undefined){
                     supprimer_cookie("incidents_im");
                     supprimer_cookie("nomsblocs_im");
                     document.location.href = document.location.href;
                }
            
               // récupération des données du premier incident
               var bloc = incidents[0];
               var nom_bloc = noms_blocs[0];
            
                // suppression de l'item des tableaux
               incidents.splice(0,1);
               noms_blocs.splice(0,1);
            
               // mise à jour des cookies
               var neodata = incidents.join('--');
               var neonomsblocs = noms_blocs.join();
               creer_cookie("incidents_im",neodata);
               creer_cookie('nomsblocs_im',neonomsblocs);
            
               // création d'un titre global si plusieurs incidents (caisse générique XXXXX)
               var titre;
               if (bloc.indexOf(",") != -1){
                  titre = bloc.substring(0,bloc.indexOf(","));
                  titre = titre.substring(0,16) + "XXXX" + titre.substring(22,titre.length);
               }else{
                  titre = bloc;
               }
            
               // conversion des virgules en sauts de ligne
               var bloc_n = "";
               var bloc_ar = bloc.split(',');
               for (var i=0;i<bloc_ar.length;i++){
                   bloc_n = bloc_n + "\n" + bloc_ar[i];
               }
            
               // saisie du formulaire
               document.getElementById("customfield_10060:1").value = 581364;
               document.getElementById("customfield_10060:2").value = 581382;
               document.getElementById("summary").value =  "#incidentMatin# - " + titre;
               document.getElementById("description").value = "Bonjour,\n\nMerci de prendre en compte.\n\n" + nom_bloc + "\n" + bloc_n + "\n\nCordialement.";
               document.getElementById("priority").value = "1";
               document.getElementById("customfield_10001").value = "SEP";
               document.getElementById("customfield_10723").value = resolv_date();
       
               supprimer_cookie("creation_im");
               creer_cookie("go_assign_im","x");
               document.getElementsByName('Créer la demande')[0].click();
          }
      }
  }

  if (check_go_assign != ""){
      if (url.substr(0,36) == "http://eco.url/secure"){
          supprimer_cookie("go_assign_im");
          creer_cookie("wait_im","x");
      }
  }
  
  if (check_wait != ""){
    var aleatime = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
    setTimeout(function(){
            supprimer_cookie("wait_im");
            creer_cookie("go_affect_im","x");
            creer_cookie("service","SEP-SUPPORT");
            document.getElementById("action_id_61").click();
    }, aleatime);
  }
  
  if (check_go_affect != ""){
     if (url.substr(0,36) == "http://eco.url/secure"){
          supprimer_cookie("go_affect_im");
          creer_cookie("final_im","x");
      }
  }
  
  if (check_final != ""){
     supprimer_cookie("final_im");
     creer_cookie("initial_im","x");
     document.location.href = "http://eco.url/secure/Dashboard.jspa";
  }
  
  
}


// ---------------------------------------------------------------------------------------------------------------------------------------

// intégration du bouton global dans le bandeau haut d'ECO

function make_btn(){
  var btn = document.createElement("BUTTON");
  var t = document.createTextNode("All_imatin");
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
  h.innerHTML = "~~~~~~~~~~~~~~~~~~~~~Automate Incidents Matin~~~~~~~~~~~~~~~~~~~~~";
 
  var p = document.createElement("p");
  p.id = "p";
  p.innerHTML = "<strong>Copier ci-dessous l'intégralité du mail :";

  var input_zone = document.createElement("textarea");
  input_zone.id = "input_zone";
 
  var ppp = document.createElement("p");
  ppp.id = "pp";
  ppp.innerHTML = "<br/>";
  
  var bout = document.createElement("BUTTON");
  bout.appendChild(document.createTextNode("Démarrer"));
  bout.id = "bout";
  bout.onclick = function(){
    parser();
  }
  
  document.getElementById("dive").appendChild(h);
  document.getElementById("dive").appendChild(p);
  document.getElementById("dive").appendChild(input_zone);
  document.getElementById("dive").appendChild(ppp);
  document.getElementById("dive").appendChild(bout);
  
}

// ------------------------------------------------------------------------------------------------------------------------------------------

function parser(){
  var text = document.getElementById("input_zone").value;
  var lignes = text.split("\n");
  var intab = false;
  var endtab = false;
  var nom_bloc = "";
  var noms_blocs = [];
  var incidents = [];
  var bloc = [];
  var j;

  for (var i=0;i<lignes.length;i++){
      if (lignes[i] == "SESSION 	UPROC 	CAISSE 	PDATE 	HEURE 	N SESSION 	N UPROC 	STATUT"){
         if (lignes[i+1].indexOf("erreur") == -1){
            nom_bloc = lignes[i-2];
            intab = true;
            bloc = [];
         }
      }
      j = i+1;
      while (intab == true){
         if (lignes[j] == ""){
            intab = false;
            endtab = true;
         }else{
            bloc.push(lignes[j]);
         }
         j = j+1;
      }
      if (endtab == true){
          incidents.push(bloc);
          noms_blocs.push(nom_bloc);
          endtab = false;
      }
  }
  
 var noms_blocs_str = noms_blocs.join();
 var incidents_str;
 var bloc_str;
  
 for (var k=0;k<incidents.length;k++){
     bloc_str = incidents[k].join();
     if (incidents_str == undefined){
        incidents_str = bloc_str;
     }else{
        incidents_str = incidents_str + "--" + bloc_str;
     }
 }

 creer_cookie('incidents_im',incidents_str);
 creer_cookie('nomsblocs_im',noms_blocs_str);
 creer_cookie('initial_im','x');
  
 document.location.href = document.location.href;
  
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



