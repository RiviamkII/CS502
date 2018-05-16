var games = [];
var currentGame;
var currentUser;
var globalMetaData;
var state = {
    page: {pages: ["login", "content"], page: null}
};

init();

function init() {
    $(document).ready(function () {
        //addChangeEvent();
        $.ajax({
            url: '/wordgame/api/v2/user',
            method: 'GET',
            success: function (user, status, xhr) {
                $('body').show().addClass('background');
                setUser(user);
            },
            error: () => {
                $('body').show().addClass('background');
                setPage('login');
            }
        });
        $("#wordGuess").keyup(function (event) {
            if (event.keyCode === 13) {
                $("#game-guess").click();
            }
        });
    });
}

function setPage(page) {
    state.page.page = page;
    if (page === 'login') {
        $('body').addClass('background');
        $('#login').show();
    } else {
        $('body').removeClass('background');
        $('.container').show();
        $('#login').hide();
        getMetaData();
        getGames();
    }
}

function setUser(user) {
    if (user != null && user.error) {
        alert(user.error);
        return;
    }
    currentUser = user;
    $('#email').text(user && user.email);
    setPage(user ? 'content' : 'login');
}

function metaData(data) {
    globalMetaData = data;
    //getFont();asynchronously
    data.fonts.forEach((eachFont) => {
        $(`<link rel="stylesheet" href="${eachFont.url}">`).appendTo($('head'));
        $(`<option value = "${eachFont.family}">${eachFont.family}</option>>`).appendTo($('#select-font'));
    });
    var levels = data.levels;
    for (var level in levels) {
        $('<option value = ' + level + '>' + level + '</option>>').appendTo($('#select-level'));
    }

    $('#select-font').change(function () {
        $('#select-font').css('font-family', $('#select-font').find('option:selected').val());
    });
    $('#select-level').val(data.defaults.level.name);
    // currentUser.defaults = data.defaults;
    engageDefaultValue(currentUser.defaults);
}

