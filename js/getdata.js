let nextMatchdayBl2 = "";
let nextMatchdayDfb = "";
const STPAULI_TEAM_ID = 98;

let upcomingMatchdaysCache = null;
let upcomingMatchdaysCachePromise = null;

function getSeason() {
	let currentYear = new Date().getFullYear();
	let currentMonth = new Date().getMonth();
	if (currentMonth < 6) {
		currentYear--;
	}
	return currentYear;
}

async function callApi(url) {
	let response = await fetch(url);
	if (!response.ok) return null;
	try {
		return await response.json();
	} catch (e) {
		return null;
	}
}

function triggerDfbPokal(data) {
	if (!data || !data[0]) return;
	dfbPokalId = data[0]['leagueId'];
	callApi('https://api.openligadb.de/getnextmatchbyleagueteam/' + dfbPokalId + '/' + STPAULI_TEAM_ID).then(data => printNextGame(data, 'dfb'));
	callApi('https://api.openligadb.de/getlastmatchbyleagueteam/' + dfbPokalId + '/' + STPAULI_TEAM_ID).then(data => printLastGame(data, 'dfb'));
}

function triggerBl2(data) {
	if (!data || !data[0]) return;
	bl2Id = data[0]['leagueId'];
	callApi('https://api.openligadb.de/getnextmatchbyleagueteam/' + bl2Id + '/' + STPAULI_TEAM_ID).then(data => printNextGame(data, 'bl2'));
	callApi('https://api.openligadb.de/getlastmatchbyleagueteam/' + bl2Id + '/' + STPAULI_TEAM_ID).then(data => printLastGame(data, 'bl2'));
}

