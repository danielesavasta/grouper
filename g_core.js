const el = {
  edit: "",
  view: "",
  home: "",
  cardshow: "",
  dropzone: ""
};
/* setting the collections by default to ak5075 */
let collection = "ak5075";
let selectedItem = 0;
let selectedIDvalue;
let db, dbKeys;
let images = [];
let indexCards = 0;
let indexcardIsOn = false;
var snapshot;
let selectedCol;
el.edit = document.getElementById('#edit');
el.view = document.getElementById('#view');

fetch("./collections/" + collection + ".json")
  .then(response => {
    return response.json();
  })
  .then(data => {
    db = data;
    snapshot = defiant.getSnapshot(db);
  });

fetch("collections/" + collection + "keys.json")
  .then(response => {
    return response.json();
  })
  .then(data => dbKeys = data);

//var defiant = await fetchScript('/res/js/modules/defiant.js');
//-------------------------------------*/

function loadDB(collection) {
  db = loadJSON("collections/" + collection + ".json");
  dbKeys = loadJSON("collections/" + collection + "keys.json");
}

function dbImages() {
  db = db.items;
  for (let i = 0; i < db.length; i++) {
    if (db[i].cover == "y") {
      let dryTitle = db[i].title;
      dryTitle = dryTitle.trim();
      dryTitle = dryTitle.turkishtoEnglish();
      dryTitle = dryTitle.toLowerCase();
      dryTitle = dryTitle.removeSpecialChars();
      images[i] = "collections/" + collection + "/images/" + dryTitle + "_" + db[i].issue + ".jpg";
    } else images[i] = "";
  }
}

function editNav() {
  let n = document.createElement('div');
  n.id = "edit__nav";
  createLink(n, "Index Card", "indexcard()");
  createLink(n, "Data Table", "datatable()");
  createLink(n, "Catalogue", "catalogue()");
  createLink(n,"Geographical","mapp()");
  /*createLink(n,"Composition","composition()");
  createLink(n,"Grouping","");
  createLink(n,"Timeline","timeline()");
  createLink(n,"Radial Tree","radialtree()");
  createLink(n,"Overview","charts()");*/
  document.body.appendChild(n);
}

function createLink(parent, name, fun) {
  let a = document.createElement('a');
  a.setAttribute("onclick", fun);
  a.innerHTML = name;
  parent.appendChild(a);
}

editNav();

/* ========================================================================================================================================================================================================================================
                                                        CHARTS
   ======================================================================================================================================================================================================================================== */

function charts() {
  let charts = createDiv().id("charts").addClass("draggable resizable");
  let header = createDiv("<h2>Charts</h2>").id("chartsheader");
  header.parent(charts);
  let body = createDiv().id("chartsbody");
  let size = createDiv(db.length);
  let keys = [];
  for (let k in db[0]) keys.push(k);
  let kk = createDiv(keys.length + " keys \n" + keys);


  /*  for (let i = 0; i < db.length; i++) {

  }*/
  body.child(size, kk);
  charts.child(body);
}

/* ========================================================================================================================================================================================================================================
                                                        TIMELINE
   ======================================================================================================================================================================================================================================== */

