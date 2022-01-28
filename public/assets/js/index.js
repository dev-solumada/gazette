function openFile(file) {
  var f = new XMLHttpRequest();
  f.open("GET", file, false);
  f.onreadystatechange = function () {
    if(f.readyState === 4) {
        if(f.status === 200 || f.status == 0) {
          var res= f.responseText;
          document.getElementById('left-page').innerHTML = res;
          window.scrollTo(0, 0);
        }
    }
  }
  f.send(null);
}

/**
 * UPLOAD PDF
 */
 var img = document.getElementById("pdf");
 function uploadPDF(){
     document.getElementById("show").setAttribute("data",URL.createObjectURL(img.files[0]));
     document.getElementById("show").setAttribute("style", 'width:100% !important;height: 100vh;zoom: 0% !important;');
 }


 /**
  * Page
  * 
  */
 
// get all input values of page1
function getPage1Values() {
  const pays_input = document.getElementById("GAZC");                      
  const date_input = document.getElementById("GAZD");                      
  const number_input = document.getElementById("GAZN");                      
  const datep_input = document.getElementById("GAZP"); 
  const pdf_viewer = document.getElementById('show');

  var pays = pays_input.value;
  var date = date_input.value;
  var number = number_input.value;
  var date_p = datep_input.value;

  let validation = true;
  // vider la liste
  showWarnings();
  // gestion d'erreur
  if (pays.value === '') {
    showWarnings(pays_input, "Select the country.");
    validation = false;
  }
  if (number.trim().length == 0) {
    showWarnings(number_input, "Number of Gazette is empty.");
    validation = false;
  }
  if (!isDate(date)) {
    showWarnings(date_input, "Date of Gazette is invalid.");
    validation = false;
  }
  if (!isDate(date_p)) {
    showWarnings(datep_input, "Date of Publication is invalid.");
    validation = false;
  }
  // non fichier séléctionné
  if(pdf_viewer.data.includes('/pdf_paceholder.png')) {
    showWarnings(pdf_viewer, 'Please, open a PDF file.')
    validation = false;
  }

  /* Affiche le popup */
  let ul = document.createElement('ul');
  var wul = document.querySelectorAll('#warnings-ul > li');
  for (const li_ of wul) {
    let li = document.createElement('li');
    li.innerHTML = li_.childNodes[0].textContent;
    li.className = 'text-start text-danger';
    ul.appendChild(li);
  }
  if (!validation) {
    swal({
      title: "Are you sure to pass this step?",  
      text: "There are some warnings:", 
      icon: "warning",
      content: ul,
      buttons: {
        cancel: "No",
        confirm: "Yes"
    }
    }).then( val => {
      if(val) {
        // go to next
        // local storage variables
        localStorage.setItem('GAZC', pays);
        localStorage.setItem('GAZD', date);
        localStorage.setItem('GAZN', number);
        localStorage.setItem('GAZP', date_p);
        showWarnings();
        openFile('plateforme/page2.html');
        // afficher les chapitre valable pour le pays séléctionné
        displayAvailableChapters(localStorage.getItem('GAZC').toUpperCase());
      }
    }); 
  } else {
    // local storage variables
    localStorage.setItem('GAZC', pays);
    localStorage.setItem('GAZD', date);
    localStorage.setItem('GAZN', number);
    localStorage.setItem('GAZP', date_p);
    showWarnings();
    openFile('plateforme/page2.html');
    // afficher les chapitre valable pour le pays séléctionné
    displayAvailableChapters(localStorage.getItem('GAZC').toUpperCase());
  }
  
}

