const currentYear = new Date().getFullYear();

async function callApi(url) {
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

function triggerDfbPokal(data) {
  dfbPokalId = data[0]["LeagueId"];
  callApi(
    "https://www.openligadb.de/api/getnextmatchbyleagueteam/" +
      dfbPokalId +
      "/98"
  ).then((data) => printDfbPokalNext(data));
  callApi(
    "https://www.openligadb.de/api/getlastmatchbyleagueteam/" +
      dfbPokalId +
      "/98"
  ).then((data) => printDfbPokalLast(data));
}

function triggerBl2(data) {
  bl2Id = data[0]["LeagueId"];
  callApi(
    "https://www.openligadb.de/api/getnextmatchbyleagueteam/" + bl2Id + "/98"
  ).then((data) => printBl2Next(data));
  callApi(
    "https://www.openligadb.de/api/getlastmatchbyleagueteam/" + bl2Id + "/98"
  ).then((data) => printBl2Last(data));
}

function printDfbPokalNext(data) {
  let textDfbNextGame = document.getElementById("dfbNextGame");
  let textDfbNextGameMatchday = document.getElementById("dfbNextGameMatchday");
  let textDfbNextGameTeam1 = document.getElementById("dfbNextGameTeam1");
  let textDfbNextGameTeam2 = document.getElementById("dfbNextGameTeam2");

  let textDfbNextGameIconTeam1 = document.getElementById(
    "dfbNextGameIconTeam1"
  );
  textDfbNextGameIconTeam1.src = data["Team1"]["TeamIconUrl"];
  textDfbNextGameIconTeam1.setAttribute("class", "img-icon-big");

  let textDfbNextGameIconTeam2 = document.getElementById(
    "dfbNextGameIconTeam2"
  );
  textDfbNextGameIconTeam2.src = data["Team2"]["TeamIconUrl"];
  textDfbNextGameIconTeam2.setAttribute("class", "img-icon-big");

  textDfbNextGame.innerHTML = data["LeagueName"];
  textDfbNextGameMatchday.innerHTML =
    data["Group"]["GroupName"] +
    " - " +
    new Date(data["MatchDateTime"]).toLocaleString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  textDfbNextGameTeam1.innerHTML = data["Team1"]["ShortName"];
  textDfbNextGameTeam2.innerHTML = data["Team2"]["ShortName"];
}

function printDfbPokalLast(data) {
  let textDfbLastGame = document.getElementById("dfbLastGame");
  let textDfbLastGameMatchday = document.getElementById("dfbLastGameMatchday");
  let textDfbLastGameTeam1 = document.getElementById("dfbLastGameTeam1");
  let textDfbLastGameTeam2 = document.getElementById("dfbLastGameTeam2");
  let textDfbLastGamePoints = document.getElementById("dfbLastGamePoints"); //

  let textDfbLastGameIconTeam1 = document.getElementById(
    "dfbLastGameIconTeam1"
  );
  textDfbLastGameIconTeam1.src = data["Team1"]["TeamIconUrl"];
  textDfbLastGameIconTeam1.setAttribute("class", "img-icon-big");

  let textDfbLastGameIconTeam2 = document.getElementById(
    "dfbLastGameIconTeam2"
  );
  textDfbLastGameIconTeam2.src = data["Team2"]["TeamIconUrl"];
  textDfbLastGameIconTeam2.setAttribute("class", "img-icon-big");

  textDfbLastGame.innerHTML = data["LeagueName"];
  textDfbLastGameMatchday.innerHTML =
    data["Group"]["GroupName"] +
    " - " +
    new Date(data["MatchDateTime"]).toLocaleString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  textDfbLastGameTeam1.innerHTML = data["Team1"]["ShortName"];
  textDfbLastGameTeam2.innerHTML = data["Team2"]["ShortName"];
  if (data["Team2"]["ShortName"] == "St. Pauli") //checking if St pauli is team2
   {
    if (
      data["MatchResults"][0]["PointsTeam2"] >
      data["MatchResults"][0]["PointsTeam1"]
    ) {
      //win
      textDfbLastGamePoints.classList.add("win");
      
    } else if (
      data["MatchResults"][0]["PointsTeam2"] <
      data["MatchResults"][0]["PointsTeam1"]
    ) {
      //loss
      textDfbLastGamePoints.classList.add("loss");
      
    } else {
      //draw
      textDfbLastGamePoints.classList.add("draw");
      
    }
  } else {
    if (
      data["MatchResults"][0]["PointsTeam2"] <
      data["MatchResults"][0]["PointsTeam1"]
    ) {
      //win
      textDfbLastGamePoints.classList.add("win");
      
    } else if (
      data["MatchResults"][0]["PointsTeam2"] >
      data["MatchResults"][0]["PointsTeam1"]
    ) {
      //loss
      textDfbLastGamePoints.classList.add("loss");
      
    } else {
      //draw
      textDfbLastGamePoints.classList.add("draw");
      
    }
  }
  textDfbLastGamePoints.innerHTML =
        data["MatchResults"][0]["PointsTeam1"] +
        " - " +
        data["MatchResults"][0]["PointsTeam2"];
}

function printBl2Last(data) {
  let textBl2LastGame = document.getElementById("bl2LastGame");
  let textBl2LastGameMatchday = document.getElementById("bl2LastGameMatchday");
  let textBl2LastGameTeam1 = document.getElementById("bl2LastGameTeam1");
  let textBl2LastGameTeam2 = document.getElementById("bl2LastGameTeam2");
  let textBl2LastGamePoints = document.getElementById("bl2LastGamePoints"); //

  let textBl2LastGameIconTeam1 = document.getElementById(
    "bl2LastGameIconTeam1"
  );
  textBl2LastGameIconTeam1.src = data["Team1"]["TeamIconUrl"];
  textBl2LastGameIconTeam1.setAttribute("class", "img-icon-big");

  let textBl2LastGameIconTeam2 = document.getElementById(
    "bl2LastGameIconTeam2"
  );
  textBl2LastGameIconTeam2.src = data["Team2"]["TeamIconUrl"];
  textBl2LastGameIconTeam2.setAttribute("class", "img-icon-big");

  textBl2LastGame.innerHTML = data["LeagueName"];
  textBl2LastGameMatchday.innerHTML =
    data["Group"]["GroupName"] +
    " - " +
    new Date(data["MatchDateTime"]).toLocaleString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  textBl2LastGameTeam1.innerHTML = data["Team1"]["ShortName"];
  textBl2LastGameTeam2.innerHTML = data["Team2"]["ShortName"];

  if (data["Team2"]["ShortName"] == "St. Pauli")  //checking if St pauli is team2
  {
    if (
      data["MatchResults"][0]["PointsTeam2"] >
      data["MatchResults"][0]["PointsTeam1"]
    ) {
      //win
      textBl2LastGamePoints.classList.add("win");
      
    } else if (
      data["MatchResults"][0]["PointsTeam2"] <
      data["MatchResults"][0]["PointsTeam1"]
    ) {
      //loss
      textBl2LastGamePoints.classList.add("loss");
      
    } else {
      //draw
      textBl2LastGamePoints.classList.add("draw");
      
    }
  } else {
    if (
      data["MatchResults"][0]["PointsTeam2"] <
      data["MatchResults"][0]["PointsTeam1"]
    ) {
      //win
      textBl2LastGamePoints.classList.add("win");
      
    } else if (
      data["MatchResults"][0]["PointsTeam2"] >
      data["MatchResults"][0]["PointsTeam1"]
    ) {
      //loss
      textBl2LastGamePoints.classList.add("loss");
      
    } else {
      //draw
      textBl2LastGamePoints.classList.add("draw");
      
    }
  }
  textBl2LastGamePoints.innerHTML =
        data["MatchResults"][0]["PointsTeam1"] +
        " - " +
        data["MatchResults"][0]["PointsTeam2"];
}

function printBl2Next(data) {
  let textBl2NextGame = document.getElementById("bl2NextGame");
  let textBl2NextGameMatchday = document.getElementById("bl2NextGameMatchday");
  let textBl2NextGameTeam1 = document.getElementById("bl2NextGameTeam1");
  let textBl2NextGameTeam2 = document.getElementById("bl2NextGameTeam2");

  let textBl2NextGameIconTeam1 = document.getElementById(
    "bl2NextGameIconTeam1"
  );
  textBl2NextGameIconTeam1.src = data["Team1"]["TeamIconUrl"];
  textBl2NextGameIconTeam1.setAttribute("class", "img-icon-big");

  let textBl2NextGameIconTeam2 = document.getElementById(
    "bl2NextGameIconTeam2"
  );
  textBl2NextGameIconTeam2.src = data["Team2"]["TeamIconUrl"];
  textBl2NextGameIconTeam2.setAttribute("class", "img-icon-big");

  textBl2NextGame.innerHTML = data["LeagueName"];
  textBl2NextGameMatchday.innerHTML =
    data["Group"]["GroupName"] +
    " - " +
    new Date(data["MatchDateTime"]).toLocaleString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  textBl2NextGameTeam1.innerHTML = data["Team1"]["ShortName"];
  textBl2NextGameTeam2.innerHTML = data["Team2"]["ShortName"];
}

function printTable(data) {
  let table = document.getElementById("leagueTable");
  let helper = 1;
  for (let key in data) {
    let newRow = table.insertRow(helper);

    let newCellPosition = newRow.insertCell(-1);
    let newCellLogo = newRow.insertCell(-1);
    let newCellTeam = newRow.insertCell(-1);
    let newCellMatches = newRow.insertCell(-1);
    let newCellSUN = newRow.insertCell(-1);
    let newCellGoalDiff = newRow.insertCell(-1);
    let newCellPoints = newRow.insertCell(-1);

    let textPosition = document.createTextNode(helper);
    let textLogo = document.createElement("img");
    textLogo.src = data[key]["TeamIconUrl"];
    textLogo.setAttribute("class", "img-icon");
    let textTeam = document.createTextNode(data[key]["ShortName"]);
    let textMatches = document.createTextNode(data[key]["Matches"]);
    let textSUN = document.createTextNode(
      data[key]["Won"] + "/" + data[key]["Draw"] + "/" + data[key]["Lost"]
    );
    let textGoalDiff = document.createTextNode(data[key]["GoalDiff"]);
    let textPoints = document.createTextNode(data[key]["Points"]);

    if (data[key]["ShortName"] === "St. Pauli") {
      newRow.classList.add("stpauli-highlight");
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

callApi("https://www.openligadb.de/api/getbltable/bl2/" + currentYear).then(
  (data) => printTable(data)
);
callApi("https://www.openligadb.de/api/getmatchdata/dfb" + currentYear).then(
  (data) => triggerDfbPokal(data)
);
callApi("https://www.openligadb.de/api/getmatchdata/bl2").then((data) =>
  triggerBl2(data)
);
