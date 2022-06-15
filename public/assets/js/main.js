
/** */
var xmldata=['<?xml version="1.0"?>'];

/**
 * Download xml file
 * @param {*} contentType 
 * @param {*} data 
 * @param {*} filename 
 */
function downloadData(contentType,data,filename){
    // console.log(StringToXML(data)); 
    let file = new File([data] 
               , "xmlfile.xml", {type:"application/xml"}); 
     
    let url = URL.createObjectURL(file); 
    console.log(encodeURI("data:"+contentType+","+data));
    var link=document.createElement("A");
    link.setAttribute("href", url);
    link.setAttribute("style","display:none");
    link.setAttribute("download",filename);
    document.body.appendChild(link);                                                        //needed for firefox
    link.click();
    setTimeout(function(){
      document.body.removeChild(link);
    },1000);
}
function StringToXML(oString) {
  //code for IE
  if (window.ActiveXObject) { 
  var oXML = new ActiveXObject("Microsoft.XMLDOM"); oXML.loadXML(oString);
  return oXML;
  }
  // code for Chrome, Safari, Firefox, Opera, etc. 
  else {
  return (new DOMParser()).parseFromString(oString, "text/xml");
  }
 }

function fromToXml(form){
  var xmldata=['<?xml version="1.0" encoding="UTF-8" ?>'];
  xmldata.push("<form>");
  xmldata.push('\t<InfoGazette>');
  var inputs=form.elements;
  var eltab = '\t\t';
  for(var i=0;i<inputs.length;i++){
    // create chapter tag
    if (inputs[i].name === 'chapters') {
      xmldata.push(`\t<chapter name="${inputs[i].name}" value="${new String(inputs[i].value)}">`);
      continue;
    }
    // create mark tag
    if (inputs[i].id === 'start_mark')
      xmldata.push(`\t\t<mark>`);
    // create element tag
    var el=document.createElement("ELEMENT");
    if (inputs[i].name && !inputs[i].disabled){
      el.setAttribute("name",inputs[i].name);
      el.setAttribute("value", new String(inputs[i].value));
      xmldata.push(eltab + el.outerHTML);
    }
    if (inputs[i].name === '400-publication') {
      eltab = '\t\t\t';
    }
    // close InfoGazette tag
    if (inputs[i].name === '400-publication')
      xmldata.push('\t</InfoGazette>');
    // close mark tag
    if (inputs[i].id === 'end_mark')
      xmldata.push('\t\t</mark>');
    // close chapter tag
    if (inputs[i].id === 'end_chap')
      xmldata.push('\t</chapter>');

  }
  xmldata.push("</form>");
  return xmldata.join("\n");
}

// fonction pour compresser les images
function zipImageFile(fileName) {
  var zip = new JSZip();
  let i = 1;
  for (const input of document.querySelectorAll('.inputFile')) {
    const file = input.files[0];
    const fileName = `${file.name.split('.')[0]}_${i}.${file.name.split('.')[1]}`;
    zip.file(fileName, file);
    i++;
  }
  zip.generateAsync({
      type: "base64"
  }).then(function(content) {
      var link = document.createElement('a');
      link.href = "data:application/zip;base64," + content;
      link.download = fileName+".zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  });       
}

// télécharger le fichier xml et compresser les images
function download(frm, fileName){
  var data=fromToXml(frm);
  downloadData("text/xml",data,fileName + ".xml");
}



/**
 * Gestion d'erreur sur les champ
 * @param {*} e 
 */

/* Champ de type number entre 0 et 45 */
function check511Value(input) {
  if (input.value < 0) input.value = 0;
  else if (input.value > 45) input.value = 45;
  else input.value = parseInt(input.value);
}


function showError(input, message) {
  let p = document.createElement('p');
  let small = document.createElement('small');
  p.style.color = 'red';
  p.style.margin = 0;
  small.textContent = message;
  p.appendChild(small);
  // remove error
  if (input.parentElement.childElementCount === 2)
    input.parentElement.removeChild(input.parentElement.childNodes[1]);
  // display error
  input.parentNode.appendChild(p);
}

function uploadImageFile() {
  var inputFile = document.querySelector("#inputFile");
  var file = inputFile.files[0];
  if (typeof file !== 'undefined') { // si une image est séléctionnée
    if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.querySelector('#image').setAttribute('src', e.target.result);
        // document.querySelector('#imagePath').setAttribute('value', e.target.result);
      }
      reader.readAsDataURL(file);
    } else {
      alert('This field accept only an image file!');
      inputFile.value = null;
    }
  } else { // afficher la source par défaut
    document.querySelector('#image').setAttribute('src', 'assets/images/placeholder.png');
  }
}