function timeline() {
  let mod = 4;
  let view = createDiv().id("timeline").addClass("view");

  let header = createDiv("<h2 class='viewTitle'>Timeline</h2>").id("timelineHeader").addClass("viewHeader");
  let x = createA("", 'x', "").attribute("onclick", "close(timeline)").addClass("viewClose");
  x.parent(header);
  //let sl = createInput("30", "range").attribute("min", 4).attribute("max", 100).addClass("slider").id("zoomRange");
  //sl.input(sliderZoom);
  header.parent(view);

  let body = createDiv(" ").id("timelineBody").addClass("viewBody");
  //sl.parent(body);
  //let img = images[selectedItem];

  //let footer = createDiv("<div class='editproperty'><span class='indexcardButtons' onclick=''>+</span><span class='indexcardButtons' onclick=''>-</span></div> <div class='editdb'><span class='indexcardButtons' onclick=''>?</span><span class='indexcardButtons' onclick=''>?</span></div>").id("compositionFooter").addClass("viewFooter");
  //footer.parent(view);



  let oldest = 1880;
  let newest = 0;

  newest += 5;
  let timelineContainer = '<div class="timelineContainerItems">';

  let tempPos = [];

  var maxHeight = 0;
  for (i in db) {
    if ((db[i].y_before != "") && (db[i].y_before != "")) {
      db[i].x = 0;
      db[i].y = 0;
      db[i].knownDate = false;
      if (db[i].y_before > newest)
        newest = db[i].y_before;

      if (db[i].y_before != db[i].y_after) {
        db[i].y_mid = db[i].y_after + (db[i].y_before - db[i].y_after) / 2;
        //console.log("mah");
      } else {
        db[i].knownDate = true;
        db[i].y_mid = db[i].y_before;
      }

      if (db[i].y_before != "") {
        db[i].x = (db[i].y_mid - oldest) * mod;
        //console.log(db[i].x);
        db[i].y = 5;
        for (j in tempPos) {
          while (Math.sqrt(((tempPos[j].x - db[i].x) * (tempPos[j].x - db[i].x)) + ((tempPos[j].y - db[i].y) * (tempPos[j].y - db[i].y))) < 5)
            db[i].y += 3;
        }
        //let tempVal=
        tempPos.push({
          x: db[i].x,
          y: db[i].y
        });
        if (db[i].y > maxHeight) maxHeight = db[i].y;
      }
      /*--- end of calculation ---*/
      //console.log(db[i].x);
      let tiny = "collections/" + collection + "/tiny/" + db[i].Photograph + ".png";
      let full = "collections/" + collection + "/" + db[i].Photograph + ".jpg";

      if (db[i].knownDate == true)
        timelineContainer = timelineContainer.concat('<div class="thumb yearKnown year' + db[i].y_mid + ' img' + i + '" id="t' + i + '" onclick="imageSel(' + i + ')" style="left:' + db[i].x + 'em; top:' + db[i].y + 'em">' +
          '<img class="thumbImg" src="' + tiny + '" data-src="' + full + '" onmouseover="hover(this);"/>' +
          '<span class="yearText">' + db[i].y_before + '</span>' +
          '</div>');
      else {
        //console.log("here");
        let span = (db[i].y_before - db[i].y_after) * .5;
        let xpan = db[i].x - span * mod + 1.5;
        timelineContainer = timelineContainer.concat('<div class="thumb yearUnknown year' + db[i].y_mid + ' img' + i + '" id="t' + i + '" onclick="imageSel(' + i + ')" style="left:' + xpan + 'em; top:' + db[i].y + 'em; width:' + span * 2 * mod + 'em;">' +
          '<img class="thumbImg" src="' + tiny + '" data-src="' + full + '" onmouseover="hover(this);"/>' +
          '<span class="yearText">' + db[i].y_after + '-' + db[i].y_before + '</span>' +
          '</div>');
      }
    }
  }
  //console.log(maxHeight);

  //--------- TIME LINE LINE -----------*/


  timelineContainer = timelineContainer.concat('</div');
  let timelineContHeader = '<div class="timelineColumn">';
  for (i = oldest; i <= newest; i += 10) {
    timelineContHeader = timelineContHeader.concat('<div class="timelineColumns" style="width:' + mod * 5 + 'em; margin-left:' + mod * 5 + 'em; height:' + maxHeight + 'em">&nbsp;</div>');
  }

  timelineContHeader = timelineContHeader.concat('</div><div class="timelineYear">');
  for (i = oldest; i <= newest; i += 5) {
    timelineContHeader = timelineContHeader.concat('<div class="timelineYears" style="width:' + mod * 5 + 'em">' + i + '</div>');
  }
  timelineContHeader = timelineContHeader.concat('</div>');
  //let split = timelineContainer.length ? timelineContainer.split(',') : [];
  body.attribute('height', maxHeight + "em").attribute('width', newest * 5 * mod + "em");
  createDiv(timelineContHeader + timelineContainer).id("timelineContainer").parent(body);

  body.parent(view);
  el.edit.child(view);
  el.edit.removeClass("hidden");
  dragEl(document.getElementById("timeline"));
  SimpleScrollbar.initEl(document.getElementById("timelineBody"));
}

/* ========================================================================================================================================================================================================================================
                                                        COMPOSITION
   ======================================================================================================================================================================================================================================== */

