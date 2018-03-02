var sid;
var games = [];
var currentGame;

init();

function init() {
    $(document).ready(function () {
        $("#gamePanel").hide();
        getMetaData();
        $("#wordGuess").keyup(function (event) {
            if (event.keyCode === 13) {
                $("#game-guess").click();
            }
        });
    });
}

function metaData(data) {
    generateID();
    getFont();
    var fonts = data.fonts;
    var levels = data.levels;
    /*for (var i in fonts) {
        $(`<link rel="stylesheet" href="${fonts[i].url}">`).appendTo($('head'));
        $("<option value=" +fonts[i].family + ">" + fonts[i].family + "</option>").appendTo("#select-font");
    }*/

    for (var level in levels) {
        $('<option value = ' + level + '>' + level + '</option>>').appendTo($('#select-level'));
    }
    $('#select-font').val(data.defaults.font.family);
    $('#select-level').val(data.defaults.level.name);
    $('#guessColor').val(data.defaults.color.guessBG);
    $('#foreColor').val(data.defaults.color.textBG);
    $('#wordColor').val(data.defaults.color.wordBG);
    $('#select-font').css('font-family', data.defaults.font.family);
    $('#select-font').change(function () {
        $('#select-font').css('font-family', $('#select-font').find('option:selected').val());
    });
    $('#select-level').val(data.defaults.level.name);
}

function generateGameView(gameData) {
    $('#optionView').slideUp("slow");
    $('#gamePanel').slideDown("slow");
    $('#gameList').slideUp("slow");
    $('#gameControl').show();
    $('#game-content1').empty();
    $('#game-content2').empty();
    $('#showRemaining').text(gameData.remaining + " guesses remaining");

    for (var i = 0; i < gameData.view.length; i++) {
        $('<label>' + gameData.view.charAt(i) + '</label>').css('font-family', gameData.font.family + ","
            + gameData.font.category).css('background-color', gameData.colors.wordBG).css('color', gameData.colors.textBG).appendTo($('#game-content2'));
    }
    for (var i = 0; i < gameData.guess.length; i++) {
        $('<label>' + gameData.guess.charAt(i).toUpperCase() + '</label>').css('font-family', gameData.font.family + ","
            + gameData.font.category).css('background-color', gameData.colors.guessBG).css('color', gameData.colors.textBG).appendTo($('#game-content1'));
    }

    if (gameData.status !== "Unfinished") {
        checkStatus(gameData.status);
    } else {
        $('#gameView-background').attr('style', 'background : ""');
    }
}

function checkStatus(status) {
    if (status === "WIN") {
        $('#gameControl').hide();
        $('#gameView-background').attr('style', 'background:url("./images/winner.gif")');
    } else {
        $('#gameControl').hide();
        $('#gameView-background').attr('style', 'background:url("./images/cry.gif")');
    }
}

function updateRow(gameData) {
    var temp = games.indexOf(gameData.gid);
    var row = $('<tr><td>' + gameData.level.name + '</td><td>' + getView(gameData) + '</td><td>'
        + gameData.remaining + '</td><td>' + containTarget(gameData) + '</td><td>' + gameData.status + '</td></tr>');
    $(row[0].getElementsByTagName('span')).css('font-family', gameData.font.family + ","
        + gameData.font.category).css('background-color', gameData.colors.wordBG).css('color', gameData.colors.textBG);
    row.click((event) => retrieveGame(gameData));

    if (temp < 0) {
        games.push(gameData.gid);
        $('tbody').append(row);
    } else {
        $('tbody').children().eq(temp).html(row.html());
    }
}

function getView(gameData) {
    var temp = gameData.view.split("");
    return "<span>" + temp.join("</span><span>") + "</span>";
}

function containTarget(gameData) {
    return (gameData.target) ? gameData.target : ""
}

function updateTable(gameData) {
    if (gameData.error) {
        alert(gameData.error);
    }
    games = [];
    for (var key in gameData) {
        updateRow(gameData[key]);
    }
}

function closeGameView() {
    $('#optionView').slideDown("slow");
    $('#gamePanel').slideUp("slow");
    $('#gameList').slideDown("slow");
}

function getFontData(fonts) {
    fonts.forEach((eachFont) => {
        $(`<link rel="stylesheet" href="${eachFont.url}">`).appendTo($('head'));
        $(`<option value = "${eachFont.family}">${eachFont.family}</option>>`).appendTo($('#select-font'));
    });
}

/********************Ajax************************/
function getMetaData() {
    $.ajax({
        url: '/wordgame/api/v1/meta',
        method: 'GET',
        success: metaData
    });
}

function getFont() {
    $.ajax({
        url: '/wordgame/api/v1/meta/fonts',
        method: 'GET',
        success: getFontData
    });
}

function generateID() {
    $.ajax({
        url: '/wordgame/api/v1/sid',
        method: 'GET',
        success: function (data, status, xhr) {
            sid = xhr.getResponseHeader("X-sid");
        }
    });
}

function newGame() {
    var font = $('#select-font').val();
    var level = $('#select-level').val();
    var colors = {
        guessBG: $('#guessColor').val(),
        textGB: $('#foreColor').val(),
        wordBG: $('#wordColor').val()
    };
    $.ajax({
        url: '/wordgame/api/v1/' + sid + "?level=" + level,
        method: 'POST',
        data: colors,
        headers: {"X-font": font},
        success: retrieveGame
    })
}

function makeGuess() {
    var guessWord = $('#wordGuess').val();
    $('#wordGuess').val("");
    if (guessWord.match(/^[a-zA-Z]$|^-$|^'$/i)) {
        $.ajax({
            url: `/wordgame/api/v1/${sid}/${currentGame.gid}/guesses/?guess=${guessWord}`,
            method: 'POST',
            success: retrieveGame
        });
    }
}

function retrieveGame(gameData) {
    if (gameData.error) {
        alert(gameData.error);
    } else {
        currentGame = gameData;
        $.ajax({
            url: '/wordgame/api/v1/' + sid + '/' + gameData.gid,
            method: 'GET',
            success: (data) => {
                generateGameView(data);
                updateRow(data)
            }
        });
    }
}

function getGames() {
    $.ajax({
        url: '/wordgame/api/v1/' + sid,
        method: 'GET',
        success: updateTable
    });
}