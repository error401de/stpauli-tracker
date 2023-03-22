let nextMatchdayBl2 = "";
let nextMatchdayDfb = "";
let upcomingMetchdaysBl2 = [];

function getSeason() {
	let currentYear = new Date().getFullYear();
	let currentMonth = new Date().getMonth()

	if (currentMonth < 6) {
		currentYear--
	}

	return currentYear
}

async function callApi(url) {
	let response = await fetch(url);
	let data = await response.json();
	return data;
}

function triggerDfbPokal(data) {
	dfbPokalId = data[0]['leagueId'];
	callApi('https://api.openligadb.de/getnextmatchbyleagueteam/' + dfbPokalId + '/98').then(data => printNextGame(data, 'dfb'))
	callApi('https://api.openligadb.de/getlastmatchbyleagueteam/' + dfbPokalId + '/98').then(data => printLastGame(data, 'dfb'))
}

function triggerBl2(data) {
	bl2Id = data[0]['leagueId'];
	callApi('https://api.openligadb.de/getnextmatchbyleagueteam/' + bl2Id + '/98').then(data => printNextGame(data, 'bl2'))
	callApi('https://api.openligadb.de/getlastmatchbyleagueteam/' + bl2Id + '/98').then(data => printLastGame(data, 'bl2'))
}