// vérifier une date
const isDate = (date) => {
  return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

var Pages = {}

// get all input values of page2
function getPage2Values() {
                        
  var chap = document.getElementById("chapitre").value;
  
  // local storage variables
  localStorage.setItem('chap', chap);

  openFile('plateforme/page3.html');
  // fonction venant du fichier main.js
  // storer une forme de page
  main();
  localStorage.setItem('current-pageId', 0);
  // toutes les pages origines
  Pages.ident1 = document.getElementById('ident-col-1').innerHTML;
  Pages.ident2 = document.getElementById('ident-col-2').innerHTML;
  if (document.getElementById('applicant-field')){
    Pages.app = document.getElementById('applicant-field').innerHTML;
  }
  else{
    Pages.app = null;
  }
  if (document.getElementById('owner-field')){
    Pages.owner = document.getElementById('owner-field').innerHTML;
  }
  else{
    Pages.owner = null;
  }
  if (document.getElementById('agent-field')){
    Pages.agent = document.getElementById('agent-field').innerHTML;
  }
  else{
    Pages.agent = null;
  }
  Pages.nice = document.getElementById('nice-field').innerHTML;
  if (document.getElementById('powner-field')){
    Pages.powner = document.getElementById('powner-field').innerHTML;
  }
  else{
    Pages.powner = null;
  }

  alert('go')
  // afficher les chapitres sur next chapter
  displayAvailableChaptersForNext(chap, localStorage.getItem('GAZC').toUpperCase());

}

// revenir dans la première page
function previousToPage1() {
  openFile('plateforme/page1.html');
  let country = localStorage.getItem('GAZC');
  if (country) document.getElementById('GAZC').value = country;
  let date = localStorage.getItem('GAZD');
  if (date) document.getElementById('GAZD').value = date;
  let datep = localStorage.getItem('GAZP');
  if (datep) document.getElementById('GAZP').value = datep;
  let number = localStorage.getItem('GAZN');
  if (number) document.getElementById('GAZN').value = number;
}

// revenir dans la deuxième page
function previousToPage2() {
  if (confirm("Do you want to exit this page? Some recordings may be lost.")) {
    numberOfPage = 1;
    let page = document.getElementById('left-page');
    let pageLeft = page.innerHTML;
    localStorage.setItem('pageLeft', pageLeft);
    document.getElementById('warnings-ul').innerHTML = '';
    openFile('plateforme/page2.html');
    // afficher les chapitre valable pour le pays séléctionné
    displayAvailableChapters(localStorage.getItem('GAZC').toUpperCase());
    // select by value
    let selected_chap = localStorage.getItem('chap');
    if (selected_chap)
      document.getElementById('chapitre').value = selected_chap;
  }
}

/**
 * Fonction pour afficher les erreurs sur les champs.
 * @param {DOM} input 
 * @param {String} message 
 * @returns 
 */
const showWarnings = (input = null, message = '') => {
  let warning_ul = document.getElementById('warnings-ul');
  if (input === null && message === '') {
    if (document.getElementById("already").value == ""){
      warning_ul.innerHTML = '';
    }
    else{
      warning_ul.innerHTML = "<li style ='font-weight:500;' class='col-md-6 succes' >"+ document.getElementById("already").value+"</li>";
    }
    for (const i of document.querySelectorAll('.select')) {
      // supprimer la class invalid
      i.classList.remove('is-invalid');
    }
    return;
  } 

  let li = document.createElement('li');
  li.className = 'col-md-3 error';
  let label = document.createElement('label');
  label.className = 'error';
  label.textContent = message;
  label.style.fontWeight = '500';
  label.style.cursor = 'pointer';
  
  if (!input.hasAttribute('data') && input.type !== 'file')  {
    input.classList.add('is-invalid');
  }
  // evénement pour faire un focus sur le champ
  label.onclick = () => {
    if (!input.hasAttribute('data')) input.focus();
    else document.getElementById('pdf').click();
  }
  li.append(label);
  warning_ul.appendChild(li);

}


// download xml file
function downloadXML() {
  // changement sur le priorities
  localStorage.setItem('GAZD', document.getElementById('GAZD').value);
  localStorage.setItem('GAZN', document.getElementById('GAZN').value);

  // verication des champs
  let validation = true;
  showWarnings(); // balayer le champ pour warnings
  for (const input of document.querySelectorAll('.select')) {
    if (!input.disabled)
      if (input.type === 'date') { // verifier date
        if (! isDate(input.value)) {
          showWarnings(input, `The field ${input.name} has an invalid date.`);
          validation = false;
        }
      } else {
        if (input.value.trim().length === 0) {
          let textid = input.id.split('-')[0] + ' at row ' +  (parseInt(input.id.split('-')[1]) + 1);
          showWarnings(input, `The field ${input.name !== '' ? input.name : textid} has an empty value.`);
          validation = false;
        }
      }
  }
  
  /* Affiche le popup */
  let ul = document.createElement('ul');
  var wul = document.querySelectorAll('#warnings-ul > li');
  for (const li_ of wul) {
    let li = document.createElement('li');
    li.innerHTML = li_.childNodes[0].textContent;
    li.className = 'text-start text-danger';
    ul.appendChild(li);
  }

  // effacer tous les avertissements
  document.getElementById('warnings-ul').innerHTML = '';

  if (!validation) {
    swal({
      title: "Are you to download the file?",  
      text: "There are some warnings:", 
      icon: "warning",
      content: ul,
      buttons: {
        cancel: "No",
        confirm: "Yes"
      }
    }).then( val => {
      if(val) {
        // country
        let GAZC = localStorage.getItem('GAZC');
        // chapter
        let chapter = localStorage.getItem('chap');
        // gazette number
        let GAZN = localStorage.getItem('GAZN');
        // gazette date
        const dateStr = localStorage.getItem('GAZD');
        let GAZD = dateStr.replace('-', '').replace('-', '');
        if (localStorage.getItem('version') != 1 ){
          download(document.forms[0], `${GAZC}_${GAZD}_${GAZN}_V${localStorage.getItem('version')}`);
          sendRequest("/download",document.getElementById("pdf").files[0].name);
        }
        else{
          download(document.forms[0], `${GAZC}_${GAZD}_${GAZN}`);
          sendRequest("/download",document.getElementById("pdf").files[0].name);
        } 
      }
    });
  }
  // si tous ont été validés
  else {
    // country
    let GAZC = localStorage.getItem('GAZC');
    // chapter
    let chapter = localStorage.getItem('chap');
    // gazette number
    let GAZN = localStorage.getItem('GAZN');
    // gazette date
    const dateStr = localStorage.getItem('GAZD');
    let GAZD = dateStr.replace('-', '').replace('-', ''); 
    // telecharger les ficher zip et xml
    if (localStorage.getItem('version') != 1 ){
      download(document.forms[0], `${GAZC}_${GAZD}_${GAZN}_V${localStorage.getItem('version')}`);
      sendRequest("/download",document.getElementById("pdf").files[0].name);
    } else {
      download(document.forms[0], `${GAZC}_${GAZD}_${GAZN}`);
      sendRequest("/download",document.getElementById("pdf").files[0].name);
    }
  } 
}
//sending request in server
function sendRequest(url,filename) {
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded"
  );
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.location = "/";
    }
  };
  http.send("filename=" + filename +"&version="+localStorage.getItem('version'));
}

