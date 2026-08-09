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

const STATUS_MESSAGES = {
	bl2: {
		Next: {
			loading: 'Lade nächstes Ligaspiel…',
			error: 'Nächstes Ligaspiel konnte nicht geladen werden',
			empty: 'Kein bevorstehendes Ligaspiel'
		},
		Last: {
			loading: 'Lade letztes Ligaspiel…',
			error: 'Letztes Ligaspiel konnte nicht geladen werden',
			empty: 'Noch kein Ligaspiel gespielt'
		}
	},
	dfb: {
		Next: {
			loading: 'Lade nächstes Pokalspiel…',
			error: 'Nächstes Pokalspiel konnte nicht geladen werden',
			empty: 'Kein bevorstehendes Pokalspiel'
		},
		Last: {
			loading: 'Lade letztes Pokalspiel…',
			error: 'Letztes Pokalspiel konnte nicht geladen werden',
			empty: 'Noch kein Pokalspiel gespielt'
		}
	}
};

async function callApi(url) {
	let response;
	try {
		response = await fetch(url);
	} catch (e) {
		return { status: 'error' };
	}

	if (response.status === 404) return { status: 'empty' };
	if (!response.ok) return { status: 'error' };

	let text;
	try {
		text = await response.text();
	} catch (e) {
		return { status: 'error' };
	}

	if (text.trim() === '') return { status: 'empty' };

	let json;
	try {
		json = JSON.parse(text);
	} catch (e) {
		return { status: 'error' };
	}

	if (json === null || json === undefined || (Array.isArray(json) && json.length === 0)) {
		return { status: 'empty' };
	}
	return { status: 'ok', data: json };
}

function setGameStatus(league, type, status) {
	const messages = STATUS_MESSAGES[league] && STATUS_MESSAGES[league][type];
	const message = (messages && messages[status]) || '';

	const icons = document.getElementById(league + type + 'GameIcons');
	const teams = document.getElementById(league + type + 'GameTeams');
	const matchday = document.getElementById(league + type + 'GameMatchday');

	if (icons) icons.classList.add('game-hidden');
	if (teams) teams.classList.add('game-hidden');

	if (matchday) {
		matchday.textContent = message;
		matchday.classList.remove('game-hidden', 'game-status-error', 'game-status-loading');
		if (status === 'error') matchday.classList.add('game-status-error');
		if (status === 'loading') matchday.classList.add('game-status-loading');
	}

	if (type === 'Last') {
		const points = document.getElementById(league + type + 'GamePoints');
		if (points) points.textContent = '';
	}
}

function clearGameStatus(league, type) {
	const icons = document.getElementById(league + type + 'GameIcons');
	const teams = document.getElementById(league + type + 'GameTeams');
	const matchday = document.getElementById(league + type + 'GameMatchday');

	if (icons) icons.classList.remove('game-hidden');
	if (teams) teams.classList.remove('game-hidden');
	if (matchday) matchday.classList.remove('game-hidden', 'game-status-error', 'game-status-loading');
}

function triggerDfbPokal(result) {
	if (result.status === 'error') {
		setGameStatus('dfb', 'Next', 'error');
		setGameStatus('dfb', 'Last', 'error');
		return;
	}
	if (result.status === 'empty') {
		setGameStatus('dfb', 'Next', 'empty');
		setGameStatus('dfb', 'Last', 'empty');
		return;
	}
	dfbPokalId = result.data[0]['leagueId'];
	callApi('https://api.openligadb.de/getnextmatchbyleagueteam/' + dfbPokalId + '/' + STPAULI_TEAM_ID).then(res => printNextGame(res, 'dfb'));
	callApi('https://api.openligadb.de/getlastmatchbyleagueteam/' + dfbPokalId + '/' + STPAULI_TEAM_ID).then(res => printLastGame(res, 'dfb'));
}

function triggerBl2(result) {
	if (result.status === 'error') {
		setGameStatus('bl2', 'Next', 'error');
		setGameStatus('bl2', 'Last', 'error');
		return;
	}
	if (result.status === 'empty') {
		setGameStatus('bl2', 'Next', 'empty');
		setGameStatus('bl2', 'Last', 'empty');
		return;
	}
	bl2Id = result.data[0]['leagueId'];
	callApi('https://api.openligadb.de/getnextmatchbyleagueteam/' + bl2Id + '/' + STPAULI_TEAM_ID).then(res => printNextGame(res, 'bl2'));
	callApi('https://api.openligadb.de/getlastmatchbyleagueteam/' + bl2Id + '/' + STPAULI_TEAM_ID).then(res => printLastGame(res, 'bl2'));
}