/**
 * 
 * SELECTION D'UNE LANGUE
 * 
 */
function showCountryLangue() {
  const LANG = ['DZ', 'TN', 'TRNC', 'MS', 'LS', 'SZ', 'MG', 'MM', 'GM'];
  const country_select = document.getElementById('country');
  displayInSelect(country_select, LANG);
}
// fonction pour afficher les langues dans le champ select

// 

/**
 * Fonction pour afficher une liste sur une balise select
 * @var select input
 * @var array variable de type table qui contient les informations à afficher.
 */

 function displayInSelect(select, array) {
  // vider le champ select
  if (!select) return;
  select.innerHTML = '';
  array = array.sort();
  for (let i = 0; i < array.length; i++) {
    let option = document.createElement('option');
    option.value = array[i];
    option.textContent = array[i];
    select.appendChild(option);
  }
}

// toutes les fonctions qui doivent dès que l'application démarre.
function main() {
  // get LocalStorage variable
  let pays = localStorage.getItem('GAZC');
  let chap = localStorage.getItem('chap');
  let chapId = chap.toUpperCase().split('_')[0];
  if (chapId.includes("APP")){
    disableFields(["111","141","151","156","171","176","180","186",]);
  }
  // functions 
  callScripts();
  tableScript();
  showCountryLangue();
  displayGazetteInfo();
}

/**
 * Fonction pour désactiver les champs par id
 * @param {array} fieldsId 
 */
 const disableFields = function(fieldsId = []) {
  var agentfield=0;
  var nicefield = 0;
  fieldsId.forEach(el => {
    if ($(`#${el}`).attr('name') == "740" || $(`#${el}`).attr('name') == "750" || $(`#${el}`).attr('name') == "770"){
      agentfield++;
    }
    else{
      if ($(`#${el}`).attr('name') == "511" || $(`#${el}`).attr('name') == "510"){
       nicefield++;
    }
    else{
      if ($(`#${el}`).attr('name') == "541"){
          if ($(`#${el}`).prop('disabled') === false){
            document.getElementById('trademark').remove();
            document.getElementById("ident-col-1").setAttribute("class","col-md-12 col-lg-12 col-xl-12 p-1")
          }
      }
      else{
        $(`#${el}`).parent().parent().remove();
        $(`#${el}`).attr('class', '');
      }
    }
    }
   
    // specified for applicant 
    let name = document.getElementsByName(el)[0];
    if (name) name.disabled = true;
    if (el === '731') {
      document.getElementById("applicant-field").remove();
    } else if (el === '732') {
      document.getElementById("owner-field").remove();
    }
  });
  if (agentfield >= 3){
    document.getElementById('agent-field').remove();
  }
  if (nicefield >= 2){
    document.getElementById('nice-field').remove();
  }
}

// disable fields applicant or owner
function disableSpecifiedField(name) {
  document.getElementById('name'+name+'-0').disabled = true;
  document.getElementById('address'+name+'-0').disabled = true;
  document.getElementById('country'+name+'-0').disabled = true;
}