function composition() {
  let view = createDiv().id("composition").addClass("view");

  let header = createDiv("<h2 class='viewTitle'>Composition</h2>").id("compositionHeader").addClass("viewHeader");
  let x = createA("", 'x', "").attribute("onclick", "close(composition)").addClass("viewClose");
  x.parent(header);
  let sl = createInput("30", "range").attribute("min", 4).attribute("max", 100).addClass("slider").id("zoomRange");
  sl.input(sliderZoom);
  header.parent(view);

  let body = createDiv(" ").id("compositionBody").addClass("viewBody");
  sl.parent(body);
  //let img = images[selectedItem];

  body.parent(view);
  let footer = createDiv("<div class='editproperty'><span class='indexcardButtons' onclick=''>+</span><span class='indexcardButtons' onclick=''>-</span></div>").id("compositionFooter").addClass("viewFooter");
  footer.parent(view);

  el.edit.child(view);
  dragEl(document.getElementById("composition"));
  el.edit.removeClass("hidden");
}

/* ========================================================================================================================================================================================================================================
                                                        RADIAL TREE
   ======================================================================================================================================================================================================================================== */

function radialtree() {
  let view = createDiv().id("radialtree").addClass("view");

  let header = createDiv("<h2 class='viewTitle'>Radial Tree</h2>").id("radialtreeHeader").addClass("viewHeader");
  let x = createA("", 'x', "").attribute("onclick", "close(radialtree)").addClass("viewClose");
  x.parent(header);
  let sl = createInput("30", "range").attribute("min", 4).attribute("max", 100).addClass("slider").id("zoomRange");
  sl.input(sliderZoom);
  header.parent(view);

  let body = createDiv(" ").id("radialtreeBody").addClass("viewBody");
  sl.parent(body);
  //let img = images[selectedItem];

  body.parent(view);
  let footer = createDiv("<div class='editproperty'><span class='indexcardButtons' onclick=''>+</span><span class='indexcardButtons' onclick=''>-</span></div> <div class='editdb'><span class='indexcardButtons' onclick=''>?</span><span class='indexcardButtons' onclick=''>?</span></div>").id("radialtreeFooter").addClass("viewFooter");
  footer.parent(view);

  el.edit.child(view);
  dragEl(document.getElementById("radialtree"));
  el.edit.removeClass("hidden");
}

/* ========================================================================================================================================================================================================================================
                                                        INDEX CARD
   ======================================================================================================================================================================================================================================== */

function indexcard() {
  indexcardIsOn = true;
  let indexcard = document.getElementById("indexCard");
  if (indexcard == null) {
    indexcard = createEl("div", "indexCard", "view", "");
  } else indexcard.innerHTML = "";

  let header = createEl("div", "indexCardHeader", "viewHeader", "<h2 class='viewTitle'>Index Card</h2>");
  indexcard.appendChild(header);

  closeEl(indexcard.id, header);

  let indexcardbody = createEl("div", "indexCardBody", "viewBody", "");
  indexcard.appendChild(indexcardbody);

  let imgContainer = createEl("div", "", "indexCardImgContainer", "<img src='" + genImageAddress(genImageName(selectedItem), "m") + "' alt='" + genImageName(selectedItem) + "' class='indexCardImg'/><span class='addImage'>+</span><label for='files'>Select multiple files: </label><input id='files' type='file' multiple/><output id='result' />");
  indexcardbody.appendChild(imgContainer);

  for (element in db[selectedItem]) {
    let div = createEl("div", "", "indexCardElement", "<label class='key_p' for='" + element + "'>" + dbKeys[0][element] + "</label>");
    let input = createEl("input", element, "tag_p", "");
    input.setAttribute("type","text");
    input.setAttribute("name",element);
    input.setAttribute("i",selectedItem);
    input.setAttribute("value", db[selectedItem][element]);
    input.addEventListener('change', updateValue);
    div.appendChild(input);
    indexcardbody.appendChild(div);
  }

  // left and right arrows to move along indexcards
  let bleft = createEl("div", "", "indexCardButton left", "<");
  bleft.setAttribute("onClick", "selectPrev();");
  indexcardbody.appendChild(bleft);

  let bright = createEl("div", "", "indexCardButton right", ">");
  bright.setAttribute("onClick", "selectNext();");
  indexcardbody.appendChild(bright);

  let footer = createEl("div", "indexCardFooter", "viewFooter", "<div class='editproperty'><span class='indexCardButtons' onclick=''>+</span><span class='indexCardButtons' onclick=''>-</span></div> <div class='editdb'><span class='indexcardButtons' onclick=''>?</span><span class='indexcardButtons' onclick=''>?</span></div>")
  indexcard.appendChild(footer);

  document.getElementById("container").appendChild(indexcard);
  dragEl(indexcard);
  imageUploader(selectedItem);
}

