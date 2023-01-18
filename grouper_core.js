const settings = {
    editing: true,
    editProp: false,
    addImages: false,
    collection: "db"
}

/*------------------------------------------------------------------------*/
let db, dbKeys, dbRelational, dbImages, dbRel;

const metadataCategories = [];

// loading the main database

function manageErrors(response) {
  if (!response.ok) {
    const responseError = {
      statusText: response.statusText,
      status: response.status,
    };
    throw responseError;
  }
  return response;
}

fetch("./" + settings.collection + ".json")
  .then(manageErrors) // call function to handle errors
  .then(function (response) {
    console.log("200 - ok");
    db = response.json();
    //console.log(db);
    checkDBhealth();
    document.getElementById("dbloader").remove();
  })
  .catch(function (error) {
    console.log("Error Code   : " + error.status);
    console.log("Error Reason : " + error.statusText);
    // load new json
  });

function checkDBhealth(){
    if(db.hasOwnProperty('grouper')) {console.log("all right! let's move"); snapshot = defiant.getSnapshot(db);}
    else {
        console.log("not a grouper json yet! let's see");
        db.grouper=true;
        //if(db.hasOwnProperty('grouper')) {console.log("all right! let's move");}
}
    
}

function saveJson(title, content) {
    let data = new FormData();
    data.append(title, JSON.stringify(content));
    let xhr = new XMLHttpRequest();

    xhr.open('post', 'saveJson.php', true);
    xhr.send(data);

    if (title == "db") {
        snapshot = defiant.getSnapshot(db);
        if (document.getElementById('obj_menu_toggle').checked) populateTable();
    }
}


const readItemsJson = json => {
  json.forEach(item => console.log(item.name));
};
  /*
fetch("./" + settings.collection + ".json")
.then(async (data) => {
    if (data.ok) {
        data = await data.json()
        //Here you have your data...
    }
}).catch(e => console.log('Connection error', e))
/*
fetch("./" + settings.collection + ".json")
    .then((res)=>{ 
        if(res.ok) return res.json();
        else throw new Error("Status code error :" + res.status) 
    })
    /*.then(data => {
        db = data;
        console.log(db)
        snapshot = defiant.getSnapshot(db);
        document.getElementById("dbloader").remove();
    })
    .catch( error => {
        console.log("file not found");
        err=>console.log(err)
    });



/*
fetch("./" + settings.collection + "images.json")
    .then(response => {
        return response.json();
    })
    .then(data => dbImages = data);


fetch("./" + settings.collection + "keys.json")
    .then(response => {
        return response.json();
    })
    .then(data => dbKeys = data);

fetch("./" + settings.collection + "relations.json")
    .then(response => {
        return response.json();
    })
    .then(data => dbRelational = data);

fetch("./" + settings.collection + "rel.json")
    .then(response => {
        return response.json();
    })
    .then(data => dbRel = data);
+/

/*------------------------------------------------------------------------*/

function menuActive(name) {
    let c;
    switch (name) {
        case 'obj_menu':
            populateTable();
            document.getElementById('deleteObjs').appendChild(removeButton);
            c = "#58FF3E";
            break;
        case 'vis_menu':
            c = "#3393FF";
            populateVis();
            break;
        case 'add_menu':
            c = "#F6C531";;
            populateTypes();
            break;
        case 'abo_menu':
            c = "#D95D39";
            populateAbout();
            break;
        case 'add_image':
            populateImages();
            //populateImages();
            document.getElementById('add_image').querySelectorAll('form')[0].innerHTML = "";
            c = "#F6C531";;
            break;
    }
    let obj = document.getElementById(name);
    let obj_c = document.getElementById(name + '_toggle');
    let obj_l = document.getElementById('l_' + name + '_toggle');

    if (obj_c.checked) {
        obj.classList.add("on");
        obj.classList.remove("off");
        obj_l.style.backgroundColor = c;
        /*obj.visibility = 'visible';
        obj.opacity = '1';
        obj.minHeight = '85vh';*/
    } else {
        obj.classList.add("off");
        obj.classList.remove("on");

        obj_l.style.backgroundColor = "#ffffff";
        /*obj.maxHeight = '0';
        obj.minHeight = '0';
        obj.opacity = '0';
        obj.visibility = 'hidden';*/
    }
}

/*------------------------ MATTER ------------------------------------------------*/
function setup() {
    //createCanvas(window.innerWidth, window.innerHeight);
}