function printNextGame(data, league) {
	let textNextGame = document.getElementById(league + 'NextGame');
	let textNextGameMatchday = document.getElementById(league + 'NextGameMatchday');
	let textNextGameTeam1 = document.getElementById(league + 'NextGameTeam1');
	let textNextGameTeam2 = document.getElementById(league + 'NextGameTeam2');

	let textNextGameIconTeam1 = document.getElementById(league + 'NextGameIconTeam1')
	textNextGameIconTeam1.src = data['team1']['teamIconUrl'];
	textNextGameIconTeam1.setAttribute("class", "img-icon-big");

	let textNextGameIconTeam2 = document.getElementById(league + 'NextGameIconTeam2')
	textNextGameIconTeam2.src = data['team2']['teamIconUrl'];
	textNextGameIconTeam2.setAttribute("class", "img-icon-big");
	
	textNextGame.innerHTML = data['leagueName'];
	textNextGameMatchday.innerHTML = data['group']['groupName'] + ' - ' + new Date(data['matchDateTime']).toLocaleString('de-DE', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', });
	textNextGameTeam1.innerHTML = data['team1']['shortName'];
	textNextGameTeam2.innerHTML = data['team2']['shortName'];

	if (league == "bl2") {
		nextMatchdayBl2 = data['group']['groupOrderID'];
	} else {
		nextMatchdayDfb = data['group']['groupOrderID'];
	}
}

function printLastGame(data, league) {
	let textLastGame = document.getElementById(league + 'LastGame');
	let textLastGameMatchday = document.getElementById(league + 'LastGameMatchday');
	let textLastGameTeam1 = document.getElementById(league + 'LastGameTeam1');
	let textLastGameTeam2 = document.getElementById(league + 'LastGameTeam2');
	let textLastGamePoints = document.getElementById(league + 'LastGamePoints');

	let textLastGameIconTeam1 = document.getElementById(league + 'LastGameIconTeam1')
	textLastGameIconTeam1.src = data['team1']['teamIconUrl'];
	textLastGameIconTeam1.setAttribute("class", "img-icon-big");

	let textLastGameIconTeam2 = document.getElementById(league + 'LastGameIconTeam2')
	textLastGameIconTeam2.src = data['team2']['teamIconUrl'];
	textLastGameIconTeam2.setAttribute("class", "img-icon-big");
	
	textLastGame.innerHTML = data['leagueName'];
	textLastGameMatchday.innerHTML = data['group']['groupName'] + ' - ' + new Date(data['matchDateTime']).toLocaleString('de-DE', { weekday: 'long',  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', });
	textLastGameTeam1.innerHTML = data['team1']['shortName'];
	textLastGameTeam2.innerHTML = data['team2']['shortName'];

	if (data['matchIsFinished'] === true) {
		textLastGamePoints.innerHTML = data['matchResults'][0]['pointsTeam1'] + ' - ' + data['matchResults'][0]['pointsTeam2'] + " (" + data['matchResults'][1]['pointsTeam1'] + " - " + data['matchResults'][1]['pointsTeam2'] + ")";
	} else {
		textLastGamePoints.innerHTML = 'Spielstand noch nicht verfügbar'
	}
}

function printTable(data) {
	let table = document.getElementById('leagueTable');
	let helper = 1;
	for (let key in data) {
		let newRow = table.insertRow(helper);

		let newCellPosition = newRow.insertCell(-1);
		let newCellLogo= newRow.insertCell(-1);
		let newCellTeam= newRow.insertCell(-1);
		let newCellMatches= newRow.insertCell(-1);
		let newCellSUN= newRow.insertCell(-1);
		let newCellGoalDiff= newRow.insertCell(-1);
		let newCellPoints= newRow.insertCell(-1);

		let textPosition = document.createTextNode(helper);
		let textLogo = document.createElement('img')
		textLogo.src = data[key]['teamIconUrl']
		textLogo.setAttribute("class", "img-icon");
		let textTeam = document.createTextNode(data[key]['shortName']);
		let textMatches = document.createTextNode(data[key]['matches']);
		let textSUN = document.createTextNode(data[key]['won'] + "/" + data[key]['draw'] + "/" + data[key]['lost']);
		let textGoalDiff = document.createTextNode(data[key]['goalDiff']);
		let textPoints = document.createTextNode(data[key]['points']);

		if (data[key]['shortName'] === 'St. Pauli'){
			newRow.classList.add('stpauli-highlight')		
		}
		
		newCellPosition.appendChild(textPosition)
		newCellLogo.appendChild(textLogo)
		newCellTeam.appendChild(textTeam)
		newCellMatches.appendChild(textMatches)
		newCellSUN.appendChild(textSUN)
		newCellGoalDiff.appendChild(textGoalDiff)
		newCellPoints.appendChild(textPoints)

		helper++;
	}
}

function triggerIcs(league) {
	if (league == "bl2") {
		callApi('https://api.openligadb.de/getmatchdata/bl2/' + getSeason() + '/' + nextMatchdayBl2).then(data => extractRelevantData(data));
	}
}

function extractRelevantData(data) {
	for (let key in data) {
		if (data[key]['team1']['teamId'] == 98 || data[key]['team2']['teamId'] == 98) {
			if (!data[key]['matchDateTime'].includes('15:30')) {
				upcomingMetchdaysBl2.push({ title:  data[key]['team1']['shortName'] + ' - ' + data[key]['team2']['shortName'], date: data[key].matchDateTime });
				nextMatchdayBl2++;
				triggerIcs('bl2');
			} else {
				generateIcs('bl2');
			}
		} 
	}
}
function generateIcs(data){
	if (data == 'bl2') {
		let icsTemplateBody = '';
		let helper = 1;
		for (let key in upcomingMetchdaysBl2) {
			title = upcomingMetchdaysBl2[key]['title'];
			if (helper == upcomingMetchdaysBl2.length) {
				title = "Letzter Termin! " + title;
			}
			startDate = upcomingMetchdaysBl2[key]['date'];

			stringToDate = new Date(startDate);
			endDate = stringToDate.setHours(stringToDate.getHours() + 2);
			endDate = new Date(endDate);
			
			year = endDate.toLocaleString("default", { year: "numeric" });
			month = endDate.toLocaleString("default", { month: "2-digit" });
			day = endDate.toLocaleString("default", { day: "2-digit" });
			hour = endDate.toLocaleString("default", { hour: "2-digit" });
			minute = endDate.toLocaleString("default", { minute: "numeric" });
			endDate = year + "-" + month + "-" + day + "T" + hour + ":" + minute;

			startDate = startDate.replaceAll("-", "").replaceAll(":","");
			renderEndDate = endDate.replaceAll(":0",":00:00").replaceAll(":30",":30:00").replaceAll("-", "").replaceAll(":","");
			icsTemplateBody = icsTemplateBody + icsTemplateEvent1 + startDate +"\n" + icsTemplateEvent2 + renderEndDate + "\n" + icsTemplateEvent3 + title +"\n" + icsTemplateEvent4 + "\n";
			helper++;
		}
		let blob = new Blob([icsTemplateHeader + icsTemplateBody + icsTemplateFooter + "\n"], { type: "text/plain;charset=utf-8", });
		saveAs(blob, 'bl2.ics');
	}
}

callApi('https://api.openligadb.de/getbltable/bl2/' + getSeason()).then(data => printTable(data));
callApi('https://api.openligadb.de/getmatchdata/dfb' + getSeason()).then(data => triggerDfbPokal(data));
callApi('https://api.openligadb.de/getmatchdata/bl2').then(data => triggerBl2(data));
