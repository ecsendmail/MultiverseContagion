// ****************************************************************************
// check if DOM (document object model) exists ********************************
// ****************************************************************************
console_log("paramSIMVL 2021.03.25 GUI-HTML parameter CovidSIMVL");
console_log(Date());



function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

/*
var use_html = false;
let x = GetURLParameter("use_html");
if (x===undefined){
  x = true
}
use_html = x;
alert(use_html);
*/
/*
try {
    document // does DOM exist?
} catch {
    use_html = false // if DOM doesn't exist, assume we're running from R / v8
}
*/


var lines = [];
var loadresult;
var COLLECTION;

var fullCt = 0;
var VIEW = "local";
var MODE = "manual"; // or "MV" - master controller of behavior
var graphFlag = "NO";


var cn = [];
var offX = 75;
var offY = 100;
var pHz = "300" + "px";
var pVt = (200).toString() + "px";

var c;

/******************************************************************************************************************* */

/*                                  BELONGS TO JSON CreateNode                                                      */

/********************************************************************************************************************/


function startParam(){
      //alertX("Load param.json file starting");
      myLoad("param.json");
      JSONprocessData(COLLECTION);
      //alertX("Finished with parameter loading");
}

function myLoad(xfname) {
    iLoad(xfname);
    COLLECTION = loadresult.x;
  }

 var txt = '';
 function iLoad(xFile){
     var xmlhttp = new XMLHttpRequest();
     xmlhttp.onreadystatechange = function(){
         if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
              txt = xmlhttp.responseText;
              loadresult = JSON.parse(txt);
         }
     };
     xmlhttp.open("GET","http://localhost:3001/"+xFile,false);
     xmlhttp.send();
 }

 function errorHandler(evt) {
     if (evt.target.error.name == "NotReadableError") {
         alertX("Cannot read file !");
     }
 }

 function JSONprocessData(one) {
     var allTextLines = one.split(/\r\n|\n/);
     lines = [];
     while (allTextLines.length) {
         lines.push(allTextLines.shift().split(','));
     }
     JSONprocessL();
 }

 function JSONprocessL() {
     let i, j;
     var inType = lines[0][0];
     switch (inType){
             case "Parameters":
                 JSONprocessParam();
                 break;
             case "Population":
                 JSONprocessPop()
                 break;
             case "Cases":
                JSONprocessCase();
                break;
             default:
               console_log("File format error");
               alertX("File Format error");
     }
 }

function JSONprocessParam(){
    initMV();
    let i=0;
    lines.shift();
    let lineNo = lines.length;
    let parx;
    for (i=0;i<lineNo;i++){
      parx = lines[i][0];
      let parN = lines[i][1];
      switch(parx){
          case "population":
              initPopn(parN);
              console_log("Population parameter set to "+parN);
              break;
          case "UN":
              M.UCt = Number(lines[i][1]);
              JSONinitUn();
              let p;
              for (p=0;p<M.UCt;p++){
                UN[p] = lines[i][p+1];
              }
              break;
          case "HzR":
              changeHzR(parN);
              break;
          case "sizeF":
              let univ = lines[i][2];
              chSizeF(parN,univ);
              break;
          case "mF":
              let u2 = lines[i][2];
              changeMF(parN,u2);
              break;
          case "RedDays":
              changeRedDays(parN);
              break;
          case "pop file":
              popnFileName = parN;
              break;
          case "case file":
              caseFileName = parN;
              break;
          case "STOP":
              HALTgen = Number(parN);
              break;
          case "":
              break;
          default:
              console_log("Error in Parameter File format");
              alertX("Error in parameter file format");
              break;
      }
    }
}


var popnFileName;
function startPopFile(){
      console_log("Reading population file "+popnFileName);
      myLoad(popnFileName);
      JSONprocessData(COLLECTION);
      console_log("Population File loaded");
}

var caseFileName;
function startCaseFile(){
      console_log("Reading Case File "+caseFileName);
      myLoad(caseFileName);
      JSONprocessData(COLLECTION);
      console_log("Case File loaded");
}

function JSONprocessPop() {
    lines.shift();
    lines.shift();
    initTicket();
    let i;                //gets rid of row labels
    let lineNo = lines.length;
    for (i = 0; i < lineNo; i++) {
          if (parseL(lines[i])) {
              setupTicket();
          }
    }
}

function JSONprocessCase() {
    let i=0;
    lines.shift();                  //gets rid of row labels
    lines.shift();
    let lineNo = lines.length;
    for (i = 0; i < lineNo; i++) {
        if (!parseC(lines[i])) break;
    }
}


function parseC(lineStr) {
    let lineS = lineStr;
    if (lineS == "" || lineS === undefined) return false;
    let ID = Number(lineS[0]);

    if (P[ID].pID === undefined || P[ID].pID == "null") return false;

    P[ID].ageGp = Number(lineS[1]); // age group
    P[ID].suscIndx = Number(lineS[2]); // combined risk
    if (P[ID].suscIndx != 0) {
        resizeRisk(ID)
    };

    if (Number(lineS[3]) === undefined || Number(lineS[3]) == "") {} else P[ID].ViralLoad = Number(lineS[3]);
    if (Number(lineS[4]) === undefined || Number(lineS[4]) == "") {} else P[ID].tInfect = 0 - Number(lineS[4]);

    // resizeVL(ID);     //we grow VL for one cycle, so resize after growth
    caseState(ID); //changes state and color by post-inf days

    if (lineS[5] === undefined || lineS[5] == "") {} else P[ID].role = lineS[5];
    if (Number(lineS[6]) === undefined || Number(lineS[6]) == "") {} else P[ID].minglf = Number(lineS[6]);
    return true;
}



var oneTime = 0;
function JSONinitUn() {
    let i,j;
    oneTime = 0;
    for (i = 0; i < M.UCt; i++) {
        U[i] = new CreateUniverse();
        initUniv(U[i], i);
    }
    initEpiCenters();
}

/*************************** END JSON SPECIFIC ROUTINES *******************************************/
/*
/*                           start html GUI SPECIFIC FILE ROUTINES *******************************
/*
/***************************************************************************************************/


function handleFiles(files) {
    if (use_html) {
        // Check for the various File API support.
        if (window.FileReader) {
            // FileReader supported
            console.log("getAsText", files[0])
            getAsText(files[0]);
        } else {
            alert('FileReader are not supported in this browser.');
        }
    }
}

function getAsText(fileToRead) {
    console.log(fileToRead);
    var reader = new FileReader();
    reader.onload = loadHandler; // handle errors load
    reader.onerror = HTerrorHandler;
    reader.readAsText(fileToRead); // read file into memory as utf-8
}

function loadHandler(event) {
    var csv = event.target.result;
    HTprocessData(csv);
}

function HTprocessData(one) {
    var allTextLines = one.split(/\r\n|\n/);
    lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
    }
    HTprocessLines();
}

function HTerrorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Cannot read file !");
    }
}

function HTprocessLines() {
    let i, j;
    if (lines[0][0] == "Population") {
        initSetPopUniv();
        lines.shift(); // one for the population and universe parameters
        lines.shift(); // one for the CSV column headers
        initTicket();
        var lineNo = lines.length;
        for (i = 0; i < lineNo; i++) {
            if (parseL(lines[i])) {
                setupTicket();
            }
          }
          document.getElementById("FName").innerHTML = "Now select Cases File";
          GUIstyle("getFile","block");
          return;

    };
    if (lines[0][0] == "Cases"){
        lines.shift();
        lines.shift();
        procClines();
        return;
    }
    if (lines[0][0] == "Parameters"){
        lines.shift();
        HTprocParam();
      }
        GUIstyle("getFile","none");
        startMain();

  }

function initSetPopUniv(){
    M.PCt = Number(lines[0][1]);
    if (lines[0][2] != ""){
        M.UCt = Number(lines[0][3]);
        let i;
        for (i=0;i<M.UCt;i++){
          UN[i] = lines[0][i+4]
        }
        initUniverse();       // use defaults if entry is null
        initPopn(M.PCt);
    }
    console_log("Population specified as: "+M.PCt);
    console_log("Universes: "+M.UCt);
}

function initUniverse(){
  let i;
  for (i = 0; i < M.UCt; i++) {
      U[i] = new CreateUniverse();
      initUniv(U[i], i);
  }
  initEpiCenters();
  initGUI();
}

  function initPopn(pnum){
        M.PCt = Number(pnum);
        M.GreenCt = M.PCt;
        let i,j;
        for (i = 0; i < M.PCt; i++) {
            P[i] = new CreatePerson;
            initPerson(P[i], i);
        }
        initAgeTable();
  }


function parseL(lineStr) {
    let lineS = lineStr;
    if (lineS == "") return false;
    let ID = Number(lineS[0]);
    transfer.pID = ID;
    transfer.stopno = Number(lineS[1]);
    transfer.ETA = Number(lineS[2]);
    transfer.AU = Number(lineS[3]);
    transfer.ETD = Number(lineS[4]);
    transfer.TU = Number(lineS[5]);
    transfer.role = lineS[6];
    transfer.Mx = Number(lineS[7]);
    let trAgeGp = lineS[8];
    trAgeGp = Math.round(trAgeGp);
    let trFam = lineS[9];
    if (ID==pID && ID !=0) {return true}    // first one is 0
    else {
//    			if (lineS[8]=="" || lineS[8] === undefined) {return true };
      P[ID].ageGp = trAgeGp;
      AG[trAgeGp].total++;
      P[ID].famKey = -1;
      if (trFam!="" && trFam!==undefined) {P[ID].famKey=trFam};
    };
    return true;
}

/* ********************************************************************************** */

function procClines(){
    var cLinesNo = lines.length;
    let i;
    for (i=0;i<cLinesNo;i++){
          if (!parseC(lines[i])) break;
    }
    document.getElementById("FName").innerHTML = "Select Parameter File if Any";
    GUIstyle("getFile","block");
    let x = prompt("If parameter file enter Y else enter N");
    if (x=="Y" || x=="y") {
//      HTprocParam();
    } else {
      GUIstyle("getFile","none");
      startMain();
    }
}

function HTprocParam(){
    let lineNo = lines.length;
    let i = 0;
    let parx;
    for (i=0;i<lineNo;i++){
        parx = lines[i][0];
        let parN = lines[i][1];
        switch(parx){
          case "ID":
            M.ID = parN;
            break;
          case "HzR":
              changeHzR(parN);
              break;
          case "sizeF":
              let univ = lines[i][2];
              chSizeF(parN,univ);
              break;
          case "mF":
              let u2 = lines[i][2];
              changeMF(parN,u2);
              break;
          case "RedDays":
              changeRedDays(parN);
              break;
          case "STOP":
              HALTgen = Number(parN);
              break;
          case "":
              break;
          default:
              break;
        }
    }
}


function startMain(){
          GUIstyle("getFile","none");
          VIEW = "local";
          load();
          load();
          hideMV();
          GUIstyle("graphCanvas","none");
          GUIstyle("controls","block");
          VIEW = "local";
          netFlag = true;
          MVtoggle = false;
          hideMV();
}


  function initPCtUCt(){
        let Mtxt = prompt("Enter population size, number of Universes as: n,m without commas");
        let Mx, My, Mz;
        Mx = Mtxt.indexOf(",");
        if (Mx==-1) {
            console_log("Population and Univ parameters in error");
            alertX("Halt on prompt POPULATION, UNIVERSE error");
            throw "input error";
        }
        My = Mtxt.substring(0,Mx);
        Mz = Mtxt.substring(Mx+1);
        M.PCt = Number(My);
        M.UCt = Number(Mz);
        console_log("Population specified as: "+M.PCt);
        console_log("Universes: "+M.UCt);
  }



  var slider;
  function initSliders(){
    slider = document.getElementById("myRange");
    slider.oninput = function() {
        clearInterval(clockTimer);
        MOTION = this.value * 500;
        clockTimer = setInterval(TimesUp, MOTION / FPS);
    }
  }

    // *********************************** CREATE CANVASES FOR EACH PANE *******************************

    function drawc(x, y, rad, color, ctx) {
        if (!use_html) { return };
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "black";
    }

    /*

    function CreateCanvases() {
        this.cid;
        this.width;
        this.height;
        this.style.top;
        this.style.left;
        this.ctx;
    }

    */

    /***********************************************************************************************************************************************/

    function createField() {
            c = document.getElementById("fields").children;

            for (let i = 0; i < c.length; i++) {
                let x = 0;
                let y = 0;
                cn[i] = document.getElementById(c[i].id);
                cn[i].cid = c[i].id;
                cn[i].width = 300;
                cn[i].height = 250;
                cn[i].style.top = ((x % 3) * 300 + offX).toString() + "px";
                cn[i].style.left = ((y % 3) * 300 + offY).toString() + "px";
                x++;
                y++;
                cn[i].ctx = cn[i].getContext("2d");
            }
    }

    var canp1;
    var ctx1;
    function crCanp1(){
              canp1 = document.getElementById("canp1");
              canp1.width = 300;
              canp1.height = 250;
              canp1.style.top = "75px";
              canp1.style.left = "100px";

              ctx1 = canp1.getContext("2d");
              ctx1.fillStyle = "MidnightBlue";
              ctx1.fillRect(0, 0, canp1.width, canp1.height);
              drawc(10, 10, 8, "green", ctx1);
    }

    var canp2;
    var ctx2;
    function crCanp2(){
              canp2 = document.getElementById("canp2");
              canp2.width = 300;
              canp2.height = 250;
              canp2.style.top = "75px";
              canp2.style.left = "400px";

              ctx2 = canp2.getContext("2d");
              ctx2.fillStyle = "MidnightBlue";
              ctx2.fillRect(0, 0, canp2.width, canp2.height);
              drawc(10, 10, 8, "green", ctx2);
    }

    var canp3;
    var ctx3;
    function crCanp3(){
              canp3 = document.getElementById("canp3");
              canp3.width = 300;
              canp3.height = 250;
              canp3.style.top = "75px";
              canp3.style.left = "700px";

              ctx3 = canp3.getContext("2d");
              ctx3.fillStyle = "MidnightBlue";
              ctx3.fillRect(0, 0, canp3.width, canp3.height);
              drawc(10, 10, 8, "green", ctx3);
    }


    var canp4;
    var ctx4;
    function crCanp4(){
            canp4 = document.getElementById("canp4");
            canp4.width = 300;
            canp4.height = 250;
            canp4.style.top = "375px";
            canp4.style.left = "100px";

            ctx4 = canp4.getContext("2d");
            ctx4.fillStyle = "MidnightBlue";
            ctx4.fillRect(0, 0, canp4.width, canp4.height);
            drawc(10, 10, 8, "green", ctx4);
    }


    var canp5;
    var ctx5;
    function crCanp5(){
            canp5 = document.getElementById("canp5");
            canp5.width = 300;
            canp5.height = 250;
            canp5.style.top = "374px";
            canp5.style.left = "400px";

            ctx5 = canp5.getContext("2d");
            ctx5.fillStyle = "MidnightBlue";
            ctx5.fillRect(0, 0, canp5.width, canp5.height);
            drawc(10, 10, 8, "green", ctx5);
    }


    var canp6;
    var ctx6;
    function crCanp6(){
              canp6 = document.getElementById("canp6");
              canp6.width = 300;
              canp6.height = 260;
              canp6.style.top = "375px";
              canp6.style.left = "700px";

              ctx6 = canp6.getContext("2d");
              ctx6.fillStyle = "MidnightBlue";
              ctx6.fillRect(0, 0, canp6.width, canp6.height);
              drawc(10, 10, 8, "green", ctx6);
    }


    var canp7;
    var ctx7;
    function crCanp7(){
              canp7 = document.getElementById("canp7");
              canp7.width = 300;
              canp7.height = 250;
              canp7.style.top = "675px";
              canp7.style.left = "100px";

              ctx7 = canp7.getContext("2d");
              ctx7.fillStyle = "MidnightBlue";
              ctx7.fillRect(0, 0, canp7.width, canp7.height);
              drawc(10, 10, 8, "green", ctx7);
    }

    var canp8;
    var ctx8;
    function crCanp8(){
              canp8 = document.getElementById("canp8");
              canp8.width = 300;
              canp8.height = 250;
              canp8.style.top = "675px";
              canp8.style.left = "400px";

              ctx8 = canp8.getContext("2d");
              ctx8.fillStyle = "MidnightBlue";
              ctx8.fillRect(0, 0, canp8.width, canp8.height);
              drawc(10, 10, 8, "green", ctx8);
    }


    var canp9;
    var ctx9;
    function crCanp9(){
              canp9 = document.getElementById("canp9");
              canp9.width = 300;
              canp9.height = 250;
              canp9.style.top = "675px";
              canp9.style.left = "700px";
              ctx9 = canp9.getContext("2d");
              ctx9.fillStyle = "MidnightBlue";
              ctx9.fillRect(0, 0, canp9.width, canp9.height);
              drawc(10, 10, 8, "green", ctx9);
    }

    function crCanpn(){
        crCanp1();
        crCanp2();
        crCanp3();
        crCanp4();
        crCanp5();
        crCanp6();
        crCanp7();
        crCanp8();
        crCanp9();
    }