/*-------------------------------- populate types  ----------------------------------------*/
function populateTypes(res) {
    document.getElementById("add_menu").innerHTML ='<fieldset><legend> Type </legend><div id="type_list" class="chip-group" tabindex="-1" role="radiogroup"></div></fieldset><fieldset id="indexCard"></fieldset><fieldset id="addRel"></fieldset><fieldset id="addImages"></fieldset>';
    let typelist = document.getElementById("type_list");
    typelist.innerHTML = "";
    //console.log(Object.keys(dbKeys).length);
    for (let i=0; i<Object.keys(dbKeys).length;i++) {
        let tname=Object.keys(dbKeys)[i];
        
    let ob = createEl("div", "", "chip chip-checkbox", "", typelist);
    ob.setAttribute("role", "radio");
    ob.setAttribute("tabindex",i);
    ob.setAttribute("aria-checked", "false");
    ob.setAttribute("aria-labelledby","radioOneLabel");
    let inp = createEl("input", "", "", "", ob);
    inp.setAttribute("type", "radio");
    inp.setAttribute("name", "radioEx");
    inp.setAttribute("value", tname);
    let lab = createEl("label", "rad"+tname, "but", tname, ob);
    lab.setAttribute("for", tname);
    }

/*---------------------------MATTER---------------------------------------------*/
var chips = document.getElementsByClassName("chip-checkbox");

Array.from(chips).forEach(function(element) {
    element.addEventListener("click", function() {
        let c = element.ariaChecked;
        if (c === 'false') {
            for (let chip of chips) {
                chip.querySelector("input").checked = false;
                chip.ariaChecked = false;
            }

            element.ariaChecked = true;
            let t = element.querySelector("input").value;
            
            populateCard(t);
        }
    });
});
drag.containers.push(document.getElementById('indexCard'));
}


/*-------------------------------- populate about ----------------------------------------*/

function populateAbout(res) {
    console.log("this is the about");
    let aboutcard = document.getElementById("aboutWindowData");
    let count = [];

    for (eleme in db) {
        let tags = db[eleme].t.split(",").map(item => item.trim());
        let coll = db[eleme].c.split(",").map(item => item.trim());

        count = count.concat(coll, tags);
    }

    let d = count.reduce((accumulator, value) => {
        return {...accumulator, [value]: (accumulator[value] || 0) + 1 };
    }, {});
    delete d[""];

    keysSorted = Object.keys(d)
        .sort()
        .reduce((accumulator, key) => {
            accumulator[key] = d[key];
            return accumulator;
        }, {});

    aboutcard.innerHTML = "Listing " + Object.keys(keysSorted).length + " abouts";
    let aboutcWindow = document.getElementById("aboutWindow");
    aboutcWindow.innerHTML = "";

    for (element in keysSorted) {
        let ob = createEl("div", "", "object draggable", element + " [" + keysSorted[element] + "]", aboutcWindow);
    }
}


/*-------------------------------- populate card ----------------------------------------*/

function populateCard(type, id) {
    let sel;
    nConnection=0;

    let add_menu = document.getElementById("add_menu");
    let indexcard = document.getElementById("indexCard");
    let addRel = document.getElementById("addRel");
    let addImages = document.getElementById("addImages");

    indexcard.innerHTML = "<legend>Properties</legend >";
    addRel.innerHTML = "<legend>Relations</legend >";
    if(settings.addImages)
    addImages.innerHTML = "<legend>Images</legend >";
    
    if (id != null) {
        sel = findObj(id.slice(2))[0];
        type = sel.ty;
        setType(type);
        createEl("div", "editID", "", sel.id, indexcard);
    }
    for (let i in dbKeys[type]) {
        let k = i;
        let v = dbKeys[type][i];
        let div = createEl("div", "", "indexCardElement", "", indexcard);
        if(typeof v.sub!=="undefined"){
            div.classList.add(v.sub);
            pushIfNew(v.sub,metadataCategories);
        }
        let input;
        if (v.type != 'longtext') {
            input = createEl("input", v.name, "tag_p", "", div);
            input.setAttribute("type", v.type);
            input.setAttribute("name", k);
            if (id) input.setAttribute("value", sel[k]);
        } else {
            input = createEl("textarea", v.name, "tag_p", "", div);
            input.setAttribute("name", k);
            input.setAttribute("rows", 7);
            if (id) input.innerHTML = sel[k];
        }
        div.innerHTML+="<label class='key_p' for='" + v.name + "'>" + v.label + "</label>";
    }
    if(settings.editProp) {
        let div = createEl("button", "addProp", "but", "Add Property", indexcard);
        div.setAttribute("onclick", "addProp()");
    }
   
    addRelationSelector(addRel);
    //resort by categories
    let subs= indexcard.getElementsByClassName("element");
    console.log(subs);
    
    metadataCategories.forEach(
        //element => console.log(element)
        (element, index) => { 
            createEl("h3", element, "", element, indexcard);
            
            
            //console.log("adding: "+element);
        });
    /*subs.forEach((element)) => {
        if(element.classList.contains(className);)
    }*/

    //addImages
    if (id != null) {
        for(let i in dbRel) {
            let nid=id.slice(2);
            if(dbRel[i]["id1"]==nid) { popExistentRelationSelector(addRel,dbRel[i]["id1"],dbRel[i]["id2"],dbRel[i]["rel"]); }
            if(dbRel[i]["id2"]==nid) { popExistentRelationSelector(addRel,dbRel[i]["id2"],dbRel[i]["id1"],dbRel[i]["rel"]); }
        }
        let images = searchElementNo(id.slice(2), "linkto", dbImages);
        for (let i = 0; i < images.length; i++) {
            let img = createEl("img", "", "imageThumb", "", addImages);
            img.setAttribute("src", "uploads/" + images[i].name);
            img.setAttribute("dbid", "db" + images[i].id);
        }
    }
    drag.containers.push(document.getElementById('addImages'));
    

    let saveButton = createEl("button", "save", "but save", "Save", add_menu);
    saveButton.setAttribute("onclick", "saveObj('" + type + "')");
}
var nConnection =0;
var type = "";