function printNextGame(result, league) {
	if (result.status === 'error') return setGameStatus(league, 'Next', 'error');
	if (result.status === 'empty') return setGameStatus(league, 'Next', 'empty');

	const data = result.data;
	clearGameStatus(league, 'Next');

	let textNextGameMatchday = document.getElementById(league + 'NextGameMatchday');
	let textNextGameTeam1 = document.getElementById(league + 'NextGameTeam1');
	let textNextGameTeam2 = document.getElementById(league + 'NextGameTeam2');

	let textNextGameIconTeam1 = document.getElementById(league + 'NextGameIconTeam1');
	textNextGameIconTeam1.src = data['team1']['teamIconUrl'];
	textNextGameIconTeam1.setAttribute("class", "img-icon-big");

	let textNextGameIconTeam2 = document.getElementById(league + 'NextGameIconTeam2');
	textNextGameIconTeam2.src = data['team2']['teamIconUrl'];
	textNextGameIconTeam2.setAttribute("class", "img-icon-big");

	textNextGameMatchday.innerHTML = data['group']['groupName'] + ' - ' + new Date(data['matchDateTime']).toLocaleString('de-DE', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
	textNextGameTeam1.innerHTML = data['team1']['shortName'];
	textNextGameTeam2.innerHTML = data['team2']['shortName'];

	if (league == "bl2") {
		nextMatchdayBl2 = data['group']['groupOrderID'];
	} else {
		nextMatchdayDfb = data['group']['groupOrderID'];
	}
}

function printLastGame(result, league) {
	if (result.status === 'error') return setGameStatus(league, 'Last', 'error');
	if (result.status === 'empty') return setGameStatus(league, 'Last', 'empty');

	const data = result.data;
	clearGameStatus(league, 'Last');

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

	textLastGameMatchday.innerHTML = data['group']['groupName'] + ' - ' + new Date(data['matchDateTime']).toLocaleString('de-DE', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
	textLastGameTeam1.innerHTML = data['team1']['shortName'];
	textLastGameTeam2.innerHTML = data['team2']['shortName'];

	if (data['matchIsFinished'] === true) {
		textLastGamePoints.innerHTML = data['matchResults'][1]['pointsTeam1'] + ' - ' + data['matchResults'][1]['pointsTeam2'] + " (" + data['matchResults'][0]['pointsTeam1'] + " - " + data['matchResults'][0]['pointsTeam2'] + ")";
	} else {
		textLastGamePoints.innerHTML = 'Spielstand noch nicht verfügbar';
	}
}

function printTable(result) {
	let table = document.getElementById('leagueTable');

	if (result.status === 'error' || result.status === 'empty') {
		let row = table.insertRow(1);
		let cell = row.insertCell(-1);
		cell.colSpan = 7;
		cell.textContent = result.status === 'error'
			? 'Tabelle konnte nicht geladen werden'
			: 'Tabelle noch nicht verfügbar';
		return;
	}

	const data = result.data;
	let helper = 1;
	for (let key in data) {
		let newRow = table.insertRow(helper);
		let newCellPosition = newRow.insertCell(-1);

		if (helper >= 1 && helper <= 2) {
			newCellPosition.setAttribute("class", "table-up");
		} else if (helper === 3) {
			newCellPosition.setAttribute("class", "table-rel-up");
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
				const res = await callApi(`https://api.openligadb.de/getmatchdata/bl2/${season}/${md}`);
				if (res.status !== 'ok' || !Array.isArray(res.data) || res.data.length === 0) break;
				const data = res.data;

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

setGameStatus('bl2', 'Next', 'loading');
setGameStatus('bl2', 'Last', 'loading');
setGameStatus('dfb', 'Next', 'loading');
setGameStatus('dfb', 'Last', 'loading');

callApi('https://api.openligadb.de/getbltable/bl2/' + getSeason()).then(result => printTable(result));
callApi('https://api.openligadb.de/getmatchdata/dfb/').then(result => triggerDfbPokal(result));
callApi('https://api.openligadb.de/getmatchdata/bl2').then(result => triggerBl2(result));