// <!-- Script to allow copy/paste in input type of date -->
function callScripts() {
  $(() => {
      $(document).on("keydown", "input[type=date]", function (e) {
          if (e.ctrlKey === true) {
              if (e.keyCode === 67) {
                  $(this).attr("type", "text").select();
                  document.execCommand("copy");
                  $(this).attr("type", "date");
              }
          }
      });
      $(document).bind("paste", function (e) {
          let $input = $(document.activeElement);
          if ($input.attr("type") === "date") {
              let dateString = e.originalEvent.clipboardData.getData('text').trim();
              if (dateString.includes('-') || dateString.includes('/')) {
                  let [dd, mm, yyyy] = dateString.includes('-') ? dateString.split("-") : dateString.split("/");
                  let date = new Date(`${yyyy.trim()}-${mm.trim()}-${dd.trim()}`);
                  if (date != "Invalid Date")
                      $input.val(date.toISOString().split('T')[0]);
              }
          }
      });
      
      let inputs = document.querySelectorAll('.select');
      let i = 0;
      for (const input of inputs) {
        if (i < inputs.length - 1) {
          const nextInput = inputs[i+1];
          input.addEventListener("keyup", function (e) {
            e.preventDefault();
              if (e && e.keyCode == 13) {
                nextInput.focus();
              }
          });
        }
        i++;
      }
  });
}

function displayGazetteInfo() {
  // chapitre
  let chap_input = document.getElementById('chapter');
  if (chap_input)
    chap_input.innerHTML = `<option value="${localStorage.getItem('chap')}">${localStorage.getItem('chap').toUpperCase()}</option>`;
  // afficher pays
  let country_input = document.getElementById('GAZC')
  if (country_input)
    country_input.value = `${localStorage.getItem('GAZC')}`;
  // afficher number
  let number_input = document.getElementById('GAZN')
  if (number_input)
    number_input.value = localStorage.getItem('GAZN');
  // afficher date
  let date_input = document.getElementById('GAZD')
  if (date_input)
    date_input.value = localStorage.getItem('GAZD');
    // date of pub
  let datep_input = document.getElementById('GAZP')
  if (datep_input)
    datep_input.value = localStorage.getItem('GAZP');
}

function getAvailableChapter(country) {
  var obj = {}
  switch (country) {
    case 'DZ': // for DZ
    obj['Registration'] = ['REG'];
    obj['Renewal'] = ['REN'];
      break;
    case 'TN': // for TN
    obj['Application'] = ['APP_T','APP_M', 'APP_E'];
    obj['Changes/Corrrections/Concelations'] = ['COR'];
    obj['Renewal'] = ['REN'];
      break;
    case 'MG': // for MG
    obj['Changes/Corrrections/Concelations'] = ['COM'];
    obj['Registration'] = ['REG', 'REG_M'];
      break;
    case 'MM': // for MM
    obj['Application'] = ['APP'];
      break;
    case 'TRNC': // for TRNC
    obj['Application'] = ['APP'];
    obj['Changes/Corrrections/Concelations'] = ['ADD', 'TRA', 'CAN'];
    obj['Renewal'] = ['REN'];
      break;
    case 'MS': // for MS
    obj['Application'] = ['APP'];
    obj['Changes/Corrrections/Concelations'] = ['CAN', 'COR', 'RES'];
    obj['Registration'] = ['REG'];
    obj['Renewal'] = ['REN'];
      break;
    case 'GM': // for GM
    obj['Application'] = ['APP'];
      break;
    case 'LS': // for LS
    obj['Application'] = ['APP'];
    obj['Changes/Corrrections/Concelations'] = ['ASS', 'MER', 'RUSER', 'ADD'];
    obj['Registration'] = ['REG'];
    obj['Renewal'] = ['REN'];
      break;
    case 'SZ': // for SZ
    obj['Application'] = ['APP'];
    obj['Registration'] = ['REG'];
    obj['Renewal'] = ['REN'];
      break;
  }
  return obj;
}

function displayAvailableChapters(country = 'DZ') {
  var obj = getAvailableChapter(country);
  // création d'élément et affichage des chapitres
  let chapter_select = document.getElementById('chapitre');
  chapter_select.innerHTML = '';
  Object.keys(obj).forEach(key => {
    let optgroup = document.createElement('optgroup');
    optgroup.label = key;
    obj[key].forEach(value => {
      let option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      optgroup.append(option);
    });
    chapter_select.appendChild(optgroup);
  });
}

function displayAvailableChaptersForNext(activeChapter, country) {
  var obj = getAvailableChapter(country);
  // création d'élément et affichage des chapitres
  let chapter_select = document.querySelector('#nextchap');
  chapter_select.innerHTML = '<option value=""></option>';
  Object.keys(obj).forEach(key => {
    let optgroup = document.createElement('optgroup');
    optgroup.label = key;
    obj[key].forEach(value => {
        let option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        optgroup.append(option);
    });
    chapter_select.appendChild(optgroup);
  });
}

