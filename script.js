const request = indexedDB.open("rrscoutingDB",1);
let db;

var output = document.getElementById("output");

function deleteTeam(e){
  console.log(e +" " +  e.length);
  const tx = db.transaction("teams","readwrite");
  const store = tx.objectStore("teams");
  store.delete(parseInt(e));
  displayData();
}//end delete teams

function add(){
  var teamToAdd = parseInt(document.getElementById("TeamNumb").value);
  var teamNameToAdd = document.getElementById("TeamName").value;
  if(teamToAdd=="" || teamNameToAdd == ""){
    return;
  }else{
    const tx = db.transaction("teams", "readwrite");
const store = tx.objectStore("teams");
store.put({ teamNumb: teamToAdd, teamName: teamNameToAdd });

  }
  displayData();
}//end add function

request.onupgradeneeded = function (event) {
  // The database did not previously exist, so create object stores and indexes.
  const db = request.result;
  if(event.oldVersion < 1){
  const store = db.createObjectStore("teams", { keyPath: "teamNumb" });
  
  const teamIndex = store.createIndex("by_team", "teamNumb");
  const teamNameIndex = store.createIndex("by_teamName","teamName");
//    const authorIndex = store.createIndex("by_author", "author");*/

  // Populate with initial data.
  store.put({ teamNumb: 4152, teamName: "Hoya Robotics" });
  /*  store.put({title: "Water Buffaloes", author: "Fred", isbn: 234567});
    store.put({title: "Bedrock Nights", author: "Barney", isbn: 345678});*/
    }//end if
  //future upgrades
  //if(event.oldVersion < 2){
    
  //}end if
};//end upgrade

request.onsuccess = function () {
  db = request.result;
  console.log(db);
  displayData();
};

function displayData() {
const tx = db.transaction("teams", "readonly");
const store = tx.objectStore("teams");
const index = store.index("by_team");
  const request = index.getAll();
  request.onsuccess = function () {
    console.log("success");
    console.log(request.result);
    const matching = request.result;
    console.log(matching.length);
    if (matching !== undefined) {
      // A match was found.
      output.innerHTML = "<ul>";
      for(var i = 0; i < matching.length; i++){
      output.innerHTML += "<li>" + matching[i].teamNumb+" - " + matching[i].teamName + " <button onclick=\"deleteTeam('"+matching[i].teamNumb+"')\"> - </button></li>";
      }
      output.innerHTML += "</ul>";

     // report(matching.isbn, matching.title, matching.author);
    } else {
      // No match was found.
      console.log(null);
    }
  };
}//end displayData