/**********************************************************************************************/

    function mouseMove1() {
        document.getElementById("canp1").style.border = "thick solid yellow";
    }
    function mouseOut1() {
        document.getElementById("canp1").style.border = "thin  solid blue";
    }
    function mouseClick1() {
    }



    function mouseMove2() {
        document.getElementById("canp2").style.border = "thick solid yellow";
    }
    function mouseOut2() {
        document.getElementById("canp2").style.border = "thin  solid blue";
    }
    function mouseClick2() {
    }
    function playVid2() {
    }
    function pauseVid2() {
    }



    function mouseMove3() {
        document.getElementById("canp3").style.border = "thick solid yellow";
    }
    function mouseOut3() {
        document.getElementById("canp3").style.border = "thin  solid blue";
    }
    function mouseClick3() {
    }



    function mouseMove4() {
        document.getElementById("canp4").style.border = "thick solid yellow";
    }
    function mouseOut4() {
        document.getElementById("canp4").style.border = "thin  solid blue";
    }
    function mouseClick4() {
    }
    function playVid4() {
    }
    function pauseVid4() {
    }



    function mouseMove5() {
        document.getElementById("canp5").style.border = "thick solid yellow";
    }
    function mouseOut5() {
        document.getElementById("canp5").style.border = "thin  solid blue";
    }
    function mouseClick5() {
    }



    function mouseMove6() {
        document.getElementById("canp6").style.border = "thick solid yellow";
    }
    function mouseOut6() {
        document.getElementById("canp6").style.border = "thin  solid blue";
    }
    function mouseClick6() {
    }




    function mouseMove7() {
        document.getElementById("canp7").style.border = "thick solid yellow";
    }
    function mouseOut7() {
        document.getElementById("canp7").style.border = "thin  solid blue";
    }
    function mouseClick7() {
    }




    function mouseMove8() {
        document.getElementById("canp8").style.border = "thick solid yellow";
    }
    function mouseOut8() {
        document.getElementById("canp8").style.border = "thin  solid blue";
    }
    function mouseClick8() {
    }



    function mouseMove9() {
        document.getElementById("canp9").style.border = "thick solid yellow";
    }
    function mouseOut9() {
        document.getElementById("canp9").style.border = "thin  solid blue";
    }
    function mouseClick9() {
    }


    // ************************************ CREATE CANVAS PANES *******************************************

    var winP = [];

    function CreateWinP() {
        this.ctx;
        this.canp;
    }

    function initWinP(){
            for (let i = 1; i < 10; i++) {
                winP[i] = new CreateWinP;
            }

            winP[1].ctx = ctx1;
            winP[1].canp = canp1;
            winP[2].ctx = ctx2;
            winP[2].canp = canp2;
            winP[3].ctx = ctx3;
            winP[3].canp = canp3;
            winP[4].ctx = ctx4;
            winP[4].canp = canp4;
            winP[5].ctx = ctx5;
            winP[5].canp = canp5;
            winP[6].ctx = ctx6;
            winP[6].canp = canp6;
            winP[7].ctx = ctx7;
            winP[7].canp = canp7;
            winP[8].ctx = ctx8;
            winP[8].canp = canp8;
            winP[9].ctx = ctx9;
            winP[9].canp = canp9;
    }


    // *************************** the following are mouse click functions but of course can be called elsewhere *****

    function selPane1() {
        //GUI("panel","Hello World");
        GUI("pane1","Hello, World");
    }

    function selPane2() {
    }

    function selPane3() {
    }

    function selPane4() {
    }

    function selPane5() {
    }

    function selPane6() {
    }

    function selPane7() {
    }

    function selPane8() {
    }

    function selPane9() {
    }





    // ***************************************************** NAMES OF UNIVERSES **************************

    var UN = [];
    function loadUNames(){

        	UN[0] = "0 CLASSROOM 1";
        	UN[1] = "1 PROJECT/LAB";
        	UN[2] = "2 PLAYGROUND";
        	UN[3] = "3 LUNCHROOM";
        	UN[4] = "4 CLASSROOM 2";
        	UN[5] = "5 TEACHER LOUNGE";
        	UN[6] = "6 LONG TERM CARE";
        	UN[7] = "7 BAR/DANCE/RECEPTION";
        	UN[8] = "8 HOME";
    }

    function loadMVnames() {
        var text = prompt("Enter names of the Universes as a list separated by commas. No quotes necessary.");
        parseMVnames(text);
    }

    function parseMVnames(x) {
        let i, y, z;
        if (x == "" || x == null) return;

    		for (i = 0; i < M.UCt; i++) {
    			y = x.indexOf(",", 0);
    			if (y == -1) break;
    			UN[i] = (x.substring(0, y));
    			x = x.substring(y + 1);
          if (i==0){chart7.options.title.text = UN[0]};
          if (i==1){chart8.options.title.text = UN[1]};
          if (i==2){chart9.options.title.text = UN[2]};
          if (i==3){chart10.options.title.text = UN[3]};
          if (i==4){chart11.options.title.text = UN[4]};
          if (i==5){chart12.options.title.text = UN[5]};
          if (i==6){chart13.options.title.text = UN[6]};
          if (i==7){chart14.options.title.text = UN[7]};
          if (i==8){chart15.options.title.text = UN[8]};
		    showMVname();
      }
    }

    function showMVname() {
//      document.getElementById("pane1").innerHTML = UN[0].fontcolor("white");

        let i = M.UCt;
        if (i>0) {GUI("row1","UN[0]")};
        if (i>1) {GUI("row2","UN[1]")};
        if (i>2) {GUI("row3","UN[2]")};
        if (i>3) {GUI("row4","UN[3]")};
        if (i>4) {GUI("row5","UN[4]")};
        if (i>5) {GUI("row6","UN[5]")};
        if (i>6) {GUI("row7","UN[6]")};
        if (i>7) {GUI("row8","UN[7]")};
        if (i>8) {GUI("row9","UN[8]")};


        i = M.UCt;
        if (i>0) {GUI("pane1",UN[0].fontcolor("white"))};
        if (i>1) {GUI("pane2",UN[1].fontcolor("white"))};
        if (i>2) {GUI("pane3",UN[2].fontcolor("white"))};
        if (i>3) {GUI("pane4",UN[3].fontcolor("white"))};
        if (i>4) {GUI("pane5",UN[4].fontcolor("white"))};
        if (i>5) {GUI("pane6",UN[5].fontcolor("white"))};
        if (i>6) {GUI("pane7",UN[6].fontcolor("white"))};
        if (i>7) {GUI("pane8",UN[7].fontcolor("white"))};
        if (i>8) {GUI("pane9",UN[8].fontcolor("white"))};
    }


    /**************************************************************************************************/

    function rBlues() {
        let ranB, id, univ;
        var txt = prompt("Enter number of travelom conversion to Infected State");
        GUI("rBlueNum",txt);
        if (txt == "" || txt == undefined) return;
        ranB = parseInt(txt);
        for (let i = 0; i < ranB; i++) {
            id = Math.floor(Math.random() * M.PCt);
            if (P[id].u != -1) {
                univ = P[id].u;
                U[univ].blueCt++;
                U[univ].greenCt--;
            }
            P[id].state = "blue";
            P[id].clr = "blue";
            P[id].infectStart = cD;

        }
    }




    // *************************************** DISPLAY MATRIX AND PROBABILITY DIStrIButioNS ******************

    var MVtoggle = false;

    function hideMV() {
        if (MVtoggle) {
            showMV();
            MVtoggle = false;
        } else {
            MVtoggle = true;
            if (use_html) {
                GUIstyle("myTab","block");
                GUIstyle("gameCanvas","block");
                GUIstyle("localCharts","block");
                GUIstyle("fields","block");
                GUIstyle("MVstats0","none");
                GUIstyle("MVstats1","none");
                GUIstyle("MVstats2","none");
                GUIstyle("MVstats3","none");
                GUIstyle("MVstats4","none");
                GUIstyle("MVstats5","none");
                GUIstyle("MVstats6","none");
                GUIstyle("MVstats7","none");
                GUIstyle("MVstats8","none");
                GUIstyle("MVcharts","none");
                GUIstyle("dayhr","none");
                GUIstyle("windowpane","none");
                GUIstyle("fields","none");
                GUIstyle("MVmatrix","none");
                GUIstyle("MV-menu","none");
            }
            VIEW = "local";
            if (gen > 0) {
                drawRect(0, 0, canWidth, canHeight, "black");
                canvTxt(15, 30, cD, cH, vU);
                drawU();
                upDateGraph(U[vU], vU);
                drawEpi();
            }
        }
    }

    function showMV() {
        GUIstyle("myTab","none");
        GUIstyle("gameCanvas","none");
        GUIstyle("localCharts","none");

        let i = M.UCt;
        if (i>0){GUIstyle("MVstats0","block")};
        if (i>1) {GUIstyle("MVstats1","block")};
        if (i>2) {GUIstyle("MVstats2","block")};
        if (i>3) {GUIstyle("MVstats3","block")};
        if (i>4) {GUIstyle("MVstats4","block")};
        if (i>5) {GUIstyle("MVstats5","block")};
        if (i>6) {GUIstyle("MVstats6","block")};
        if (i>7) {GUIstyle("MVstats7","block")};
        if (i>8) {GUIstyle("MVstats8","block")};

        GUIstyle("MVcharts","block");
        GUIstyle("dayhr","block");
        GUIstyle("windowpane","block");
        GUIstyle("fields","block");
        GUIstyle("MVmatrix","block"); //for now
        GUIstyle("MV-menu","block");
        //showMVname();

        VIEW = "MV";
        upDateGraph(U[vU], vU);
        GUI("day",("DAY:\n" + cD));
        GUI("hour",("HOUR:\n" + cH));
        showMVname();

    }


    /* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

                      THESE ARE THE CHARTS AND OBJECTS UNIVERSE

       $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    */

    const LTC = 1;
    const HOME = 0;

    var U = []; // local Universes
    var P = []; // all people in the system
    var T = []; // one ticket per person - 24hr or 1 week?
    var D = [];
    var H = []; // timer-based schedule of events - arr depart
    var AG = []; // age groups
    var ageRiskT = [];

    var toTime = 0;
    var toDD = 9999;
    var toHH = 0;

    var cD = 0; // not sure if we will use as globals
    var xD = 0; // last defined day with schedule
    var cH = 0; // initialization of 5AM
    var cP = 0;
    var cT = 0; // for combined time DD*100+HR
    var cS = 0; // current stop
    var pID = 0;

    var vU = 0; // visible U
    var wU = 0; // working U

    var gen = 0;
    var R0;
    var M = new ConstructMVC;

    // for Fixed U which opertes in days, the following are viral loads starting from 1, to peak VL
    // as 10 on days as indexes of the array -peak at 4d to 6 days
    // NOTE that infectiousness is at VL 3.6 and above, so by postInfDay 13 no longer infective

    var tViral = [0,1,2.20,10,10,10,10,8,7,5.5,4,3,2,1,1,1,1,1,0.7,0.5,0.1,0.01];

    // temporal transmission Model from t=0 of infection

    var VLlower = 2.0;        // viral load at day 2.2
    var VLincD = 2.2;         // day 2.2 infectious begins - yellow -> blue
    var VLpeak0 = 3.2;        // day 3.2 VL peak 10 - from 2 days before symptom onset
    var VLpeakVL = 10;        // VL peak load from day 4.2 to day 7.2 (one before, two after)
    var VLonsetT = 5.2;       // onset symptoms
    var VLpeakFnd = 6.2;      // peak VL to one day after onset
    var VLinfEnd = 13.2;      // infectiousness ends 13.2 day after infection
    var VLprePeakRate = 1.069; // every 0.1 days
    var VLpostPeak = 0.865;
    var VLradius = 5;


    function CreateAgeGP() {
      this.AGname;
      this.total;
      this.vax;
      this.vaxGen;
      this.infected;
    }

    function ConstructMVC() {
        this.ID;
        this.UCt; // count of Universes
        this.PCt;
        this.GreenCt; // these are totals of all universes at this time
        this.YellowCt;
        this.BlueCt;
        this.RedCt;
        this.OrangeCt; // total count of population
        this.Cases;
        this.R0;
        this.clockDay; // the Master Clock Day
        this.clockHr; // the Master Clock clock hour

        this.logGreen = [];
        this.logYellow = [];
        this.logBlue = [];
        this.logRed = [];
        this.logOrange = [];
        this.logCases = [];
        this.logR0 = [];
        this.endGreen = [];
        this.endYellow = [];
        this.endBlue = [];
        this.endRed = [];
        this.endOrange = [];
        this.Delta = [];
        this.endCases = [];
        this.endVelocity = [];
        this.endR0 = [];

        this.tIncubate;
        this.qInfective;
        this.tPeakVL;
        this.qPeakVL;
        this.tInfectEnd;
        this.tOnset;
        this.tInert;
    }


    function initMV(){
          M.ID = "MV-LTC"
          M.UCt = 9;
          M.GreenCt = M.PCt; // these are totalled from U's
          M.YellowCt = 0;
          M.BlueCt = 0;
          M.RedCt = 0;
          M.OrangeCt = 0;
          M.Cases = 0;
          M.R0 = 0;
          M.clockDay = 0;
          M.clockHr = 0;

          M.logGreen = [];
          M.logYellow = [];
          M.logBlue = [];
          M.logRed = [];
          M.logOrange = [];
          M.logCases = [];
          M.logR0 = [];
          M.endGreen = [];
          M.endYellow = [];
          M.endBlue = [];
          M.endRed = [];
          M.endOrange = [];
          M.endRedDelta = [];
          M.endCases = [];
          M.endVelocity = [];
          M.endR0 = [];

          M.tIncubate = VLincD;
          M.qInfective = VLlower;
          M.tPeakVL = VLpeak0;
          M.qPeakVL = VLpeakVL;
          M.tInfectEnd = VLinfEnd;
          M.tOnset = VLonsetT;
          M.tInert = VLinfEnd;
    }

    // ************************  this describes a local universe *********************************************************

    function CreateUniverse() {
        this.uID;
        this.name; // universe name
        this.Population; // universe current population
        this.gen = 0; // do we need this in U
        this.Resident; // these population numbers will change every hour perhaps
        this.Attached;
        this.Transient;
        this.minglf;
        this.sizeFactor;
        this.greenCt; // these counts reflect the status of this universe at this time
        this.yellowCt;
        this.blueCt;
        this.redCt;
        this.orangeCt;
        this.allTouch;
        this.cases;
        this.infectHere = [];
        this.canvas;

        this.arr = [];
        this.dep = [];
        this.depT = [];
        this.day;
        this.hour;
        this.person = [];

        this.logDay = [];
        this.logGreen = [];
        this.logYellow = [];
        this.logBlue = [];
        this.logRed = [];
        this.logOrange = [];
        this.logAllTouch = [];
        this.logCases = [];
        this.endGreen = [];
        this.endYellow = [];
        this.endBlue = [];
        this.endRed = [];
        this.endOrange = [];
        this.endCases = [];
        this.endRedDelta = []; // we need this to point to the persons there - just pIDs
        this.endVelocity = [];

        this.vaxMode = 0;
        this.vaxGroup = 0;
        this.vaxAgeGp = -1;
    }

    function initUniv(U, i) {
        U.uID = i;
        U.name = "U" + i;
        U.Population = 0;
        U.gen = 0;
        U.Resident = 0;
        U.Attached = 0;
        U.Transient = 0;
        U.minglf = 1;
        U.sizeFactor = 1;
        U.greenCt = 0;
        U.yellowCt = 0;
        U.blueCt = 0;
        U.redCt = 0;
        U.orangeCt = 0;
        U.allTouch = 0;
        U.cases = 0;
        U.infectHere = [];
        U.canvas = "";

        U.arr = [];
        U.dep = [];
        U.depT = [];

        U.day = 0;
        U.hour = 0;
        U.person = [];
        U.logDay = [];
        U.logGreen = [];
        U.logYellow = [];
        U.logBlue = [];
        U.logRed = [];
        U.logOrange = [];
        U.logAllTouch = [];
        U.logCases = [];
        U.endGreen = [];
        U.endYellow = [];
        U.endBlue = [];
        U.endRed = [];
        U.endOrange = [];
        U.endCases = [];
        U.endRedDelta = []; // we need to point to the persons there - just pIDs
        U.endVelocity = [];

        U.vaxMode = 0;
        U.vaxGroup = 0;       // % of population
        U.vaxAgeGp = -1;      // for now, work on latest change, and use console_log to track them
    };


    function CreateType() {
        this.gCt = 0;
        this.yCt = 0;
        this.bCt = 0;
        this.rCt = 0;
        this.oCt = 0;
        this.resCt = 0;
        this.attCt = 0;
        this.visCt = 0;
    }

    function initNet(Q, gen) {
        Q.arr[gen] = new CreateType();
        Q.dep[gen] = [];
        Q.depT[gen] = new CreateType();
        let Y = Q.dep[gen];
        let i;
        for (i = 0; i < M.UCt; i++) {
            Y[i] = new CreateType()
        }
    }

    // *************************** CREATE PERSON PROTOTYPES *************************************************
    //

    function CreatePerson() { // the persistent info for a person
        this.pID; // issued in multiverse - most of this data generated in MULTIVERSE
        this.state; // uninfected; incubating; infectious; disagnosed; inert
        this.ageGp;
        this.role;
        this.suscIndx;
        this.prevVL;
        this.ViralLoad;
		    this.famKey;
        this.convT;
        this.gen;

        this.tInfect;
        this.tIncubate;
        this.qInfective;
        this.tPeakVL;
        this.qPeakVL;
        this.tInfectEnd;
        this.tOnset;
        this.tInert;

        this.baseSize;
        this.currSize;
        this.minglf;
        this.X;
        this.Y;
        this.OldX;
        this.OldY;
        this.newX;
        this.newY;
        this.delX;
        this.delY;
        this.ddx;
        this.ddy;

        this.vaxD = 0;       // becomes 75% effective in 14 days lasts 28 + 14 days then zero
        this.vaxType = 0;    // 1 - follows schedule above;  2 - at 28d becomes 95%


        /* %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

                                        LOCAL PERSON DATA STARTS here

           $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */

        this.day;
        this.hour; // strictly local information
        //    this.stopCt;            // these in Ticket already?
        //    this.stop = [];
        this.u;
        this.ETA;
        this.ETD;

        this.touchCt;
        this.susCt;
        this.failedCt;
    }


    function initPerson(P, i) {
        P.pID = i;
        P.state = "green";
        P.clr = "green";
        P.age = -1;
        P.ageGp = 0;
        P.role = "R";
        P.suscIndx = 1;
        P.prevVL = 0;
        P.ViralLoad = 0;
		    P.famKey = -1;
        P.gen = 0;

        P.tInfect = 0;
        P.tIncubate = stochast(VLincD, 0.05);
        P.qInfective = stochast(VLlower, 0.05);
        P.tPeakVL = stochast(VLpeak0, 0.05);
        P.qPeakVL = stochast(VLpeakVL, 0.05);
        P.tInfecTnd = stochast(VLinfEnd, 0.05)
        P.tOnset = stochast(VLonsetT, 0.05);
        P.tInert = stochast(VLinfEnd, 0.05);

        P.baseSize = stochast(VLradius, 0.05);
        P.currSize = P.baseSize;
        P.minglf = 1;
        P.X = 0;
        P.Y = 0;
        P.old = 0;
        P.old = 0;
        P.newX = 0;
        P.newY = 0;
        P.delX = 0;
        P.delY = 0;
        P.ddx = 0;
        P.ddy = 0;

        P.day = 0;
        P.hour = 0;
        P.u = -1;
        P.ETA = 0;
        P.ETD = 0;
        P.touchCt = 0;
        P.susCt = 0;
        P.failedCt = 0;

        P.vaxD = 0;       // becomes 75% effective in 14 days lasts 28 + 14 days then zero
        P.vaxType = 0;    // 1 - follows schedule above;  2 - at 28d becomes 95%


    }

    // %%%%%%%%%%%%%%%%%%%%%%%%% NOW SET UP ALL THE LOCAL INFO BEFORE SPECIALIZING $$$$$$$$$$$$$$$$$$$$$$
    //

    function stochast(b, factor) {
        if (b==0) {b=0.0001};
        let pb = (Math.random() * factor) * b;
        if (Math.random() * 2 > 1) {pb = -pb};
//        return(b+pb);
        return (b * (1 - factor) + pb)
    }



    // ******************************************************************************************************
    //
    //                              CREATE SCHEDULE AND TICKET POINTERS TO PERSONS BY HOUR
    //
    // ******************************************************************************************************
    //


    function initTicket(){
            let i;
            for (i = 0; i < M.PCt; i++) {
                T[i] = new CreateTicket();
                T[i].pID = i;
                T[i].S = [];
            }
    }


    function CreateTicket() {
        this.pID;
        this.S = [];
    }

    function CreateStop() {
        this.pID;
        this.uHere;
        this.ETA;
        this.uDest;
        this.ETD;
        this.R; // RESIDENT, ATTACHED, TRANSIENT
        this.M; // deegree of mingling 0 to 10 - loner to pollster
    }

    function CreateTransfer() {
        this.pID;
        this.stopno;
        this.ETA;
        this.AU;
        this.ETD;
        this.TU;
        this.role;
        this.Mx;
    }



    function CreateD() {
        this.DD;
        this.H = [];
    }

    function CreateH() {
        this.HH;
        this.u;
        this.cID;
        this.cS;
        this.cDir;
    }


    function setupTicket() {
        let tr = transfer;
        let Tx;
        let sno;

        Tx = new CreateStop;
        if (tr.pID == pID || tr.pID == "" || tr.pID === undefined) {
            Tx.pID = pID;
        } else {
            Tx.pID = tr.pID;
            pID = tr.pID; // break - new playVid2
        }
        Tx.uHere = tr.AU;
        Tx.ETA = tr.ETA;
        Tx.uDest = tr.TU;
        if (tr.AU == tr.TU) {
            Tx.ETD = -1
        } else {
            Tx.ETD = tr.ETD;
        }
        Tx.R = tr.role;
        Tx.M = tr.Mx;
        sno = tr.stopno;
        T[pID].S[sno] = Tx;

        let t, d, h;
        let X;

        t = Tx.ETA;
        d = Math.floor(t / 100); // time  in ddhh
        h = t % 100;
        if (D[d] === undefined || D[d] == null) {
            D[d] = new CreateD();
        }
        D[d].DD = d;
        X = new CreateH();
        X.HH = h;
        X.u = Tx.uHere;
        X.cID = pID;
        X.cS = sno;
        X.cDir = "A";
        if (D[d].H[h] === undefined || D[d].H[h] == "") {
            D[d].H[h] = [];
        }
        D[d].H[h].push(X);

        if (tr.AU == tr.TU) return;

        t = Tx.ETD;
        d = Math.floor(t / 100);
        h = t % 100;
        if (D[d] === undefined || D[d] == null) {
            D[d] = new CreateD();
        }
        D[d].DD = d;
        X = new CreateH();
        X.HH = h;
        X.u = Tx.uHere;
        X.cID = pID;
        X.cS = sno;
        X.cDir = "D";
        if (D[d].H[h] === undefined || D[d].H[h] == "") {
            D[d].H[h] = [];
        }
        D[d].H[h].push(X);
    }



    function resizeRisk(ID) {
        let Q = P[ID];
        Q.baseSize = Q.baseSize * Math.cbrt(Q.suscIndx);
        Q.currSize = stochast(Q.baseSize, 0.05);
    }


    function caseState(ID){
          let G = P[ID];
          let postInfect = (cT - G.tInfect);
          if (postInfect < G.tIncubate){
              G.state = "yellow";
              G.clr = "yellow";
              M.YellowCt++;
              return;
          };
          if (postInfect < G.tOnset){
              G.state = "blue";
              G.clr = "blue";
              M.blueCt++;
              return;
          };
          if (postInfect < G.tInert){
              G.state = "red";
              G.clr = "red";
              M.RedCt++;
          }
    }

    // must test to see if these are transitions
    function changeState(ID) {
        let G = P[ID];
        let postInfect = (cT - G.tInfect);
        if (G.u == -1) {
            return
        }
        let q = P[ID].u;
        let Q = U[q];

        if (postInfect > 0) {
            if (postInfect < G.tIncubate) {
                if (G.ViralLoad > 0)
                  {newState(ID, "yellow")};
                return
            }
            if (postInfect < G.tOnset) {
                if (G.ViralLoad > G.qInfective)
                  {newState(ID, "blue")};
                return
            }
            if (postInfect < G.tInert) {
                if (G.ViralLoad > G.qInfective)
                  {newState(ID, "red")};
                return
            }
            newState(ID, "orange");
        }
        showUstat(Q,q);
    }

    function newState(ID, newState) {
        let G = P[ID];
        let q = P[ID].u;
        let Q = U[q];
        switch (G.state) {
            case "green":
                Q.greenCt--;
                M.GreenCt--;
                if (newState=="yellow"){
                  let r = Q.infectHere.length;
                  Q.infectHere[r] = [gen,r+1];
                }
                break;
            case "yellow":
                Q.yellowCt--;
                M.YellowCt--;
                break;
            case "blue":
                Q.blueCt--;
                M.BlueCt--;
                break;
            case "red":
                Q.redCt--;
                M.RedCt--;
                Q.cases--;
                break;
            case "orange":
                Q.orangeCt--;
                M.OrangeCt--;
                Q.cases--;
                break
        }
        G.state = newState;
        G.clr = newState;
        switch (G.state) {
            case "yellow":
                Q.yellowCt++;
                M.YellowCt++;
                break;
            case "blue":
                Q.blueCt++;
                M.BlueCt++;
                break;
            case "red":
                Q.redCt++;
                M.RedCt++;
                Q.cases++;
                break;
            case "orange":
                Q.orangeCt++;
                M.OrangeCt++;
                Q.cases++;
                break;
        }
    }


    // **************************** start at 0600 end at 2200 *************************************


    const FPS = 30;
    var MOTION = 5000;

    var canWidth = 800;
    var canHeight = 600;

    var bx = []; //presumably ball center
    var by = [];
    var xv = []; //velocity in x and y directions
    var yv = [];
    var bColor = [];

    var canvas, ctx;

    function blackCanvas(selCan){
        if (selCan=="game"){
            canvas = document.getElementById("gameCanvas");
            GUIstyle("gameCanvas","block");
          }
        else {
            if (selCan == "graph"){
                canvas = document.getElementById("graphCanvas");
                GUIstyle("graphCanvas","block");
            }
        }
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "source-over";
    }


    var travel = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8, 9];
    var dIRECTION = [-1, 0, 1];
    var rand, randint;

    //hideMV();

    function Epicenter() {
        this.X;
        this.Y;
        this.perim;
    }


    var perim = 20;
    var epic1, epic2, epic3, epic4, epic5;
    function initEpiCenters(){
          epic1 = new Epicenter;
          epic1.X = canWidth / 4;
          epic1.Y = canHeight / 4;
          epic1.perim = 30;
          epic2 = new Epicenter;
          epic2.X = canWidth / 4;
          epic2.Y = canHeight / 4 * 3;
          epic2.perim = 30;
          epic3 = new Epicenter;
          epic3.X = canWidth / 4 * 3;
          epic3.Y = canHeight / 4;
          epic3.perim = 30;
          epic4 = new Epicenter;;
          epic4.X = canWidth / 4 * 3;
          epic4.Y = canHeight / 4 * 3;
          epic4.perim = 30;
          epic5 = new Epicenter;
          epic5.X = canWidth / 2;
          epic5.Y = canHeight / 2;
          epic5.perim = 30;

          epic1.X = epic3.X;
          epic2.X = epic3.X;
          epic4.X = epic3.X;
          epic5.X = epic3.X;
          epic1.Y = epic3.Y;
          epic2.Y = epic3.Y;
          epic4.Y = epic3.Y;
          epic5.Y = epic3.Y;
          epic1.perim = perim;
          epic2.perim = perim;
          epic3.perim = perim;
          epic4.perim = perim;
          epic5.perim = perim
    }




    function canvTxt(x, y, day, hr, u) {
        if (!use_html) { return };
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Day" + day + "   HR:" + hr + "  U" + u, x, y);
        ctx.fillText("gen "+gen,15,60);
    }

    function drawC(x, y, rad, color) {
        if (!use_html) { return };
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();

    }

    function drawCross(x, y, width, height, clr) {
        if (!use_html) { return };
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.fillStyle = clr;
        ctx.fillRect(x, y, width, height);
        ctx.fillRect(Math.round(x + width / 2 - height / 2), Math.round(y + height / 2 - width / 2), height, width);
    }

    function drawRect(x, y, width, height, clr) {
        if (!use_html) { return };
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.fillStyle = clr;
        ctx.fillRect(x, y, width, height);
    }

    function drawEpi() {
        if (!use_html) { return };
            drawCross(epic1.X, epic1.Y, 5, 1, "pink");
            drawCross(epic2.X, epic2.Y, 5, 1, "pink");
            drawCross(epic3.X, epic3.Y, 5, 1, "pink");
            drawCross(epic4.X, epic4.Y, 5, 1, "pink");
            drawCross(epic5.X, epic5.Y, 5, 1, "pink");
            canvTxt(15, 30, cD, cH, vU);
    }

    function drawAgent(x, y, g, clrFlag) {
        if (!use_html) { return };
            fullCt++;
            let clr, size;
            size = P[g].currSize;
            //    canvTxt(15,30,cD,cH,vU);
            if (clrFlag == -1) {
                clr = P[g].state;
            } else {
                clr = clrFlag;
            }

            switch (P[g].role) {
                case "R":
                    drawC(x, y, size, clr);
                    break;
                case "A":
                    drawCross(x, y, 2 * size, size / 2, clr);
                    break;
                case "T":
                    drawRect(x, y, 1.5 * size, 1.5 * size, clr);
            }
    }

    function drawU() {
        if (!use_html) { return };
        let i, j, k, m;
        drawRect(0, 0, canWidth, canHeight, "black");
        drawRect(0, 0, 270, 80, "#00000044");
        canvTxt(15, 30, cD, cH, vU);

       ctx.beginPath();
       ctx.font = "30px Arial";
       ctx.fillStyle = "white";
       ctx.fillText("gen "+gen,15,60);

      k = U[vU].person.slice(0);
      m = k.length;
      for (i = 0; i < m; i++) {
          j = k.pop();
          drawAgent(P[j].X, P[j].Y, j, -1);
      }
  }



    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //
    //          these functions deal with parameter settings by user incl slider
    //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    var metInfectMax;
    var metDiagMax;

    function showIncD() {
        let incTxt = prompt("Current incubation days as shown below. Enter new value if desired, otherwise cancel", VLincD);
        let incDays = Number(incTxt);
        GUI("dIncD",incDays);
        if (incDays === null || incDays == "" || incDays == VLincD) return;
        VLincD = incDays;
        M.tIncubate = VLincD;
        let pCt = 0;
        for (pCt = 0; pCt < M.PCt; pCt++) {
            P[pCt].tIncubate = stochast(VLincD, 0.05);
        }
    }

    function showInfD() {
        let infTxt = prompt("Current asymptomatic transmission days shown below. To change, enter new value else cancel", VLonsetT);
        let infDays = Number(infTxt);
        GUI("dInfD",infDays);
        if (infDays === null || infDays == "" || infDays == VLonsetT) return;
        VLonsetT = infDays;
        let pCt = 0;
        for (pCt = 0; pCt < M.PCt; pCt++) {
            P[pCt].tOnset = stochast(VLonsetT, 0.05);
        }
    }

    function showCliD() {
        let cliTxt = prompt("Current days of infectivity after case is symptomatic or tested positive \nTo\
 change enter new value between 5.2 and 13.2 or cancel (applies to REDs)", VLinfEnd);
        changeRedDays(cliTxt);

    }

    function changeRedDays(cliTxt){
        GUI("dCliD",cliTxt);
        console_log("Red Days changed to "+cliTxt);
        let cliDays = Number(cliTxt);
        if (cliDays === null || cliDays == "" || cliDays == VLinfEnd) return;
        VLinfEnd = cliDays;
        let pCt = 0;
        for (pCt = 0; pCt < M.PCt; pCt++) {
            P[pCt].tInert = stochast(VLinfEnd, 0.05);
        }
    }


    function showCycle() {
        let infTxt = prompt("Current activity events per hour. To change, enter new value else cancel", cycleMax);
        let infCyc = Number(infTxt);
        GUI("dCycl",infCyc);
        if (infCyc === null || infCyc == "" || infCyc == cycleMax) return;
        cycleMax = infCyc;
    }

  function showPradius() {
        let rTxt = prompt("Enter Hazard Radius", VLradius);
        changeHzR(rTxt);
    };


    function changeHzR(rTxt){
          GUI("dPrad",rTxt);
          if (rTxt === null || rTxt == "" || rTxt == VLradius) return;
          let HzR = Number(rTxt);
          console_log("New Hazard Radius = "+rTxt);

          VLradius = HzR;
          let pCt = 0;
          for (pCt = 0; pCt < M.PCt; pCt++) {
              let rRatio = P[pCt].currSize / P[pCt].baseSize;
              P[pCt].baseSize = VLradius;
              P[pCt].currSize = VLradius * rRatio;
          }
    }

    function chSizeF(x,u){
        console_log("Size Factor in U "+x+" U"+u);
        U[u].sizeFactor = Number(x);
    }

  function showMingle(){
    	   var txt = prompt("Enter Mingle Factor, Universe as: i,j where mF from 0.1 to 10 and Univ = 1-9");
         let x,y,z;
         x = txt.indexOf(",",0);
         if (y==-1){ return };
         y = txt.substring(0,x);
         z = txt.substring(x+1);
    	   changeMF(y,z);
    	}

  function changeMF(newMF,univ){
        GUI("dMingl",newMF);
        let nu;
        console_log("new Mingle Factor in Universe = "+newMF+" U"+univ);
        if (univ == "" || univ === undefined){ nu = vU }
        else {nu = univ};

        U[nu].minglf = Number(newMF);
  }

  function showVax(){
    let txt = prompt("Enter AgeGroup and %  as m,n eg 1,20\n0 = <10; 1=10-19; 2=20-29 etc....9=90+");

    GUI("vaxnow",txt);
    console_log("Age Group "+txt+" 1st shot; 2nd auto in 35days");
    let y = txt.indexOf(",",0);
    if (y==-1) {return};
    U[vU].vaxAgeGp = Math.round(txt.substring(0,y));
    U[vU].vaxGroup = Math.round(txt.substring(y+1));
    U[vU].vaxMode = 2;    // for now, always 2
    console_log("Gen"+gen+" AgeGp ="+U[vU].vaxAgeGp+" To be vaccinated="+U[vU].vaxGroup+"%");
    let vax = U[vU].vaxGroup;
    let ages = U[vU].vaxAgeGp;
    implementVax(ages,vax);
}

