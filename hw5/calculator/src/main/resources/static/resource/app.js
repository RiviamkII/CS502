$(document).ready(function(){
    $('.fixed-action-btn').floatingActionButton();
    $('select').formSelect();
    appendInput();
});

function calculate(operation) {
    let x = $('#xValue').val();
    let y = $('#yValue').val();
    let hashMode = $('#hashMode').val();
    let checkBoxFlag = $('input[id="default"]').is(':checked');
    const zero = 0;
    if(!(isNaN(x) && isNaN(y)) && !(isInteger(x) && isInteger(y))){
        return alert("the input must be integer");
    }
    if(y === zero.toString() && operation === "div"){
        return alert("The divisor cannot be 0!");
    }
    if(checkBoxFlag){
        $.ajax({
            url: '/api/v1/' + operation +'/?x=' + x + '&y=' + y,
            method: 'POST',
            headers: {"hash-alg": hashMode},
            success:function (results) {
                generateCalResult(results);
            },
            error: function (xhr, status, err) {
                alert(xhr.responseJSON['message']);
                appendInput();
            }
        });
    }else{
        $.ajax({
            url: '/api/v1/' + operation +'/?x=' + x + '&y=' + y,
            method: 'GET',
            headers: {"hash-alg": hashMode},
            success:function (results) {
                generateCalResult(results);
            },
            error:function (xhr, status, err) {
                alert(xhr.responseJSON['message']);
                appendInput();
            }
        });
    }
}

function isInteger(obj) {
    return  Math.round(obj) == obj;
}

function generateCalResult(results) {
    clearValueAndReload();
    let operator = results.operator;
    let resultX = results.x;
    let resultY = results.y;
    let result = results.result;
    let hashedResult = results.hashedResult;
    let hashMode = results.hashMode;
    $('#calResult').slideDown();
    $('#hashResult').slideDown();
    $(`<span class="teal-text text-lighten-1" style="word-break: break-all">${resultX} ${operator} ${resultY} = ${result}</>`).appendTo($('#calResult'));
    $(`<span class="teal-text text-lighten-1" style="word-break: break-all">${hashMode}: ${hashedResult}</span>`).appendTo($('#hashResult'));
}

function clearValueAndReload() {
    $('#calResult').empty();
    $('#hashResult').empty();
    appendInput();
}

function appendInput() {
    $('.xValue').empty();
    $('.yValue').empty();
    $(`<input id="xValue" type="text" class="validate"><label for="xValue">X</label>`).appendTo($('.xValue'));
    $(`<input id="yValue" type="text" class="validate"><label for="yValue">Y</label>`).appendTo($('.yValue'));
}