function updateValue(e) {
  fieldSave(e.target.getAttribute("i"),e.target.id,e.target.value);
  saveAll(db);
}

function genImageName(id) {
  let imageName = mreplace(imageNameReplaceCriteria, db[id].b);
  imageName += "_" + lpad(db[id].k, 3) + "_" + "a";
  return imageName;
}

function genImageAddress(imageName, size) {
  switch (size) {
    case "f":
      return "collections/" + collection + "/full/" + imageName + ".jpg";
      break;
    case "m":
    default:
      return "collections/" + collection + "/" + imageName + ".jpg";
  }
}

function selectPrev() {
  selectedItem--;
  if (selectedItem < 0) selectedItem = 0;
  indexcard();
}

function selectNext() {
  selectedItem++;
  if (selectedItem >= db.length) selectedItem = db.length - 1;
  indexcard();
}

/* ========================================================================================================================================================================================================================================
                                                        CATALOGUE
   ======================================================================================================================================================================================================================================== */

function catalogue() {
  let catalogueview = createEl("div", "catalogue", "view", "");
  let header = createEl("div", "catalogueHeader", "viewHeader", "<h2 class='viewTitle'>Catalogue</h2>");
  catalogueview.appendChild(header);

  closeEl(catalogueview.id, header);

  let cataloguebody = createEl("div", "catalogueBody", "viewBody", "<input type='range' min='4' max='100' value='50' class='slider' id='zoomRange'>")
  catalogueview.appendChild(cataloguebody);

  let galUl = createEl("ul", "masUl", "mdc-image-list mdc-image-list--masonry masonry-image-list", "");
  for (i in db) {
    let tiny = genImageAddress(genImageName(i), "m");
    let full = genImageAddress(genImageName(i), "f");

  let li = createEl("li", "", "mdc-image-list__item", "");
    const img = new Image();
    img.classList.add("preview");
    img.classList.add("mdc-image-list__image");
    img.setAttribute("i", db[i]["id"]);
    img.setAttribute(onclick,"selectID("+db[i]['id']+")");
    loadImage(tiny, img);
    li.appendChild(img);
    galUl.appendChild(li);
  }
  cataloguebody.appendChild(galUl);

  let footer = createEl("div", "catalogueFooter", "viewFooter", "<div class='editProperty'></div>", catalogueview);

  document.getElementById("container").appendChild(catalogueview);
  dragEl(catalogueview);
  SimpleScrollbar.initEl(cataloguebody);
}
/*
function imageExists(image_url) {
  var http = new XMLHttpRequest();
  http.open('HEAD', image_url, false);
  http.send();
  return http.status != 404;
}
*/
async function loadImage(url, elem) {
  return new Promise((resolve, reject) => {
    elem.onload = () => resolve(elem);
    elem.onerror = reject;
    elem.src = url;
  });
}/*

async function addImageProcess(src) {
  let img = new Image();
  let imgpromise = onload2promise(img); // see comment of T S why you should do it this way.
  img.src = src;
  await imgpromise;
  return this;
}

function onload2promise(obj) {
  return new Promise((resolve, reject) => {
    obj.onload = () => resolve(obj);
    obj.onerror = reject;
  });
}
*/
/* ========================================================================================================================================================================================================================================
                                                        DATA TABLE
   ======================================================================================================================================================================================================================================== */


