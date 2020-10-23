// ****************************************************************************
// check if DOM (document object model) exists ********************************
// ****************************************************************************

var use_html = true
try {
    document // does DOM exist?
} catch {
    use_html = false // if DOM doesn't exist, assume we're running from R / v8
}

// ****************************************************************************
// file handling **************************************************************
// ****************************************************************************

var lines = [];

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
    reader.onerror = errorHandler;
    reader.readAsText(fileToRead); // read file into memory as utf-8
}

function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
    }
    processLines();
}

function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
}

// ****************************************************************************

if (use_html) {
    var slider = document.getElementById("myRange");
    slider.oninput = function() {
        clearInterval(clockTimer);
        MOTION = this.value * 500;
        clockTimer = setInterval(TimesUp, MOTION / FPS);
    }
}

try {
    var fullCt = 0;
    var VIEW = "local";
    var MODE = "manual"; // or "MV" - master controller of behavior
    var graphFlag = "NO";


    // *********************************** CREATE CANVASES FOR EACH PANE *******************************

    function drawc(x, y, rad, color, ctx) {
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "black";
    }

    function CreateCanvases() {
        this.cid;
        this.width;
        this.height;
        this.style.top;
        this.style.left;
        this.ctx;
    }

    var cn = [];
    var offX = 75;
    var offY = 100;
    var pHz = "300" + "px";
    var pVt = (200).toString() + "px";

    var c;

    if (use_html) {
        c = document.getElementById("fields").children;

        for (let i = 0; i < c.length; i++) {
            var x = 0;
            var y = 0;
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
    if (use_html) {
        canp1 = document.getElementById("canp1");
        canp1.width = 300;
        canp1.height = 250;
        canp1.style.top = "75px";
        canp1.style.left = "100px";
    }

    var ctx1;
    if (use_html) {
        ctx1 = canp1.getContext("2d");
        ctx1.fillStyle = "MidnightBlue";
        ctx1.fillRect(0, 0, canp1.width, canp1.height);
        drawc(10, 10, 8, "green", ctx1);
        /*
        canp1.addEventListener("mousemove", mouseMove1, {passive:true});
        canp1.addEventListener("mouseout", mouseOut1, {passive:true});
        canp1.addEventListener("click", mouseClick1, {passive:true});
        */
    }

    // ********************************************************

    var canp2;
    if (use_html) {
        canp2 = document.getElementById("canp2");
        canp2.width = 300;
        canp2.height = 250;
        canp2.style.top = "75px";
        canp2.style.left = "400px";
    }

    var ctx2;
    if (use_html) {
        ctx2 = canp2.getContext("2d");
        ctx2.fillStyle = "MidnightBlue";
        ctx2.fillRect(0, 0, canp2.width, canp2.height);
        drawc(10, 10, 8, "green", ctx2);
        /*
        canp2.addEventListener("mousemove", mouseMove2, {passive:true});
        canp2.addEventListener("mouseout", mouseOut2, {passive:true});
        canp2.addEventListener("click", mouseClick2, {passive:true});
        */
    }
    // *********************************************************************

    var canp3;
    if (use_html) {
        canp3 = document.getElementById("canp3");
        canp3.width = 300;
        canp3.height = 250;
        canp3.style.top = "75px";
        canp3.style.left = "700px";
    }

    var ctx3;
    if (use_html) {
        ctx3 = canp3.getContext("2d");
        ctx3.fillStyle = "MidnightBlue";
        ctx3.fillRect(0, 0, canp3.width, canp3.height);
        drawc(10, 10, 8, "green", ctx3);
        /*
        canp3.addEventListener("mousemove", mouseMove3, {passive:true});
        canp3.addEventListener("mouseout", mouseOut3, {passive:true});
        canp3.addEventListener("click", mouseClick3, {passive:true});
        */
    }
    // ********************************************************

    var canp4;
    if (use_html) {
        canp4 = document.getElementById("canp4");
        canp4.width = 300;
        canp4.height = 250;
        canp4.style.top = "375px";
        canp4.style.left = "100px";
    }

    var ctx4;
    if (use_html) {
        ctx4 = canp4.getContext("2d");
        ctx4.fillStyle = "MidnightBlue";
        ctx4.fillRect(0, 0, canp4.width, canp4.height);
        drawc(10, 10, 8, "green", ctx4);
        /*
        canp4.addEventListener("mousemove", mouseMove4, {passive:true});
        canp4.addEventListener("mouseout", mouseOut4, {passive:true});
        canp4.addEventListener("click", mouseClick4, {passive:true});
        */
    }
    // ********************************************************

    var canp5;
    if (use_html) {
        canp5 = document.getElementById("canp5");
        canp5.width = 300;
        canp5.height = 250;
        canp5.style.top = "374px";
        canp5.style.left = "400px";
    }

    var ctx5;
    if (use_html) {
        ctx5 = canp5.getContext("2d");
        ctx5.fillStyle = "MidnightBlue";
        ctx5.fillRect(0, 0, canp5.width, canp5.height);
        drawc(10, 10, 8, "green", ctx5);
        /*
        canp5.addEventListener("mousemove", mouseMove5, {passive:true});
        canp5.addEventListener("mouseout", mouseOut5, {passive:true});
        canp5.addEventListener("click", mouseClick5, {passive:true});
        */
    }
    // ********************************************************

    var canp6;
    if (use_html) {
        canp6 = document.getElementById("canp6");
        canp6.width = 300;
        canp6.height = 250;
        canp6.style.top = "375px";
        canp6.style.left = "700px";
    }

    var ctx6;
    if (use_html) {
        ctx6 = canp6.getContext("2d");
        ctx6.fillStyle = "MidnightBlue";
        ctx6.fillRect(0, 0, canp6.width, canp6.height);
        drawc(10, 10, 8, "green", ctx6);
        /*
        canp6.addEventListener("mousemove", mouseMove6, {passive:true});
        canp6.addEventListener("mouseout", mouseOut6, {passive:true});
        canp6.addEventListener("click", mouseClick6, {passive:true});
        */
    }
    // ********************************************************

    var canp7;
    if (use_html) {
        canp7 = document.getElementById("canp7");
        canp7.width = 300;
        canp7.height = 250;
        canp7.style.top = "675px";
        canp7.style.left = "100px";
    }

    var ctx7;
    if (use_html) {
        ctx7 = canp7.getContext("2d");
        ctx7.fillStyle = "MidnightBlue";
        ctx7.fillRect(0, 0, canp7.width, canp7.height);
        drawc(10, 10, 8, "green", ctx7);
        /*
        canp7.addEventListener("mousemove", mouseMove7, {passive:true});
        canp7.addEventListener("mouseout", mouseOut7, {passive:true});
        canp7.addEventListener("click", mouseClick7, {passive:true});
        */
    }
    // ********************************************************

    var canp8;
    if (use_html) {
        canp8 = document.getElementById("canp8");
        canp8.width = 300;
        canp8.height = 250;
        canp8.style.top = "675px";
        canp8.style.left = "400px";
    }

    var ctx8;
    if (use_html) {
        ctx8 = canp8.getContext("2d");
        ctx8.fillStyle = "MidnightBlue";
        ctx8.fillRect(0, 0, canp8.width, canp8.height);
        drawc(10, 10, 8, "green", ctx8);
        /*
        canp8.addEventListener("mousemove", mouseMove8, {passive:true});
        canp8.addEventListener("mouseout", mouseOut8, {passive:true});
        canp8.addEventListener("click", mouseClick8, {passive:true});
        */
    }
    // ********************************************************

    var canp9;
    if (use_html) {
        canp9 = document.getElementById("canp9");
        canp9.width = 300;
        canp9.height = 250;
        canp9.style.top = "675px";
        canp9.style.left = "700px";
    }

    var ctx9;
    if (use_html) {
        ctx9 = canp9.getContext("2d");
        ctx9.fillStyle = "MidnightBlue";
        ctx9.fillRect(0, 0, canp9.width, canp9.height);
        drawc(10, 10, 8, "green", ctx9);
        /*
        canp9.addEventListener("mousemove", mouseMove9, {passive:true});
        canp9.addEventListener("mouseout", mouseOut9, {passive:true});
        canp9.addEventListener("click", mouseClick9, {passive:true});
        */
    }


    // ***************************************************************************

    function mouseMove1() {
        document.getElementById("canp1").style.border = "thick solid yellow";
    }

    function mouseOut1() {
        document.getElementById("canp1").style.border = "thin  solid blue";
    }

    function mouseClick1() {
        //
    }

    // ******************************************** mouse 2 ********************

    function mouseMove2() {
        document.getElementById("canp2").style.border = "thick solid yellow";
    }

    function mouseOut2() {
        document.getElementById("canp2").style.border = "thin  solid blue";
    }

    var vid2;

    function mouseClick2() {
        vid2 = document.getElementById("myVideo2");
        vid2.loop = true;
        vid2.play();
    }

    function playVid2() {
        vid2 = document.getElementById("myVideo2");
        vid2.play();
    }

    function pauseVid2() {
        vid2.pause();
    }

    function mouseMove3() {
        document.getElementById("canp3").style.border = "thick solid yellow";
    }

    function mouseOut3() {
        document.getElementById("canp3").style.border = "thin  solid blue";
    }

    function mouseClick3() {
        //
    }

    function mouseMove4() {
        document.getElementById("canp4").style.border = "thick solid yellow";
    }

    function mouseOut4() {
        document.getElementById("canp4").style.border = "thin  solid blue";
    }

    var vid4;

    function mouseClick4() {
        vid4 = document.getElementById("myVideo4");
        vid4.loop = true;
        vid4.play();
    }

    function playVid4() {
        vid4 = document.getElementById("myVideo4");
        vid4.play();
    }

    function pauseVid4() {
        vid4.pause();
    }

    function mouseMove5() {
        document.getElementById("canp5").style.border = "thick solid yellow";
    }

    function mouseOut5() {
        document.getElementById("canp5").style.border = "thin  solid blue";
    }

    function mouseClick5() {
        //
    }

    function mouseMove6() {
        document.getElementById("canp6").style.border = "thick solid yellow";
    }

    function mouseOut6() {
        document.getElementById("canp6").style.border = "thin  solid blue";
    }

    function mouseClick6() {
        //
    }

    function mouseMove7() {
        document.getElementById("canp7").style.border = "thick solid yellow";
    }

    function mouseOut7() {
        document.getElementById("canp7").style.border = "thin  solid blue";
    }

    function mouseClick7() {
        //
    }

    function mouseMove8() {
        document.getElementById("canp8").style.border = "thick solid yellow";
    }

    function mouseOut8() {
        document.getElementById("canp8").style.border = "thin  solid blue";
    }

    function mouseClick8() {
        //
    }

    function mouseMove9() {
        document.getElementById("canp9").style.border = "thick solid yellow";
    }

    function mouseOut9() {
        document.getElementById("canp9").style.border = "thin  solid blue";
    }

    function mouseClick9() {
        //
    }


    // ************************************ CREATE CANVAS PANES *******************************************

    var winP = [];

    function CreateWinP() {
        this.ctx;
        this.canp;
    }

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

    // *************************** the following are mouse click functions but of course can be called elsewhere *****

    function selPane1() {
        alert("Pane 1");
        document.getElementById("pane1").innerHTML = "Hello World";
    }

    function selPane2() {
        alert("Pane 2");
        alert("making them all disappear except canvas");
        document.getElementById("windowpane").style.display = "none";
        document.getElementById("fields").style.display = "none";

    }

    function selPane3() {
        alert("Pane 3");
    }

    function selPane4() {
        alert("Pane 4");
        document.getElementById("pane4").innerHTML = "Hello World 4";
    }

    function selPane5() {
        alert("Pane 5");
    }

    function selPane6() {
        alert("Pane 6");
        document.getElementById("pane6").innerHTML = U[6].name;
        //    document.getElementById("pane6").style.border = "thick solid yellow";
        document.getElementById("canp6").style.border = "thick solid yellow";

    }

    function selPane7() {
        alert("Pane 7");
        document.getElementById("pane7").innerHTML = "Hello World 7";
    }

    function selPane8() {
        alert("Pane 8");
        document.getElementById("pane8").innerHTML = "Hello World 8";
    }

    function selPane9() {
        alert("Pane ");
        document.getElementById("pane9").innerHTML = U[9].name;
    }





    // ***************************************************** NAMES OF UNIVERSES **************************



	var UN = [];
	UN[0] = "0 CLASSROOM 1";
	UN[1] = "1 PROJECT/LAB";
	UN[2] = "2 PLAYGROUND";
	UN[3] = "3 LUNCHROOM";
	UN[4] = "4 CLASSROOM 2";
	UN[5] = "5 TEACHER LOUNGE";
	UN[6] = "6 LONG TERM CARE";
	UN[7] = "7 BAR/DANCE/RECEPTION";
	UN[8] = "8 HOME";

    function loadMVnames() {
        var text = prompt("Enter names of the Universes as a list separated by commas. No quotes necessary.");
        parseMVnames(text);
    }

    function parseMVnames(x) {
        let i, y, z;
        if (x == "" || x == null) return;

		for (i = 0; i < 9; i++) {
			y = x.indexOf(",", 0);
			if (y == -1) break;
			UN[i] = (x.substring(0, y));
			x = x.substring(y + 1);
		}
		showMVname();
    }

    function showMVname() {
        document.getElementById("pane1").innerHTML = UN[0].fontcolor("white");
        document.getElementById("pane2").innerHTML = UN[1].fontcolor("white");
        document.getElementById("pane3").innerHTML = UN[2].fontcolor("white");
        document.getElementById("pane4").innerHTML = UN[3].fontcolor("white");
        document.getElementById("pane5").innerHTML = UN[4].fontcolor("white");
        document.getElementById("pane6").innerHTML = UN[5].fontcolor("white");
        document.getElementById("pane7").innerHTML = UN[6].fontcolor("white");
        document.getElementById("pane8").innerHTML = UN[7].fontcolor("white");
        document.getElementById("pane9").innerHTML = UN[8].fontcolor("white");
    }

    function rBlues() {
        let ranB, id, univ;
        var txt = prompt("Enter number of travelom conversion to Infected State");
        document.getElementById("rBlueNum").innerHTML = txt;
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

    // ************************************* CREATE MATRIX FOR MUTIVERSE ************************

	function showMingle(){
	   var txt = prompt("Set or Change mingle factor FOR THE CURRENT UNIVERSE -- from 0.1 to 10");
	   document.getElementById("dMingl").innerHTML = txt;
		let mn = eval(txt);
		U[vU].minglf = mn/10;     // so user can keep the same scale of 1 to 10 for U and Persons
	}


    if (use_html) {
        document.getElementById("row1").innerHTML = UN[0];
        document.getElementById("row2").innerHTML = UN[1];
        document.getElementById("row3").innerHTML = UN[2];
        document.getElementById("row4").innerHTML = UN[3];
        document.getElementById("row5").innerHTML = UN[4];
        document.getElementById("row6").innerHTML = UN[5];
        document.getElementById("row7").innerHTML = UN[6];
        document.getElementById("row8").innerHTML = UN[7];
        document.getElementById("row9").innerHTML = UN[8];
        showMVname();
    }

    // *************************************** DISPLAY MATRIX AND PROBABILITY DIStrIButioNS ******************

    (function() {
        hideMV()
    })();

    var MVtoggle = false;

    function hideMV() {
        if (MVtoggle) {
            showMV();
            MVtoggle = false;
        } else {
            MVtoggle = true;
            if (use_html) {
                document.getElementById("myTab").style.display = "block";
                document.getElementById("chartContainer6").style.display = "block";
                document.getElementById("gameCanvas").style.display = "block";
                document.getElementById("localCharts").style.display = "block";

                document.getElementById("MVstats0").style.display = "none";
                document.getElementById("MVstats1").style.display = "none";
                document.getElementById("MVstats2").style.display = "none";
                document.getElementById("MVstats3").style.display = "none";
                document.getElementById("MVstats4").style.display = "none";
                document.getElementById("MVstats5").style.display = "none";
                document.getElementById("MVstats6").style.display = "none";
                document.getElementById("MVstats7").style.display = "none";
                document.getElementById("MVstats8").style.display = "none";

                document.getElementById("MVcharts").style.display = "none";
                document.getElementById("dayhr").style.display = "none";
                document.getElementById("windowpane").style.display = "none";
                document.getElementById("fields").style.display = "none";
                document.getElementById("MVmatrix").style.display = "none";
                document.getElementById("MV-menu").style.display = "none";
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
        document.getElementById("myTab").style.display = "none";
        document.getElementById("chartContainer6").style.display = "none";
        document.getElementById("gameCanvas").style.display = "none";
        document.getElementById("localCharts").style.display = "none";

        if (M.UCt > 0) {
            document.getElementById("MVstats0").style.display = "block"
        };
        if (M.UCt > 1) {
            document.getElementById("MVstats1").style.display = "block"
        };
        if (M.UCt > 2) {
            document.getElementById("MVstats2").style.display = "block"
        };
        if (M.UCt > 3) {
            document.getElementById("MVstats3").style.display = "block"
        };
        if (M.UCt > 4) {
            document.getElementById("MVstats4").style.display = "block"
        };
        if (M.UCt > 5) {
            document.getElementById("MVstats5").style.display = "block"
        };
        if (M.UCt > 6) {
            document.getElementById("MVstats6").style.display = "block"
        };
        if (M.UCt > 7) {
            document.getElementById("MVstats7").style.display = "block"
        };
        if (M.UCt > 8) {
            document.getElementById("MVstats8").style.display = "block"
        };


        document.getElementById("MVcharts").style.display = "block";
        document.getElementById("dayhr").style.display = "block";
        document.getElementById("windowpane").style.display = "block";
        document.getElementById("fields").style.display = "block";
        document.getElementById("MVmatrix").style.display = "none"; //for now
        document.getElementById("MV-menu").style.display = "block";
        VIEW = "MV";
        upDateGraph(U[vU], vU);
        document.getElementById("day").innerHTML = ("DAY:\n" + cD);
        document.getElementById("hour").innerHTML = ("HOUR:\n" + cH);
    }


    /* &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

                      THESE ARE THE CHARTS AND OBJECTS UNIVERSE

       $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

    */

    const LTC = 1;
    const HOME = 0;
    var csvAct = "Population";

    var U = []; // local Universes
    var P = []; // all people in the system
    var T = []; // one ticket per person - 24hr or 1 week?
    var D = [];
    var H = []; // timer-based schedule of events - arr depart

    var toTime = 0;
    var toDD = 0;
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

    var tViral = [0, 1, 1.97, 3.87, 7.61, 10, 10, 8.74, 6.67, 5.83, 5.09, 4.45, 3.89, 3.40, 2.98, 2.60, 2.21, 1.86, 1.54, 1.32, 1, 1];

    // temporal transmission Model from t=0 of infection

    var VLlower = 3.6;
    var VLincD = 2.9;
    var VLpeak0 = 4.5;
    var VLpeakVL = 10;
    var VLonsetT = 5.2;
    var VLpeakFnd = 6.2;
    var VLinfEnd = 13.2;
    var VLprePeakRate = 1.069; // every 0.1 days
    var VLpostPeak = 0.865;
    var VLradius = 5;

    function ConstructMVC() {
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
        this.endRedDelta = [];
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



    M.UCt = 9;
    if (use_html) {
        M.PCt = prompt("Enter the global population size");
    } else {
        M.PCt = number_of_agents; // passed in from R/V8 javascript interpreter
    }

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
        this.greenCt; // these counts reflect the status of this universe at this time
        this.yellowCt;
        this.blueCt;
        this.redCt;
        this.orangeCt;
        this.allTouch;
        this.cases;
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
        U.greenCt = 0;
        U.yellowCt = 0;
        U.blueCt = 0;
        U.redCt = 0;
        U.orangeCt = 0;
        U.allTouch = 0;
        U.cases = 0;
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
    };

    (function() {
        let i;
        for (i = 0; i < M.UCt; i++) {
            U[i] = new CreateUniverse();
            initUniv(U[i], i);
        }
    })();

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
        for (let i = 0; i < M.UCt; i++) {
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

    (function() {
        let i;
        for (i = 0; i < M.PCt; i++) {
            P[i] = new CreatePerson;
            initPerson(P[i], i);
        }
    })();


    function initPerson(P, i) {
        P.pID = i;
        P.state = "green";
        P.clr = "green";
        P.ageGp = -1;
        P.role = "R";
        P.suscIndx = 1;
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
    }


    // %%%%%%%%%%%%%%%%%%%%%%%%% NOW SET UP ALL THE LOCAL INFO BEFORE SPECIALIZING $$$$$$$$$$$$$$$$$$$$$$
    //

    function stochast(b, factor) {
        let pb = (Math.random() * factor) * b;
        if (Math.random() * 2 > 1) pb = -pb;
        return (b * (1 - factor) + pb)
    }



    // ******************************************************************************************************
    //
    //                              CREATE SCHEDULE AND TICKET POINTERS TO PERSONS BY HOUR
    //
    // ******************************************************************************************************
    //


    (function() {
        let i;
        for (i = 0; i < M.PCt; i++) {
            T[i] = new CreateTicket();
            T[i].pID = i;
            T[i].S = [];
        }
    })();

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

    var transfer = new CreateTransfer();

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

    function parseL(lineStr) {
        let lineS = lineStr;
        if (lineS == "") return false;
        let ID = eval(lineS[0]);
        transfer.pID = ID;
        transfer.stopno = eval(lineS[1]);
        transfer.ETA = eval(lineS[2]);
        transfer.AU = eval(lineS[3]);
        transfer.ETD = eval(lineS[4]);
        transfer.TU = eval(lineS[5]);
        transfer.role = lineS[6];
        transfer.Mx = eval(lineS[7]);
		let trAge = eval(lineS[8]);
		let trFam = lineS[9];
		if (ID==pID) {return true}
		else {
			P[ID].age = -1;
			if (trAge!="" && trAge!==undefined){P[ID].age=trAge};
			P[ID].famKey = -1;
			if (trFam!="" && trFam!==undefined) {P[ID].famKey=trFam};
		}; return true;
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

    function processLines() {
        let i, j;
        if (lines[0][0] == "pID") lines.shift(); //gets rid of row labels
        var lineNo = lines.length;
        if (csvAct == "Population") {
            for (i = 0; i < lineNo; i++) {
                if (parseL(lines[i])) {
                    setupTicket();
                }
            }
            if (use_html) {
                document.getElementById("getFile").style.display = "none";
            }
        } else {
            if (csvAct == "Cases") {
                for (i = 0; i < lineNo; i++) {
                    if (!parseC(lines[i])) break;
                }

                if (use_html) {
                    //drawAgents(0);
                    //showCounts();
                    document.getElementById("getFile").style.display = "none";
                    //document.getElementById("csvButton").style.display="none";
                }
            }
        }
    }

    function caseLoad() {
        if (use_html) {
            document.getElementById("getFile").style.display = "block";
        }
        csvAct = "Cases";
    }

    function parseC(lineStr) {
        let lineS = lineStr;
        if (lineS == "" || lineS === undefined) return false;
        let ID = eval(lineS[0]);

        if (P[ID].pID === undefined || P[ID].pID == "null") return false;

        P[ID].ageGp = eval(lineS[1]); // age group
        P[ID].suscIndx = eval(lineS[2]); // combined risk
        if (P[ID].suscIndx != 0) {
            resizeRisk(ID)
        };

        if (eval(lineS[3]) === undefined || eval(lineS[3]) == "") {} else P[ID].ViralLoad = eval(lineS[3]);
        if (eval(lineS[4]) === undefined || eval(lineS[4]) == "") {} else P[ID].tInfect = 0 - eval(lineS[4]);

        // resizeVL(ID);     //we grow VL for one cycle, so resize after growth
        changeState(ID); //changes state and color by post-inf days

        if (lineS[5] === undefined || lineS[5] == "") {} else P[ID].role = lineS[5];
        if (eval(lineS[6]) === undefined || eval(lineS[6]) == "") {} else P[ID].minglf = eval(lineS[6]);
        return true;
    }

    function resizeRisk(ID) {
        let Q = P[ID];
        Q.baseSize = Q.baseSize * Math.cbrt(Q.suscIndx);
        Q.currSize = stochast(Q.baseSize, 0.05);
    }

    // must test to see if these are transitions
    function changeState(ID) {
        let G = P[ID];
        let postInfect = (cT - G.tInfect);
        if (G.u == -1) {
            return
        }
        if (postInfect > 0) {
            if (postInfect < G.tIncubate) {
                newState(ID, "yellow");
                return
            }
            if (postInfect < G.tOnset) {
                newState(ID, "blue");
                return
            }
            if (postInfect < G.tInert) {
                newState(ID, "red");
                return
            }
            newState(ID, "orange");
        }
        if (use_html) {
            showUstat(G, ID);
        }
    }

    function newState(ID, newState) {
        let G = P[ID];
        let q = P[ID].u;
        let Q = U[q];
        switch (G.state) {
            case "green":
                Q.greenCt--;
                break;
            case "yellow":
                Q.yellowCt--;
                break;
            case "blue":
                Q.blueCt--;
                break;
            case "red":
                Q.redCt--;
                Q.cases--;
                break;
            case "orange":
                Q.orangeCt--;
                Q.cases--;
                break
        }
        G.state = newState;
        G.clr = newState;
        switch (G.state) {
            case "yellow":
                Q.yellowCt++;
                break;
            case "blue":
                Q.blueCt++;
                break;
            case "red":
                Q.redCt++;
                Q.cases++;
                break;
            case "orange":
                Q.orangeCt++;
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

    if (use_html) {
        // load canvas
        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
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

    var epic1 = new Epicenter;
    epic1.X = canWidth / 4;
    epic1.Y = canHeight / 4;
    epic1.perim = 30;
    var epic2 = new Epicenter;
    epic2.X = canWidth / 4;
    epic2.Y = canHeight / 4 * 3;
    epic2.perim = 30;
    var epic3 = new Epicenter;
    epic3.X = canWidth / 4 * 3;
    epic3.Y = canHeight / 4;
    epic3.perim = 30;
    var epic4 = new Epicenter;;
    epic4.X = canWidth / 4 * 3;
    epic4.Y = canHeight / 4 * 3;
    epic4.perim = 30;
    var epic5 = new Epicenter;
    epic5.X = canWidth / 2;
    epic5.Y = canHeight / 2;
    epic5.perim = 30;


    var perim = 20;

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
    epic5.perim = perim;


    function canvTxt(x, y, day, hr, u) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Day" + day + "   HR:" + hr + "  U" + u, x, y);
    }

    function drawC(x, y, rad, color) {
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "black";
    }

    function drawCross(x, y, width, height, clr) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.fillStyle = clr;
        ctx.fillRect(x, y, width, height);
        ctx.fillRect(Math.round(x + width / 2 - height / 2), Math.round(y + height / 2 - width / 2), height, width);
    }

    function drawRect(x, y, width, height, clr) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.fillStyle = clr;
        ctx.fillRect(x, y, width, height);
    }

    function drawEpi() {
        drawCross(epic1.X, epic1.Y, 5, 1, "pink");
        drawCross(epic2.X, epic2.Y, 5, 1, "pink");
        drawCross(epic3.X, epic3.Y, 5, 1, "pink");
        drawCross(epic4.X, epic4.Y, 5, 1, "pink");
        drawCross(epic5.X, epic5.Y, 5, 1, "pink");
        canvTxt(15, 30, cD, cH, vU);
    }

    function drawAgent(x, y, g, clrFlag) {

        fullCt++;
        let clr, size;
        size = P[g].currSize;
        //    canvTxt(15,30,cD,cH,vU);
        if (clrFlag == -1) {
            clr = P[g].state;
        } else {
            clr = clrFlag;
        }
        if (use_html) {
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
    }

    function drawU() {
        let i, j, k, l;
        if (use_html) {
            drawRect(0, 0, canWidth, canHeight, "black");
            canvTxt(15, 30, cD, cH, vU);
        }
        k = U[vU].person.slice(0);
        l = k.length;
        for (i = 0; i < l; i++) {
            j = k.pop();
            drawAgent(P[j].X, P[j].Y, j, -1);
        }
    }



    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //
    //          these functions deal with parameter settings by user incl slider
    //
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    function showIncD() {
        let incTxt = prompt("Current incubation days as shown below. Enter new value if desired, otherwise cancel", metIncMax);
        let incDays = parseInt(incTxt);
        document.getElementById("dIncD").innerHTML = incDays;
        if (incDays === null || incDays == "" || incDays == metIncMax) return;
        metIncMax = incDays;
        let pCt = 0;
        for (pCt = 0; pCt < M.PCt; pCt++) {
            P[pCt].incMax = metIncMax;
        }
    }

    function showInfD() {
        let infTxt = prompt("Current asymptomatic transmission days shown below. To change, enter new value else cancel", metInfectMax);
        let infDays = parseInt(infTxt);
        document.getElementById("dInfD").innerHTML = infDays;
        if (infDays === null || infDays == "" || infDays == metInfectMax) return;
        metInfectMax = infDays;
        let pCt = 0;
        for (pCt = 0; pCt < M.PCt; pCt++) {
            P[pCt].infectMax = metInfectMax;
        }
    }

    function showCliD() {
        let cliTxt = prompt("Current days of infectivity after case is symptomatic or tested positive \nTo\
 change enter new value or cancel (applies to REDs)", metDiagMax);
        let cliDays = parseInt(cliTxt);
        document.getElementById("dCliD").innerHTML = cliDays;
        if (cliDays === null || cliDays == "" || cliDays == metDiagMax) return;
        metDiagMax = cliDays;
        let pCt = 0;
        for (pCt = 0; pCt < M.PCt; pCt++) {
            P[pCt].diagMax = metDiagMax;
        }
    }


    function showCycle() {
        let infTxt = prompt("Current activity events per hour. To change, enter new value else cancel", cycleMax);
        let infCyc = parseInt(infTxt);
        document.getElementById("dCycl").innerHTML = infCyc;
        if (infCyc === null || infCyc == "" || infCyc == cycleMax) return;
        cycleMax = infCyc;
    }

    function showPradius() {
        let rTxt = prompt("Enter Hazard rtadius of personal safety \nThe smaller the extent of isolation", VLradius);
        let pRad = parseInt(rTxt);
        document.getElementById("dPrad").innerHTML = pRad;
        if (pRad === null || pRad == "" || pRad == VLradius) return;
        VLradius = pRad;
        let pCt = 0;
        for (pCt = 0; pCt < M.PCt; pCt++) {
            let rRatio = P[pCt].currSize / P[pCt].baseSize;
            P[pCt].baseSize = VLradius;
            P[pCt].currSize = VLradius * rRatio;
        }
    };

    function getToTime() {
        let toTxt = prompt("Enter the DDHH time that this program is to run until", cycleMax);
        let toHHDD = parseInt(toTxt);
        document.getElementById("toHHDD").innerHTML = toHHDD;
        if (toHHDD === null || toHHDD == "" || toHHDD == toTime) return;
        toTime = toHHDD;
    }

    function sizeP(G, g) {
        return (G.currSize);
    }


    var ageRiskT = [];
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


    function ageRisk(G, g) {
        let i;
        if (G.age == "") return (1);
        if (G.age >= 90) return (2.33);
        for (i = 0; i < 9; i++) {
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
        if (use_html) {
            document.getElementById("dCycl").innerHTML = cycleCount;
        }

        let cy = cycleCount;

        for (cy = 0; cy < cycleMax; cy++) {
            if (use_html) {
                if (wU == vU && VIEW == "local") drawRect(0, 0, canWidth, canHeight, "black");
                if (wU == vU && VIEW == "local") drawEpi();
            }
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
                if (use_html) {
                    if (wU == vU && VIEW == "local") showUstat(U[wU], wU);
                }
            }
        }

        if (wU == vU && VIEW == "local") drawU();
        if (use_html) {
            if (wU == vU && VIEW == "local") showUstat(U[wU], wU);
        }
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
        if (G.newY > canWidth) {
            G.newY = canWidth - 10;
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
                if (yLength > raMax) {
                    touchFlag = false;
                } else {
                    touchFlag = true;
                    Q.allTouch++;
                    // console.log("overlap g,h = "+g+","+k[j]+": "+G.state+","+F.state);
                }
				if (touchFlag) {
					if (wU != 8) {VLtransfer(g, k[j])}			//U8 is HOME always
					else {
						if (G.famKey == F.famKey && G.famKey != -1) {VLtransfer(g, k[j])};
					}
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
        // console.log("i,j viral load = "+iVL.toFixed(2)+","+jVL.toFixed(2));
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
            // console.log("iVL, jVL below threshold for i,j"+i+","+j);
            return
        }
        if (Math.max((cT - P[i].tInfect), (cT - P[j].tInfect)) < VLincD) {
            // console.log("both i,j in incubation for"+i+","+j);
            return
        }

        let Vgrad = Math.abs(jVL - iVL);
        let diff = raMax - yLength;
        let Vdist = Math.pow((diff / raMax), 3);
        let Vbig = i;
        if (iVL < jVL) {
            Vbig = j
        };
        let VTrans = Vgrad * Vdist;
        // console.log("Virus Transfer = "+VTrans+" Overlap diff "+diff);

        // this is a stochastic threshold for ineffective touches
        if (VTrans < 0.05) {
            if (Math.random() < 0.5) { // toss a ccoin
                P[Vbig].failedCt++;
                return
            }
        }

        let ipostInfect = cT - P[i].tInfect;
        let jpostInfect = cT - P[j].tInfect;

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

        let qVir = 0;
        if (Vbig == i) {
            let jinfD = Math.floor(jpostInfect);
            if (jinfD < 21) {
                var jinfVir = tViral[jinfD]
            } else jinfVir = 1;
            qVir = Math.min((jVL + VTrans), jinfVir);
            qVir = stochast(qVir, 0.05);
            P[j].ViralLoad = Math.max(qVir, 1); //forcing infection VL to 1
            if (P[j].tInfect == 0) {
                P[j].tInfect = cT
            }
			  if (P[j].state=="green") {
			   let iInf = M.PCt-M.GreenCt;
               console.log(iInf+"I j:famKey "+j+":"+P[j].famKey+" infected by "+P[i].state+" i:famKey "+i+":"+P[i].famKey+" at gen "+gen+" in Univ"+wU);                    // console.log(P[j].state+" "+j+" infected by "+P[i].state+" "+i);
			  }

        } else {
            let iinfD = Math.floor(ipostInfect);
            if (iinfD < 21) {
                var iinfVir = tViral[iinfD]
            } else iinfVir = 1;
            qVir = Math.min((jVL + VTrans), iinfVir);
            qVir = stochast(qVir, 0.1);
            P[i].ViralLoad = Math.max((iVL + VTrans), 1);
            if (P[i].tInfect == 0) { // once for infection
                P[i].tInfect = cT
            }
			  if (P[i].state=="green"){
				let jInf = M.PCt-M.GreenCt;
				console.log(jInf+"I i:famKey "+i+":"+P[i].famKey+" infected by "+P[j].state+" j:famKey "+j+":"+P[j].famKey+" at gen "+gen+" in U"+wU);
			  }
        }
    }
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //          MAIN CONTROL LOOP STARTS here
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    var anFlag = true;
    var animClk;
    var cycleCount = 0;
    var nU = 0;

    var iCycle;
    var cycleMax = 5;
    var arrFlag = false;
    var depFlag = false;


    cD = -1;
    cH = 23; // set up to initialize to first day = 0
    chkMaxTime = 23;
    if (use_html) {
        drawEpi();
    }

    var clockTimer;
    var movieTimer;
    var cycleTimer;
    //hideMV();


    function auto() {
        if (MODE == "auto") {
            MODE = "manual";
            if (use_html) {
                clearInterval(clockTimer);
            }
            return;
        }
        MODE = "auto";
        if (use_html) {
            clockTimer = setInterval(TimesUp, MOTION / FPS);
        }
    }

    function load() {
        var x;
        if (use_html) {
            x = document.getElementById("loadB").innerHTML;
        }
        if (x == "HR++") {
            TimesUp();
            return
        };
        M.clockHr = 24; // one-time initialization
        M.clockDay = -1;
        gen = -1;
        vU = 0;
        wU = 0;
        MODE = "manual";
        startNet();
        for (let i = 0; i < M.UCt; i++) {
            initNet(U[i], 0);
        }
        if (use_html) {
            document.getElementById("loadB").innerHTML = "HR++";
        }
    }

    function TimesUp() {
        gen++;
        for (let i = 0; i < M.UCt; i++) {
            initNet(U[i], gen);
        }
        if (MODE == "auto" && cH == toHH && cD == toDD) {
            MODE = "manual";
            clearInterval(clockTimer);
            drawLocal();
        } else {
            advanceTime();
            conductor();
            tabulate();
        }
        if (graphFlag == "YES") {
            document.getElementById("grSlider").value = 1910;
            sliderFlag = false;
            graphB()
        }
    }

    function advanceTime() {
        if (cH == chkMaxTime) {
            // alert("End of Day - go home, no more coding!");
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
            if (use_html) {
                document.getElementById("day").innerHTML = ("DAY:\n" + cD);
                document.getElementById("hour").innerHTML = ("HOUR:\n" + cH);
            }
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
            if (use_html) {
                drawEpi();
            }
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
            if (Q.ViralLoad == 0) continue;

            if (Q.state == "orange") {
                Q.ViralLoad = Q.ViralLoad * 0.875;
                continue
            }

            let vfactor = 0;
            Q.prevVL = Q.ViralLoad;

            if ((cT - Q.tInfect) < Q.tPeakVL) {
                vfactor = (VLprePeakRate - 1) / (24 * 10);
                newVL = Q.ViralLoad * (1 + vfactor);
            } else {
                vfactor = (1 - VLpostPeak) / (24);
                newVL = Q.ViralLoad * (1 - vfactor);
            }

            let postDays = Math.floor(cT - Q.tInfect);
            let tableVL = 1;
            if (postDays < 20) {
                tableVL = tViral[postDays];
            } else(tableVL = 1); // ernie is this statement correct?

            // console.log("calc vs tableVL "+newVL+","+tableVL);
            Q.ViralLoad = Math.max(Q.ViralLoad, tableVL);
            Q.ViralLoad = stochast(Q.ViralLoad, 0.2);
            // console.log("final VL= "+Q.ViralLoad);

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
            if (Q.ViralLoad == 0) continue; //size unchanged
            let newSize = Q.currSize * Math.cbrt(vRatio);

            // console.log("newSize = "+newSize);
            if (newSize < Q.baseSize) {
                newSize = Q.baseSize
            } else {
                if (newSize > (Q.baseSize * 3)) {
                    newSize = Q.baseSize * 3
                }
            }
            Q.currSize = stochast(newSize, 0.05);
            // console.log("final size of "+i+" = "+Q.currSize);
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
                // console.log("inject red pID = "+g+" redCt in U++");
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
        let tTime = prompt("Enter Last Date in format DDHH, otherwise CANCEL", 0100);
        toTime = parseInt(tTime);
        if (toTime === null || toTime == "" || toTime == 0100) return;
        document.getElementById("toHHDD").innerHTML = toTime;
        toHH = toTime % 100;
        toDD = Math.floor(toTime / 100);
        MODE = "auto";
    }


    function showUstat(Q, q) {
        if (VIEW == "local" && q == vU) {
            document.getElementById("grCt").innerHTML = Q.greenCt;
            document.getElementById("yeCt").innerHTML = Q.yellowCt;
            document.getElementById("blCt").innerHTML = Q.blueCt;
            document.getElementById("reCt").innerHTML = Q.redCt;
            document.getElementById("orCt").innerHTML = Q.orangeCt;
            document.getElementById("dMingl").innerHTML = Q.minglf*10;
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
                x: gen / 24
            });
            Q.endYellow.push({
                y: Q.logYellow[gen],
                x: gen / 24
            });
            Q.endBlue.push({
                y: Q.logBlue[gen],
                x: gen / 24
            });
            Q.endRed.push({
                y: Q.logRed[gen],
                x: gen / 24
            });
            Q.endOrange.push({
                y: Q.logOrange[gen],
                x: gen / 24
            });
            Q.endCases.push({
                y: Q.logCases[gen],
                x: gen / 24
            });
            if (gen > 1) {
                let del = Q.logCases[gen] - Q.logCases[gen - 1];
                Q.endRedDelta.push({
                    y: del,
                    x: gen / 24
                });
            } else {
                Q.endRedDelta.push({
                    y: 0,
                    x: gen / 24
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
            for (let i = 0; i < M.PCt; i++) {
                if (P[i].state != "orange") {
                    continue
                };
                totConv = totConv + P[i].susCt;
            }
            R0 = totConv / M.OrangeCt;
            M.R0 = R0;
            M.logR0[gen] = M.R0;
            if (use_html) {
                document.getElementById("R0button").innerHTML = R0.toFixed(2);
            }
        }

        let vNum, vDenom, endV = 0;
        let len = 0;

        M.endGreen.push({
            y: M.logGreen[gen],
            x: gen / 24
        });
        M.endYellow.push({
            y: M.logYellow[gen],
            x: gen / 24
        });
        M.endBlue.push({
            y: M.logBlue[gen],
            x: gen / 24
        });
        M.endRed.push({
            y: M.logRed[gen],
            x: gen / 24
        });
        M.endOrange.push({
            y: M.logOrange[gen],
            x: gen / 24
        });
        M.endCases.push({
            y: M.logCases[gen],
            x: gen / 24
        });

        if (gen > 1) {
            let del = M.logCases[gen] - M.logCases[gen - 1];
            M.endRedDelta.push({
                y: del,
                x: gen / 24
            });
        } else
            M.endRedDelta.push({
                y: 0,
                x: gen / 24
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


    function upDateGraph(Q, q) {
        let X = Q.arr[gen];
        let Y = Q.depT[gen];

        if (VIEW == "local") {
            if (use_html) {
                showUstat(Q, q);
                chart6.render();
                chart1.render();
                chart2.render();
                chart3.render();
                chart4.render();

                document.getElementById("popStat").innerHTML = Q.Population;
                document.getElementById("arrStat").innerHTML = (X.resCt + X.attCt + X.visCt);
                document.getElementById("depStat").innerHTML = (Y.resCt + Y.attCt + Y.visCt);

                document.getElementById("totouch").innerHTML = Q.allTouch;

                document.getElementById("resCt").innerHTML = Q.Resident;
                document.getElementById("attCt").innerHTML = Q.Attached;
                document.getElementById("visCt").innerHTML = Q.Transient;

                document.getElementById("GArr").innerHTML = X.gCt;
                document.getElementById("YArr").innerHTML = X.yCt;
                document.getElementById("BArr").innerHTML = X.bCt;
                document.getElementById("RArr").innerHTML = X.rCt;
                document.getElementById("OArr").innerHTML = X.oCt;
                document.getElementById("ResArr").innerHTML = X.resCt;
                document.getElementById("AttArr").innerHTML = X.attCt;
                document.getElementById("VisArr").innerHTML = X.visCt;

                document.getElementById("GDep").innerHTML = Y.gCt;
                document.getElementById("YDep").innerHTML = Y.yCt;
                document.getElementById("BDep").innerHTML = Y.bCt;
                document.getElementById("RDep").innerHTML = Y.rCt;
                document.getElementById("ODep").innerHTML = Y.oCt;
                document.getElementById("ResDep").innerHTML = Y.resCt;
                document.getElementById("AttDep").innerHTML = Y.attCt;
                document.getElementById("VisDep").innerHTML = Y.visCt;
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

			document.getElementById("TGreen").innerHTML = M.GreenCt;
			document.getElementById("TYellow").innerHTML = M.YellowCt;
			document.getElementById("TBlue").innerHTML = M.BlueCt;
			document.getElementById("TRed").innerHTML = M.RedCt;
			document.getElementById("TOrange").innerHTML = M.OrangeCt;
			document.getElementById("trafficB").innerHTML = "TRAFFIC";

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
    }

    function MVtable0() {
        let X = U[0].arr[gen];
        let Y = U[0].depT[gen];

        document.getElementById("grMV0").innerHTML = U[0].greenCt;
        document.getElementById("yeMV0").innerHTML = U[0].yellowCt;
        document.getElementById("blMV0").innerHTML = U[0].blueCt;
        document.getElementById("reMV0").innerHTML = U[0].redCt;
        document.getElementById("orMV0").innerHTML = U[0].orangeCt;
        document.getElementById("resMV0").innerHTML = U[0].Resident;
        document.getElementById("attMV0").innerHTML = U[0].Attached;
        document.getElementById("visMV0").innerHTML = U[0].Transient;

        document.getElementById("GMV0").innerHTML = X.gCt;
        document.getElementById("YMV0").innerHTML = X.yCt;
        document.getElementById("BMV0").innerHTML = X.bCt;
        document.getElementById("RMV0").innerHTML = X.rCt;
        document.getElementById("OMV0").innerHTML = X.oCt;
        document.getElementById("ResMV0").innerHTML = X.resCt;
        document.getElementById("AttMV0").innerHTML = X.attCt;
        document.getElementById("VisMV0").innerHTML = X.visCt;

        document.getElementById("GMD0").innerHTML = Y.gCt;
        document.getElementById("YMD0").innerHTML = Y.yCt;
        document.getElementById("BMD0").innerHTML = Y.bCt;
        document.getElementById("RMD0").innerHTML = Y.rCt;
        document.getElementById("OMD0").innerHTML = Y.oCt;
        document.getElementById("ResMD0").innerHTML = Y.resCt;
        document.getElementById("AttMD0").innerHTML = Y.attCt;
        document.getElementById("VisMD0").innerHTML = Y.visCt;
    }
    //      11111111111111111111111111111111111111111111111111111111111111
    //
    function MVtable1() {
        let X = U[1].arr[gen];
        let Y = U[1].depT[gen];

        document.getElementById("grMV1").innerHTML = U[1].greenCt;
        document.getElementById("yeMV1").innerHTML = U[1].yellowCt;
        document.getElementById("blMV1").innerHTML = U[1].blueCt;
        document.getElementById("reMV1").innerHTML = U[1].redCt;
        document.getElementById("orMV1").innerHTML = U[1].orangeCt;
        document.getElementById("resMV1").innerHTML = U[1].Resident;
        document.getElementById("attMV1").innerHTML = U[1].Attached;
        document.getElementById("visMV1").innerHTML = U[1].Transient;

        document.getElementById("GMV1").innerHTML = X.gCt;
        document.getElementById("YMV1").innerHTML = X.yCt;
        document.getElementById("BMV1").innerHTML = X.bCt;
        document.getElementById("RMV1").innerHTML = X.rCt;
        document.getElementById("OMV1").innerHTML = X.oCt;
        document.getElementById("ResMV1").innerHTML = X.resCt;
        document.getElementById("AttMV1").innerHTML = X.attCt;
        document.getElementById("VisMV1").innerHTML = X.visCt;

        document.getElementById("GMD1").innerHTML = Y.gCt;
        document.getElementById("YMD1").innerHTML = Y.yCt;
        document.getElementById("BMD1").innerHTML = Y.bCt;
        document.getElementById("RMD1").innerHTML = Y.rCt;
        document.getElementById("OMD1").innerHTML = Y.oCt;
        document.getElementById("ResMD1").innerHTML = Y.resCt;
        document.getElementById("AttMD1").innerHTML = Y.attCt;
        document.getElementById("VisMD1").innerHTML = Y.visCt;
    }

    function MVtable2() {
        let X = U[2].arr[gen];
        let Y = U[2].depT[gen];

        document.getElementById("grMV2").innerHTML = U[2].greenCt;
        document.getElementById("yeMV2").innerHTML = U[2].yellowCt;
        document.getElementById("blMV2").innerHTML = U[2].blueCt;
        document.getElementById("reMV2").innerHTML = U[2].redCt;
        document.getElementById("orMV2").innerHTML = U[2].orangeCt;
        document.getElementById("resMV2").innerHTML = U[2].Resident;
        document.getElementById("attMV2").innerHTML = U[2].Attached;
        document.getElementById("visMV2").innerHTML = U[2].Transient;

        document.getElementById("GMV2").innerHTML = X.gCt;
        document.getElementById("YMV2").innerHTML = X.yCt;
        document.getElementById("BMV2").innerHTML = X.bCt;
        document.getElementById("RMV2").innerHTML = X.rCt;
        document.getElementById("OMV2").innerHTML = X.oCt;
        document.getElementById("ResMV2").innerHTML = X.resCt;
        document.getElementById("AttMV2").innerHTML = X.attCt;
        document.getElementById("VisMV2").innerHTML = X.visCt;

        document.getElementById("GMD2").innerHTML = Y.gCt;
        document.getElementById("YMD2").innerHTML = Y.yCt;
        document.getElementById("BMD2").innerHTML = Y.bCt;
        document.getElementById("RMD2").innerHTML = Y.rCt;
        document.getElementById("OMD2").innerHTML = Y.oCt;
        document.getElementById("ResMD2").innerHTML = Y.resCt;
        document.getElementById("AttMD2").innerHTML = Y.attCt;
        document.getElementById("VisMD2").innerHTML = Y.visCt;
    }

    function MVtable3() {
        let X = U[3].arr[gen];
        let Y = U[3].depT[gen];

        document.getElementById("grMV3").innerHTML = U[3].greenCt;
        document.getElementById("yeMV3").innerHTML = U[3].yellowCt;
        document.getElementById("blMV3").innerHTML = U[3].blueCt;
        document.getElementById("reMV3").innerHTML = U[3].redCt;
        document.getElementById("orMV3").innerHTML = U[3].orangeCt;
        document.getElementById("resMV3").innerHTML = U[3].Resident;
        document.getElementById("attMV3").innerHTML = U[3].Attached;
        document.getElementById("visMV3").innerHTML = U[3].Transient;

        document.getElementById("GMV3").innerHTML = X.gCt;
        document.getElementById("YMV3").innerHTML = X.yCt;
        document.getElementById("BMV3").innerHTML = X.bCt;
        document.getElementById("RMV3").innerHTML = X.rCt;
        document.getElementById("OMV3").innerHTML = X.oCt;
        document.getElementById("ResMV3").innerHTML = X.resCt;
        document.getElementById("AttMV3").innerHTML = X.attCt;
        document.getElementById("VisMV3").innerHTML = X.visCt;

        document.getElementById("GMD3").innerHTML = Y.gCt;
        document.getElementById("YMD3").innerHTML = Y.yCt;
        document.getElementById("BMD3").innerHTML = Y.bCt;
        document.getElementById("RMD3").innerHTML = Y.rCt;
        document.getElementById("OMD3").innerHTML = Y.oCt;
        document.getElementById("ResMD3").innerHTML = Y.resCt;
        document.getElementById("AttMD3").innerHTML = Y.attCt;
        document.getElementById("VisMD3").innerHTML = Y.visCt;
    }

    function MVtable4() {
        let X = U[4].arr[gen];
        let Y = U[4].depT[gen];

        document.getElementById("grMV4").innerHTML = U[4].greenCt;
        document.getElementById("yeMV4").innerHTML = U[4].yellowCt;
        document.getElementById("blMV4").innerHTML = U[4].blueCt;
        document.getElementById("reMV4").innerHTML = U[4].redCt;
        document.getElementById("orMV4").innerHTML = U[4].orangeCt;
        document.getElementById("resMV4").innerHTML = U[4].Resident;
        document.getElementById("attMV4").innerHTML = U[4].Attached;
        document.getElementById("visMV4").innerHTML = U[4].Transient;

        document.getElementById("GMV4").innerHTML = X.gCt;
        document.getElementById("YMV4").innerHTML = X.yCt;
        document.getElementById("BMV4").innerHTML = X.bCt;
        document.getElementById("RMV4").innerHTML = X.rCt;
        document.getElementById("OMV4").innerHTML = X.oCt;
        document.getElementById("ResMV4").innerHTML = X.resCt;
        document.getElementById("AttMV4").innerHTML = X.attCt;
        document.getElementById("VisMV4").innerHTML = X.visCt;

        document.getElementById("GMD4").innerHTML = Y.gCt;
        document.getElementById("YMD4").innerHTML = Y.yCt;
        document.getElementById("BMD4").innerHTML = Y.bCt;
        document.getElementById("RMD4").innerHTML = Y.rCt;
        document.getElementById("OMD4").innerHTML = Y.oCt;
        document.getElementById("ResMD4").innerHTML = Y.resCt;
        document.getElementById("AttMD4").innerHTML = Y.attCt;
        document.getElementById("VisMD4").innerHTML = Y.visCt;
    }

    function MVtable5() {
        let X = U[5].arr[gen];
        let Y = U[5].depT[gen];

        document.getElementById("grMV5").innerHTML = U[5].greenCt;
        document.getElementById("yeMV5").innerHTML = U[5].yellowCt;
        document.getElementById("blMV5").innerHTML = U[5].blueCt;
        document.getElementById("reMV5").innerHTML = U[5].redCt;
        document.getElementById("orMV5").innerHTML = U[5].orangeCt;
        document.getElementById("resMV5").innerHTML = U[5].Resident;
        document.getElementById("attMV5").innerHTML = U[5].Attached;
        document.getElementById("visMV5").innerHTML = U[5].Transient;

        document.getElementById("GMV5").innerHTML = X.gCt;
        document.getElementById("YMV5").innerHTML = X.yCt;
        document.getElementById("BMV5").innerHTML = X.bCt;
        document.getElementById("RMV5").innerHTML = X.rCt;
        document.getElementById("OMV5").innerHTML = X.oCt;
        document.getElementById("ResMV5").innerHTML = X.resCt;
        document.getElementById("AttMV5").innerHTML = X.attCt;
        document.getElementById("VisMV5").innerHTML = X.visCt;

        document.getElementById("GMD5").innerHTML = Y.gCt;
        document.getElementById("YMD5").innerHTML = Y.yCt;
        document.getElementById("BMD5").innerHTML = Y.bCt;
        document.getElementById("RMD5").innerHTML = Y.rCt;
        document.getElementById("OMD5").innerHTML = Y.oCt;
        document.getElementById("ResMD5").innerHTML = Y.resCt;
        document.getElementById("AttMD5").innerHTML = Y.attCt;
        document.getElementById("VisMD5").innerHTML = Y.visCt;
    }

    function MVtable6() {
        let X = U[6].arr[gen];
        let Y = U[6].depT[gen];

        document.getElementById("grMV6").innerHTML = U[6].greenCt;
        document.getElementById("yeMV6").innerHTML = U[6].yellowCt;
        document.getElementById("blMV6").innerHTML = U[6].blueCt;
        document.getElementById("reMV6").innerHTML = U[6].redCt;
        document.getElementById("orMV6").innerHTML = U[6].orangeCt;
        document.getElementById("resMV6").innerHTML = U[6].Resident;
        document.getElementById("attMV6").innerHTML = U[6].Attached;
        document.getElementById("visMV6").innerHTML = U[6].Transient;

        document.getElementById("GMV6").innerHTML = X.gCt;
        document.getElementById("YMV6").innerHTML = X.yCt;
        document.getElementById("BMV6").innerHTML = X.bCt;
        document.getElementById("RMV6").innerHTML = X.rCt;
        document.getElementById("OMV6").innerHTML = X.oCt;
        document.getElementById("ResMV6").innerHTML = X.resCt;
        document.getElementById("AttMV6").innerHTML = X.attCt;
        document.getElementById("VisMV6").innerHTML = X.visCt;

        document.getElementById("GMD6").innerHTML = Y.gCt;
        document.getElementById("YMD6").innerHTML = Y.yCt;
        document.getElementById("BMD6").innerHTML = Y.bCt;
        document.getElementById("RMD6").innerHTML = Y.rCt;
        document.getElementById("OMD6").innerHTML = Y.oCt;
        document.getElementById("ResMD6").innerHTML = Y.resCt;
        document.getElementById("AttMD6").innerHTML = Y.attCt;
        document.getElementById("VisMD6").innerHTML = Y.visCt;
    }

    function MVtable7() {
        let X = U[7].arr[gen];
        let Y = U[7].depT[gen];

        document.getElementById("grMV7").innerHTML = U[7].greenCt;
        document.getElementById("yeMV7").innerHTML = U[7].yellowCt;
        document.getElementById("blMV7").innerHTML = U[7].blueCt;
        document.getElementById("reMV7").innerHTML = U[7].redCt;
        document.getElementById("orMV7").innerHTML = U[7].orangeCt;
        document.getElementById("resMV7").innerHTML = U[7].Resident;
        document.getElementById("attMV7").innerHTML = U[7].Attached;
        document.getElementById("visMV7").innerHTML = U[7].Transient;

        document.getElementById("GMV7").innerHTML = X.gCt;
        document.getElementById("YMV7").innerHTML = X.yCt;
        document.getElementById("BMV7").innerHTML = X.bCt;
        document.getElementById("RMV7").innerHTML = X.rCt;
        document.getElementById("OMV7").innerHTML = X.oCt;
        document.getElementById("ResMV7").innerHTML = X.resCt;
        document.getElementById("AttMV7").innerHTML = X.attCt;
        document.getElementById("VisMV7").innerHTML = X.visCt;

        document.getElementById("GMD7").innerHTML = Y.gCt;
        document.getElementById("YMD7").innerHTML = Y.yCt;
        document.getElementById("BMD7").innerHTML = Y.bCt;
        document.getElementById("RMD7").innerHTML = Y.rCt;
        document.getElementById("OMD7").innerHTML = Y.oCt;
        document.getElementById("ResMD7").innerHTML = Y.resCt;
        document.getElementById("AttMD7").innerHTML = Y.attCt;
        document.getElementById("VisMD7").innerHTML = Y.visCt;
    }

    function MVtable8() {
        let X = U[8].arr[gen];
        let Y = U[8].depT[gen];

        document.getElementById("grMV8").innerHTML = U[8].greenCt;
        document.getElementById("yeMV8").innerHTML = U[8].yellowCt;
        document.getElementById("blMV8").innerHTML = U[8].blueCt;
        document.getElementById("reMV8").innerHTML = U[8].redCt;
        document.getElementById("orMV8").innerHTML = U[8].orangeCt;
        document.getElementById("resMV8").innerHTML = U[8].Resident;
        document.getElementById("attMV8").innerHTML = U[8].Attached;
        document.getElementById("visMV8").innerHTML = U[8].Transient;

        document.getElementById("GMV8").innerHTML = X.gCt;
        document.getElementById("YMV8").innerHTML = X.yCt;
        document.getElementById("BMV8").innerHTML = X.bCt;
        document.getElementById("RMV8").innerHTML = X.rCt;
        document.getElementById("OMV8").innerHTML = X.oCt;
        document.getElementById("ResMV8").innerHTML = X.resCt;
        document.getElementById("AttMV8").innerHTML = X.attCt;
        document.getElementById("VisMV8").innerHTML = X.visCt;

        document.getElementById("GMD8").innerHTML = Y.gCt;
        document.getElementById("YMD8").innerHTML = Y.yCt;
        document.getElementById("BMD8").innerHTML = Y.bCt;
        document.getElementById("RMD8").innerHTML = Y.rCt;
        document.getElementById("OMD8").innerHTML = Y.oCt;
        document.getElementById("ResMD8").innerHTML = Y.resCt;
        document.getElementById("AttMD8").innerHTML = Y.attCt;
        document.getElementById("VisMD8").innerHTML = Y.visCt;
    }

    var chart1, chart2, chart3, chart4;
    var chart5, chart6, chart7, chart8;
    var chart9, chart10, chart11, chart12;
    var chart13, chart14, chart15, chart16;
    var chart17, chart18, chart19, chart20;

    if (use_html) {
        CanvasJS.addColorSet("Overview GYBRO",
            [
                "#008000",
                "#FFD700",
                "#1E90FF",
                "#FF0000",
                "#FF8C00",
            ]);

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

        // chart 2 **********************************************

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


        // CHART3 **********************************************************

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


        // *********************************************************************************
        // CHART 4 - GREEN YELLOE BLUE RED over time

        chart4 = new CanvasJS.Chart("chartContainer4", {
            //  theme: "light1",
            colorSet: "Overview GYBRO",
            zoomEnabled: true,
            title: {
                text: "Progress of Transitions"
            },
            data: [{
                type: "stackedColumn",
                dataPoints: U[vU].endGreen
            }, {
                type: "stackedColumn",
                dataPoints: U[vU].endYellow
            }, {
                type: "stackedColumn",
                dataPoints: U[vU].endBlue
            }, {
                type: "stackedColumn",
                dataPoints: U[vU].endRed
            }, {
                type: "stackedColumn",
                dataPoints: U[vU].endOrange
            }]
        });

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
                title: "G + B + O"
            },
            data: [{
                type: "column",
                markerType: "none",
                dataPoints: U[vU].endGreen

            }, {
                type: "column",
                axisYType: "secondary",
                markerType: "none",
                dataPoints: U[vU].endYellow
            }, {
                type: "column",
                markerType: "none",
                dataPoints: U[vU].endBlue
            }, {
                type: "column",
                markerType: "none",
                axisYType: "secondary",
                dataPoints: U[vU].endRed
            }, {
                type: "column",
                markerType: "none",
                dataPoints: U[vU].endOrange
            }]
        });

        var chart7 = new CanvasJS.Chart("chartContainer7", {
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

        var chart8 = new CanvasJS.Chart("chartContainer8", {
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

        var chart9 = new CanvasJS.Chart("chartContainer9", {
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

        var chart10 = new CanvasJS.Chart("chartContainer10", {
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
        }
        );

        var chart11 = new CanvasJS.Chart("chartContainer11", {
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
        }
        );


        var chart12 = new CanvasJS.Chart("chartContainer12", {
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


        var chart13 = new CanvasJS.Chart("chartContainer13", {
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


        var chart14 = new CanvasJS.Chart("chartContainer14", {
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


        var chart15 = new CanvasJS.Chart("chartContainer15", {
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
                type: "column",
                color: "orange",
                showInLegend: true,
                legendMarkerColor: "grey",
                legendText: "Days since beginning",
                dataPoints: M.endCases
            }]
        });


        // chart 2 **********************************************

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

        // CHART3 **********************************************************

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


        // *********************************************************************************
        // CHART 4 - GREEN YELLOE BLUE RED over time

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
        graphFlag = "YES";
        if (netFlag) {
            document.getElementById("graphCanvas").style.display = "block";
            document.getElementById("grExit").style.display = "block";
            document.getElementById("grB").style.display = "block";
            document.getElementById("grF").style.display = "block";
            document.getElementById("grSlider").style.display = "block";
            gcanvas = document.getElementById("graphCanvas");
            gctx = gcanvas.getContext("2d");
            gctx.fillStyle = "black";
            netFlag = false;
        }
        if (sliderFlag) {
            gen = saveGen;
            sliderFlag = false
            writeSlider(gen);
        } else {
            saveGen = gen;
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
        document.getElementById("graphCanvas").style.display = "none";
        document.getElementById("grExit").style.display = "none";
        document.getElementById("grB").style.display = "none";
        document.getElementById("grF").style.display = "none";
        document.getElementById("grSlider").style.display = "none";
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
        //console.log("sliderVal = " + sliderVal);
        genEquiv = Math.floor(sliderVal / 1920 * saveGen);
        //console.log("genEquiv = " + genEquiv);
        gen = genEquiv;
        //console.log("new gen = " + gen);
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
        //process gen++
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
        for (let nct = 0; nct < 9; nct++) {
            N[nct] = new CreateNode();
        }
        N[0].x = 250; N[0].y = 110;
        N[1].x = 460; N[1].y = 70;
        N[2].x = 670; N[2].y = 150;
        N[3].x = 760; N[3].y = 320;
        N[4].x = 710; N[4].y = 520;
        N[5].x = 500; N[5].y = 630;
        N[6].x = 270; N[6].y = 600;
        N[7].x = 130; N[7].y = 440;
        N[8].x = 120; N[8].y = 250;

    }

    // nodes are drawn, edges created but not drawn till we know what traffic is

    function drawNArena(gen) {
        gctx.fillStyle = "Black";
        gctx.fillRect(0, 0, gcanvas.width, gcanvas.height);
        for (let i = 0; i < 9; i++) {
            drawNC(i, gen, N[i].x, N[i].y, 20, "midnightblue");
            drawCircleTxt(gctx,N[i].x,N[i].y,i);
        }
    }

    var nInst;
    function loadNet(gen) {
        for (let i = 0; i < 9; i++) {
            N[i].to = [];
            if (sumDep(i, gen) == 0) { continue };    // no departures
            nInst = 0;
            for (j = 0; j < 9; j++) {
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
        if (Y.bCt > 0) { loadEdge(i, j, gen, "blue") };
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
            case "blue":
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
        for (n = 0; n < 9; n++) {
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
        for (let n = 0; n < 9; n++) {
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

} catch (e) {
    console.log(e.stack); // use this to print out line number in this file, of error (within R/V8 JS interpreter)
}

try {
    // try to load the input data
    if (!use_html) {
        processData(csv_traffic); // open csv traffic file
        caseLoad() // switch to cases file
        processData(csv_cases); // open csv cases file
    }
} catch (e) {
    console.log(e.stack);
}

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
var min_iter = 1000
try {
    if (!use_html) {
        auto();
        load();
	var max_iter_same = 25 // simulation exits after metric is 0 for this many iterations
	var max_iterations = 100000
        var last_state_count = null // last iteration's counts for people in each state, for comparison
	var count_zero = 0 // increment this if metric is zero, zero this if metric is nonzero

	var state_counts = []
        console.log(list_to_str(state_names))

        for (var i = 0; i < max_iterations; i++) {

            var state_count = {}
            for (var j = 0; j < state_names.length; j++) state_count[state_names[j]] = 0 // initialize histogram
            for (var j = 0; j < M.PCt; j++) state_count[P[j].state] += 1 // accumulate by person

	    var count_list = []
	    for(var j = 0; j < state_names.length; j++){
	      count_list.push(state_count[state_names[j]])
	    }
	    console.log(count_list)
	    state_counts.push(count_list) // track all the counts

	    // var info = dic_to_str(state_count) + (last_state_count ? dic_to_str(last_state_count) : "")

	    var d = last_state_count ? (dic_metric(state_count, last_state_count)): 0 // are people changing state?
            if(d > 0) count_zero = 0 // people are changing state
            else count_zero += 1 // people aren't changing state
            // console.log(d, " ", info)

	    if(count_zero >= max_iter_same && i >= min_iter) break // exit for loop / stop iterating, if we reached a fixed point

	    TimesUp(); // go to next state
            last_state_count = state_count;
        }
    }
} catch (e) {
    console.log(e.stack)
}
console.log("exit covidSim")
