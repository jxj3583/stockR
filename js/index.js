
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
app.initialize();

function showHide() {
  request('aapl', 'chart', '');

    var x = document.getElementById("stockChart");
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}


function request(ticker,item, range){
  var xhttp = new XMLHttpRequest();
  if(item=="quote")
    var url = "https://api.iextrading.com/1.0/stock/" + ticker + "/" + item + "?displayPercent=true";
  else if(item=="stats")
    var url = "https://api.iextrading.com/1.0/stock/" + ticker + "/" + item;
  else if(item=="chart")
    var url = "https://api.iextrading.com/1.0/stock/" + ticker + "/" + item +  "/" + range;
  console.log(url);
  xhttp.open('GET', url, true);
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
       let data = JSON.parse(this.response);
       if(item=="quote"){
         addHeader(data);
       }
       else if(item=="chart"){
         drawChart(data,ticker);
       }
       //document.getElementById("demo").innerHTML = xhttp.responseText;
    }
  };
  xhttp.send();
}

function addHeader(data){
  let header = "<div class='stockSection'><div class='left'> <h2>" + data.symbol + "</h2> <p>" + data.companyName + "</p>"
   + "<div class='right'>  <h2>" + data.latestPrice + "</h2><p>" + data.change +"   "+ data.changePercent + "%" +"</p></div></div>";
  document.getElementById("stockticker").innerHTML = header;
}

function returnValues(data){
      var array = new Array();
      for(var i = 0; i < data.length; i++){
        array.push(new Array(data[i].label,data[i].average));
      }

      return array;
}

google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);

function drawChart(stock, ticker) {
  var data = new google.visualization.DataTable();
    data.addColumn('string', 'time');
    data.addColumn('number', ticker);
    data.addRows(returnValues(stock));

    var options = {
      width: 900,
      height: 500,
      legend: {position: 'none'},
      drawChart: '#AARRGGBB ',
      colors: '#9CE3A1'
    };
    var chart = new google.charts.Line(document.getElementById('stockChart'));
    chart.draw(data, options);

};
