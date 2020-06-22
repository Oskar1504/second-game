

var element_felder = document.getElementsByClassName("field");
var element_button = document.getElementsByClassName("button_shop");
var array_felder = [];
var array_hauser = [];
var inventar = [];
var index_array_felder = 0,
	index_array_hauser =0,
	clock_value = 0,
	gold = 1000,
	selected_button = "none",
	selected_field = "none";

function start(){
	
	//pushed für jedes field html element ein field json obj in ein array
	for(var i=0;i<element_felder.length;i++){
		array_felder.push(create_field_obj(i));
		//set texture
		element_felder[i].style.backgroundImage = 'url(bilder/'+array_felder[i].biom.id+'.png)';
		/*console.log(array_felder[i].id+"\n"+array_felder[i].type+"\n"+array_felder[i].haus.id);*/
	}
	
	//initalisiert die button und zeigt direkt den ersten an
	array_hauser.push(haus.mensch,haus.holzfaller,haus.mine,haus.sagewerk,haus.steinmetz);
	button_setup();
	
	//initalisiert das inventar
	inventar.push(items.none,items.nahrung,items.holz,items.lehm,items.stein,items.bretter,items.erz);
	
	//gametick
	clock();
	
	//debuged alle wichtigen werte
	show_field_info();
	show_general_info();
}
function clock(){
	setTimeout(function(){
		
		
		
		//zählt clock hoch
		clock_value++;
		//zeigtr alle values
		show_general_info();
		//endless loop
		clock();
		//ressourcenberechnung
		ressourcenberechnung();
	
	},1000);
}