function datatable() {
  if (document.getElementById("datatableView")) {
    document.getElementById("datatableView").remove();
  }
  let datatableview = createEl("div", "datatableView", "view", "", ""); // Creating the view container
  let header = createEl("div", "datatableViewHeader", "viewHeader", "<h2 class='viewTitle'>Data table</h2>", datatableview); // Creating a header
  closeEl(datatableview.id, header); // Closing view
  let datatablebody = createEl("div", "datatableBody", "viewBody", "", datatableview); // Create the body

  // Create the data table
  let tbl = createEl("table", "datatable", "", "", datatablebody);

  // --- header
  let h_row = document.createElement("thead");
  tbl.appendChild(h_row);
  let trh_row = document.createElement("tr");
  h_row.appendChild(trh_row);

  Object.keys(dbKeys[0]).forEach(function(key) {
    let value = dbKeys[0][key];

    let t_cell = createEl("th", "th_" + key, "", value, trh_row);
    t_cell.setAttribute("onClick", "sortByTh(\"th_" + key + "\");");
  });

  // --- body
  let tbody = createEl("tbody", "tblBody", "", "", tbl);
  for (let item in db) {
    let t_row = document.createElement("tr");
    t_row.setAttribute("id", "tr" + db[item]["id"]);
    t_row.setAttribute("onclick", "selectID("+db[item]["id"]+")");
    tbody.appendChild(t_row);

    Object.keys(dbKeys[0]).forEach(function(key) {
      var keyvalue = key;
      let td_cell = document.createElement("td");

      if (db[item][keyvalue] != null) {
        td_cell.innerHTML = db[item][keyvalue];
        let v = td_cell.innerHTML.charAt(0);

        if (v == '#') {
          let colr = db[item][keyvalue];
          let opacity = 0.25;
          var rgbaCol = 'rgba(' + parseInt(colr.slice(-6, -4), 16) + ',' + parseInt(colr.slice(-4, -2), 16) + ',' + parseInt(colr.slice(-2), 16) + ',' + opacity + ')';
          t_row.setAttribute("style", "background-color: " + rgbaCol);
        }
      }
      if (keyvalue != "id") td_cell.addEventListener("dblclick", modifyCellContent);
      td_cell.classList.add("table_cell");
      td_cell.setAttribute("k", keyvalue);
      td_cell.setAttribute("i", db[item]["id"]);
      t_row.appendChild(td_cell);
    });
  }

  // --- footer
  let footer = createEl("div", "datatableFooter", "viewFooter", "<div class='editProperty'><!--<a title='create an ID for each row in the currente order' class='indexCardButtons' onclick='generateID()'>+ID</a>--><a class='indexCardButtons' title='add a new row to the table' onclick=''>+</a><a title='delete the selected row' class='indexCardButtons' onclick='removeID()'>-</a></div><div class='eRight editProperty'><div class='searchForm'><input id='searchKey' class='searchInput' onkeyup='searchFor()'><i class='fa fa-search'></i></div></div>", datatableview);

  document.getElementById("container").appendChild(datatableview);

  dragEl(datatableview);
  SimpleScrollbar.initEl(datatablebody);
}

/* ---------------------------------- selectID :: select item and highlight in the datatable  ---------------------------------- */
function selectID(id){
  let tb = document.getElementById("tblBody").children;
  for (let i = 0; i < tb.length; i++) {
    tb[i].classList.remove("selectedID");
  }
  selectedIDvalue=id;
  //console.log(id);
  selectedItem= db.findIndex(item => item.id== id);

  //console.log(selectedItem);
  document.getElementById("tr" + id).classList.add("selectedID");
  if(indexcardIsOn) indexcard();
}

/* ---------------------------------- removeID :: remove item forever  ---------------------------------- */
function removeID() {
  console.log(db[selectedIDvalue]+":"+selectedItem);
  /* TO BE CHECKED AGAIN
  db.splice(selectedItem,1);
  deleteRow(document.getElementsByClassName("selectedID")[0].rowIndex-1);
  let newJ = tableToJson(document.getElementById("datatable"));
  saveAll(newJ); */
}

function deleteRow(i) {
    document.getElementById("tblBody").deleteRow(i);
}

/* ---------------------------------- searchFor :: sort table view by column header ---------------------------------- */
function searchFor() {
  let input = document.getElementById("searchKey").value;
  if (input != "") {
    found = defiant.search(snapshot, '//*[contains(' + selectedCol + ',"' + input + '")]/id'); //+[b="MALTEPE"]+
    datatableFilter(found);
  }
}

/* ---------------------------------- datatableFilter :: hide from datatable the unrelated items ---------------------------------- */
function datatableFilter(found) {
  let tb = document.getElementById("tblBody").children;
  for (let i = 0; i < tb.length; i++) {
    tb[i].classList.add("hide");
  }
  for (let i = 0; i < found.length; i++) {
    document.getElementById("tr" + found[i]).classList.remove("hide");
  }
}

/* ---------------------------------- generateID :: assign ID based on row number ---------------------------------- */
function generateID() {
  let rows = document.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].childElementCount; j++) {
      if (rows[i].childNodes[j].getAttribute("k") == "id") {
        rows[i].childNodes[j].innerHTML = rows[i].rowIndex;
      }
    }
  }
  let newJ = tableToJson(document.getElementById("datatable"));
  saveAll(newJ);
}