const pushIfNew = (newItem,array) => {
    array.indexOf(newItem) === -1 ? array.push(newItem) : console.log("This item already exists");
}
function setType(ty) {
    let list=document.getElementById("type_list");
    //console.log(list.children);
    for(let i=0; i < list.children.length; i++) {
        //console.log(list.children[l]);
        if(list.children[i].getElementsByTagName("label")[0].getAttribute("for")==ty)
            list.children[i].setAttribute("aria-checked","true");
        else {
            list.children[i].setAttribute("aria-checked","false"); 
            
            list.children[i].blur(); 
        }
    }
    type=ty;
}
function addRelationSelector(addRel){
    let leftRel = createEl("div", "lefRel"+ nConnection, "leftRel", "", addRel);
    let relRel = createEl("select", "", "relRel", "", addRel);
    relRel.setAttribute("name", "relRel" + nConnection);
    drag.containers.push(leftRel);
    
    nConnection++;
}

function popRelationSelector(index,typeA,typeB,sel){
    let cont=document.getElementsByName("relRel"+index)[0];
    /*console.log(typeA);
    console.log(typeB);
    console.log(cont);*/
    for (let i = 0; i < dbRelational[typeA][typeB].length; i++) {
        let a = createEl("option", "", "relOpt", dbRelational[typeA][typeB][i], cont);
        a.setAttribute("value", dbRelational[typeA][typeB][i]);
        if(sel != undefined) if(i==sel) a.setAttribute("selected","selected");
    }
    
}

function popExistentRelationSelector(addRel,a,b,c){
    addRelationSelector(addRel);
    popRelationSelector(nConnection-1,getProp(a,"ty"),getProp(b,"ty"),c);

    let rCont=document.getElementById("lefRel"+(nConnection-1));
    let divElement=createEl("div", "", "object draggable", getProp(b,"s"),rCont);
    divElement.setAttribute("dbid","id"+ getProp(b,"id"));

       // <div class="object draggable" dbid="id2">İnsel İnan</div>
}
/* ---------------------------------- add property ---------------------------------- */

function addProp() {
    let elem = createEl("div", "", "indexCardElement newProp", "");
    let b = createEl("input", "", "tag_p half", "", elem);
    b.setAttribute("type", "text");
    b.setAttribute("name", "label");
    b.setAttribute("value", "label");

    let c = createEl("input", "", "tag_p half", "", elem);
    c.setAttribute("type", "text");
    c.setAttribute("name", "newElem");
    c.setAttribute("value", "newElem");
    let d = document.getElementById("addProp");
    d.parentNode.insertBefore(elem, d);
}

/* ---------------------------------- save object ---------------------------------- */
function saveObj(type) {
    let els = document.getElementsByClassName("indexCardElement");
    var obj = new Object();
    let id;
    let idC = document.getElementById("editID");
    if (idC) {
        id = idC.innerHTML;
    } else {
        id = getNextId(db);
    }
    obj.id = parseInt(id);
    obj.ty = type;

    for (let i = 0; i < els.length; i++) {
        let n;
        if (els[i].getElementsByTagName('input').length > '0') {
            n = els[i].getElementsByTagName('input')[0];
        } else if (els[i].getElementsByTagName('textarea').length > '0') {
            n = els[i].getElementsByTagName('textarea')[0];
        }
        obj[n.name] = n.value;
    }
    let rel = document.getElementById("addRel").querySelectorAll("div.object");
    
    removeByProp(dbRel, "id1", id);
    removeByProp(dbRel, "id2", id);
    
    for(let i = 0; i < rel.length; i++) {
        let r = new Object();
        r["id1"] = id;
        console.log(rel[i]);
        r["id2"] = rel[i].getAttribute("dbid").slice(2);
        let relSelect = document.getElementsByName("relRel"+rel[i].parentElement.getAttribute("id").slice(6))[0];
        let reltype=relSelect.selectedIndex;
        r["rel"] = reltype;
        dbRel.push(r);
    }
    
    let igs = document.getElementById("addImages").querySelectorAll("img");
    for (let i = 0; i < igs.length; i++) {
        let imgObj = new Object();
        imgObj.id = parseInt(igs[i].getAttribute("dbid").slice(2));
        imgObj.name = igs[i].getAttribute("src").slice(8);
        imgObj.linkto = parseInt(id);

        removeById(dbImages, imgObj.id);
        dbImages.push(imgObj);
    }

    removeById(db, id);
    db.push(obj);
    saveAll(settings.collection, db);
    saveAll(settings.collection+"images", dbImages);
    saveAll(settings.collection+"rel", dbRel);
    populateImages();
    populateCard("", id);
}

/* ---------------------------------- look for the highest ID and return +1 ---------------------------------- */
function getNextId(obj) {
    return (Math.max.apply(Math, obj.map(function(o) {
        return o.id;
    })) + 1);
}