function ressourcenberechnung(){
	//geht durch alle felder durch
	for(var i=0;i<element_felder.length;i++){
		//geht durch alle häuser durch
		for(var j=0;j<array_hauser.length;j++){
			//schaut welches haus auf dem feld steht
			if(element_felder[i].classList.contains(array_hauser[j].id)){
				//geht durch das inventar durch um consume item amount zu testen
				for(var y = 1;y<inventar.length;y++){
					//schaut ob des consume genug vorhanenden ist und auf welchen slot es ist
					if(array_hauser[j].consume_item == inventar[y].id&&array_hauser[j].consume_amount<=inventar[y].amount){
						//geht nochmal durch die hauser durch da ich ja zwei items bearbeiten muss
						for(var l=0;l<array_hauser.length;l++){
							//schaut welcehs haus auf dem feld steht
							if(element_felder[i].classList.contains(array_hauser[l].id)){
								//geht durchs inventar durch
								for(var k = 1;k<inventar.length;k++){
									//schaut ob wir am consume item slot sind
									if(array_hauser[l].consume_item == inventar[k].id){
										//zieht die consume menge aus dem lager ab
										inventar[k].amount=inventar[k].amount-array_hauser[l].consume_amount;
									}
									//schaut ob wir am output item slot sind
									if(array_hauser[l].output == inventar[k].id){
										//fügt die menge an output items hinzu wie es das haus hat
										inventar[k].amount=inventar[k].amount+array_hauser[l].mining_rate;
									}
									//schaut ob das haus ein mensch ist da menschen alles abbauen können und kein output item haben schaut auf welchen biom der mensch steth
									if(l==0&&array_felder[i].biom.output == inventar[k].id){
										inventar[k].amount=inventar[k].amount+array_hauser[l].mining_rate;
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
//creates individuelle feld objekte
function create_field_obj(index_nummer){
	return {
	 "id":"field_"+index_nummer,
	 "biom":get_biom(),
	 "haus":haus.none
	}
}

//random biom generation
function get_biom(){
	var factor = Math.floor(Math.random() * 5);
	var xbiom = "ocean";
	switch (factor) {
		case 0:
			xbiom = biom.ocean;
			break;
		case 1:
			xbiom = biom.wald;
			break;
		case 2:
			xbiom = biom.wiese;
			break;
		case 3:
			xbiom = biom.lehm;
			break;
		case 4:
			xbiom =biom.gebirge;
	}
	
	return xbiom
}

//field auswahl
function field_selection(id){
	for(var i = 0;i<element_felder.length;i++){
		element_felder[i].classList.remove("selected_field");
	}
	id.classList.add("selected_field");
	for(var i = 0;i<element_felder.length;i++){
		if(element_felder[i].classList.contains("selected_field")){
			index_array_felder =i;
		}
	}
	debug_everything();
	show_field_info();
}

//erstellt soviele buttoon wie hauser ium spiel 
	//muss angepasst werden mit ner for begrenzung
function button_setup(){
	var  button_array_ende =1;
	var inner_html_shop = "<p class = \"info button_shop\" onclick = \"button_selection(this);\" data-array-button-index = 0>test</p>";
	for(var i = 0;i<4;i++){
		inner_html_shop = inner_html_shop+"<p class = \"info button_shop\" onclick = \"button_selection(this);\" data-array-button-index = 0>test</p>";
		
	}
	document.getElementById("button_shop_kasten").innerHTML = inner_html_shop;
	for(var i =0;i<element_button.length;i++){
		if(i==0){
			element_button[i].classList.add("selected_button");
			button_selection(element_button[i]);
		}
		element_button[i].setAttribute("data-array-button-index",i);
		element_button[i].innerHTML = array_hauser[i+(button_array_ende-1)].id;
	}
}
//button auswahl
function button_selection(ids){
	for(var i = 0;i<element_button.length;i++){
		element_button[i].classList.remove("selected_button");
		
	}
	ids.classList.add("selected_button");
	selected_button = array_hauser[ids.getAttribute("data-array-button-index")];
	index_array_hauser = ids.getAttribute("data-array-button-index");
	document.getElementById("shop_item_info").innerHTML = "Id: "+selected_button.id+"<br>Preis: "+selected_button.preis+"<br>Miningrate: "+selected_button.mining_rate+"<br>Consumes: "+selected_button.consume_item+" "+selected_button.consume_amount+"<br>Output: "+selected_button.output;
}

function kaufen(){
	if(array_hauser[index_array_hauser].preis<gold&&element_felder[index_array_felder].classList.contains(selected_button.id) == false&&array_felder[index_array_felder].biom.id != "ocean"){
		element_felder[index_array_felder].classList.add(selected_button.id);
		console.log(selected_button);
		array_felder[index_array_felder].haus = array_hauser[index_array_hauser];
		gold = gold-array_hauser[index_array_hauser].preis;
		element_felder[index_array_felder].style.backgroundImage = 'url(bilder/'+array_hauser[index_array_hauser].id+'.png),url(bilder/'+array_felder[index_array_felder].biom.id+'.png)';
	}
}
function verkaufen(){
	element_felder[index_array_felder].classList.remove(selected_button.id);
}

function show_field_info(){
	var feld = array_felder[index_array_felder];
	document.getElementById("field_info").innerHTML = "Field id: "+feld.id+"<br>Field biom: "+feld.biom.id+"<br>Ressources: "+feld.biom.output+"<br>Field house: "+feld.haus.id;
}

function show_general_info(){
	document.getElementById("general_info").innerHTML = "Clock: "+clock_value+"<br>Gold: "+gold;
	
	show_lager_info();
}

function show_lager_info(){
	var output = "";
	for(var i= 0;i<inventar.length;i++){
		output = output+(inventar[i].id+": "+inventar[i].amount+"<br>")
	}
	document.getElementById("lager_info").innerHTML = output;
}

function marketplace(){
	var marketplace_inhalt = "<p class = \"info\"><span>dwads</span><span>dwasdw</span></p><p>Swag</p><p>Swag</p><p>Swag</p>";
	var ment = document.getElementById("marketplace");
	ment.innerHTML = marketplace_inhalt;
}

function debug_everything(){
	console.log(array_felder[1].id + " " +array_felder[1].biom.id + " " +array_felder[1].biom.output + " " +array_felder[1].haus.id + " " +array_felder[1].haus.consume_item  );
}


function debug(input){
	console.log(input);
}