function engageDefaultValue(defaults) {
    $('#select-font').val(defaults.font.family);
    $('#select-font').css("font-family", defaults.font.family);
    $('#select-level').val(defaults.level.name);
    $('#wordColor').val(defaults.colors.wordBG);
    $('#foreColor').val(defaults.colors.textBG);
    $('#guessColor').val(defaults.colors.guessBG);
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
    for (var i = 0; i < gameData.guesses.length; i++) {
        $('<label>' + gameData.guesses.charAt(i).toUpperCase() + '</label>').css('font-family', gameData.font.family + ","
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
    let temp = games.indexOf(gameData._id);
    let row = $('<tr><td>' + gameData.level.name + '</td><td>' + getView(gameData) + '</td><td>'
        + gameData.remaining + '</td><td>' + containTarget(gameData) + '</td><td>' + gameData.status + '</td></tr>');

    $(row[0].getElementsByTagName('span')).css('font-family', gameData.font.family + ","
        + gameData.font.category).css('background-color', gameData.colors.wordBG).css('color', gameData.colors.textBG);

    row.click((event) => retrieveGame(gameData));

    if (temp < 0) {
        games.push(gameData._id);
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
    if (gameData.err) {
        alert(gameData.err);
    }
    games = [];
    for (let i = 0; i<gameData.length;i++) {
        updateRow(gameData[i]);
    }
}

function closeGameView() {
    $('#optionView').slideDown("slow");
    $('#gamePanel').slideUp("slow");
    $('#gameList').slideDown("slow");
}

function addChangeEvent() {
    $('#option-form').change(function () {
        updateUserDefaults(getCurDefaults());
    })
}

function updateDefaults() {
    updateUserDefaults(getCurDefaults());
}

function getFontData(fonts) {
    fonts.forEach((eachFont) => {
        $(`<link rel="stylesheet" href="${eachFont.url}">`).appendTo($('head'));
        $(`<option value = "${eachFont.family}">${eachFont.family}</option>>`).appendTo($('#select-font'));
    });
}

function getCurDefaults() {
    let font = $('#select-font option:selected').text();
    let level = $('#select-level').val();
    let guessBG = $('#guessColor').val();
    let wordBG = $('#wordColor').val();
    let textColor = $('#foreColor').val();

    let defaults = {};
    let fonts = globalMetaData.fonts;
    for (let i in fonts) {
        if (fonts[i].family === font) {
            defaults.font = fonts[i];
            break;
        }
    }
    let levels = globalMetaData.levels;
    for (let j in levels) {
        if (levels[j].name === level) {
            defaults.level = levels[j];
            break;
        }
    }
    defaults.colors = {
        guessBG: guessBG,
        wordBG: wordBG,
        textBG: textColor
    };
    return defaults;
}

/*******************************Ajax*********************************/
function getMetaData() {
    $.ajax({
        url: `/wordgame/api/v2/meta`,
        method: 'GET',
        success: metaData
    });
}

function getFont() {
    $.ajax({
        url: `/wordgame/api/v2/meta/fonts`,
        method: 'GET',
        success: getFontData
    });
}

function generateID() {
    $.ajax({
        url: `/wordgame/api/v2/userid`,
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
        url: `/wordgame/api/v2/${currentUser._id}/?level=${level}`,
        method: 'POST',
        data: colors,
        headers: {"X-font": font, "csrf_Token": sessionStorage.csrf_Token},
        success: retrieveGame
    })
}

function makeGuess() {
    var guessWord = $('#wordGuess').val();
    $('#wordGuess').val("");
    if (guessWord.match(/^[a-zA-Z]$|^-$|^'$/i)) {
        $.ajax({
            url: `/wordgame/api/v2/${currentUser._id}/${currentGame._id}/guesses/?guess=${guessWord}`,
            method: 'POST',
            headers: {"csrf_Token": sessionStorage.csrf_Token},
            success: retrieveGame
        });
    }
}

function retrieveGame(gameData) {
    if (gameData.err) {
        alert(gameData.err);
    } else {
        currentGame = gameData;
        $.ajax({
            url: '/wordgame/api/v2/' + currentUser._id + '/' + currentGame._id,
            method: 'GET',
            headers: {"csrf_Token": sessionStorage.csrf_Token},
            success: (data) => {
                generateGameView(data);
                updateRow(data)
            }
        });
    }
}

function getGames() {
    $.ajax({
        url: '/wordgame/api/v2/' + currentUser._id,
        method: 'GET',
        headers: {"csrf_Token": sessionStorage.csrf_Token},
        success: updateTable,
        error: function (xhr, status, err) {
            alert("error" + err);
            logout();
        }
    });
}

function updateUserDefaults(defaults) {
    $.ajax({
        url: '/wordgame/api/v2/' + currentUser._id + '/defaults',
        method: 'PUT',
        dataType: "json",
        headers: {"csrf_Token": sessionStorage.csrf_Token},
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(defaults),
        success: alert("Successfully update defaults"),
        error: function (xhr, status, err) {
            alert("error: " + err);
            logout();
        }
    });
}

function login(evt) {
    evt.preventDefault();
    let username = $('#login_username').val();
    let password = $('#login_password').val();

    $('#login_username').val('');
    $('#login_password').val('');
    $.ajax({
        url: '/wordgame/api/v2/login',
        data: {"username": username, "password": password},
        method: 'POST',
        success: function (data, status, xhr) {
            sessionStorage.csrf_Token = xhr.getResponseHeader("csrf_Token");
            setUser(data);
        },
        error: function (xhr, status, err) {
            alert("Error with password or user is not existed");
        }
    });
}

function logout(evt) {
    $.ajax({
        url: '/wordgame/api/v2/logout',
        method: 'POST',
        success: () => setUser(null)
    });
    $('.container').hide();
    $('#select-level').empty();
    $('#select-font').empty();
    $('tbody').empty();
}