/* ---------------------------------- populate table ---------------------------------- */
function populateTable(res) {
    let d;
    if (res) d = res;
    else d = db;

    let objectWindowC = document.getElementById("objectWindowData");
    objectWindowC.innerHTML = "Listing " + d.length + " objects";
    let objectWindow = document.getElementById("objectWindow");
    objectWindow.innerHTML = "";
    for (let i = 0; i < d.length; i++) {
        let cstring = d[i].s;
        let ob = createEl("div", "", "object draggable", cstring, objectWindow);
        ob.setAttribute("dbid", "id" + d[i].id);
    }
    sortThem('objectWindow');
}

/* ---------------------------------- sort objects alphabetıcally ---------------------------------- */
function sortThem(s) {
    Array.prototype.slice.call(document.getElementById(s).querySelectorAll("div")).sort(function sort(ea, eb) {
        let a = ea.textContent.trim().toUpperCase();
        let b = eb.textContent.trim().toUpperCase();
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }).forEach(function(div) {
        div.parentElement.appendChild(div);
    });
}
/* ---------------------------------- populate images ---------------------------------- */
function populateImages() {
    let container = document.getElementById("uploadedImages");
    container.innerHTML = "<legend id='ina'>Images not associated<legend>";

    let images = searchElementNo("-1", "linkto", dbImages);
    let linktoIdArr = listID("linkto", dbImages);
    let objIdArr = listID("id", db);

    let difference = linktoIdArr.filter(x => !objIdArr.includes(x));
    if (difference.length > 0)
        for (let i = 0; i < difference.length; i++)
            for (let j = 0; j < dbImages.length; j++) {

                if (dbImages[j].linkto == difference[i]) {
                    dbImages[j].linkto = -1;
                    saveAll("dbimages", dbImages);
                }
            }
    for (let i = 0; i < images.length; i++) {
        let img = createEl("img", "", "imageThumb", "", container);
        img.setAttribute("src", "uploads/" + images[i].name);
        img.setAttribute("dbid", "id" + images[i].id);
    }
    drag.containers.push(document.getElementById('uploadedImages'));
}


