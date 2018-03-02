function httpRequest(request) {
    var splitResults = request.split("\n\n");
    var body = splitResults[1];
    var notBody = splitResults[0].split("\n");
    var requestLine = notBody.shift();
    var regexOfHttp = /(get|head|post|put|delete|options|connect|trace)\s((https|http|ftp)?\:\/\/([^.]*\@)?\@?(\w+(?:\.\w+)+)(?:\:(\d{1,5}))?(\/(?:[^\?]+)?)(?:\?([^\#]+))?(?:\#(.+))?)\s(.+)/i;
    var splitRequestLine = requestLine.match(regexOfHttp);

    if(splitRequestLine == null) throw new Error("Invalid HTTP address.");

    return {
        headers: splitHeaders(notBody),
        query: splitQuery(splitRequestLine[8]),
        account: detailOfAccount(splitRequestLine[4]),
        get:function (headerName) {
            return splitHeaders(notBody)[headerName] || null;
        },
        body: getBody(body),
        method: splitRequestLine[1],
        path: splitRequestLine[7],
        url: splitRequestLine[2],
        version: splitRequestLine[10] || null,
        fragment: splitRequestLine[9] || null,
        host: splitRequestLine[5],
        port: getPort(splitRequestLine[6],splitRequestLine[3]),
        protocol: splitRequestLine[3]
    }
}

function splitQuery(query) {
    var json = {};
    if(query == null){
        return json;
    }
    var splitResult = query.split("&");
    for(var i =0;i<splitResult.length;i++){
        if(splitResult[i].indexOf("=") == 1){
            var temp = splitResult[i].split("=");
            json[temp[0]] = temp[1];
        }
    }
    return json;
}

function splitHeaders(headers) {
    var json = {};
    if(headers == null){
        return json;
    }else {
        for (var i = 0; i < headers.length; i++) {
            if(headers[i] == "" || typeof(headers[i]) === "undefined"){
                headers.splice(i,1);
            }
        }
        for(var j =0;j<headers.length;j++){
            var temp = headers[j].split(":");
            json[temp[0]] = temp[1];
        }
    }
    return json;
}

function  getPort(port,protocol) {
    if(port === undefined){
        switch (protocol.toLowerCase()){
            case 'http':
                return 80;
            case 'https':
                return 433;
        }
    }else{
        return port;
    }
}

function getBody(body) {
    if(body === undefined){
        return null;
    }else if(body == ''){
        return '';
    }
    return body;
}

function detailOfAccount(account) {
    var json = {};
    if(account === undefined){
        return json;
    }else {
        var temp1 = account.split("@");
        var temp = temp1[0].split(":");
        json['username'] = temp[0];
        json['password'] = temp[1];
    }
    return json;
}