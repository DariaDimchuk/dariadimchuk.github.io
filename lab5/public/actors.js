class Actor{
    id;
    name;
    description;
    avatarImg;

    constructor(id, name, descr, avatar){
        this.id = id;
        this.name = name;
        this.description = descr;
        this.avatarImg = avatar;
    }
}

var actors = [];


async function loadActors(search = ""){
    if(search.length > 0){
        const response = await fetch("/search/" + search, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        actors = await response.json();
    } else {
        const response = await fetch('/getall');
        actors = await response.json();
    }
}

async function loadPage(){
	await loadActors();
	displayActors();
}


function toggleInsert(){
    var x = document.getElementById("addActor");
    document.getElementById("add-actor-error").style.display = 'none';

    if (x.style.display === "none") {
        x.style.display = "block";
        generateAvatarImg();
    } else {
        x.style.display = "none";
        x.reset();
    }
}

function showNoArtistsFoundMsg(){
    var emptyTbl = document.getElementById("empty-table");
    if(actors.length === 0){
        emptyTbl.style.display = "flex";
    } else{
        emptyTbl.style.display = "none";
    }
}

async function search(){
    var input = document.getElementById("search-input").value;
    input = input.toLowerCase();

    await loadActors(input);
    displayActors();
}


async function deleteArtist(){
    var id = document.getElementById(this.value).id;
    var params = JSON.stringify({idToDelete: id});

    await fetch("/delete", {
        method: "POST",
        body: params,
        headers: { 'Content-Type': 'application/json' }
    });

    await loadPage();
    showNoArtistsFoundMsg();
}


async function addActor() {
    var name = document.getElementById("name").value;
    var desc = document.getElementById("description").value;
    var avatar = document.getElementById("avatar").value;

    var err = document.getElementById("add-actor-error");

    if(name.length == 0 || desc.length == 0 || avatar.length == 0){
        err.innerText = "Error: name, description and Image url are required fields.";
        err.style.display = 'block';
        return false;
    }

    if(name.length > 40 || desc.length > 40){
        err.innerText = "Error: name and description must be < 40 characters.";
        err.style.display = 'block';
        return false;
    }

    //no errors detected
    err.style.display = 'none';

    var params = JSON.stringify({ name: name, desc: desc, url: avatar });

    await fetch("/add", {
        method: "POST",
        body: params,
        headers: { 'Content-Type': 'application/json' }
    });

    await loadActors();

    toggleInsert(); //hides & resets form
    displayActors(); //refreshes list
}


function displayActors(){
    var actor_list_tbl = document.getElementById("artist-table");

    while(actor_list_tbl.hasChildNodes()){
        actor_list_tbl.removeChild(actor_list_tbl.firstChild);
    }

    for(var i = 0; i < actors.length; i++){
        var actor_div = document.createElement("div");
        actor_div.setAttribute('id', actors[i].id);
        actor_div.className += " actor-flex-1 actor-element";

        var avatarImg = document.createElement("img");
        avatarImg.className += " actor-avatar";
        avatarImg.src = actors[i].avatarImg;


        var actor_name = document.createElement("span");
        actor_name.className += " actor_name";
        actor_name.textContent = actors[i].name;
        actor_name.appendChild(document.createElement("br"));


        var actor_details = document.createElement("div");
        actor_details.className += " actor_details";

        var actor_descr = document.createElement("span");
        actor_descr.className += " desc_of_actor";
        actor_descr.textContent = actors[i].description;

        //must append in such an order
        actor_details.appendChild(actor_name);
        actor_details.appendChild(actor_descr);

        var del = document.createElement("div");
        del.className += "delete";
        var delBtn = document.createElement("button");
        delBtn.textContent += "Delete";
        delBtn.value = actors[i].id;
        delBtn.addEventListener("click", deleteArtist);
        del.appendChild(delBtn);

        actor_div.appendChild(avatarImg);
        actor_div.appendChild(actor_details);
        actor_div.appendChild(del);
        actor_list_tbl.appendChild(actor_div);
    }

    showNoArtistsFoundMsg();
}


 function generateAvatarImg(){
     var femUrl = "https://randomuser.me/api/portraits/med/women/";
     var maleUrl = "https://randomuser.me/api/portraits/med/men/";

     var extension = ".jpg";

     var index = Math.floor(Math.random() * 99); //between 0 and 99

     var chosenUrl = Math.random() < 0.5 ? femUrl : maleUrl;
     var generatedAvatarUrl = chosenUrl + index + extension;

     var avatarInput = document.getElementById("avatar");
     avatarInput.value = generatedAvatarUrl;
 }