//add image screenshoot
window.addEventListener("paste", e => {
  const pays = localStorage.getItem('GAZC');
  const chap = localStorage.getItem('chap');
 
  if (pays === 'TN' && chap === 'REN') return;
  // get current image and input file
  const pageId = parseInt(localStorage.getItem('current-pageId')) || 0;
  if (e.clipboardData.files.length > 0) {
      if (clickedImg) {
        let inputFile = clickedImg.nextSibling;
        while (inputFile.type !== 'file') {
          inputFile = inputFile.nextSibling;
        }
      }
      
      if (e.clipboardData.files[0].type.startsWith("image/")) {
        setPreviewImage(e.clipboardData.files[0])
      }
  }

  function setPreviewImage(file) {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (clickedImg) {
        clickedImg.src = fileReader.result;
        clickedImg.removeAttribute("width");
        clickedImg.removeAttribute("height");
        let inputFilehidden = clickedImg.nextElementSibling;
        while (inputFilehidden.type !== 'hidden') {
          inputFilehidden = inputFilehidden.nextElementSibling;
        }
        inputFilehidden.value = fileReader.result;
        
        // reset to null the image
        clickedImg.classList.remove('img-focused');
        clickedImg = null;
      }
    }
  }

});


/**
 * Evenement sur image 
 */
var clickedImg = null;
// envent handler
function handler(img) {
  if (clickedImg) clickedImg.classList.remove('img-focused') 
  if (clickedImg === img) {
    clickedImg = null;
  } else {
    img.classList.add('img-focused');
    clickedImg = img;
  }
}



/**
 * Save data
 */

function saveData() {
  swal({
    title: "Do you want to save your data?",  
    text: "", 
    icon: "warning",
    content: '',
    buttons: {
      cancel: "No",
      confirm: "Yes"
    }
  }).then( val => {
    if (val) {
      backupData();
    }
  });
}

function backupData(bool = false) {
  const selects = document.querySelectorAll('#gazette-form .select');
  for (let i = 0; i < selects.length; i++) {
    selects[i].classList.add('saved-' + (i+1));
    if (selects[i].type === 'textarea') {
      selects[i].textContent =  selects[i].value;
    } else {
      selects[i].setAttribute('value', selects[i].value);
    }
  }
  const data = document.getElementById('left-page').innerHTML;

  const fileName = localStorage.getItem('pdf_name');
  const prevchap = localStorage.getItem('prevchap');
  const GAZC = localStorage.getItem('GAZC');
  var filepath = `${fileName}__${GAZC}__${prevchap}`;
  var html = new String(data).replace(/\n/g, "");
      html = html.replace(/\t/g, "");
  sendDataRequest('/save', filepath, html, bool);
}

//sending request in server
function sendDataRequest(url, filename, data, redirect) {
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader(
    "Content-type",
    "application/json"
  );
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let json = JSON.parse(this.responseText);
      if (json.status === 'ok') {
        // set local storage
        localStorage.setItem('file_saved', json.file.filename);
        swal({
          title: "Your data is successfully saved!",  
          text: "", 
          icon: "success",
          buttons: {
            confirm: 'OK'
          }
        }).then(val => {
          if (redirect) {
            window.location = "/";
          }
        })
      } else {
        swal({
          title: "Backup failure!",  
          text: "Failed to save sata. Please retry.", 
          icon: "error",
          buttons: {
            confirm: "OK"
          }
        })
      }
    }
  };
  let json = JSON.stringify({filename: filename, data: data, oldfilename: localStorage.getItem('file_saved')})

  http.send(json);
}