var numberOfPage = 1;
function nextIdentifier(id = 1,e) {
  if (Object.keys(Pages).length === 0) return;
  id = parseInt(id);
  const prevId = id - 1;
  // elements à ajouter
  // cacher le prev page
  if (e === "add"){

    const pageField = document.getElementById('ident-page-'+ prevId);
    pageField.classList.add('hidden-page');
    const page = `
    <div class="row mt-0">
      <div class="col-12 p-1">
        <fieldset id="ident-${id}" class="">
          <legend class="text-end"><img src="assets/images/Delete-icon.png" class="btn" alt="..." width="24" height="24" onclick="deletePage(${id})"></legend>
          <div class="row">
            <div class="col-md-7 col-lg-7 col-xl-7 p-0">
              ${Pages.ident1 ? Pages.ident1 : ''}
            </div>
            <div class="col-md-5 col-lg-5 col-xl-5  p-0">
              ${Pages.ident2 ? Pages.ident2 : ''}
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 p-1">
              ${Pages.app ? Pages.app : ''}
            </div>
          </div>
      
          <div class="row">
            <div class="col-md-12 p-1">
              ${Pages.owner ? Pages.owner : ''}
            </div>
          </div>
      
          <div class="row">
            <div class="col-md-12 p-1">
              ${Pages.agent ? Pages.agent : ''}
            </div>
          </div>
      
          <div class="row">
            <div class="col-md-12 p-1">
              ${Pages.nice ? Pages.nice : ''}
            </div>
          </div>

          <div class="row">
            <div class="col-md-12 p-1">
              ${Pages.powner ? Pages.powner : ''}
            </div>
          </div>
        </fieldset>
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-12 p-1">
        <!-- Boutton next and previous -->
        <div class="text-end p-1 mt-2" id="ident-1-button">
          <small class="float-start text-muted">Number of page: <span id="ident-page-nbr-${id}"></span></small>
          <button type="button" onclick="prevIdentifier('${id}')" class="btn btn-warning"><B class="text-white">&xlArr; Previous</B></button>
          <span class="badge bg-dark">${id+1}</span>
          <button type="button" onclick="nextIdentifier('${id+1}','next')" class="btn btn-warning"><B class="text-white">Next &xrArr;</B></button>
          <button type="button" style="display: none;"  name="addpage" onclick="nextIdentifier('${id+1}','add')" class="btn btn-success"><B class="text-white">Add Page &xrArr;</B></button>
        </div>
      </div>
    </div>
    `;
    const div = document.createElement('div');
    div.id = 'ident-page-'+id;
    div.className = 'ident-pages';
    // page à remplir
    div.innerHTML += page;
    pageField.after(div);
    document.getElementsByName("addpage")[0].setAttribute("style","display:none;");
    for (i=0;i<document.getElementsByName("addpage").length - 1;i++){
      document.getElementsByName("addpage")[i].style.display = "none";
    };
    document.getElementsByName("addpage")[document.getElementsByName("addpage").length - 1].setAttribute("style","display:block;");
    numberOfPage += 1 ;
  }
  else{
    if (document.getElementById('ident-page-'+id)){
      const pageField = document.getElementById('ident-page-'+ prevId);
      pageField.classList.add('hidden-page');
        // document.querySelectorAll('.image')[id].src = 'assets/images/placeholder.png';
     const p = document.getElementById('ident-page-'+id);
     if (p) p.classList.remove('hidden-page');
    }
    else{
      alert("No page, please add another one");
    }
     
  }

   
   
  // afficher le nombre de page
  const pageNbr = document.getElementById('ident-page-nbr-'+ id)
  if (pageNbr) pageNbr.textContent = numberOfPage;
  
  // set current page Id
  localStorage.setItem('current-pageId', id);
  
} 