/* ---------------------------------- sortByTh :: sort table view by column header ---------------------------------- */
function sortByTh(th) {
  let e = document.getElementById(th).cellIndex;
  let rem = document.getElementsByTagName("th");
  for (let i = 0; i < rem.length; i++) {
    rem[i].classList.remove("selected");
  }
  document.getElementById(th).classList.add("selected");
  selectedCol = th.substring(3);
  sortGrid(e);
};

/* ---------------------------------- modifyCellContent :: Function triggered when double click on a cell ---------------------------------- */
var modifyCellContent = function() {
  let originalContent = this.innerHTML;
  this.setAttribute("class", "cellEditing");
  this.innerHTML = '<input type="text" value="' + originalContent + '" />';
  this.firstChild.focus();
  this.firstChild.setAttribute("onkeydown", 'keyOut(event,"' + originalContent + '")');
  this.firstChild.addEventListener("focusout", focusOut, true);
};
/* ---------------------------------- focusOut :: Function triggered when unfocused from cell editing ---------------------------------- */
function focusOut(event) {
  updateCell(event.target.value);
  saveAll(db);
}
/* ---------------------------------- keyOut :: Function triggered when key released while cell editing (esc for revert to original, enter to confirm editing) ---------------------------------- */
function keyOut(event, originalContent) {
  console.log("out");
  let x = event.keyCode;
  if (x == 27) {
    updateCell(event.target.value);
  }
  if (x == 13) {
    updateCell(event.target.value);
  }
}
/* ---------------------------------- fieldSave :: Save the content of a cell editing and revert to simple cell content ---------------------------------- */
function updateCell(newContent) {
  let td = event.target.parentElement;
  let iOfthis=td.getAttribute("i");
  console.log("unfocused, new value:"+event.target.value+" id:"+iOfthis);
  td.classList.remove("cellEditing");
  td.classList.add("table_cell");
  fieldSave(selectedItem,td.getAttribute("k"),event.target.value);
  td.innerHTML = newContent;
}
/* ---------------------------------- fieldSave :: Save the content of the new input ---------------------------------- */
function fieldSave(i,k,newContent) {
  db[i][k] = newContent;
  saveAll(db[i][k]);
}
/* ---------------------------------- saveAll :: Function triggered when unfocused from cell editing ---------------------------------- */
function saveAll(content) {
  let data = new FormData();
  data.append("data", JSON.stringify(content));
  let xhr = new XMLHttpRequest();
  xhr.open('post', 'saveJson.php', true);
  xhr.send(data);
}

/* ========================================================================================================================================================================================================================================
                                                        Geographical
   ======================================================================================================================================================================================================================================== */