function checkSaveRequest(url,filename) {
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader(
    "Content-type",
    "application/x-www-form-urlencoded"
  );
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let json = JSON.parse(this.responseText);
      if (json.status === 'ok') {
        let file = json.file;
        localStorage.setItem('file_saved', file.filename);
        let d = file.filename.split('--!')[1].split('.')[0];
        let filedate = new Date(parseInt(d));
        let datenow = new Date(Date.now());
        let timeDiff = Math.abs(filedate.getTime() - datenow.getTime());
        var diffDays = timeDiff / (1000 * 3600 * 24); 
        let dayleft = Math.ceil(121 - diffDays)
        var warn = dayleft + (dayleft < 2 ? ' day' : ' days') + ' remaining' ;
        swal({
        	title:"You have a backup!",  
        	text: `${warn}. Do you want to continue it?`, 
        	icon: "warning",
        	content: '',
        	buttons: {
        		cancel: "No",
        		confirm: "Yes"
        	}
        }).then( val => {
        	if(val) {
            let file = json.file;
            // afficher le fichier
            displaySave(file);
            // navbar fixed on scroll  
            window.scrollTo(0, 0);
            window.addEventListener('scroll', onScroll);
            // F9 auto save
            window.addEventListener('keyup', (e) => {
              if(e.keyCode == 120 || e.which === 120)
              backupData();
            })
            // localstorage
            let prevchap = file.filename.split('__')[2].split('-')[0];
            let gazd = document.getElementById('GAZD').value;
            let gazn = document.getElementById('GAZN').value;
            let gazp = document.getElementById('GAZP').value;
            let gazc = document.getElementById('GAZC').value;
            localStorage.setItem('GAZC', gazc);
            localStorage.setItem('GAZD', gazd);
            localStorage.setItem('GAZN', gazn);
            localStorage.setItem('GAZP', gazp);
            localStorage.setItem('prevchap', prevchap);
            localStorage.setItem('chap', prevchap);

            let pagesbtn = document.querySelectorAll('.page-buttons');
            for (let pagebtn of pagesbtn) {
              let btnfield = pagebtn.firstElementChild.lastElementChild;
              let btnPrev = btnfield.firstElementChild.nextElementSibling;
              let span = btnPrev.nextElementSibling;
              let btnNext = span.nextElementSibling;
              btnNext.addEventListener('click', function() {nextPage(btnPrev, span, btnNext)});
              btnPrev.addEventListener('click', function() {prevPage(btnPrev, span, btnNext)});

              chapterPage_Array = [];
              // section array
              for (let section of document.querySelectorAll('section')) {
                chapterPage_Array.push(section);
              }
              
              // Créer les page pour chapitre
              let chapters = getAvailableChapter(localStorage.getItem('GAZC').toUpperCase());
              Object.keys(chapters).forEach(key => {
                chapters[key].forEach(value => {
                  if (chapterPage_Array.some(e => e.id !== value)) {
                    // field set
                    let fieldset = document.createElement('fieldset');
                    let legend = document.createElement('legend');
                    legend.className = 'text-end';
                    let img = document.createElement('img');
                    img.src = '/Delete-icon.png';
                    img.className="btn";
                    img.width="24";
                    img.height="24";
                    img.setAttribute('onclick', "deleteSection(this)");
                    legend.append(img);
                    fieldset.append(legend);
                    let section = document.createElement('section');
                    let sectionContent = value.includes("APP") ? getSectionContentFile('/app.html') : getSectionContentFile('/originalsection.html');
                    fieldset.innerHTML += sectionContent;
                    section.append(fieldset);
                    section.id = value; 
                    section.className = 'hidden-page deleted mt-2';
                    let select = section.firstChild.firstChild.nextSibling.nextSibling.firstChild.nextSibling.firstChild.nextSibling.nextSibling.nextSibling.firstChild.nextSibling.nextSibling.nextSibling;
                    select.innerHTML = `<option value="${value}">${value}</option>`;
                    let pageButtons = section.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling;
                    if (pageButtons.classList.contains('page-buttons')); 
                      pageButtons.classList.add('pagebtn-' + value);

                    // page to repat
                    let pageToRepeat = section.firstElementChild.firstElementChild.nextElementSibling.nextElementSibling;
                    pageToRepeat.className = 'page-to-repeat-' + value     + ' active-page';
                    
                    chapterPage_Array.push(section);
                  }
                })
              })
            }
        	}
        }); 
      }
    }
  };
  http.send("filename=" + filename);
}