function implementVax(ages,vax){
    // create list of susceptibles (global)
    var susList = [];
    var susvxCt = 0;
    var aCt = U[vU].Population;
    console_log(U[vU].person);
    for (let i=0;i<aCt; i++){
      let k = U[vU].person[i];
      let pAge = P[k].ageGp;

      if (P[k].state != "green"){
         continue}
      else {
         if (pAge == ages){
             susList[susvxCt] = k;
             susvxCt++;
             AG[ages].vax++;
             AG[ages].vaxGen = gen;
          }
      }
    }
    console_log("ageGp"+ages+" count: "+susvxCt+" List: "+susList);


        // now apply % away
        let target = parseInt(susvxCt*vax/100);
        console_log("Vaccination list = "+target);
        if (target==0) {return};
        let vaxed = [];
        for (i=0; i<target; i++){
          let selectvax = parseInt(Math.random()*susvxCt);
          let j = susList[selectvax];
          vaxed.push(j);
          susList.splice(selectvax,1);
//          P[j].ViralLoad = 0;
          P[j].vaxD = cD;
          P[j].vaxType = U[vU].vaxMode;
          susvxCt--;

      }
      console_log("AgeGp"+ages+" vaccinated "+target+" List: "+vaxed);

  }


    function sizeP(G, g) {
        return (G.currSize);
    }

    var ageRiskT = [];
    function initAgeTable(){
      let j;
      for (j=0;j<10;j++){
          AG[j] = new CreateAgeGP();
          initAG(AG[j],j);
      }
          ageRiskT[0] = {
              low: 0,
              high: 9,
              risk: 0.33
          };
          ageRiskT[1] = {
              low: 10,
              high: 19,
              risk: 0.44
          };
          ageRiskT[2] = {
              low: 20,
              high: 29,
              risk: 0.90
          };
          ageRiskT[3] = {
              low: 30,
              high: 39,
              risk: 1.10
          };
          ageRiskT[4] = {
              low: 40,
              high: 49,
              risk: 1.08
          };
          ageRiskT[5] = {
              low: 50,
              high: 59,
              risk: 1.15
          };
          ageRiskT[6] = {
              low: 60,
              high: 69,
              risk: 0.96
          };
          ageRiskT[7] = {
              low: 70,
              high: 79,
              risk: 1.05
          };
          ageRiskT[8] = {
              low: 80,
              high: 89,
              risk: 1.49
          };
          ageRiskT[9] = {
              low: 90,
              high: 99,
              risk: 2.33
          };
    }

    function initAG(AG,agp){
      AG.total = 0;
      AG.vax = 0;
      AG.vaxGen = 0;
      AG.infected = 0;
      switch(agp){
        case 0: AG.AGname = "<10";
             break;
        case 1: AG.AGname = "10-19";
             break;
        case 2: AG.AGname = "20-29";
             break;
        case 3: AG.AGname = "30-39";
             break;
        case 4: AG.AGname = "40-49";
             break;
        case 5: AG.AGname = "50-59";
             break;
        case 6: AG.AGname = "60-69";
             break;
        case 7: AG.AGname = "70-79";
             break;
        case 8: AG.AGname = "80-99";
             break;
        case 9: AG.AGname = "90++";
      }
    }



    function ageRisk(G, g) {
        let i;
        if (G.age == "") return (1);
        if (G.age >= 90) return (2.33);
        for (i = 0; i < 10; i++) {
            if (G.age >= ageRiskT[i].low && G.age <= age[i].high)
                return (ageRiskT[i]);
        }
    }

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    //
    //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    var epic;

    function moveItmoveIt() {
        let i, j, k, n, len;
        let Q;

        cycleCount = 0;

        let cy = cycleCount;

        for (cy = 0; cy < cycleMax; cy++) {
            if (wU == vU && VIEW == "local") drawRect(0, 0, canWidth, canHeight, "black");
            if (wU == vU && VIEW == "local") drawEpi();

            Q = U[wU];
            k = Q.person;
            len = k.length;
            for (i = 0; i < len; i++) {
                j = k[i];
                proposeMove(P[j], j);
                epic = nearestEpicenter(P[j].newX, P[j].newY);
                //        adjminglf(P[j],j,epic);
                //        findOverlap(P[j],j,U[wU],wU);
                testOverlap(P[j], j, i);

                if (wU == vU && VIEW == "local") drawAgent(P[j].X, P[j].Y, j, "black");

                P[j].X = P[j].newX;
                P[j].Y = P[j].newY;
                if (wU == vU && VIEW == "local") {
                    drawAgent(P[j].newX, P[j].newY, j, -1);
                }
                if (wU == vU && VIEW == "local") showUstat(U[wU], wU);
            }
        }

        if (wU == vU && VIEW == "local") drawU();
        if (wU == vU && VIEW == "local") showUstat(U[wU], wU);
    }

    // #######################################################################

    var delX, delY;

    function proposeMove(G, g) {
        let randx = Math.floor(Math.random() * 43);
        G.delX = travel[randx] * G.currSize / 2;
        let randy = Math.floor(Math.random() * 43);
        G.delY = travel[randy] * G.currSize / 2;

		let sumMing = U[vU].minglf * G.minglf;

		G.delX = G.delX * sumMing;
		G.delY = G.delY * sumMing;

        if ((Math.random() * 2) > 1) {
            G.delX = -G.delX;
        }
        if ((Math.random() * 2) > 1) {
            G.delY = -G.delY;
        }
        G.newX = G.X + G.delX;
        G.newY = G.Y + G.delY;

        testWall(G, g);
    }

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    function testWall(G, g) {
        if (G.newX - G.currSize / 2 < 0 && G.delX < 0) {
            G.delX = -G.delX;
        }
        if (G.newX + G.currSize / 2 > canWidth && G.delX > 0) {
            G.delX = -G.delX;
        }
        if (G.newY - G.currSize / 2 < 0 && G.delY < 0) {
            G.delY = -G.delY;
        }
        if (G.newY + G.currSize / 2 > canHeight && G.delY > 0) {
            G.delY = -G.delY;
        }

        G.newX = G.X + G.delX;
        G.newY = G.Y + G.delY;
        if (G.newX < 0) {
            G.newX = 10;
            G.delX = G.X - G.newX;
        }
        if (G.newX > canWidth) {
            G.newX = canWidth - 10;
            G.delX = G.newX - G.X;
        }
        if (G.newY < 0) {
            G.newY = 10;
            G.delX = G.Y - G.newY;
        }
        if (G.newY > canHeight) {
            G.newY = canHeight - 10;
            G.delX = G.newY - G.Y;
        }
    }


    // ***************************************************************************

    var raMax, yLength;

    function testOverlap(G, g, indx) {
        let touchFlag = false;
        let j = 0;
        let Q = U[wU];
        let k = Q.person;
        for (j = indx + 1; j < k.length; j++) {
            if (j != indx) {
                let F = P[k[j]];
                let xDelta = (G.X - F.X) ** 2;
                let yDelta = (G.Y - F.Y) ** 2;
                yLength = Math.sqrt(xDelta + yDelta);

                raMax = G.currSize + F.currSize;
                if (yLength > raMax) { touchFlag = false;
                    } else {
                        touchFlag = true;
                        Q.allTouch++;
                        // console_log("overlap g,h = "+g+","+k[j]+": "+G.state+","+F.state);
                }
        				if (touchFlag && (wU != 8)) {VLtransfer(g, k[j])			//U8 is HOME always
            				} else {
            						if (G.famKey == F.famKey && G.famKey != -1) {VLtransfer(g, k[j])};
            	  }
				     }
        }
    }



    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

    function nearestEpicenter(x, y) {
        let dist1, dist2, dist3, dist4, win1, win2, winner1, winner2;
        dist1 = Math.floor((x - epic1.X) ** 2 + (y - epic1.Y) ** 2);
        dist2 = Math.floor((x - epic2.X) ** 2 + (y - epic2.Y) ** 2);
        dist3 = Math.floor((x - epic3.X) ** 2 + (y - epic3.Y) ** 2);
        dist4 = Math.floor((x - epic4.X) ** 2 + (y - epic4.Y) ** 2);
        dist5 = Math.floor((x - epic5.X) ** 2 + (y - epic5.Y) ** 2);


        if (dist2 > dist1) {
            win1 = dist1;
            winner1 = epic1;
        } else {
            win1 = dist2;
            winner1 = epic2;
        }

        if (dist4 > dist3) {
            win2 = dist3;
            winner2 = epic3;
        } else {
            win2 = dist4;
            winner2 = epic4;
        }

        if (win2 > win1) {
            if (win1 > dist5) {
                return (epic5)
            } else return (winner1)
        } else {
            if (win2 > dist5) {
                return (epic5)
            } else return (winner2);
        }
    }

    function adjminglf(G, g, epic) {
        let delX, delY;
        G.delX = Math.abs(Math.floor((G.newX - epic.X) / G.minglf));
        G.delY = Math.abs(Math.floor((G.newY - epic.Y) / G.minglf));

        if (G.newX > epic.X) {
            G.newX = Math.max((epic.X + epic.perim), G.newX - G.delX)
        } else {
            G.newX = Math.min((epic.X - epic.perim), G.newX + G.delX);
        }
        if (G.newY > epic.Y) {
            G.newY = Math.max((epic.Y + epic.perim), G.newY - G.delY)
        } else {
            G.newY = Math.min((epic.Y - epic.perim), G.newY + G.delY);
        }

        G.newX = G.newX + Math.floor(Math.random() * 15); // avoid strict duplicate positions
        G.newY = G.newY + Math.floor(Math.random() * 15);
    }

    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


    // focus on i's viral load - whether it will increase
    // but not infective till 2.9d and viral load > 3.6

    function VLtransfer(i, j) {
        let iVL = P[i].ViralLoad;
        let jVL = P[j].ViralLoad;
        if (isNaN(iVL) || (isNaN(jVL))) {
          alertX("NaN i:j "+i+":"+j);
          iVL = 5; jVL=5;
        }
        // console_log("i,j viral load = "+iVL.toFixed(2)+","+jVL.toFixed(2));
        if (iVL == 0 && jVL == 0) {
            return
        }
        if (P[i].state == "orange" || P[j].state == "orange") {
            return
        }

        // if viral load below threshold or still in incubation period do not infect
        // if they are both below threshold, cannot infect
        // if they are both in incubation, they cannot infect

        if (Math.max(iVL, jVL) < VLlower) {
            // console_log("iVL, jVL below threshold for i,j"+i+","+j);
            return
        }
        if (Math.max((cT - P[i].tInfect), (cT - P[j].tInfect)) < VLincD) {
            // console_log("both i,j in incubation for"+i+","+j);
            return
        }

        let Vgrad = Math.abs(jVL - iVL);
        let diff = raMax - yLength;
        // if gap is A, then overlap = sum - gap
        let Vdist = Math.pow(1-(diff / raMax), 3);
        let Vbig = i;
        let Vsmall = j;
        if (iVL < jVL) {
            Vbig = j;   //the bigger viral load agent
            Vsmall = i;
        };
        let VTrans = Vgrad * Vdist;
        // console_log("Virus Transfer = "+VTrans+" Overlap diff "+diff);

        // this is a stochastic threshold for ineffective touches
        if (VTrans < 0.05) {
            if (Math.random() < 0.5) { // toss a ccoin
                P[Vbig].failedCt++;
                return
            }
        }

        /*********************************************************
        /                 VAX Status checks
        /*********************************************************
        */

        let vaxT = cD - P[Vsmall].vaxD;
        let vaxSwitch = 1;
        let VaxProb = Math.random();

      if (P[Vsmall].vaxType==0) { }
      else {

          if (P[Vsmall].vaxType == 1){
            if (vaxT>13 && vaxT<36){
              if (VaxProb<0.75) {vaxSwitch = 0};
            }
          }
          if (P[Vsmall].vaxType == 2){
            if (vaxT>28) {
              if (VaxProb<0.95) {vaxSwitch = 0};
            }
            if (vaxT>13 && vaxT<29){
              if (VaxProb<0.75) {vaxSwitch = 0};
            }
          }
          if (vaxSwitch==0) {
            console_log("Vax prevented "+Vsmall+" ageGp"+P[Vsmall].ageGp+" by "+Vbig+" ageGp"+P[Vbig].ageGp+" gen"+gen+" Prob "+VaxProb);
            return}
      }

      // if vaccinated transmitter, will do so with inverse %

      let vaxTT = cD - P[Vbig].vaxD;
      vaxSwitch = 1;

    if (P[Vbig].vaxType==0) { }
    else {

        if (P[Vbig].vaxType == 1){
          if (vaxTT>13 && vaxTT<36){
            if (VaxProb>0.25) {vaxSwitch = 0};
          }
        }
        if (P[Vsmall].vaxType == 2){
          if (vaxTT>28) {
            if (VaxProb>0.95) {vaxSwitch = 0};
          }
          if (vaxTT>13 && vaxTT<29){
            if (VaxProb>0.75) {vaxSwitch = 0};
          }
        }
        if (vaxSwitch==0) {
          console_log("No transmit "+Vbig+ " ageGp"+P[Vbig].ageGp+" on "+Vsmall+" ageGp"+P[Vsmall].ageGp+" gen"+gen+" Prob "+VaxProb);
          return}
    }

        let qVir = 0;

        let ipostInfect = cT - P[i].tInfect;
        let jpostInfect = cT - P[j].tInfect;
        let xpostInf;
        let xVL;

        let xinfD;
        let xinfVir;
        let xInf = 0;
        let x;

        if (ipostInfect<0)  { ipostInfect = -ipostInfect };
        if (jpostInfect <0) { jpostInfect = - jpostInfect};
        if (Vbig == i){
            xpostInf = jpostInfect;
            xVL = jVL;
            x = j;
         } else {
            xpostInf = ipostInfect;
            xVL = iVL;
            x = i;
         }
        xinfD = Math.floor(xpostInf);
        if (xinfD < 21) {
            xinfVir = tViral[xinfD]
        } else {
            xinfVir = 1;
        }

        qVir = Math.min((xVL + VTrans), xinfVir);
        qVir = stochast(qVir, 0.05);
        if (isNaN(qVir)) {
          alertX("NaN qVir");
        }
        if (qVir < 0) {
            alertX("neg viral load "+qVir)
        };

        if (P[x].tInfect == 0){
            P[x].tInfect = cT;
            P[x].ViralLoad = Math.max(qVir,1);
        } else {
            P[x].tInfect = P[x].tInfect + 0.000001;
            return;
        }

        let xAgeGp = P[x].ageGp;
        let AGtotal = AG[xAgeGp].total;
        let AGinfcd = AG[xAgeGp].infected;
        if (AGinfcd > AGtotal) alertX("AG limit exceeded");


        if (P[x].state == "green"){
            xInf = M.PCt-M.GreenCt;
            xAgeGp = P[x].ageGp;
            if (P[x].tInfect == cT){      // new infection
                AG[xAgeGp].infected++;
            }
          let vic = i;
          let dra = j;
          if (x==j) {
              vic = j;
              dra = i;
          }
          console_log(xInf+"I x:ageGp:fam "+vic+":"+P[vic].ageGp+":"+P[vic].famKey+" by "+P[dra].state+" "+dra+":"+P[dra].ageGp+":"+P[dra].famKey+" at gen"+gen+" Univ"+wU+" prob="+VaxProb.toFixed(3));
        }


        if (ipostInfect > VLincD) {
            P[i].touchCt++
        };
        if (ipostInfect > VLincD && P[j].state == "green") {
            P[i].susCt++
        };
        if (jpostInfect > VLincD) {
            P[j].touchCt++
        };
        if (jpostInfect > VLincD && P[i].state == "green") {
            P[j].susCt++
        };

  }
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //          MAIN CONTROL LOOP STARTS here
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    var anFlag = true;
    var cycleCount = 0;
    var nU = 0;

    var iCycle;
    var cycleMax = 1;
    var arrFlag = false;
    var depFlag = false;


    cD = -1;
    cH = 23; // set up to initialize to first day = 0
    chkMaxTime = 23;



    var clockTimer;
    var movieTimer;
    var cycleTimer;
    //hideMV();


    function auto() {
        if (MODE == "auto") {
            MODE = "manual";
            clearInterval(clockTimer);
            return;
        }
        MODE = "auto";
        clockTimer = setInterval(TimesUp, MOTION / FPS);
    }

    function load() {
        var x;
        let j;
        if (use_html) {
            x = document.getElementById("loadB").innerHTML;
            if (x == "HR++") {
              TimesUp();
            return
          }
        }

        M.clockHr = 24; // one-time initialization
        M.clockDay = -1;
        gen = -1;
        vU = 0;
        wU = 0;
        MODE = "manual";
        startNet();
        for (j = 0; j < M.UCt; j++) {
            initNet(U[j], 0);
        }

        GUI("loadB","HR++");

    }

    function  TimesUp() {
        gen++;
        if (gen % 10 == 0 && !use_html) {console_log("another 10 gens....")};
        let i;
        if (gen > HALTgen && HALTgen!=0) {
            HALT();
            throw "halt on generation parameter specified";
        };
        for (i = 0; i < M.UCt; i++) {
            initNet(U[i], gen);
        };
        if (MODE == "auto" && cH == toHH && cD == toDD) {
            MODE = "manual";
            clearInterval(clockTimer);
            drawLocal();
        } else {
            advanceTime();
            conductor();
            tabulate();
        };
        if (graphFlag == "YES") {         // if we never invoke graphB we never set this flag to YES
            document.getElementById("grSlider").value = 1910;
            sliderFlag = false;
            graphB()
        };
    }

    function advanceTime() {
        if (cH == chkMaxTime) {
            // alertX("End of Day - go home, no more coding!");
            M.clockDay++;
            M.clockHr = 0;
            cD = M.clockDay;
            cH = 0;
            if (D[cD] == "" || D[cD] === undefined) {
                true
            } else {
                xD = cD; // day with defined schedule
            }
        } else {
            M.clockHr++;
            cH = M.clockHr;
        }
        if (MODE == "auto" && cH == toHH && cD == toDD) {
            return true;
        }
        cS = 0;
        cH = M.clockHr;
        cT = (cD + (cH + 0.0001) / 24);

        drawLocal();

        if (VIEW == "MV") {
                GUI("day",("DAY:\n" + cD))
                GUI("hour",("HOUR:\n" + cH))
        }
        growVL();
    }

    function drawLocal() {
        if (VIEW == "local" && MODE == "manual") {
            if (use_html) {
                drawRect(0, 0, canWidth, canHeight, "black");
                canvTxt(15, 30, cD, cH, vU);
            }
            drawU();
            drawEpi();
        }
    }

    function conductor() {
        let slot, action;
        if (D[xD] === undefined || D[xD] == "" || D[xD].H[cH] === undefined || D[xD].H[cH] == "") {
            finishHour();
            return;
        }

        arrLength = D[xD].H[cH].length;
        for (cS = 0; cS < arrLength; cS++) {
            wU = D[xD].H[cH][cS].u;
            slot = D[xD].H[cH][cS].cS; // the person's slot number
            action = D[xD].H[cH][cS].cDir; // the direction
            pID = D[xD].H[cH][cS].cID; // the person
            if (action == "A") injectXY(P[pID], pID, slot);
            if (action == "D") expel(P[pID], pID, slot);
        }
        finishHour();
    }

    function finishHour() {
        let i;
        for (i = 0; i < M.UCt; i++) {
            wU = i;
            U[i].allTouch = 0; // initialize count of all touches before movements
            moveItmoveIt();
            if (i == vU && VIEW == "local") {
                drawU()
            };
        }
    }

    // needs to be for entire population ie M (?)
    function growVL() {
        let newVL = 0;

        // for each person
        for (var i = 0; i < P.length; i++) {
            let Q = P[i];
            if (Q.ViralLoad == 0) {continue};

            if (Q.state == "orange") {
                Q.ViralLoad = Q.ViralLoad * 0.875;
                continue;
            }

            let vfactor = 0;
            Q.prevVL = Q.ViralLoad;


            let postDays = Math.floor(cT - Q.tInfect);
            let tableVL = 1;
            if (postDays < 20) {
                tableVL = tViral[postDays];
            } else {tableVL = 1};

            Q.ViralLoad = Math.max(Q.ViralLoad, tableVL);
            Q.ViralLoad = stochast(Q.ViralLoad, 0.15);

            changeState(i);
        }
        reSizeAll();
    }

    function reSizeAll() {
        let i;
        for (i = 0; i < M.PCt; i++) {
            let Q = P[i];
            let vRatio = 1;
            if (Q.prevVL != 0) {
                vRatio = Q.ViralLoad / Q.prevVL;
            }
            if (Q.ViralLoad == 0) {continue}; //size unchanged
            let newSize = Q.currSize * Math.sqrt(vRatio);
            if (isNaN(newSize)) {
              alertX("NaN in reSizeAll");
              newSize = Q.currSize * vRatio;
            }

            if (newSize < Q.baseSize) {
                newSize = Q.baseSize
            } else {
                if (newSize > (Q.baseSize * 3)) {
                    newSize = Q.baseSize * 3
                }
            }
            Q.currSize = stochast(newSize, 0.05);

        }
    }

    function injectXY(G, g, stop) {
        let present;

        //  update Person - Universe - Multiverse
        //  BUT IF THE PERSON IS ALREADY THERE WE DO NOT ADD, SO WE HAVE TO
        //  TEST LOCAL POPULATION AGAINST THE PERSON P

        G.day = cD;
        G.hour = cH;
        G.role = T[g].S[stop].R;
        G.ETA = T[g].S[stop].ETA;
        G.ETD = T[g].S[stop].ETD;
        G.minglf = T[g].S[stop].M;
        G.u = wU;


        let Q = U[wU];
        Q.day = cD;
        Q.hour = cH;

        present = Q.person.includes(g);
        if (present) return;

        G.currSize = G.currSize * Q.sizeFactor;
        G.baseSize = G.baseSize * Q.sizeFactor;

        G.X = Math.floor(Math.random() * canWidth);
        G.Y = Math.floor(Math.random() * canHeight);
        G.newX = G.X;
        G.newY = G.Y;

        Q.Population++;
        let Z = Q.arr[gen];

        switch (G.role) {
            case "R":
                Q.Resident++;
                Z.resCt++
                break;
            case "A":
                Q.Attached++;
                Z.attCt++;
                break;
            case "T":
                Q.Transient++;
                Z.visCt++;
                break;
        }

        switch (G.state) {
            case "green":
                Q.greenCt++;
                Z.gCt++;
                break;
            case "yellow":
                Q.yellowCt++;
                Z.yCt++;
                break;
            case "blue":
                Q.blueCt++;
                Z.bCt++;
                break;
            case "red":
                Q.redCt++;
                Z.rCt++;
                Q.cases++;
                break;
            case "orange":
                Q.orangeCt++;
                Z.oCt++;
                Q.cases++;
                break;
        }

        Q.person.push(g);
        if (wU == vU && VIEW == "local") drawAgent(G.X, G.Y, g, "white");
    }

    function expel(G, g, slot) {
        let Q, len;
        let Y;
        let edge;
        Q = U[wU];
        G.baseSize = G.baseSize / Q.sizeFactor;
        G.currSize = G.currSize / Q.sizeFactor;
        if (T[g].S[slot].ETD != -1) { // staying
            Q.Population--;
            len = Q.person.length;
            let thisP = Q.person.indexOf(g);
            let A = Q.person.slice(0, thisP);
            let B = Q.person.slice(thisP + 1, len);
            Q.person = A.concat(B);
            edge = T[g].S[slot].uDest;

            let X = Q.depT[gen]; // X total for all edges
            Y = Q.dep[gen][edge]; // Y specific to an edge

            switch (G.role) {
                case "R":
                    Q.Resident--;
                    X.resCt++;
                    Y.resCt++;
                    break;
                case "A":
                    Q.Attached--;
                    X.attCt++;
                    Y.attCt++;
                    break;
                case "T":
                    Q.Transient--;
                    X.visCt++;
                    Y.visCt++;
                    break;
            }

            switch (G.state) {
                case "green":
                    Q.greenCt--;
                    X.gCt++;
                    Y.gCt++;
                    break;
                case "yellow":
                    Q.yellowCt--;
                    X.yCt++;
                    Y.yCt++;
                    break;
                case "blue":
                    Q.blueCt--;
                    X.bCt++;
                    Y.bCt++;
                    break;
                case "red":
                    Q.redCt--;
                    Q.cases--;
                    X.rCt++;
                    Y.rCt++;
                    break;
                case "orange":
                    Q.orangeCt--;
                    Q.cases--;
                    X.oCt++;
                    Y.oCt++;
                    break;
            }
        }
    }

    function getToTime() {
          let toTxt = prompt("Enter the DDHH time that this program is to run until", cycleMax);
          let toHHDD = Number(toTxt);
          GUI("toHHDD",toHHDD);
          if (toHHDD === null || toHHDD == "" || toHHDD == toTime) return;
          toTime = toHHDD;
          toHH = toTime % 100;
          toDD = Math.floor(toTime / 100);
          MODE = "auto";
      }



    function showUstat(Q, q) {
        if (VIEW == "local" && q == vU) {
            GUI("grCt",Q.greenCt);
            GUI("yeCt",Q.yellowCt);
            GUI("blCt",Q.blueCt);
            GUI("reCt",Q.redCt);
            GUI("orCt",Q.orangeCt);
            GUI("dMingl",Q.minglf);
        }
    }

    function sumUcount() {
        let i, j, Q;
        for (i = 0; i < M.UCt; i++) {
            M.GreenCt = 0;
            M.YellowCt = 0;
            M.BlueCt = 0;
            M.RedCt = 0;
            M.OrangeCt = 0;
            M.Cases = 0;
        }
        for (i = 0; i < M.UCt; i++) {
            Q = U[i];
            M.GreenCt = M.GreenCt + Q.greenCt;
            M.YellowCt = M.YellowCt + Q.yellowCt;
            M.BlueCt = M.BlueCt + Q.blueCt;
            M.RedCt = M.RedCt + Q.redCt;
            M.OrangeCt = M.OrangeCt + Q.orangeCt;
            M.Cases = M.RedCt + M.OrangeCt;
        }
        M.logGreen[gen] = M.GreenCt;
        M.logYellow[gen] = M.YellowCt;
        M.logBlue[gen] = M.BlueCt;
        M.logRed[gen] = M.RedCt;
        M.logOrange[gen] = M.OrangeCt;
        M.logCases[gen] = M.cases;
    }

    var lastU = -1;
    var hU = 0;

    function showU() {
        let Q;
        let mu = vU;
        mu = (mu + 1) % M.UCt; //switch views between two universes
        vU = mu;
        wU = mu;

        Q = U[vU];
        drawU();
        showUstat(U[vU], vU);

        if (VIEW == "local" && gen >= 0) {
            cleanCharts();
            upDateGraph(Q, vU);
        }
    }

    function cleanCharts() {
        chart1.options.data[0].dataPoints = [];
        chart1.options.data[0].dataPoints = U[vU].endCases;

        chart2.options.data[0].dataPoints = [];
        chart2.options.data[0].dataPoints = U[vU].endRedDelta;

        chart3.options.data[0].dataPoints = [];
        chart3.options.data[0].dataPoints = U[vU].endVelocity;

        chart4.options.data[0].dataPoints = [];
        chart4.options.data[0].dataPoints = U[vU].endGreen;
        chart4.options.data[1].dataPoints = [];
        chart4.options.data[1].dataPoints = U[vU].endYellow;
        chart4.options.data[2].dataPoints = [];
        chart4.options.data[2].dataPoints = U[vU].endBlue;;
        chart4.options.data[3].dataPoints = [];
        chart4.options.data[3].dataPoints = U[vU].endRed;
        chart4.options.data[4].dataPoints = [];
        chart4.options.data[4].dataPoints = U[vU].endOrange;

        chart6.options.data[0].dataPoints = [];
        chart6.options.data[0].dataPoints = U[vU].endGreen;
        chart6.options.data[1].dataPoints = [];
        chart6.options.data[1].dataPoints = U[vU].endYellow;
        chart6.options.data[2].dataPoints = [];
        chart6.options.data[2].dataPoints = U[vU].endBlue;;
        chart6.options.data[3].dataPoints = [];
        chart6.options.data[3].dataPoints = U[vU].endRed;
        chart6.options.data[4].dataPoints = [];
        chart6.options.data[4].dataPoints = U[vU].endOrange;
    }

    function tabulate() {
        let i;
        let Q;
        for (i = 0; i < M.UCt; i++) {
            Q = U[i];
            Q.logGreen[gen] = Q.greenCt;
            Q.logYellow[gen] = Q.yellowCt;
            Q.logBlue[gen] = Q.blueCt;
            Q.logRed[gen] = Q.redCt;
            Q.logOrange[gen] = Q.orangeCt;
            Q.logAllTouch[gen] = Q.allTouch;
            Q.logCases[gen] = Q.cases;
            Q.logAllTouch[gen] = Q.allTouch;
            let vNum, vDenom, endV = 0;
            let len = 0;
            Q.endGreen.push({
                y: Q.logGreen[gen],
                x: gen
            });
            Q.endYellow.push({
                y: Q.logYellow[gen],
                x: gen
            });
            Q.endBlue.push({
                y: Q.logBlue[gen],
                x: gen
            });
            Q.endRed.push({
                y: Q.logRed[gen],
                x: gen
            });
            Q.endOrange.push({
                y: Q.logOrange[gen],
                x: gen
            });
            Q.endCases.push({
                y: Q.logCases[gen],
                x: gen
            });
            if (gen > 1) {
                let del = Q.logCases[gen] - Q.logCases[gen - 1];
                Q.endRedDelta.push({
                    y: del,
                    x: gen
                });
            } else {
                Q.endRedDelta.push({
                    y: 0,
                    x: gen
                })
            };

            len = Q.endRedDelta.length;
            endV = 0;
            if (len > 1) {
                vNum = Q.endRedDelta[len - 1].y;
                vDenom = Q.endCases[len - 2].y;
                if (vDenom != 0) {
                    endV = parseFloat((vNum / vDenom) * 100);
                }
            }
            Q.endVelocity.push({
                y: endV,
                label: len
            });

        }
        sumUcount();
        Mtabulate();
        upDateGraph(U[vU], vU);
    }

    function Mtabulate() {
        M.logGreen[gen] = M.GreenCt;
        M.logYellow[gen] = M.YellowCt;
        M.logBlue[gen] = M.BlueCt;
        M.logRed[gen] = M.RedCt;
        M.logOrange[gen] = M.OrangeCt;
        M.Cases = M.RedCt + M.OrangeCt;
        M.logCases[gen] = M.Cases;
        M.logR0[gen] = M.R0;

        var totConv = 0;

        if (M.OrangeCt > 0) {
            let R0Ct = M.OrangeCt;
            for (let i = 0; i < M.PCt; i++) {
                if (P[i].state != "orange") {
                    continue
                };
                totConv = totConv + P[i].susCt;
                if (P[i].susCt == 0) R0Ct--;
            }
            R0 = totConv / R0Ct;
            M.R0 = R0;
            M.logR0[gen] = M.R0;
            GUI("R0button",R0.toFixed(2));
        }

        let vNum, vDenom, endV = 0;
        let len = 0;

        M.endGreen.push({
            y: M.logGreen[gen],
            x: gen
        });
        M.endYellow.push({
            y: M.logYellow[gen],
            x: gen
        });
        M.endBlue.push({
            y: M.logBlue[gen],
            x: gen
        });
        M.endRed.push({
            y: M.logRed[gen],
            x: gen
        });
        M.endOrange.push({
            y: M.logOrange[gen],
            x: gen
        });
        M.endCases.push({
            y: M.logCases[gen],
            x: gen
        });

        if (gen > 1) {
            let del = M.logCases[gen] - M.logCases[gen - 1];
            M.endRedDelta.push({
                y: del,
                x: gen
            });
        } else
            M.endRedDelta.push({
                y: 0,
                x: gen
            });

        len = M.endRedDelta.length;
        endV = 0
        if (len > 1) {
            vNum = M.endRedDelta[len - 1].y;
            vDenom = M.endCases[len - 2].y;
            if (vDenom != 0) {
                endV = parseFloat((vNum / vDenom) * 100);
            }
        }
        M.endVelocity.push({
            y: endV,
            label: len
        });
    }

    var lastG = [];
    var lastY = [];
    var lastB = [];
    var lastR = [];
    var lastO = [];

    for(let aX=0;aX<11;aX++){
      lastG[aX] = 0;
      lastY[aX] = 0;
      lastB[aX] = 0;
      lastR[aX] = 0;
      lastO[aX] = 0;
    }

    function consoleComp(Univ){
      if (Univ==10){
        if (M.GreenCt != lastG[10] || M.YellowCt != lastY[10] || M.BlueCt != lastB[10] || M.RedCt != lastR[10]) {
            lastG[10] = M.GreenCt;
            lastY[10] = M.YellowCt;
            lastB[10] = M.BlueCt;
            lastR[10] = M.RedCt;
            lastO[10] = M.OrangeCt;
            //console_log("Structure S0 "+"gen"+gen+" "+M.GreenCt+":"+M.YellowCt+":"+M.BlueCt+":"+M.RedCt+":"+M.OrangeCt);
            return;
        }
        return
      };
      if (Univ < M.UCt){
            if (U[Univ].greenCt != lastG[Univ] || U[Univ].yellowCt != lastY[Univ] || U[Univ].blueCt != lastB[Univ] || U[Univ].redCt != lastR[Univ] || U[Univ].orangeCt != lastO[Univ]){
                lastG[Univ] = U[Univ].greenCt;
                lastY[Univ] = U[Univ].yellowCt;
                lastB[Univ] = U[Univ].blueCt;
                lastR[Univ] = U[Univ].redCt;
                lastO[Univ] = U[Univ].orangeCt;
                //console_log("Structure U"+Univ+" "+"gen"+gen+" "+U[Univ].greenCt+":"+U[Univ].yellowCt+":"+U[Univ].blueCt+":"+U[Univ].redCt+":"+U[Univ].orangeCt);
            }
      }
    }


    function upDateGraph(Q, q) {
        let X = Q.arr[gen];
        let Y = Q.depT[gen];

        for (let is=0;is<M.UCt;is++){
          consoleComp(is);
        };
        consoleComp(10);

        if (VIEW == "local") {
            if (use_html) {
                showUstat(Q, q);
                chart6.render();
                chart1.render();
                chart2.render();
                chart3.render();
                chart4.render();

                GUI("popStat",Q.Population);
                GUI("arrStat",(X.resCt + X.attCt + X.visCt));
                GUI("depStat",(Y.resCt + Y.attCt + Y.visCt));

//                GUI("totouch",Q.allTouch;

                GUI("resCt",Q.Resident);
                GUI("attCt",Q.Attached);
                GUI("visCt",Q.Transient);

                GUI("GArr",X.gCt);
                GUI("YArr",X.yCt);
                GUI("BArr",X.bCt);
                GUI("RArr",X.rCt);
                GUI("OArr",X.oCt);
                GUI("ResArr",X.resCt);
                GUI("AttArr",X.attCt);
                GUI("VisArr",X.visCt);

                GUI("GDep",Y.gCt);
                GUI("YDep",Y.yCt);
                GUI("BDep",Y.bCt);
                GUI("RDep",Y.rCt);
                GUI("ODep",Y.oCt);
                GUI("ResDep",Y.resCt);
                GUI("AttDep",Y.attCt);
                GUI("VisDep",Y.visCt);
            }
        }
    if (VIEW == "MV") {
			if (M.UCt > 0) { chart7.render() };
			if (M.UCt > 1) { chart8.render() };
			if (M.UCt > 2) { chart9.render() };
			if (M.UCt > 3) { chart10.render() };
			if (M.UCt > 4) { chart11.render() };
			if (M.UCt > 5) { chart12.render() };
			if (M.UCt > 6) { chart13.render() };
			if (M.UCt > 7) { chart14.render() };
			if (M.UCt > 8) { chart15.render() };

			chart16.render();
			chart17.render();
			chart18.render();
			chart19.render();
			chart20.render();


      GUI("dispGen",("gen: "+gen));
      GUI("TGreen",M.GreenCt);
      GUI("TYellow",M.YellowCt);
      GUI("TBlue",M.BlueCt);
      GUI("TRed",M.RedCt);
      GUI("TOrange",M.OrangeCt);
      GUI("trafficB","TRAFFIC");

			if (M.UCt > 0) { MVtable0() };
			if (M.UCt > 1) { MVtable1() };
			if (M.UCt > 2) { MVtable2() };
			if (M.UCt > 3) { MVtable3() };
			if (M.UCt > 4) { MVtable4() };
			if (M.UCt > 5) { MVtable5() };
			if (M.UCt > 6) { MVtable6() };
			if (M.UCt > 7) { MVtable7() };
			if (M.UCt > 8) { MVtable8() };
    }

      if (M.YellowCt==0 && M.BlueCt==0 && M.RedCt==0 && gen>1 && gen>3) {
        HALT();
      }
  }




    function MVtable0() {

        let X = U[0].arr[gen];
        let Y = U[0].depT[gen];

        GUI("grMV0",U[0].greenCt);
        GUI("yeMV0",U[0].yellowCt);
        GUI("blMV0",U[0].blueCt);
        GUI("reMV0",U[0].redCt);
        GUI("orMV0",U[0].orangeCt);
        GUI("resMV0",U[0].Resident);
        GUI("attMV0",U[0].Attached);
        GUI("visMV0",U[0].Transient);

        GUI("GMV0",X.gCt);
        GUI("YMV0",X.yCt);
        GUI("BMV0",X.bCt);
        GUI("RMV0",X.rCt);
        GUI("OMV0",X.oCt);
        GUI("ResMV0",X.resCt);
        GUI("AttMV0",X.attCt);
        GUI("VisMV0",X.visCt);

        GUI("GMD0",Y.gCt);
        GUI("YMD0",Y.yCt);
        GUI("BMD0",Y.bCt);
        GUI("RMD0",Y.rCt);
        GUI("OMD0",Y.oCt);
        GUI("ResMD0",Y.resCt);
        GUI("AttMD0",Y.attCt);
        GUI("VisMD0",Y.visCt);
    }
    //      11111111111111111111111111111111111111111111111111111111111111
    //
    function MVtable1() {
        let X = U[1].arr[gen];
        let Y = U[1].depT[gen];

        GUI("grMV1",U[1].greenCt);
        GUI("yeMV1",U[1].yellowCt);
        GUI("blMV1",U[1].blueCt);
        GUI("reMV1",U[1].redCt);
        GUI("orMV1",U[1].orangeCt);
        GUI("resMV1",U[1].Resident);
        GUI("attMV1",U[1].Attached);
        GUI("visMV1",U[1].Transient);

        GUI("GMV1",X.gCt);
        GUI("YMV1",X.yCt);
        GUI("BMV1",X.bCt);
        GUI("RMV1",X.rCt);
        GUI("OMV1",X.oCt);
        GUI("ResMV1",X.resCt);
        GUI("AttMV1",X.attCt);
        GUI("VisMV1",X.visCt);

        GUI("GMD1",Y.gCt);
        GUI("YMD1",Y.yCt);
        GUI("BMD1",Y.bCt);
        GUI("RMD1",Y.rCt);
        GUI("OMD1",Y.oCt);
        GUI("ResMD1",Y.resCt);
        GUI("AttMD1",Y.attCt);
        GUI("VisMD1",Y.visCt);
    }

    function MVtable2() {
        let X = U[2].arr[gen];
        let Y = U[2].depT[gen];

        GUI("grMV2",U[2].greenCt);
        GUI("yeMV2",U[2].yellowCt);
        GUI("blMV2",U[2].blueCt);
        GUI("reMV2",U[2].redCt);
        GUI("orMV2",U[2].orangeCt);
        GUI("resMV2",U[2].Resident);
        GUI("attMV2",U[2].Attached);
        GUI("visMV2",U[2].Transient);

        GUI("GMV2",X.gCt);
        GUI("YMV2",X.yCt);
        GUI("BMV2",X.bCt);
        GUI("RMV2",X.rCt);
        GUI("OMV2",X.oCt);
        GUI("ResMV2",X.resCt);
        GUI("AttMV2",X.attCt);
        GUI("VisMV2",X.visCt);

        GUI("GMD2",Y.gCt);
        GUI("YMD2",Y.yCt);
        GUI("BMD2",Y.bCt);
        GUI("RMD2",Y.rCt);
        GUI("OMD2",Y.oCt);
        GUI("ResMD2",Y.resCt);
        GUI("AttMD2",Y.attCt);
        GUI("VisMD2",Y.visCt);
    }

    function MVtable3() {
        let X = U[3].arr[gen];
        let Y = U[3].depT[gen];

        GUI("grMV3",U[3].greenCt);
        GUI("yeMV3",U[3].yellowCt);
        GUI("blMV3",U[3].blueCt);
        GUI("reMV3",U[3].redCt);
        GUI("orMV3",U[3].orangeCt);
        GUI("resMV3",U[3].Resident);
        GUI("attMV3",U[3].Attached);
        GUI("visMV3",U[3].Transient);

        GUI("GMV3",X.gCt);
        GUI("YMV3",X.yCt);
        GUI("BMV3",X.bCt);
        GUI("RMV3",X.rCt);
        GUI("OMV3",X.oCt);
        GUI("ResMV3",X.resCt);
        GUI("AttMV3",X.attCt);
        GUI("VisMV3",X.visCt);

        GUI("GMD3",Y.gCt);
        GUI("YMD3",Y.yCt);
        GUI("BMD3",Y.bCt);
        GUI("RMD3",Y.rCt);
        GUI("OMD3",Y.oCt);
        GUI("ResMD3",Y.resCt);
        GUI("AttMD3",Y.attCt);
        GUI("VisMD3",Y.visCt);
    }

    function MVtable4() {
        let X = U[4].arr[gen];
        let Y = U[4].depT[gen];

        GUI("grMV4",U[4].greenCt);
        GUI("yeMV4",U[4].yellowCt);
        GUI("blMV4",U[4].blueCt);
        GUI("reMV4",U[4].redCt);
        GUI("orMV4",U[4].orangeCt);
        GUI("resMV4",U[4].Resident);
        GUI("attMV4",U[4].Attached);
        GUI("visMV4",U[4].Transient);

        GUI("GMV4",X.gCt);
        GUI("YMV4",X.yCt);
        GUI("BMV4",X.bCt);
        GUI("RMV4",X.rCt);
        GUI("OMV4",X.oCt);
        GUI("ResMV4",X.resCt);
        GUI("AttMV4",X.attCt);
        GUI("VisMV4",X.visCt);

        GUI("GMD4",Y.gCt);
        GUI("YMD4",Y.yCt);
        GUI("BMD4",Y.bCt);
        GUI("RMD4",Y.rCt);
        GUI("OMD4",Y.oCt);
        GUI("ResMD4",Y.resCt);
        GUI("AttMD4",Y.attCt);
        GUI("VisMD4",Y.visCt);
    }

    function MVtable5() {
        let X = U[5].arr[gen];
        let Y = U[5].depT[gen];

        GUI("grMV5",U[5].greenCt);
        GUI("yeMV5",U[5].yellowCt);
        GUI("blMV5",U[5].blueCt);
        GUI("reMV5",U[5].redCt);
        GUI("orMV5",U[5].orangeCt);
        GUI("resMV5",U[5].Resident);
        GUI("attMV5",U[5].Attached);
        GUI("visMV5",U[5].Transient);

        GUI("GMV5",X.gCt);
        GUI("YMV5",X.yCt);
        GUI("BMV5",X.bCt);
        GUI("RMV5",X.rCt);
        GUI("OMV5",X.oCt);
        GUI("ResMV5",X.resCt);
        GUI("AttMV5",X.attCt);
        GUI("VisMV5",X.visCt);

        GUI("GMD5",Y.gCt);
        GUI("YMD5",Y.yCt);
        GUI("BMD5",Y.bCt);
        GUI("RMD5",Y.rCt);
        GUI("OMD5",Y.oCt);
        GUI("ResMD5",Y.resCt);
        GUI("AttMD5",Y.attCt);
        GUI("VisMD5",Y.visCt);
    }

    function MVtable6() {
        let X = U[6].arr[gen];
        let Y = U[6].depT[gen];

        GUI("grMV6",U[6].greenCt);
        GUI("yeMV6",U[6].yellowCt);
        GUI("blMV6",U[6].blueCt);
        GUI("reMV6",U[6].redCt);
        GUI("orMV6",U[6].orangeCt);
        GUI("resMV6",U[6].Resident);
        GUI("attMV6",U[6].Attached);
        GUI("visMV6",U[6].Transient);

        GUI("GMV6",X.gCt);
        GUI("YMV6",X.yCt);
        GUI("BMV6",X.bCt);
        GUI("RMV6",X.rCt);
        GUI("OMV6",X.oCt);
        GUI("ResMV6",X.resCt);
        GUI("AttMV6",X.attCt);
        GUI("VisMV6",X.visCt);

        GUI("GMD6",Y.gCt);
        GUI("YMD6",Y.yCt);
        GUI("BMD6",Y.bCt);
        GUI("RMD6",Y.rCt);
        GUI("OMD6",Y.oCt);
        GUI("ResMD6",Y.resCt);
        GUI("AttMD6",Y.attCt);
        GUI("VisMD6",Y.visCt);
    }

    function MVtable7() {
        let X = U[7].arr[gen];
        let Y = U[7].depT[gen];

        GUI("grMV7",U[7].greenCt);
        GUI("yeMV7",U[7].yellowCt);
        GUI("blMV7",U[7].blueCt);
        GUI("reMV7",U[7].redCt);
        GUI("orMV7",U[7].orangeCt);
        GUI("resMV7",U[7].Resident);
        GUI("attMV7",U[7].Attached);
        GUI("visMV7",U[7].Transient);

        GUI("GMV7",X.gCt);
        GUI("YMV7",X.yCt);
        GUI("BMV7",X.bCt);
        GUI("RMV7",X.rCt);
        GUI("OMV7",X.oCt);
        GUI("ResMV7",X.resCt);
        GUI("AttMV7",X.attCt);
        GUI("VisMV7",X.visCt);

        GUI("GMD7",Y.gCt);
        GUI("YMD7",Y.yCt);
        GUI("BMD7",Y.bCt);
        GUI("RMD7",Y.rCt);
        GUI("OMD7",Y.oCt);
        GUI("ResMD7",Y.resCt);
        GUI("AttMD7",Y.attCt);
        GUI("VisMD7",Y.visCt);
    }

    function MVtable8() {
        let X = U[8].arr[gen];
        let Y = U[8].depT[gen];

        GUI("grMV8",U[8].greenCt);
        GUI("yeMV8",U[8].yellowCt);
        GUI("blMV8",U[8].blueCt);
        GUI("reMV8",U[8].redCt);
        GUI("orMV8",U[8].orangeCt);
        GUI("resMV8",U[8].Resident);
        GUI("attMV8",U[8].Attached);
        GUI("visMV8",U[8].Transient);

        GUI("GMV8",X.gCt);
        GUI("YMV8",X.yCt);
        GUI("BMV8",X.bCt);
        GUI("RMV8",X.rCt);
        GUI("OMV8",X.oCt);
        GUI("ResMV8",X.resCt);
        GUI("AttMV8",X.attCt);
        GUI("VisMV8",X.visCt);

        GUI("GMD8",Y.gCt);
        GUI("YMD8",Y.yCt);
        GUI("BMD8",Y.bCt);
        GUI("RMD8",Y.rCt);
        GUI("OMD8",Y.oCt);
        GUI("ResMD8",Y.resCt);
        GUI("AttMD8",Y.attCt);
        GUI("VisMD8",Y.visCt);
    }

    var chart1, chart2, chart3, chart4;
    var chart5, chart6, chart7, chart8;
    var chart9, chart10, chart11, chart12;
    var chart13, chart14, chart15, chart16;
    var chart17, chart18, chart19, chart20;

    function initGUI(){

          createField();
          crCanpn();
          initWinP();
          initSliders();
          blackCanvas("game");
          VIEW = "local";
          hideMV();

        CanvasJS.addColorSet("Overview GYBRO",
          [
              "#008000",
              "#FFD700",
              "#1E90FF",
              "#FF0000",
              "#FF8C00",
          ]);
        initChart01();
        initChart02();
        initChart03();
        initChart04();
        //initChart05();
        initChart06();

    		if (M.UCt > 0) { initChart07() };
    		if (M.UCt > 1) { initChart08() };
    		if (M.UCt > 2) { initChart09() };
    		if (M.UCt > 3) { initChart10() };
    		if (M.UCt > 4) { initChart11() };
    		if (M.UCt > 5) { initChart12() };
    		if (M.UCt > 6) { initChart13() };
    		if (M.UCt > 7) { initChart14() };
    		if (M.UCt > 8) { initChart15() };

        initChart16();
        initChart17();
        initChart18();
        initChart19();
        initChart20();
    }




    function initChart01() {
          chart1 = new CanvasJS.Chart("chartContainer1", {
              zoomEnabled: true,
              theme: "light2", // "light1", "light2", "dark1", "dark2"
              title: {
                  text: "TOTAL Cases to Date"
              },
              axisY: {
                  title: "Total Cases"
              },
              width: 500,
              data: [{
                  type: "column",
                  color: "orange",
                  showInLegend: true,
                  legendMarkerColor: "grey",
                  legendText: "Days since beginning",
                  dataPoints: U[vU].endCases
              }]
          });
      }

        // chart 2 **********************************************

    function initChart02() {
        chart2 = new CanvasJS.Chart("chartContainer2", {
            zoomEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title: {
                text: "Daily NEW Cases"
            },
            axisY: {
                title: "New cases"
            },
            width: 500,
            data: [{
                type: "column",
                color: "red",
                showInLegend: true,
                legendMarkerColor: "grey",
                legendText: "Days since beginning",
                dataPoints: U[vU].endRedDelta
            }]
        });
      }


        // CHART3 **********************************************************

    function initChart03() {
        chart3 = new CanvasJS.Chart("chartContainer3", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title: {
                text: "Percent Increase over Previous TOTAL"
            },
            axisY: {
                title: "Percent Increase"
            },
            data: [{
                type: "line",
                showInLegend: true,
                legendMarkerColor: "grey",
                legendText: "Days since beginning",
                dataPoints: U[vU].endVelocity
            }]
        });
    }


        // *********************************************************************************
        // CHART 4 - GREEN YELLOE BLUE RED over time

    function initChart04() {
        chart4 = new CanvasJS.Chart("chartContainer4", {
            //  theme: "light1",
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: "Progress of Transitions"
            },
            data: [{
                type: "line",
                fillopacity: 0.2,
                dataPoints: U[vU].endGreen
            }, {
                type: "line",
                fillopacity: 0.2,
                dataPoints: U[vU].endYellow
            }, {
                type: "line",
                fillopacity: 0.2,
                dataPoints: U[vU].endBlue
            }, {
                type: "line",
                fillopacity: 0.2,
                dataPoints: U[vU].endRed
            }, {
                type: "line",
                fillopacity: 0.2,
                dataPoints: U[vU].endOrange
            }]
        });
    }


    function initChart06() {
        CanvasJS.addColorSet("Overview GYBRO",
            [
                "#008000",
                "#FFD700",
                "#1E90FF",
                "#FF0000",
                "#FF8C00",
            ]);

        chart6 = new CanvasJS.Chart("chartContainer6", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: "Progress of Epidemic"
            },
            axisY2: {
                title: "Y + R"
            },
            axisY: {
                title: "Counts"
            },
            data: [{
                type: "stackedColumn",
                markerType: "none",
                dataPoints: U[vU].endGreen

            }, {
                type: "stackedColumn",
                markerType: "none",
                dataPoints: U[vU].endYellow
            }, {
                type: "stackedColumn",
                markerType: "none",
                dataPoints: U[vU].endBlue
            }, {
                type: "stackedColumn",
                markerType: "none",
                dataPoints: U[vU].endRed
            }, {
                type: "stackedColumn",
                markerType: "none",
                dataPoints: U[vU].endOrange
            }]
        });
    }


    function initChart07() {
        chart7 = new CanvasJS.Chart("chartContainer7", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: UN[0]
            },
            axisY2: {
                title: "Y + R"
            },
            axisY: {
                title: "G + B + O"
            },
            data: [{
                type: "column",
                markerType: "none",
                dataPoints: U[0].endGreen

            }, {
                type: "column",
                axisYType: "secondary",
                markerType: "none",
                dataPoints: U[0].endYellow
            }, {
                type: "column",
                markerType: "none",
                dataPoints: U[0].endBlue
            }, {
                type: "column",
                markerType: "none",
                axisYType: "secondary",
                dataPoints: U[0].endRed
            }, {
                type: "column",
                markerType: "none",
                dataPoints: U[0].endOrange
            }
            ]
        }
        );
    }


    function initChart08() {
        chart8 = new CanvasJS.Chart("chartContainer8", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: UN[1]
            },
            axisY2: {
                title: "Y + R"
            },
            axisY: {
                title: "G + B + O"
            },
            data: [{
                type: "column",
                markerType: "none",
                dataPoints: U[1].endGreen

            }, {
                type: "column",
                axisYType: "secondary",
                markerType: "none",
                dataPoints: U[1].endYellow
            }, {
                type: "column",
                markerType: "none",
                dataPoints: U[1].endBlue
            }, {
                type: "column",
                markerType: "none",
                axisYType: "secondary",
                dataPoints: U[1].endRed
            }, {
                type: "column",
                markerType: "none",
                dataPoints: U[1].endOrange
            }
            ]
        }
        );
    }


    function initChart09() {
        chart9 = new CanvasJS.Chart("chartContainer9", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: UN[2]
            },
            axisY2: {
                title: "Y + R"
            },
            axisY: {
                title: "G + B + O"
            },
            data: [{
                type: "column",
                markerType: "none",
                dataPoints: U[2].endGreen

            }, {
                type: "column",
                axisYType: "secondary",
                markerType: "none",
                dataPoints: U[2].endYellow
            }, {
                type: "column",
                markerType: "none",
                dataPoints: U[2].endBlue
            }, {
                type: "column",
                markerType: "none",
                axisYType: "secondary",
                dataPoints: U[2].endRed
            }, {
                type: "column",
                markerType: "none",
                dataPoints: U[2].endOrange
            }
            ]
        }
        );
    }


    function initChart10() {
        chart10 = new CanvasJS.Chart("chartContainer10", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: UN[3]
            },
            axisY2: {
                title: "Y + R"
            },
            axisY: {
                title: "G + B + O"
            },
            data: [{
                type: "column",
                markerType: "none",
                dataPoints: U[3].endGreen

            }, {
                type: "column",
                axisYType: "secondary",
                markerType: "none",
                dataPoints: U[3].endYellow
            }, {
                type: "column",
                markerType: "none",
                dataPoints: U[3].endBlue
            }, {
                type: "column",
                markerType: "none",
                axisYType: "secondary",
                dataPoints: U[3].endRed
            }, {
                type: "column",
                markerType: "none",
                dataPoints: U[3].endOrange
            }
            ]
        });
    }


    function initChart11() {
        chart11 = new CanvasJS.Chart("chartContainer11", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: UN[4]
            },
            axisY2: {
                title: "Y + R"
            },
            axisY: {
                title: "G + B + O"
            },
            data: [{
                type: "line",
                markerType: "none",
                dataPoints: U[4].endGreen

            }, {
                type: "line",
                axisYType: "secondary",
                markerType: "none",
                dataPoints: U[4].endYellow
            }, {
                type: "line",
                markerType: "none",
                dataPoints: U[4].endBlue
            }, {
                type: "line",
                markerType: "none",
                axisYType: "secondary",
                dataPoints: U[4].endRed
            }, {
                type: "line",
                markerType: "none",
                dataPoints: U[4].endOrange
            }
            ]
        });
    }


    function initChart12() {
        chart12 = new CanvasJS.Chart("chartContainer12", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: UN[5]
            },
            axisY2: {
                title: "Y + R"
            },
            axisY: {
                title: "G + B + O"
            },
            data: [{
                type: "line",
                markerType: "none",
                dataPoints: U[5].endGreen

            }, {
                type: "line",
                axisYType: "secondary",
                markerType: "none",
                dataPoints: U[5].endYellow
            }, {
                type: "line",
                markerType: "none",
                dataPoints: U[5].endBlue
            }, {
                type: "line",
                markerType: "none",
                axisYType: "secondary",
                dataPoints: U[5].endRed
            }, {
                type: "line",
                markerType: "none",
                dataPoints: U[5].endOrange
            }
            ]
        }
        );
    }



    function initChart13() {
        chart13 = new CanvasJS.Chart("chartContainer13", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: UN[6]
            },
            axisY2: {
                title: "Y + R"
            },
            axisY: {
                title: "G + B + O"
            },
            data: [{
                type: "line",
                markerType: "none",
                dataPoints: U[6].endGreen

            }, {
                type: "line",
                axisYType: "secondary",
                markerType: "none",
                dataPoints: U[6].endYellow
            }, {
                type: "line",
                markerType: "none",
                dataPoints: U[6].endBlue
            }, {
                type: "line",
                markerType: "none",
                axisYType: "secondary",
                dataPoints: U[6].endRed
            }, {
                type: "line",
                markerType: "none",
                dataPoints: U[6].endOrange
            }
            ]
        }
        );
    }



    function initChart14() {
        chart14 = new CanvasJS.Chart("chartContainer14", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: UN[7]
            },
            axisY2: {
                title: "Y + R"
            },
            axisY: {
                title: "G + B + O"
            },
            data: [{
                type: "line",
                markerType: "none",
                dataPoints: U[7].endGreen

            }, {
                type: "line",
                axisYType: "secondary",
                markerType: "none",
                dataPoints: U[7].endYellow
            }, {
                type: "line",
                markerType: "none",
                dataPoints: U[7].endBlue
            }, {
                type: "line",
                markerType: "none",
                axisYType: "secondary",
                dataPoints: U[7].endRed
            }, {
                type: "line",
                markerType: "none",
                dataPoints: U[7].endOrange
            }
            ]
        }
        );
    }



    function initChart15() {
        chart15 = new CanvasJS.Chart("chartContainer15", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: UN[8]
            },
            axisY2: {
                title: "Y + R"
            },
            axisY: {
                title: "G + B + O"
            },
            data: [{
                type: "line",
                markerType: "none",
                dataPoints: U[8].endGreen

            }, {
                type: "line",
                axisYType: "secondary",
                markerType: "none",
                dataPoints: U[8].endYellow
            }, {
                type: "line",
                markerType: "none",
                dataPoints: U[8].endBlue
            }, {
                type: "line",
                markerType: "none",
                axisYType: "secondary",
                dataPoints: U[8].endRed
            }, {
                type: "line",
                markerType: "none",
                dataPoints: U[8].endOrange
            }
            ]
        }
        );
    }


    function initChart16() {
        chart16 = new CanvasJS.Chart("chartContainer16", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: "Total Population Counts"
            },
            axisY2: {
                title: "Y + R"
            },
            axisY: {
                title: "G + B + O"
            },
            data: [{
                type: "line",
                markerType: "none",
                dataPoints: M.endGreen
            }, {
                type: "line",
                axisYType: "secondary",
                markerType: "none",
                dataPoints: M.endYellow
            }, {
                type: "line",
                markerType: "none",
                dataPoints: M.endBlue
            }, {
                type: "line",
                markerType: "none",
                axisYType: "secondary",
                dataPoints: M.endRed
            }, {
                type: "line",
                markerType: "none",
                dataPoints: M.endOrange
            }]
        });
    }


    function initChart17() {
        chart17 = new CanvasJS.Chart("chartContainer17", {
            zoomEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title: {
                text: "TOTAL Cases to Date - Entire Population"
            },
            axisY: {
                title: "Number of Clinical or Positive"
            },
            width: 500,
            data: [{
                type: "line",
                color: "orange",
                showInLegend: true,
                legendMarkerColor: "grey",
                legendText: "Days since beginning",
                dataPoints: M.endCases
            }]
        });
    }


    function initChart18() {
        chart18 = new CanvasJS.Chart("chartContainer18", {
            zoomEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title: {
                text: "Daily NEW Cases - entire Population"
            },
            axisY: {
                title: "Number of Clinical or Positive"
            },
            width: 500,
            data: [{
                type: "column",
                color: "red",
                showInLegend: true,
                legendMarkerColor: "grey",
                legendText: "Days since beginning",
                dataPoints: M.endRedDelta
            }]
        });
    }

    function initChart19() {
        chart19 = new CanvasJS.Chart("chartContainer19", {
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            title: {
                text: "Percent Increase Total Cases - Entire Population"
            },
            axisY: {
                title: "Percent Increase"
            },
            data: [{
                type: "line",
                showInLegend: true,
                legendMarkerColor: "grey",
                legendText: "Days since beginning",
                dataPoints: M.endVelocity
            }]
        });
    }


    function initChart20() {
      chart20 = new CanvasJS.Chart("chartContainer20", {
            zoomEnabled: true,
            colorSet: "Overview GYBRO",
            title: {
                text: "Daily Population Composition of Epidemic"
            },
            data: [{
                type: "stackedColumn",
                dataPoints: M.endGreen
            }, {
                type: "stackedColumn",
                dataPoints: M.endYellow
            }, {
                type: "stackedColumn",
                dataPoints: M.endBlue
            }, {
                type: "stackedColumn",
                dataPoints: M.endRed
            }, {
                type: "stackedColumn",
                dataPoints: M.endOrange
            }]
        });
    }

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //
    //                    NETWORK GRAPH AND TRAFFIC ROUTINES
    //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    const LFACTOR = 1000;
    const SPEED = 35;
    const ELAPSED = 3500;
    const GRANULARITY = 110;
    var gcanvas, gctx;
    var Nstart; 100
    var Ntimer;
    var sliderFlag = false;
    var saveGen = 0;

    // load canvas


    function CreateNode() {
        this.x;
        this.y;
        this.to = [];
        this.fr = [];
    }

    function CreateEdge() {
        this.u = 0;             // destination node
        this.clr = "green";
        this.ct = 0;
        this.dx = 0;
        this.dy = 0;
        this.xi = 0;
        this.yi = 0;
        this.newx = 0;
        this.newy = 0;
        this.steps = 0;
    }


    var netFlag = true;
    function graphB() {
        if (!use_html) {return};      // this will avoid anything to do with the network including sliders etc
        graphFlag = "YES";
        if (netFlag) {
            GUIstyle("graphCanvas","block");
            GUIstyle("grExit","block");
            GUIstyle("grB","block");
            GUIstyle("grF","block");
            GUIstyle("grSlider","block");
            gcanvas = document.getElementById("graphCanvas");
            gctx = gcanvas.getContext("2d");
            gctx.fillStyle = "black";
            saveGen = gen;
            netFlag = false;
        }
        if (sliderFlag) {
            gen = saveGen;
            GUIstyle("controls","block");
            sliderFlag = false
            writeSlider(gen);
        } else {
            MODE = "manual";
            clearInterval(clockTimer);
            saveGen = gen;
            GUIstyle("controls","none");
        }
        graphNetwork(gen);
    }

    function graphNetwork(gen) {
        drawNArena(gen);
        graphDDHH(gen);
        loadNet(gen);
        calcdydx();
        Nanimate();
    }

    function graphDDHH(gen) {
        let DD = Math.floor(gen / 24);
        let HH = gen % 24;
        gctx.font = "30px Arial";
        gctx.fillStyle = "Yellow";
        gctx.fillText("Day: " + DD + "   HR: " + HH,50,760);
    }

    function graphStop() {
        clearInterval(Ntimer);
        clearInterval(clockTimer);
    }

    function graphExit() {
        GUIstyle("graphCanvas","none");
        GUIstyle("grExit","none");
        GUIstyle("grB","none");
        GUIstyle("grF","none");
        GUIstyle("grSlider","none");
        GUIstyle("controls","block");
        gen = saveGen;
        clearInterval(Ntimer);
        graphFlag = "NO";
        netFlag = true;
    }

    var sliderVal = 0;
    var genEquiv = 0;

    function graphIn() {                                        // destroy till we get it performing
        clearInterval(Ntimer);
        sliderFlag = true;
        sliderVal = document.getElementById("grSlider").value;
        genEquiv = Math.floor(sliderVal / 1920 * saveGen);
        gen = genEquiv;
        graphNetwork(gen)
    }

    function backGraph() {
        if (!sliderFlag) { return };
        if(gen == 0){ return };
        // process gen--
        gen--;
        writeSlider(gen);
        graphNetwork(gen);
    }

    function foreGraph() {
        if (!sliderFlag) { return };
        if (gen == saveGen) { return };
        gen++;
        writeSlider(gen);
        graphNetwork(gen);
    }

    function writeSlider(gen) {
        let genEquiv = 1920 / saveGen;
        let sliderVal = genEquiv * gen;
        document.getElementById("grSlider").value = sliderVal;
    }


    var N = [];
    function startNet() {
        for (let nct = 0; nct < M.UCt; nct++) {
            N[nct] = new CreateNode();
        }
        if (M.UCt > 0){
            N[0].x = 250; N[0].y = 110;}
        if (M.UCt > 1){
            N[1].x = 460; N[1].y = 70;}
        if (M.UCt > 2){
            N[2].x = 670; N[2].y = 150;}
        if (M.UCt > 3){
            N[3].x = 760; N[3].y = 320;}
        if (M.UCt > 4){
            N[4].x = 710; N[4].y = 520;}
        if (M.UCt > 5){
            N[5].x = 500; N[5].y = 630;}
        if (M.UCt > 6){
            N[6].x = 270; N[6].y = 600;}
        if (M.UCt > 7){
            N[7].x = 130; N[7].y = 440;}
        if (M.UCt > 8){
            N[8].x = 120; N[8].y = 250;}
    }

    // nodes are drawn, edges created but not drawn till we know what traffic is

    function drawNArena(gen) {
        gctx.fillStyle = "Black";
        gctx.fillRect(0, 0, gcanvas.width, gcanvas.height);
        for (let i = 0; i < M.UCt; i++) {
            drawNC(i, gen, N[i].x, N[i].y, 20, "midnightblue");
            drawCircleTxt(gctx,N[i].x,N[i].y,i);
        }
    }

    var nInst;
    function loadNet(gen) {
        for (let i = 0; i < M.UCt; i++) {
            N[i].to = [];
            if (sumDep(i, gen) == 0) { continue };    // no departures
            nInst = 0;
            for (j = 0; j < M.UCt; j++) {
                if (i == j) { continue };     // skip edge to itself
                markEdges(i, j, gen);
            }
        }
    }


    function sumDep(i, gen) {
        let sum = 0;
        let Y = U[i].depT[gen];
        sum = sum + Y.gCt;
        sum = sum + Y.yCt;
        sum = sum + Y.bCt;
        sum = sum + Y.rCt;
        sum = sum + Y.oCt;
        return (sum);
    }


    function markEdges(i, j, gen) {
        let Y = U[i].dep[gen][j];
        if (Y.gCt > 0) { loadEdge(i, j, gen, "green") };
        if (Y.yCt > 0) { loadEdge(i, j, gen, "yellow") };
        if (Y.bCt > 0) { loadEdge(i, j, gen, "aqua") };
        if (Y.rCt > 0) { loadEdge(i, j, gen, "red") };
        if (Y.oCt > 0) { loadEdge(i, j, gen, "orange") };
    }

    function loadEdge(i, j, gen, colr) {
        let Y = U[i].dep[gen][j];
        let Z = N[i].to;
        Z[nInst] = new CreateEdge();
        Z[nInst].u = j;
        Z[nInst].clr = colr;
        switch (colr) {
            case "green":
                Z[nInst].ct = Y.gCt;
                break;
            case "yellow":
                Z[nInst].ct = Y.yCt;
                break;
            case "aqua":
                Z[nInst].ct = Y.bCt;
                break;
            case "red":
                Z[nInst].ct = Y.rCt;
                break;
            case "orange":
                Z[nInst].ct = Y.oCt;
                break;
        }
        nInst++;
    }

    function calcdydx() {
        let n;
        for (n = 0; n < M.UCt; n++) {
            focusN(n);
        }
    }

    function focusN(n) {
        if (N[n].to == "" || N[n].to === undefined) { return };
        let A = N[n];
        let edges = (A.to).length;
        for (let e = 0; e < edges; e++) {
            calcE(n, e);
        }
    }

    function calcE(n, e) {
        let tangent;
        let A = N[n];
        let edge = A.to[e];
        let tou = edge.u;

        let tox = N[tou].x;
        let toy = N[tou].y;

        let frx = N[n].x;
        let fry = N[n].y;

        tangent = Math.abs((toy - fry) / (tox - frx));
        edge.dx = Math.abs((tox - frx) / GRANULARITY);
        edge.dy = edge.dx * tangent;
        if (toy < fry) { edge.dy = 0 - edge.dy };
        if (tox < frx) { edge.dx = 0 - edge.dx };
        edge.xi = frx;
        edge.yi = fry;

        edge.steps = 0;
        edge.newx = frx;
        edge.newy = fry;
    }

    function Nanimate() {
        Nstart = Date.now();
        clearInterval(Ntimer);
        Ntimer = setInterval(function () {
            Nupdate();
            let timePassed = Date.now() - Nstart;
            if (timePassed >= ELAPSED) {
                clearInterval(Ntimer); // finish the animation after 2 seconds
                return;
            }
        }, SPEED);
    }

    function Nupdate() {
        drawNRect(0, 0, 800, 700, "black");
        drawNArena(gen);
        graphDDHH(gen);
        for (let n = 0; n < M.UCt; n++) {
            if (N[n].to == "" || N[n].to === undefined) continue;
            showNode(n);
        }
    }

    function showNode(n) {
        let A = N[n];
        let edges = (A.to).length;

        for (let e = 0; e < edges; e++) {
            showEdge(n, e);
        }
    }

    function showEdge(n, e) {
        let A = N[n];
        let edge = A.to[e];
        let tou = edge.u;
        let tox = N[tou].x;
        let toy = N[tou].y;

        drawNLine(A.x, A.y, tox, toy, "midnightblue");
        drawNPath(n, e);
        let timePassed = Date.now() - Nstart;
        if (timePassed >= LFACTOR * e) {
            drawNPath(n, e);
        }
        //      if (N[n].to[e].dx==0 && N[n].to[e].dy==0)
        //         clearInterval(Ntimer);
    }

    function drawNRect(x, y, width, height, clr) {
        gctx.beginPath();
        gctx.moveTo(x, y);
        gctx.fillStyle = clr;
        gctx.fillRect(x, y, width, height);
    }


    function drawNPath(node, ic) {        // baby steps for animation
        netwTxt(N[node].to[ic].newx, N[node].to[ic].newy, N[node].to[ic].ct.toString(), "black");
        N[node].to[ic].newx = N[node].to[ic].newx + N[node].to[ic].dx;
        N[node].to[ic].newy = N[node].to[ic].newy + N[node].to[ic].dy;
        netwTxt(N[node].to[ic].newx, N[node].to[ic].newy, N[node].to[ic].ct.toString(), N[node].to[ic].clr);
        N[node].to[ic].steps++;
        if (N[node].to[ic].steps >= GRANULARITY) {
            N[node].to[ic].dx = 0;
            N[node].to[ic].dy = 0;
        }
    }



    function connect(fru, tou) {          // the line connecting 2 nodes
        let x1, x2, y1, y2;
        x1 = N[fru].x;
        y1 = N[fru].y;
        x2 = N[tou].x;
        y2 = N[tou].y;
        drawNLine(x1, y1, x2, y2, "midnightblue");
    }

    function netwTxt(x, y, tSTR, clr) {       // text routine
        gctx.font = "30px Arial";
        gctx.fillStyle = clr;
        gctx.fillText(tSTR, x, y);
    }

    function drawNC(i, gen, x, y, rad, color) {       // draw a single node
        gctx.beginPath();
        gctx.arc(x, y, rad, 0, 2 * Math.PI);
        gctx.fillStyle = color;
        gctx.fill();
        gctx.stroke();
        gctx.strokeStyle = "black";
        gctx.font = "12px Courier";
        gctx.fillStyle = "white";
        gctx.fillText(UN[i],x-40, y+40);
        let A=U[i];
        let txtdata = A.logGreen[gen].toFixed()+":"+A.logYellow[gen]+":"+A.logBlue[gen].toFixed()+":"+
                      A.logRed[gen].toFixed()+":"+A.logOrange[gen].toFixed();
        gctx.fillText(txtdata,x-20,y+20);
    }


    function drawNLine(x1, y1, x2, y2, clr) {    // draw a single line
        gctx.beginPath();
        gctx.moveTo(x1, y1);
        gctx.lineTo(x2, y2);
        gctx.strokeStyle = clr;
        gctx.stroke();
    }

    function drawCircleTxt(canv,x,y,i) {
        canv.font = "12px Arial";
        canv.fillStyle = "white";
        canv.fillText(i.toFixed(0),x,y);
    }

