function getSeason() {
	let helper = 0;
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
	dfbPokalId = data[0]['LeagueId'];
	callApi('https://www.openligadb.de/api/getnextmatchbyleagueteam/' + dfbPokalId + '/98').then(data => printNextGame(data, 'dfb'))
	callApi('https://www.openligadb.de/api/getlastmatchbyleagueteam/' + dfbPokalId + '/98').then(data => printLastGame(data, 'dfb'))
}

function triggerBl2(data) {
	bl2Id = data[0]['LeagueId'];
	callApi('https://www.openligadb.de/api/getnextmatchbyleagueteam/' + bl2Id + '/98').then(data => printNextGame(data, 'bl2'))
	callApi('https://www.openligadb.de/api/getlastmatchbyleagueteam/' + bl2Id + '/98').then(data => printLastGame(data, 'bl2'))
}

function printNextGame(data, league) {
	let textNextGame = document.getElementById(league + 'NextGame');
	let textNextGameMatchday = document.getElementById(league + 'NextGameMatchday');
	let textNextGameTeam1 = document.getElementById(league + 'NextGameTeam1');
	let textNextGameTeam2 = document.getElementById(league + 'NextGameTeam2');

	let textNextGameIconTeam1 = document.getElementById(league + 'NextGameIconTeam1')
	textNextGameIconTeam1.src = data['Team1']['TeamIconUrl'];
	textNextGameIconTeam1.setAttribute("class", "img-icon-big");

	let textNextGameIconTeam2 = document.getElementById(league + 'NextGameIconTeam2')
	textNextGameIconTeam2.src = data['Team2']['TeamIconUrl'];
	textNextGameIconTeam2.setAttribute("class", "img-icon-big");
	
	textNextGame.innerHTML = data['LeagueName'];
	textNextGameMatchday.innerHTML = data['Group']['GroupName'] + ' - ' + new Date(data['MatchDateTime']).toLocaleString('de-DE', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', });
	textNextGameTeam1.innerHTML = data['Team1']['ShortName'];
	textNextGameTeam2.innerHTML = data['Team2']['ShortName'];
}

function printLastGame(data, league) {
	let textLastGame = document.getElementById(league + 'LastGame');
	let textLastGameMatchday = document.getElementById(league + 'LastGameMatchday');
	let textLastGameTeam1 = document.getElementById(league + 'LastGameTeam1');
	let textLastGameTeam2 = document.getElementById(league + 'LastGameTeam2');
	let textLastGamePoints = document.getElementById(league + 'LastGamePoints');

	let textLastGameIconTeam1 = document.getElementById(league + 'LastGameIconTeam1')
	textLastGameIconTeam1.src = data['Team1']['TeamIconUrl'];
	textLastGameIconTeam1.setAttribute("class", "img-icon-big");

	let textLastGameIconTeam2 = document.getElementById(league + 'LastGameIconTeam2')
	textLastGameIconTeam2.src = data['Team2']['TeamIconUrl'];
	textLastGameIconTeam2.setAttribute("class", "img-icon-big");
	
	textLastGame.innerHTML = data['LeagueName'];
	textLastGameMatchday.innerHTML = data['Group']['GroupName'] + ' - ' + new Date(data['MatchDateTime']).toLocaleString('de-DE', { weekday: 'long',  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', });
	textLastGameTeam1.innerHTML = data['Team1']['ShortName'];
	textLastGameTeam2.innerHTML = data['Team2']['ShortName'];

	if (data['MatchIsFinished'] === true) {
		textLastGamePoints.innerHTML = data['MatchResults'][0]['PointsTeam1'] + ' - ' + data['MatchResults'][0]['PointsTeam2'] + " (" + data['MatchResults'][1]['PointsTeam1'] + " - " + data['MatchResults'][1]['PointsTeam2'] + ")";
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
		textLogo.src = data[key]['TeamIconUrl']
		textLogo.setAttribute("class", "img-icon");
		let textTeam = document.createTextNode(data[key]['ShortName']);
		let textMatches = document.createTextNode(data[key]['Matches']);
		let textSUN = document.createTextNode(data[key]['Won'] + "/" + data[key]['Draw'] + "/" + data[key]['Lost']);
		let textGoalDiff = document.createTextNode(data[key]['GoalDiff']);
		let textPoints = document.createTextNode(data[key]['Points']);

		if (data[key]['ShortName'] === 'St. Pauli'){
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


callApi('https://www.openligadb.de/api/getbltable/bl2/' + getSeason()).then(data => printTable(data));
callApi('https://www.openligadb.de/api/getmatchdata/dfb' + getSeason()).then(data => triggerDfbPokal(data));
callApi('https://www.openligadb.de/api/getmatchdata/bl2').then(data => triggerBl2(data));
