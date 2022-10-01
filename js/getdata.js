async function callApi(url) {
	let response = await fetch(url);
	let data = await response.json();
	return data;
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
		let textTeam = document.createTextNode(data[key]['TeamName']);
		let textMatches = document.createTextNode(data[key]['Matches']);
		let textSUN = document.createTextNode(data[key]['Won'] + "/" + data[key]['Draw'] + "/" + data[key]['Lost']);
		let textGoalDiff = document.createTextNode(data[key]['GoalDiff']);
		let textPoints = document.createTextNode(data[key]['Points']);

		newCellPosition.appendChild(textPosition)
		newCellLogo.appendChild(textLogo)
		newCellTeam.appendChild(textTeam)
		newCellMatches.appendChild(textMatches)
		newCellSUN.appendChild(textSUN)
		newCellGoalDiff.appendChild(textGoalDiff)
		newCellPoints.appendChild(textPoints)

		console.log(data[key]['TeamName']);

		helper++;
	}
}


callApi('https://www.openligadb.de/api/getbltable/bl2/2022').then(data => printTable(data))