/**********************************************************************************/
var HALTgen = 90000;
var oneTime = 0;
function HALT(){
      wrapUp();
      if (gen > HALTgen && HALTgen >0){
          alertX("HALTgen maximum generations reached at gen"+gen);
          MODE="manual";
          clearInterval(clockTimer);
          return;
      }
      if (oneTime == 0) {
          alertX("Self-terminate with no further infectives at gen "+gen);
          oneTime = 1;
          return;
      }

      if (use_html) {
          if (MODE=="auto"){
              MODE = "manual";
              clearInterval(clockTimer);
              drawLocal();
          };
          return;
      };
      MODE="manual";
      console_log("Paradise Regained");
      clearInterval(clockTimer);
}


    var wrapGreen = 0;
    var wrapYellow = 0;
    var wrapBlue = 0;
    var wrapRed = 0;
    var wrapOrange = 0;
    var totGreen = 0;
    var totYellow = 0;
    var totBlue = 0;
    var totRed = 0;
    var totOrange = 0;


    function wrapUp(){
        console_log("\nWRAPUP: gen" +gen);
        console_log("calculated R0: "+R0);
        console_log(" ");

        if (M.ID == "MV-LTC"){
            wrapup_mvLTC();
            return;
        };
        if (M.ID == "Reaction1"){
            wrapupReaction1();
            return;
        }
    }

    function wrapupReaction1(){
        console_log("Wrapup Reaction1 results");

        for (k=0; k<M.UCt; k++){
            findReactmax(k);
        }
    }

    function findReactmax(k){
        let i, max, r, ptr;
        let A;
        A = U[k].infectHere;
        r = U[k].logRed.length;
        if (A == "" || A === undefined) { }
          else {
            max = 0; ptr = 0;
            console_log("First infection in U"+k+" at gen "+A[0][0]);
            for (i=0;i<r;i++){
              if (U[k].logRed[i] > max){
                  max = U[k].logRed[i];
                  ptr = i;
              }            }
            console_log("Max infections in U"+k+" at gen "+ptr+": "+max);
            console_log(" ");
            stepThrough(0,1);
            stepThrough(2,3);
            stepThrough(4,5);
        }
    }

    function stepThrough(a,b){
        let min;
        min = U[a].infectHere[0][0];
        if (U[b].infectHere[0][0] < min){
            min = U[b].infectHere[0][0]
        }
        let step = 200;
        let limit = gen;
        let i;
        for (i=min; i<gen; i+200){
            print_console("U"+a+":"+U[a].logRed[i]+" at gen"+i);
            print_console("U"+b+":"+U[b].logRed[i]+" at gen"+i);
        }
    }

    function wrapup_mvLTC(){
        totGreen = 0;
        totYellow = 0;
        totBlue = 0;
        totRed = 0;
        totOrange = 0;


        wrapCt("Student GpA",0,9);
        wrapCt("Student GpB",10,19);
        wrapCt("Student GpC",20,29);
        wrapCt("Teachers",30,35);
        wrapCt("Spouses",36,40);
        wrapCt("Grandparents",41,47);
        wrapCt("LTC Staff DayShift",48,54);
        wrapCt("LTC Staff Evenight Shift",55,58);
        wrapCt("LTC Staff Night Shift",59,61);
        wrapCt("LTC Residents with Fam",62,71);
        wrapCt("LTC Residents NO Fam",72,89);
        wrapCt("Bar Staff",90,99);
        console_log(" Total G-Y-B-R-O = "+totGreen+" "+totYellow+" "+totBlue+" "+totRed+" "+totOrange);
        let i;
        for (i=0;i<M.UCt;i++){
            let r = U[i].infectHere.length-1;
            console_log(U[i].infectHere[r][1]+" infections happened in U"+i+"  "+UN[i]);
        }
    }

    function wrapCt(a,b,c){
        wrapGreen = 0;
        wrapYellow = 0;
        wrapBlue = 0;
        wrapRed = 0;
        wrapOrange = 0;

        let x = (c-b+1);
        let j;
        for (j=b; j<c+1; j++){
            switch(P[j].state){
                case "green":
                    wrapGreen++;
                    break;
                case "yellow":
                    wrapYellow++;
                    break;
                case "blue":
                    wrapBlue++;
                    break;
                case "red":
                    wrapRed++;
                case "orange":
                    wrapOrange++;
                    break;
                default:
                    break;
            }
          }
          totGreen = totGreen + wrapGreen;
          totYellow = totYellow + wrapYellow;
          totBlue = totBlue+ wrapBlue;
          totRed = totRed + wrapRed;
          totOrange = totOrange + wrapOrange;
          console_log(a);
          console_log("     Green     "+wrapGreen);
          console_log("     Yellow    "+wrapYellow);
          console_log("     Blue      "+wrapBlue);
          console_log("     Red       "+wrapRed);
          console_log("     Orange    "+wrapOrange);
          console_log(" ");
    }


    function alertX (x){
        console_log("ALERT! "+x);
        if (use_html) {
            alert(x);
        }
    }

    function GUI(elem,argu){
      if (use_html){
          document.getElementById(elem).innerHTML = argu;
      }
    }



    function GUIstyle(elem,argu) {
        if (use_html) {
            document.getElementById(elem).style.display = argu;
        }
    }


    function console_log(x){
        console.log(x)
    }