function printNextGame(data, league) {
	if (!data) return;
	let textNextGame = document.getElementById(league + 'NextGame');
	let textNextGameMatchday = document.getElementById(league + 'NextGameMatchday');
	let textNextGameTeam1 = document.getElementById(league + 'NextGameTeam1');
	let textNextGameTeam2 = document.getElementById(league + 'NextGameTeam2');

	let textNextGameIconTeam1 = document.getElementById(league + 'NextGameIconTeam1');
	textNextGameIconTeam1.src = data['team1']['teamIconUrl'];
	textNextGameIconTeam1.setAttribute("class", "img-icon-big");

	let textNextGameIconTeam2 = document.getElementById(league + 'NextGameIconTeam2');
	textNextGameIconTeam2.src = data['team2']['teamIconUrl'];
	textNextGameIconTeam2.setAttribute("class", "img-icon-big");

	textNextGame.innerHTML = data['leagueName'];
	textNextGameMatchday.innerHTML = data['group']['groupName'] + ' - ' + new Date(data['matchDateTime']).toLocaleString('de-DE', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
	textNextGameTeam1.innerHTML = data['team1']['shortName'];
	textNextGameTeam2.innerHTML = data['team2']['shortName'];

	if (league == "bl2") {
		nextMatchdayBl2 = data['group']['groupOrderID'];
	} else {
		nextMatchdayDfb = data['group']['groupOrderID'];
	}
}

function printLastGame(data, league) {
	if (!data) return;
	let textLastGame = document.getElementById(league + 'LastGame');
	let textLastGameMatchday = document.getElementById(league + 'LastGameMatchday');
	let textLastGameTeam1 = document.getElementById(league + 'LastGameTeam1');
	let textLastGameTeam2 = document.getElementById(league + 'LastGameTeam2');
	let textLastGamePoints = document.getElementById(league + 'LastGamePoints');

	let textLastGameIconTeam1 = document.getElementById(league + 'LastGameIconTeam1');
	textLastGameIconTeam1.src = data['team1']['teamIconUrl'];
	textLastGameIconTeam1.setAttribute("class", "img-icon-big");

	let textLastGameIconTeam2 = document.getElementById(league + 'LastGameIconTeam2');
	textLastGameIconTeam2.src = data['team2']['teamIconUrl'];
	textLastGameIconTeam2.setAttribute("class", "img-icon-big");

	textLastGame.innerHTML = data['leagueName'];
	textLastGameMatchday.innerHTML = data['group']['groupName'] + ' - ' + new Date(data['matchDateTime']).toLocaleString('de-DE', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
	textLastGameTeam1.innerHTML = data['team1']['shortName'];
	textLastGameTeam2.innerHTML = data['team2']['shortName'];

	if (data['matchIsFinished'] === true) {
		textLastGamePoints.innerHTML = data['matchResults'][1]['pointsTeam1'] + ' - ' + data['matchResults'][1]['pointsTeam2'] + " (" + data['matchResults'][0]['pointsTeam1'] + " - " + data['matchResults'][0]['pointsTeam2'] + ")";
	} else {
		textLastGamePoints.innerHTML = 'Spielstand noch nicht verfügbar';
	}
}

function printTable(data) {
	if (!data) return;
	let table = document.getElementById('leagueTable');
	let helper = 1;
	for (let key in data) {
		let newRow = table.insertRow(helper);
		let newCellPosition = newRow.insertCell(-1);

		if (helper >= 1 && helper <= 4) {
			newCellPosition.setAttribute("class", "table-cl");
		} else if (helper === 5) {
			newCellPosition.setAttribute("class", "table-el");
		} else if (helper === 6) {
			newCellPosition.setAttribute("class", "table-elq");
		} else if (helper === 16) {
			newCellPosition.setAttribute("class", "table-rel");
		} else if (helper >= 17) {
			newCellPosition.setAttribute("class", "table-down");
		}

		let newCellLogo = newRow.insertCell(-1);
		let newCellTeam = newRow.insertCell(-1);
		let newCellMatches = newRow.insertCell(-1);
		let newCellSUN = newRow.insertCell(-1);
		let newCellGoalDiff = newRow.insertCell(-1);
		let newCellPoints = newRow.insertCell(-1);

		let textPosition = document.createTextNode(helper);
		let textLogo = document.createElement('img');
		textLogo.src = data[key]['teamIconUrl'];
		textLogo.setAttribute("class", "img-icon");
		let textTeam = document.createTextNode(data[key]['shortName']);
		let textMatches = document.createTextNode(data[key]['matches']);
		let textSUN = document.createTextNode(data[key]['won'] + "/" + data[key]['draw'] + "/" + data[key]['lost']);
		let textGoalDiff = document.createTextNode(data[key]['goalDiff']);
		let textPoints = document.createTextNode(data[key]['points']);

		if (data[key]['shortName'] === 'St. Pauli') {
			newRow.classList.add('stpauli-highlight');
		}

		newCellPosition.appendChild(textPosition);
		newCellLogo.appendChild(textLogo);
		newCellTeam.appendChild(textTeam);
		newCellMatches.appendChild(textMatches);
		newCellSUN.appendChild(textSUN);
		newCellGoalDiff.appendChild(textGoalDiff);
		newCellPoints.appendChild(textPoints);

		helper++;
	}
}

function isScheduled(matchdayData) {
	const times = matchdayData.map(m => m.matchDateTime);
	return times.some(t => t !== times[0]);
}

function isFuture(dateStr) {
	try { return new Date(dateStr) >= new Date(); } catch(e) { return false; }
}

async function loadUpcomingMatchdays() {
	if (upcomingMatchdaysCache !== null) return upcomingMatchdaysCache;
	if (upcomingMatchdaysCachePromise !== null) return upcomingMatchdaysCachePromise;

	upcomingMatchdaysCachePromise = (async () => {
		const season = getSeason();
		const startMd = (nextMatchdayBl2 && !Number.isNaN(Number(nextMatchdayBl2)))
			? Number(nextMatchdayBl2)
			: 1;

		const result = [];
		for (let md = startMd; md <= 34; md++) {
			try {
				const data = await callApi(`https://api.openligadb.de/getmatchdata/bl2/${season}/${md}`);
				if (!Array.isArray(data) || data.length === 0) break;

				if (!isScheduled(data)) break;

				const pauliGames = data.filter(m =>
					(m.team1 && m.team1.teamId === STPAULI_TEAM_ID) ||
					(m.team2 && m.team2.teamId === STPAULI_TEAM_ID)
				);
				if (!pauliGames.length) continue;

				const futureGames = pauliGames.filter(g => isFuture(g.matchDateTime));
				if (futureGames.length) {
					result.push({ matchday: md, games: futureGames });
				}
			} catch (e) {
				console.warn('Fehler beim Laden von Spieltag', md, e);
			}
		}

		upcomingMatchdaysCache = result;
		return result;
	})();

	return upcomingMatchdaysCachePromise;
}

async function triggerIcs(league) {
	if (league !== 'bl2') return;
	const matchdays = await loadUpcomingMatchdays();
	if (!matchdays.length) return;
	generateIcs(matchdays);
}

function generateIcs(matchdays) {
	let icsTemplateBody = '';
	const allGames = matchdays.flatMap(item => item.games);

	allGames.forEach((g, index) => {
		const isLast = index === allGames.length - 1;
		let title = g.team1.shortName + ' - ' + g.team2.shortName;
		if (isLast) title = 'Letzter Termin! ' + title;

		const startDate = g.matchDateTime;
		const stringToDate = new Date(startDate);
		const endDateObj = new Date(stringToDate.getTime() + 2 * 60 * 60 * 1000);

		const year = endDateObj.toLocaleString("default", { year: "numeric" });
		const month = endDateObj.toLocaleString("default", { month: "2-digit" });
		const day = endDateObj.toLocaleString("default", { day: "2-digit" });
		const hour = endDateObj.toLocaleString("default", { hour: "2-digit" });
		const minute = endDateObj.toLocaleString("default", { minute: "numeric" });
		const endDateStr = year + "-" + month + "-" + day + "T" + hour + ":" + minute;

		const startFmt = startDate.replaceAll("-", "").replaceAll(":", "");
		const endFmt = endDateStr.replaceAll(":0", ":00:00").replaceAll(":30", ":30:00").replaceAll("-", "").replaceAll(":", "");

		icsTemplateBody += icsTemplateEvent1 + startFmt + "\n" + icsTemplateEvent2 + endFmt + "\n" + icsTemplateEvent3 + title + "\n" + icsTemplateEvent4 + "\n";
	});

	const blob = new Blob([icsTemplateHeader + icsTemplateBody + icsTemplateFooter + "\n"], { type: "text/plain;charset=utf-8" });
	saveAs(blob, 'bl2.ics');
}

function openNextMatchdaysModal() {
	const modal = document.getElementById('nextMatchdaysModal');
	if (!modal) return;
	modal.classList.remove('hidden');
	loadAndRenderPauliUpcomingMatchdays().catch(console.error);
}

function closeNextMatchdaysModal() {
	const modal = document.getElementById('nextMatchdaysModal');
	if (!modal) return;
	modal.classList.add('hidden');
}

async function loadAndRenderPauliUpcomingMatchdays() {
	const container = document.getElementById('nextMatchdaysList');
	if (!container) return;
	container.innerHTML = '<p>Lade Spieltage…</p>';
	try {
		const matchdays = await loadUpcomingMatchdays();
		if (!matchdays.length) {
			container.innerHTML = '<p>Keine kommenden St. Pauli-Spieltage gefunden.</p>';
			return;
		}
		container.innerHTML = matchdays.map(item => {
			const label = 'Spieltag ' + item.matchday;
			const games = item.games.map(g => {
				const isHome = g.team1 && g.team1.teamId === STPAULI_TEAM_ID;
				const oppTeam = isHome ? (g.team2 || {}) : (g.team1 || {});
				const opp = oppTeam.teamName || 'Gegner';
				const oppLogo = oppTeam.teamIconUrl || '';
				const when = g.matchDateTime ? new Date(g.matchDateTime).toLocaleString('de-DE', {
					weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
				}) : '';
				const ha = isHome ? 'H' : 'A';
				const logoImg = oppLogo ? '<img class="team-logo" src="' + oppLogo + '" alt="' + opp + ' Logo">' : '';
				return '<div class="games">' + logoImg + opp + ' (' + ha + ') – ' + when + '</div>';
			}).join('');
			return '<div class="matchday-item"><span class="label">' + label + '</span>' + games + '</div>';
		}).join('');
	} catch (e) {
		container.innerHTML = '<p>Fehler beim Laden.</p>';
		console.error(e);
	}
}

callApi('https://api.openligadb.de/getbltable/bl2/' + getSeason()).then(data => printTable(data));
callApi('https://api.openligadb.de/getmatchdata/dfb/').then(data => triggerDfbPokal(data));
callApi('https://api.openligadb.de/getmatchdata/bl2').then(data => triggerBl2(data));
