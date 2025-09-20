let nextMatchdayBl1 = "";
let nextMatchdayDfb = "";
let upcomingMetchdaysBl1 = [];
const STPAULI_TEAM_ID = 98;

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
	callApi('https://api.openligadb.de/getnextmatchbyleagueteam/' + dfbPokalId + '/' + STPAULI_TEAM_ID).then(data => printNextGame(data, 'dfb'))
	callApi('https://api.openligadb.de/getlastmatchbyleagueteam/' + dfbPokalId + '/' + STPAULI_TEAM_ID).then(data => printLastGame(data, 'dfb'))
}

function triggerBl1(data) {
	bl1Id = data[0]['leagueId'];
	callApi('https://api.openligadb.de/getnextmatchbyleagueteam/' + bl1Id + '/' + STPAULI_TEAM_ID).then(data => printNextGame(data, 'bl1'))
	callApi('https://api.openligadb.de/getlastmatchbyleagueteam/' + bl1Id + '/' + STPAULI_TEAM_ID).then(data => printLastGame(data, 'bl1'))
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

	if (league == "bl1") {
		nextMatchdayBl1 = data['group']['groupOrderID'];
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
		textLastGamePoints.innerHTML = data['matchResults'][1]['pointsTeam1'] + ' - ' + data['matchResults'][1]['pointsTeam2'] + " (" + data['matchResults'][0]['pointsTeam1'] + " - " + data['matchResults'][0]['pointsTeam2'] + ")";
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
	if (league == "bl1") {
		callApi('https://api.openligadb.de/getmatchdata/bl1/' + getSeason() + '/' + nextMatchdayBl1).then(data => extractRelevantData(data));
	}
}

function extractRelevantData(data) {
	// A matchday is seen as valid matchday, if there is at least one game with a different 'matchDateTime', except matchday 34.
	const times = data.map(match => match.matchDateTime);
	const allSame = times.every(time => time === times[0]);
	
	if (allSame && data[0].group.groupOrderID !== 34) {
		generateIcs('bl1');
	} else {
		for (let key in data) {
			if (data[key]['team1']['teamId'] == STPAULI_TEAM_ID || data[key]['team2']['teamId'] == STPAULI_TEAM_ID) {
				upcomingMetchdaysBl1.push({ title:  data[key]['team1']['shortName'] + ' - ' + data[key]['team2']['shortName'], date: data[key].matchDateTime });
				nextMatchdayBl1++;
				triggerIcs('bl1');
			} 
		}
	}
}

function generateIcs(data){
	if (data == 'bl1') {
		let icsTemplateBody = '';
		let helper = 1;
		for (let key in upcomingMetchdaysBl1) {
			title = upcomingMetchdaysBl1[key]['title'];
			if (helper == upcomingMetchdaysBl1.length) {
				title = "Letzter Termin! " + title;
			}
			startDate = upcomingMetchdaysBl1[key]['date'];

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
		saveAs(blob, 'bl1.ics');
	}
}

callApi('https://api.openligadb.de/getbltable/bl1/' + getSeason()).then(data => printTable(data));
callApi('https://api.openligadb.de/getmatchdata/dfb/').then(data => triggerDfbPokal(data));
callApi('https://api.openligadb.de/getmatchdata/bl1').then(data => triggerBl1(data));

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

function isValidMatchday(matches) {
  if (!Array.isArray(matches) || matches.length === 0) return false;
  const md = matches[0] && matches[0].group ? matches[0].group.groupOrderID : undefined;
  if (md === 34) return false;
  const times = new Set();
  for (const m of matches) {
    const dt = m && m.matchDateTime ? m.matchDateTime : null;
    if (dt) times.add(dt);
  }
  // "at least one game with a different matchDateTime" -> two different times needed
  return times.size > 1;
}

async function fetchMatchday(season, matchday) {
  const url = `https://api.openligadb.de/getmatchdata/bl1/${season}/${matchday}`;
  return callApi(url);
}

function isFuture(dateStr) {
  try { return new Date(dateStr) >= new Date(); } catch(e) { return false; }
}

async function getUpcomingPauliMatchdays() {
  const season = getSeason();
  let startMd;
  try {
    if (typeof nextMatchdayBl1 !== 'undefined' && nextMatchdayBl1) {
      startMd = Number(nextMatchdayBl1);
    }
  } catch(e) {}
  if (!startMd || Number.isNaN(startMd)) startMd = 1;

  const result = [];
  for (let md = startMd; md <= 34; md++) {
    try {
      const data = await fetchMatchday(season, md);
      if (!Array.isArray(data) || data.length === 0) continue;
      if (!isValidMatchday(data)) continue;

      const pauliGames = data.filter(m =>
        (m.team1 && m.team1.teamId === STPAULI_TEAM_ID) ||
        (m.team2 && m.team2.teamId === STPAULI_TEAM_ID)
      );

      if (!pauliGames.length) continue;
      if (!pauliGames.some(g => isFuture(g.matchDateTime || g.matchDateTimeUTC))) continue;

      
      const gamesDisplay = pauliGames.map(g => {
        const isHome = g.team1 && g.team1.teamId === STPAULI_TEAM_ID;
        const oppTeam = isHome ? (g.team2 || {}) : (g.team1 || {});
        const opp = oppTeam.teamName || 'Gegner';
        const oppLogo = oppTeam.teamIconUrl || '';
        const when = g.matchDateTime ? new Date(g.matchDateTime).toLocaleString('de-DE', {
          weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        }) : '';
        const ha = isHome ? 'H' : 'A';
        const logoImg = oppLogo ? '<img class="team-logo" src="' + oppLogo + '" alt="' + opp + ' Logo">' : '';
        return logoImg + opp + ' (' + ha + ') – ' + when;
      });
			result.push({ season, matchday: md, gamesDisplay });
    } catch (e) {
      console.warn('Failed to fetch matchday', md, e);
    }
  }
  return result;
}

async function loadAndRenderPauliUpcomingMatchdays() {
  const container = document.getElementById('nextMatchdaysList');
  if (!container) return;
  container.innerHTML = '<p>Lade Spieltage…</p>';
  try {
    const rows = await getUpcomingPauliMatchdays();
    if (!rows.length) {
      container.innerHTML = '<p>Keine kommenden St. Pauli-Spieltage gefunden.</p>';
      return;
    }
    container.innerHTML = rows.map(item => {
      const label = 'Spieltag ' + item.matchday;
      const games = item.gamesDisplay.map(t => '<div class="games">' + t + '</div>').join('');
      return (
        '<div class="matchday-item">' +
          '<span class="label">' + label + '</span>' +
          games +
        '</div>'
      );
    }).join('');
  } catch (e) {
    container.innerHTML = '<p>Fehler beim Laden.</p>';
    console.error(e);
  }
}