/* this initialization is for JSON parameter version

*/
var use_html = false;
let x = GetURLParameter("use_html");
if (x===undefined){
  x = true
}
if (x == "false"){
  use_html = false
} else {
  use_html = true
}




var transfer = new CreateTransfer();
if (use_html) {
      initMV();
      blackCanvas("graph");
      GUIstyle("getFile","block");
} else {
      startParam();
      startPopFile();
      startCaseFile();
      initEpiCenters();
      load();
      load();
      load();
      auto();
}







/********************   ASH stuff **********************************************
// produce string representation for key-value store e.g. a histogram
function dic_to_str(x) {
    var i = 0
    var s = "{"
    for (var key in x) {
        if (i++ > 0) {
            s += ", "
        }
        s += key.toString() + ":" + x[key].toString()
    }
    return s + "}"
}

// difference two key-value stores
function dic_sub(x, y){
  for(k in x) if(!(k in y)) return null // assert keys match
  for(k in y) if(!(k in x)) return null

  var z = {} // subtract by element
  for(k in x) z[k] = x[k] - y[k]
  return z
}

// l1 norm for dictionary / key-value store: analogy of "absolute value" for a vector
function dic_norm(x){
  var y = 0
  for(k in x) y += Math.abs(x[k])
  return y
}

// metric to compare dictionaries
function dic_metric(x, y){
  return dic_norm(dic_sub(x, y)) // subtract and then take "absolute value" for vectors
}

function list_to_str(x){
  s = x[0]
  if(x.length > 1){
    for(var i = 1; i < x.length; i++){
      s += "," + x[i]
    }
  }
  return s
}

//try to run the simulation
var state_names = ["green", "yellow", "blue", "red", "orange"]
var state_counts = null // try to pass this back to R
var min_iter = 2000

try {
    if (!use_html) {
        auto();
        load();
	var max_iter_same = 25 // simulation exits after metric is 0 for this many iterations
	var max_iterations = 100000
        var last_state_count = null // last iteration's counts for people in each state, for comparison
	var count_zero = 0 // increment this if metric is zero, zero this if metric is nonzero

	var state_counts = []
        console_log(list_to_str(state_names))

        for (var i = 0; i < max_iterations; i++) {

            var state_count = {}
            for (var j = 0; j < state_names.length; j++) state_count[state_names[j]] = 0 // initialize histogram
            for (var j = 0; j < M.PCt; j++) state_count[P[j].state] += 1 // accumulate by person

	    var count_list = []
	    for(var j = 0; j < state_names.length; j++){
	      count_list.push(state_count[state_names[j]])
	    }
	    console_log(count_list)
	    state_counts.push(count_list) // track all the counts


	    // var info = dic_to_str(state_count) + (last_state_count ? dic_to_str(last_state_count) : "")

	    var d = last_state_count ? (dic_metric(state_count, last_state_count)): 0 // are people changing state?
            if(d > 0) count_zero = 0 // people are changing state
            else count_zero += 1 // people aren't changing state
            // console_log(d, " ", info)

	    if(count_zero >= max_iter_same && i >= min_iter) break // exit for loop / stop iterating, if we reached a fixed point

	    TimesUp(); // go to next state
            last_state_count = state_count;
        }
    }
} catch (e) {
    console_log(e.stack)
}
*/