function prevIdentifier(id = 1) {
  // cacher la page
  let prevPageContent = document.getElementById('ident-page-'+ id);
  prevPageContent.classList.add('hidden-page');
  id = parseInt(id);
  let pageId = id - 1;

  let pageContent = document.getElementById('ident-page-'+ pageId);
  if  (pageContent)
    // afficher la page 
    pageContent.classList.remove('hidden-page');

  // set current page Id
  localStorage.setItem('current-pageId', pageId)

  // afficher le nombre de page
  const pageNbr = document.getElementById('ident-page-nbr-'+ pageId)
  if (pageNbr) pageNbr.textContent = numberOfPage;

}

var pagedeleted = [];
// fonction pour supprimer une page ajouté
function deletePage(id) {
  numberOfPage -= 1;
  prevIdentifier(id);
  document.getElementById('ident-page-'+ id).remove();
  const pageNbr = document.getElementById('ident-page-nbr-'+ id)
  if (pageNbr) pageNbr.textContent = numberOfPage;
  pagedeleted.push(id);
  document.getElementsByName("addpage")[document.getElementsByName("addpage").length - 1].setAttribute("style","display:block;");
}


/**
 * Bouton annuler
 */
function cancel() {
  swal({
    title: "Are you sure to cancel?",
    text: "Once canceled, you will no longer be able to recover the data!",
    icon: "warning",
    buttons: {
      cancel: "No",
      confirm: "Yes",
    },
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      window.location.href = '/';
    } else {
      swal("Your data is safe!");
    }
  });
}

/**
 * Chapitre suivant
 */

function nextChapter() {
  // enregistrer les données en xml
  fromToXml(document.forms[0]);

  console.log(xmldata)
  previousToPage2();
}