function mapp(){
  let mapview = createEl("div", "map", "view", "");
  let header = createEl("div", "mapHeader", "viewHeader", "<h2 class='viewTitle'>Map</h2>");
  mapview.appendChild(header);

  closeEl(mapview.id, header);

  let mapbody = createEl("div", "mapBody", "viewBody", "<input type='range' min='4' max='100' value='50' class='slider' id='zoomRange'>")
  mapview.appendChild(mapbody);
  let c= createEl("canvas", "mapCanvas","","");
    mapbody.appendChild(c);

;
    c.height=window.innerHeight;
    c.width=window.innerWidth;
  console.log("here");
  for (i in db) {
    //console.log(((db[i]["lat"]-32.8)*1000)," : ",(db[i]["lon"]-39.9)*1000);
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.arc((db[i]["lat"]-32.8)*10000,(db[i]["lon"]-39.9+0.05)*10000, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
  }

  /*let galUl = createEl("ul", "masUl", "mdc-image-list mdc-image-list--masonry masonry-image-list", "");
  for (i in db) {
    let tiny = genImageAddress(genImageName(i), "m");
    let full = genImageAddress(genImageName(i), "f");

  let li = createEl("li", "", "mdc-image-list__item", "");
    const img = new Image();
    img.classList.add("preview");
    img.classList.add("mdc-image-list__image");
    img.setAttribute("i", db[i]["id"]);
    img.setAttribute(onclick,"selectID("+db[i]['id']+")");
    loadImage(tiny, img);
    li.appendChild(img);
    galUl.appendChild(li);
  }*/

  //mapbody.appendChild(galUl);

  let footer = createEl("div", "mapFooter", "viewFooter", "<div class='editProperty'></div>", mapview);

  document.getElementById("container").appendChild(mapview);
  dragEl(mapview);
  SimpleScrollbar.initEl(mapbody);
}

function latitudeToY(lat,mapWidth,mapHeight){
  lat = lat * PI / 180;  // convert from degrees to radians
  let y = log(tan((lat/2) + (PI/4)));  // do the Mercator projection (w/ equator of 2pi units)
  y = (mapHeight / 2) - (mapWidth * y / (2 * PI));   // fit it to our map
  return y;
}

function longitudeToX(lng,mapWidth){
  let x=(mapWidth * (180 + lng) / 360) % mapWidth;
  return x;
}

/* ========================================================================================================================================================================================================================================
                                                        OTHER INTERFACE FUNCTIONS
   ======================================================================================================================================================================================================================================== */

function getTitleById(db, id) {
  return db.filter(
    function(db) {
      return db.id == id
    }
  );
}

function hover(img) {
  img.setAttribute('src', img.getAttribute("data-src"));
}

function sliderZoom() {
  select("#masUl").style("font-size", 10 / this.value() + "em");
  select("#masUl").style("-webkit-column-count", this.value());
}

function showPalette(index, item) {
  let a = createDiv("&nbsp;");
  a.style('background-color', item.getHex());
}

function dragLeaveCallback() {
  dropzone.removeClass('fileover');
}

function dragOverCallback() {
  dropzone.addClass('fileover');
}

function logMouseOver(index) {
  selectedItem = index;
  if (indexcardIsOn) indexcard();
}

/* ---------------------------------- createEl :: facilitate the creation of HTML elements adding type, id, class, html ---------------------------------- */
function createEl(type, id, classes, html, par) {
  let el = document.createElement(type);
  if (id) el.id = id;
  if (classes) {
    let c = classes.split(" ");
    for (let i = 0; i < c.length; i++) el.classList.add(c[i]);
  }
  if (html) el.innerHTML = html;
  if (par) par.appendChild(el);
  return el;
}

/* ---------------------------------- closeEl :: create the closing view element ---------------------------------- */
function closeEl(id, par) {
  let el = document.createElement("a");
  el.innerHTML = "x";
  el.classList.add("viewClose");
  el.setAttribute("onClick", "deleteEl(\"" + id + "\");");
  par.appendChild(el);
  //return el;
}

/* ---------------------------------- deleteEl :: destroy the selected element ---------------------------------- */
function deleteEl(idd) {
  let element = document.getElementById(idd);
  element.parentNode.removeChild(element);
}
/* ---------------------------------- dragEl :: Make the selected element draggable ---------------------------------- */
function dragEl(elmnt) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    // elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

/* ---------------------------------- tableToJson ::---------------------------------- */
function tableToJson(table) {
  var data = [];
  for (var i = 1; i < table.rows.length; i++) {
    var tableRow = table.rows[i];
    var rowData = {};
    for (var j = 0; j < tableRow.cells.length; j++) {
      rowData[tableRow.cells[j].getAttribute("k")] = tableRow.cells[j].innerHTML;
    }
    data.push(rowData);
  }
  return data;
}


/* ---------------------------------- IMAGE UPLOAD FROM TANIA RASCIA ::---------------------------------- */

function imageUploader(){
    //Check File API support
if(window.File && window.FileList && window.FileReader){
var filesInput = document.getElementById("files");
filesInput.addEventListener("change", function(event){

var files = event.target.files; //FileList object
var output = document.getElementById("result");

for(var i = 0; i< files.length; i++) {
  let file = files[i];
  //Only pics
  if(!file.type.match('image')) continue;
  let picReader = new FileReader();
  picReader.addEventListener("load",function(event){
    let picFile = event.target;
    //console.log(event.target);
    let div = document.createElement("div");
    div.innerHTML = "<img class='thumbnail' src='" + picFile.result + "'" + "title='" + file.name + "'/>";

    saveImage(file.name,picFile.result);
    output.insertBefore(div,null);
  });
  //Read the image
  picReader.readAsDataURL(file);
  }
});
}
else { console.log("Your browser does not support File API"); }
}

/* ---------------------------------- saveImage :: Function  ---------------------------------- */
function saveImage(title,image) {
  let data = new FormData();
  //let title = "Wow.jpg";
  data.append("name", title);
  data.append("content", image);

  let xhr = new XMLHttpRequest();
  xhr.open('post', 'process.php', true);
  xhr.send(data);
}