function listID(field, db) {
    let newArray = new Array();
    for (let i = 0; i < db.length; i++) {
        if (newArray.indexOf(db[i][field]) === -1) newArray.push(db[i][field]);
    }
    return newArray;
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

/* ---------------------------------- saveAll :: Function triggered when unfocused from cell editing ---------------------------------- */

function saveAll(title, content) {
    let data = new FormData();
    data.append(title, JSON.stringify(content));
    let xhr = new XMLHttpRequest();

    xhr.open('post', 'saveJson.php', true);
    xhr.send(data);

    if (title == "db") {
        snapshot = defiant.getSnapshot(db);
        if (document.getElementById('obj_menu_toggle').checked) populateTable();
    }
}

/* ---------------------------------- dragging :: ---------------------------------- */
let drag = dragula([document.getElementById('objectWindow'), document.getElementById('objdrop')], {
    removeOnSpill: true,
    copy: function(el, source) {
        if ((source === document.getElementById('objectWindow')) || (source === document.getElementById('uploadedImages')) || (source === document.getElementById('aboutWindow')))
            return source;
    },
    accepts: function(el, target, source) {
        if (source === document.getElementById('aboutWindow')) {
            if (target !== document.getElementById('fildrop'))
                return;
        }
        if (source === document.getElementById('uploadedImages')) {
            if (target !== document.getElementById('addImages'))
                return;
        }
        if ((target === document.getElementById('addImages')) && (source !== document.getElementById('uploadedImages'))) {
            return;
        }

        if ((target !== document.getElementById('objectWindow')) && (target !== document.getElementById('uploadedImages')))
            return target;
    },
    moves: function(el, source) {
        return source !== document.getElementById('add_menu');
    }
}).on('drop', function(el, target) {
    if (target != null) {
        
        switch (target.id) {
            case 'deleteObjs':
                document.getElementById('deleteObjsB').style.backgroundColor = "#F3A3C1";
                document.getElementById('deleteObjsB').style.color = "#000";
                break;
            case 'indexCard':
                populateCard("", el.getAttribute("dbid"));
           // case 'indexCard':
        }
    }
    console.log(nConnection);
    if(nConnection>0) {
        //console.log("enter");
        for(let i=0;i<nConnection;i++) {
            let a='#lefRel'+i;
            let secondItemId =  el.getAttribute('dbid').slice(2);
            
            if (target.matches(a)) {
                let addRel = document.getElementById('addRel');//document.getElementById(a.slice(1));
                let secondItem=getProp(secondItemId,"ty");
                console.log(addRel);
                popRelationSelector(i,type,secondItem);
                addRelationSelector(addRel);
            }
        }
    }
    /*if (target.matches('#leftRel')) {
        if (target.children.length > 2) {
        drag.cancel()
        }
    }*/
});
drag.containers.push(document.getElementById('deleteObjs'));
drag.containers.push(document.getElementById('aboutWindow'));
drag.containers.push(document.getElementById('fildrop'));

/* ---------------------------------- remove duplicates after drop  ---------------------------------- */
function removeDupes(target) {
    var elements = document.getElementById(target).querySelectorAll("*[dbid]");
    var usedIds = {};

    for (let i = 0; i < elements.length; i++) {
        const id = elements[i].getAttribute("dbid");
        if (usedIds[id]) {
            elements[i].parentNode.removeChild(elements[i]);
        } else {
            usedIds[id] = true;
        }
    }
}

/* ---------------------------------- search filter of objects ---------------------------------- */
function searchFor() {
    let val = document.getElementById("searchKey").value;
    if (val != "") {
        let found = defiant.search(snapshot, "//*[contains(string(),'" + val + "')]/id");

        let res = db.filter(function(e) {
            return found.includes(e.id);
        });
        populateTable(res);
    } else populateTable();
}

/* bot existing at startup
document.getElementById("searchKey").addEventListener("search", function(event) {
    searchFor();
});
*/
function searchElementID(value, property, database) {
    let found = defiant.search(database, "//*[" + property + "=" + value + "]/id");
    return found;
}

function searchElementNo(value, property, database) {
    let found = defiant.search(database, "//*[" + property + "=" + value + "]");
    return found;
}

/* ---------------------------------- remove objects via ID ---------------------------------- */
const removeById = (arr, id) => {
    const requiredIndex = arr.findIndex(el => {
        return el.id === parseInt(id);
    });
    if (requiredIndex === -1) {
        return false;
    };
    return !!arr.splice(requiredIndex, 1);
};

/* ---------------------------------- remove objects via Property ---------------------------------- */
const removeByProp = (arr, prop, value) => {
    const requiredIndex = arr.findIndex(el => {
        return el[prop] === value;
    });
    if (requiredIndex === -1) {
        return false;
    };
    return !!arr.splice(requiredIndex, 1);
};

/* ---------------------------------- get property of obj ID ---------------------------------- */
function getProp(id,property) {
    let item=findObj(id);
    return item[0][property];
};


/* ---------------------------------- find objects via ID ---------------------------------- */
function findObj(id) {
    let item = defiant.search(db, '//*[id="' + id + '"]');
    return item;
};

/* ---------------------------------- remove objects  ---------------------------------- */
function removeObjs() {
    let list = document.getElementById("deleteObjs").querySelectorAll("*[dbid]");
    for (let i = 0; i < list.length; i++) {
        let eltodrop = list[i].getAttribute("dbid").slice(2);
        removeById(db, eltodrop);
    }
    let container = document.getElementById("deleteObjs");
    container.innerHTML = "";
    container.appendChild(removeButton);
    saveAll("db", db);
}

let removeButton = createEl("button", "deleteObjsB", "but", "Delete Objects");
removeButton.setAttribute("onclick", "removeObjs()");

/* ---------------------------------- timeline  ---------------------------------- */

function populateVis() {
    let visualizers = document.getElementById("vis_menu");
    if (!document.getElementById("visOpt")) {
        let opt = createEl("fieldset", "visOpt", "", "", visualizers);
        createEl("legend", "", "", "Options", opt);
        let c1 = createEl("input", "visOptI", "", "Image", opt);
        let l1 = createEl("label", "", "", "Image", opt);
        let c2 = createEl("input", "visOptN", "", "Name", opt);
        let l2 = createEl("label", "", "", "Name", opt);
        let sl = createEl("div", "", "slidecontainer", '<label for="imgSize">Images size</label><input type="range" min="1" max="100" value="50" class="slider" id="imgSize">', opt);
        l1.setAttribute("for", "visOptI");
        c1.setAttribute("name", "Image");
        c1.setAttribute("type", "checkbox");
        c1.checked = true;
        l2.setAttribute("for", "visOptN");
        c2.setAttribute("name", "Name");
        c2.setAttribute("type", "checkbox");
        c2.checked = true;

        c1.addEventListener("click", function() {
            if (c1.checked) document.getElementById("timeline").classList.remove("hideImgs");
            else document.getElementById("timeline").classList.add("hideImgs");
        });
        c2.addEventListener("click", function() {
            if (c2.checked) document.getElementById("timeline").classList.remove("hideText");
            else document.getElementById("timeline").classList.add("hideText");
        });

        //var slider = document.getElementById("imgSize");
        sl.addEventListener("change", function() {timeGen();
            }, false);
    }
}
var imageSize = 1;

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++  VISUALIZERS  +++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function gallery(){
    let base = document.getElementById("base");
    base.innerHTML = "";

    let list = document.getElementById("objdrop").querySelectorAll("*[dbid]");
    if (list.length < 1) {
        list = document.getElementById("objectWindow").querySelectorAll("*[dbid]");
    }
    if (list.length < 1) {
        populateTable();
        list = document.getElementById("objectWindow").querySelectorAll("*[dbid]");
    }

    let l = listToObjects(list);
    for(i in l) {
        let c = createEl("div", "", "gallery_item", "", base);
    
    for (im in l[i].images) {
        if (im == 0) c.innerHTML += "<img src='uploads/" + l[i].images[im].name + "' class='imgThumb show' alt='" + l[i].title + "' onclick='showNext(this)'/>";
        else c.innerHTML += "<img src='uploads/" + l[i].images[im].name + "' class='imgThumb' alt='" + l[i].title + "' onclick='showNext(this)'/>";
    }}
}

function timeGen(){
    let imThumbs = document.getElementsByClassName("timeline_item");
            slida = document.getElementById("imgSize");
            imageSize = slida.value;
            timelineView();
            imThumbs.forEach(function(el, index, array) {
                el.style.height = imageSize + "px";
                el.querySelectorAll("h2")[0].style.fontSize = imageSize * .1 + "px";
            });
        
}
let bodies = [];

function timelineView2() {
    let base = document.getElementById("base");
    base.innerHTML = "";
    let mod = 4;
    let view = createEl("div", "timeline", "view", "");
    base.appendChild(view);

    let list = document.getElementById("objdrop").querySelectorAll("*[dbid]");
    if (list.length < 1) {
        list = document.getElementById("objectWindow").querySelectorAll("*[dbid]");
    }
    if (list.length < 1) {
        populateTable();
        list = document.getElementById("objectWindow").querySelectorAll("*[dbid]");
    }

    let oldest = lookFor(list, "oldest");
    let newest = lookFor(list, "newest");
    let sub = newest - oldest;

    let alignLeftMargin = -0.25;
    let years = [];

    let table = createEl("div", "timeline_line", "", "", view);

    for (let i = oldest; i < newest; i++) {
        years[i] = { x: 1740 / sub * (i - oldest), y: 0 };
    }

    for (let i = 0; i < sub; i++) {
        let c = createEl("div", "", "timeline_col", "", table);
        if (i % 10 == 0) {
            c.classList.add("majorTick");
            let y = createEl("div", "", "timedate", oldest + i, view);
            y.style.left = "calc(" + 100 / sub * i + "% + " + alignLeftMargin + "em)";
        }
        c.style.width = 100 / sub + "%";
    }

    let objsPos = [];
    let mTop = 10;

    for (let i = 0; i < list.length; i++) {
        let id = parseInt(list[i].getAttribute("dbid").slice(2));

        let item = findObj(id)[0];
        let c = createEl("div", "", "timeline_item", "", view);
        let images = searchElementNo(id, "linkto", dbImages);
        let b = parseInt(item.b.slice(0, 4));

        if (!isNaN(b)) {
            objsPos[id] = { title: list[i].innerHTML, images: images, year: b, x: Math.ceil(years[b].x), y: Math.ceil(mTop + years[b].y * imageSize) };
            years[b].y++;
        } else { objsPos[id] = { title: list[i].innerHTML, images: images, year: b, x: 0, y: 0 }; }


        for (cv in objsPos) {
            if (cv != id) {
                while (Math.ceil(Math.sqrt((objsPos[cv].x - objsPos[id].x) * (objsPos[cv].x - objsPos[id].x) + (objsPos[cv].y - objsPos[id].y) * (objsPos[cv].y - objsPos[id].y))) < imageSize * 1.5) {
                    objsPos[id].y += imageSize * .25;
                }
            }
        };

        /*  c.innerHTML += "<img src='uploads/" + images[0].name + "' class='imgThumb' alt='" + objsPos[id].title + "'/>";
          

          c.style.left = objsPos[id].x + "px"; //"calc(" + 100 / sub * (b - oldest) + "% + " + alignLeftMargin + "em)";
          c.style.top = objsPos[id].y + "px";*/

        const img = new Image();
        img.classList.add("imgThumb");
        img.setAttribute("alt", objsPos[id].title);
        //img.setAttribute("i", db[i]["id"]);
        //img.setAttribute("onclick","selectID("+db[i]['id']+")");
        loadImage("uploads/" + images[0].name, img);
        c.appendChild(img);
        c.innerHTML += "<h2>" + objsPos[id].title + "</h2>";
        c.style.left = objsPos[id].x + "px";
        c.style.top = objsPos[id].y + "px";
        /*
                let box = Bodies.rectangle(objsPos[id].x, 50, 40, 40, {
                    inertia: Infinity,
                    render: {
                        sprite: {
                            texture: 'uploads/' + images[0].name,
                            xScale: 0.05,
                            yScale: 0.05
                        }
                    }
                });
                bodies.push(box);
                Composite.add(engine.world, box);*/

    }
}

function timelineView() {
    let base = document.getElementById("base");
    base.innerHTML = "";
    let mod = 4;
    let view = createEl("div", "timeline", "view", "");
    base.appendChild(view);

    let list = document.getElementById("objdrop").querySelectorAll("*[dbid]");
    if (list.length < 1) {
        list = document.getElementById("objectWindow").querySelectorAll("*[dbid]");
    }
    if (list.length < 1) {
        populateTable();
        list = document.getElementById("objectWindow").querySelectorAll("*[dbid]");
    }

    let objs = listToObjects(list);
    //console.log(objs);

    let oldest = lookFor(objs, "oldest");
    let newest = lookFor(objs, "newest");
    let sub = newest - oldest;

    let alignLeftMargin = -0.25;

    let table = createEl("div", "timeline_line", "", "", view);

    for (let i = 0; i < sub; i++) {
        let c = createEl("div", "", "timeline_col", "", table);
        if (i % 10 == 0) {
            c.classList.add("majorTick");
            let y = createEl("div", "", "timedate", oldest + i, view);
            y.style.left = "calc(" + 100 / sub * i + "% + " + alignLeftMargin + "em)";
            //y.setAttribute("onmouseover", showThisYear(oldest + i))
        }
        c.style.width = 100 / sub + "%";
        c.setAttribute("y", oldest + i);

        c.addEventListener('mouseover', function() {
            let items = document.getElementsByClassName("timeline_item");
            for (let o = 0; o < items.length; o++) {
                console.log(items[o].getAttribute('y'));
                if (items[o].getAttribute('y') == oldest + i) {
                    //console.log("ok");
                    items[o].classList.add("specialClass");
                }
            }
        });

        c.addEventListener('mouseout', function() {
            let items = document.getElementsByClassName("timeline_item");
            for (let o = 0; o < items.length; o++) {
                items[o].classList.remove("specialClass");
            }
        });
    }

    let selCriteria = [];

    let filDrop = document.getElementById("fildrop");
    if (filDrop.innerHTML != "") {
        let fD = filDrop.querySelectorAll("div");
        for (let i = 0; i < fD.length; i++) {
            let selAbout = fD[i].innerHTML.split(" [")[0];
            //console.log(selAbout);
            selCriteria.push(selAbout);
        }
    }
    let nCriteria = selCriteria.length;
    let stripeH = 900 / (nCriteria + 1);

    for (let i = 0; i < nCriteria; i++) {
        let tempList = [];
        for (j in objs) {
            let s = objs[j].t;
            if (typeof s !== "undefined")
                if (s.indexOf(selCriteria[i]) > 0) {
                    tempList[j] = objs[j];
                    delete objs[j];
                }
        }
        //console.log(tempList);
        let crit = createEl("div", "", "criteria", selCriteria[i], view);
        crit.setAttribute("style", "top:" + stripeH * i + "px; height: " + stripeH + "px;");
        timelineElementShow(tempList, view, oldest, sub, stripeH * i);
    }
    //console.log(objs);
    timelineElementShow(objs, view, oldest, sub, stripeH * nCriteria);
}
/*function showThisYear(y){
    let items=document.getElementsByClassName("timeline_item");

    for(i in items) {
        if(items[i].getAttribute('year')==y) {
            //items[i].classList.add()
        }
    }
}*/
function listToObjects(list) {
    let o = [];
    for (let i = 0; i < list.length; i++) {
        let id = parseInt(list[i].getAttribute("dbid").slice(2));
        let newa = findObj(id)[0];
        let images = searchElementNo(id, "linkto", dbImages);
        o[id] = { title: newa.s, type: newa.ty, i: newa.i, t: newa.t + newa.c, c: newa.c, images: images, year: newa.b, x: 0, y: 0 };
    }
    return o;
}

function timelineElementShow(l, view, oldest, sub, space) {
    let mTop = 10 + space;

    let years = [];

    for (let i = 0; i < sub; i++) {
        years[oldest + i] = { x: 1740 / sub * i, y: 0 };
    }

    for (i in l) {
        let c = createEl("div", "", "timeline_item", "", view);
        let b = 1930;
        if (typeof l[i].year !== "undefined") b = parseInt(l[i].year.slice(0, 4));

        if (isNaN(b)) { b = 1930; }
        l[i].x = Math.ceil(years[b].x);
        l[i].y = Math.ceil(mTop + years[b].y * imageSize);
        years[b].y++;

        for (cv in l) {
            if (cv != i) {
                while (Math.ceil(Math.sqrt((l[cv].x - l[i].x) * (l[cv].x - l[i].x) + (l[cv].y - l[i].y) * (l[cv].y - l[i].y))) < imageSize * 1.5) {
                    l[i].y += imageSize * .25;
                }
            }
        };

        for (im in l[i].images) {
            if (im == 0) c.innerHTML += "<img src='uploads/" + l[i].images[im].name + "' class='imgThumb show' alt='" + l[i].title + "' onclick='showNext(this)'/>";
            else c.innerHTML += "<img src='uploads/" + l[i].images[im].name + "' class='imgThumb' alt='" + l[i].title + "' onclick='showNext(this)'/>";
        }
        c.innerHTML += "<h2>" + l[i].title + "</h2>";

        c.style.left = l[i].x + "px";
        c.style.top = l[i].y + "px";
        c.setAttribute("y", b);
        c.setAttribute("id", "db" + i);
    }
}

function showNext(caller) {
    let nS = caller.nextElementSibling;
    let switc = false;

    if (nS) {
        //console.log(nS.tagName);
        if (nS.tagName == 'IMG') {
            nS.classList.add('show');
            caller.classList.remove('show');
            switc = true;
            // console.log("so");
        }
        //console.log("ok");
    }
    if (!switc) {
        nS = caller.parentNode.firstChild;
        //console.log(nS.tagName);
        if (nS)
            if (nS.tagName == 'IMG') {
                caller.classList.remove('show');
                nS.classList.add('show');
            }
    }
    /*for (im in l[i].images) {
        if(im==imShow) c.innerHTML += "<img src='uploads/" + l[i].images[im].name + "' class='imgThumb show' alt='" + l[i].title + "' onclick='showNext()'/>";
        else c.innerHTML += "<img src='uploads/" + l[i].images[im].name + "' class='imgThumb' alt='" + l[i].title + "' onclick='showNext()'/>";
     }
     imShow++;*/
}

function lookFor(list, type) {
    let res;
    switch (type) {
        case "oldest":
            res = 1930;
            break;
        case "newest":
            res = 2010;
            break;
    }
    return res;
}


/*------------------------------------------------------------------------*/
/*Dropzone.autoDiscover = false;

const dropzone = new Dropzone("form.dropzone", {
    renameFile: function(file) {
        let newName = new Date().getTime() + '_' + file.name;

        saveImage(newName);
        return newName;
    }
});
/*
Dropzone.options.filedrop = {
    init: function() {
        this.on("queuecomplete", function(file) {
            alert("All files have uploaded ");
        });
    }
};*/

function saveImage(name) {
    let obj = new Object();
    let id = getNextId(dbImages);
    obj.id = parseInt(id);
    obj.name = name;
    obj.linkto = -1;

    dbImages.push(obj);
    saveAll("dbimages", dbImages);
}
/*------------------------------------------------------------------------*/

async function loadImage(url, elem) {
    return new Promise((resolve, reject) => {
        elem.onload = () => resolve(elem);
        elem.onerror = reject;
        elem.src = url;
    });
}
/*
var items = [];
var defaultSize = 5;

function generateItems() {
  for (let i = 0; i < db.length; i++) {
    items[i] = new Item(random(width), random(height), defaultSize, 0, db[i].id);
  }
}

class Item {
  constructor(x, y, s, c, id_n) {
    this.over = false;
    this.move = false;
    this.tempPos = this.pos = createVector(x, y);
    this.restPos = createVector(x, y);
    this.size = s;
    this.scale = 1;
    this.mass = 8.0;

    this.color = c;
    this.selected = false;
    this.textRotation = 0;
    this.alignment = 0;

    this.id = id_n;
    this.title = nam;
    this.year = year;
    this.showTitle = false;
    this.displayLines = false;
    this.mouseDistance = -1;
  }

  addToDom() {
    var i = createDiv();
    i.id(this.id);
    i.parent(select(html));
    if (displayEllipse) {
      ellipse(this.tempPos.x, this.tempPos.y, this.size, this.size);
    }
    if ((displayTitle) || (this.showTitle)) {
      push();
      translate(this.tempPos.x, this.tempPos.y);
      rotate(this.textRotation);
      switch (alignment) {
        case 0:
          textAlign(LEFT, CENTER);
          break;
        case 1:
          textAlign(CENTER, CENTER);
          break;
        case 2:
          textAlign(RIGHT, CENTER);
          break;
      }
      textSize(map(this.size, 1, 20, 1, 40));
      text(this.title, 0, 0);
      pop();
    }
  }

  update() {
    this.over=false;
    if (this.pos != this.restPos) {
      this.pos.x = lerp(this.pos.x, this.restPos.x, 0.05);
      this.pos.y = lerp(this.pos.y, this.restPos.y, 0.05);
    }
    this.color = color(0, 255);
    if (centered) this.mouseDistance = dist(mouseX - width / 2, mouseY - height / 2, this.pos.x, this.pos.y);
    else this.mouseDistance = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    this.size = defaultSize;
    if (this.mouseDistance < 50) {
      this.showTitle = true;
      if (this.mouseDistance < 10) {
        this.size = 12;
        this.color = color(0, 255);
        this.over=true;
        if(stage==0) {
        for (var i = 0; i < dataYear.length; i++) {
          items[i].displayLines=false;
        }
        this.displayLines=true;
      }
    } else {
        this.size += map(this.mouseDistance, 10, 50, 6, 1);
        this.color = color(0, map(this.mouseDistance, 10, 50, 80, 20));
      }
    } else this.showTitle = false;
  }

  display() {
    if ((this.displayLines)&&(stage==1)) {

      noFill();
      stroke(128);
      strokeWeight(0.2);
      let key;
      for (var i = 0; i < uniqueCategories.length; i++) {
        if (dataYear[this.id].genre == uniqueCategories[i])
          key = i;
      }

      if (key != 0) fakeBezier(this.tempPos.x, this.tempPos.y, marginLeftTimeline+key * timelineSpaceInBetween, height - 50+(key%2*20));

      noStroke();
    }

    if ((this.displayLines)&&(stage==0)) {

      noFill();
      stroke(128);
      strokeWeight(0.2);
      let key;
      for (var i = 0; i < uniqueCategories.length; i++) {
        if (dataYear[this.id].genre == uniqueCategories[i])
          key = i;
      }

      if (key != 0) fakeBezier(this.tempPos.x, this.tempPos.y,  0, -height*.5+hh+30*key );
      noStroke();
    }

    fill(color(this.color));
    if (displayEllipse) {
      ellipse(this.tempPos.x, this.tempPos.y, this.size, this.size);
    }
    if ((displayTitle) || (this.showTitle)) {
      push();
      translate(this.tempPos.x, this.tempPos.y);
      rotate(this.textRotation);
      switch (this.alignment) {
        case 0:
          textAlign(LEFT, CENTER);
          break;
        case 1:
          textAlign(CENTER, CENTER);
          break;
        case 2:
          textAlign(RIGHT, CENTER);
          break;
      }
      textSize(map(this.size, 1, 20, 1, 40));
      text(this.title, 0, -15);
      pop();
    }
  }

  goTo(x, y, tr, str) {
    this.restPos.x = x;
    this.restPos.y = y;
    this.textRotation = tr;
    this.alignment = str;
  }
}*/