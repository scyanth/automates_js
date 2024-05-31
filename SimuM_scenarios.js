var url = document.location.href;

// pour tout le site simu.m

if (url.substr(0,33) == "https://simumep.m.fr" || url.substr(0,19) == "https://simu.m.fr"){
  
    // page de connexion : boutons pour choisir et actionner le script du scénario fonctionnel
  if (url.substr(url.length - 9) == "modalId=2"){
    window.onload = function () {
      make_btn("POR-P6");
      make_btn("PF_TLS_extranet(s2)");
   }
    // page de suivi de mes demandes de prestations (ne concerne que por-p6)
  }else if (url == "https://simumep.m.fr/z84sdd/app/"){
     window.onload = function () {
     // validation du bon fonctionnement
     var retVal = confirm("Scénario 1 Etape 2 : valider le bon chargement de la page puis continuer. Scénario 3 : annuler pour s'arrêter à cette page.");
       if (retVal == true){
         document.location.href = "https://simumep.m.fr/lfy/group/es-pa/msel?domaine=fam%2C%20lgm";
       }
     } // page de menu des services d'aide au lgm (ne concerne que por-p6)
  }else if (url == "https://simumep.m.fr/lfy/group/es-pa/msel?domaine=fam%2C%20lgm"){
    window.onload = function () {
      // accès à la demande d'aide au lgm
      document.getElementsByClassName("flex-column col-md-4")[3].getElementsByTagName("a")[0].click();
    }
    // pages du formulaire de demande d'aide au lgm (ne concerne que por-p6)
  }else if (url.substr(0,44) == "https://simumep.m.fr/pw0aielgt") {
    por_p6_formulaire();
    // page de déclaration trimestrielle (ne concerne que pf_tls_extranet)
  }else if (url == "https://simumep.m.fr/pw3drrsa/"){
    document.getElementsByClassName("button")[1].click();
  
  }else{
    // vérification du compte connecté
    var compte = document.getElementsByClassName("name")[0].innerHTML;
  
    // cas de por-p6
    if (compte == "GAB PORPS-SCENARIO-DISPOSLE"){
      // go étape 2 (l'étape 1 n'étant que la connexion)
      document.location.href = "https://simumep.m.fr/z84sd/app/";
    // cas de pf-tls-extranet (scénario 2)
    }else if (compte == "SERGE VOLLE"){
      document.location.href = "https://simumep.m.fr/pw3trrsa/";
    }
  }
  
}

// fonction déroulant l'étape 3 du scénario 1 de por_p6 (formulaire de demande d'aide au lgm)

function por_p6_formulaire(){
  
  // accueil du formulaire
  if (url == "https://simumep.m.fr/pw0aidelg/Accueil.do"){
    document.getElementsByClassName("FBE_ALIGN_LEFT")[0].click();
  }else{
    // vérification de l'étape
    var nom_etape = document.getElementsByClassName("etape active")[0].getElementsByClassName("nomEtape")[0].innerHTML;
    
    if (nom_etape == "fam"){
      
      document.getElementsByTagName("input")[5].checked=1;
      document.getElementsByTagName("input")[8].checked=1;
      document.getElementsByTagName("input")[10].checked=1;
      document.getElementsByTagName("input")[13].click();
      
    }else if (nom_etape == "adr"){
      
      document.getElementsByTagName("input")[12].checked=1;
      document.getElementsByTagName("input")[16].click();
      
    }else if (nom_etape == "lgm"){
      
      var sous_etape = document.getElementsByClassName("PANEL")[1].getElementsByClassName("PANEL")[0].innerHTML;
      
      if (sous_etape == "Informations générales"){
              document.getElementsByTagName("input")[5].checked=1;
              var datej = new Date();
              var nsemainej = datej.getDay();
              var jourj = datej.getDate();
              var moisj = datej.getMonth() + 1;
              var anj = datej.getFullYear();
              if (nsemainej == 1){
                 var jourh = jourj - 3;
              } else {
                 var jourh = jourj - 1;
              }
              if (jourh < 10){
                 var sjourh = "0" + String(jourh);
              }else{
                 var sjourh = String(jourh);
              }
              if (moisj < 10){
                 var smoisj = "0" + String(moisj);
              }else{
                 var smoisj = String(moisj);
              }
              var sdateh = sjourh + "/" + smoisj + "/" + String(anj);
              document.getElementsByTagName("input")[7].value = sdateh;
              document.getElementsByTagName("input")[10].value = "45";
              document.getElementsByTagName("input")[25].click();
     
      }else{
              document.getElementsByTagName("input")[15].click();
      }
      
    }else if (nom_etape == "Récapitulatif"){
      document.getElementsByTagName("input")[5].checked = 1;
      document.getElementsByTagName("input")[7].click();
    }
  }
  
}

// fonction des boutons de connexion à simu.m aux comptes des scénarios fonctionnels

function make_btn(btn_name){
  var btn = document.createElement("BUTTON");
  var t = document.createTextNode(btn_name);
  btn.appendChild(t);
  btn.style.cssText = "border: none;margin: 10px 10px;font-size: 14px;display: inline-block;color: black;padding: 5px 5px;text-align: center;background-color: grey;";
  document.getElementsByClassName("text")[0].appendChild(btn);
  
  if (btn_name == "POR-P6"){
    btn.onclick = function(){
      document.getElementById("_58_login").value = "1900106190190";
      document.getElementById("_58_password").value = "ScenFctP6";
      document.getElementsByClassName("btn btn-primary")[0].click();
    }
  }
  
  if (btn_name == "PF_TLS_extranet(s2)"){
    btn.onclick = function(){
      document.getElementById("_58_login").value = "0281000006214";
      document.getElementById("_58_password").value = "simupaje";
      document.getElementsByClassName("btn btn-primary")[0].click();
    }
  }

}