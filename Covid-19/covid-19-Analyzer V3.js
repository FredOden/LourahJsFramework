Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");
Activity.importScript(Lourah.jsFramework.dir() + "/Lourah.covid19.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.graphics.g2d.js");
Activity.importScript(Lourah.jsFramework.parentDir() + "/Lourah.view.GestureDetector.js");

var now = new Date();
var ext = 0;

var screen = {
  $ll : {
    class: "android.widget.LinearLayout"
    ,setOrientation: android.widget.LinearLayout.VERTICAL
    ,$sv : {
      class: "android.widget.ScrollView"
      //,setFillViewport: true
      ,$ll0: {
        class: "android.widget.LinearLayout"
        ,setOrientation : android.widget.LinearLayout.VERTICAL
        ,$ll00 : {
          class: "android.widget.LinearLayout"
          ,setOrientation : android.widget.LinearLayout.HORIZONTAL
          ,$ll1 : {
            class: "android.widget.LinearLayout"
            ,setOrientation : android.widget.LinearLayout.HORIZONTAL
            ,$date: {
              class: "android.widget.EditText"
              ,setTextSize: 12
              ,setText: "'" + now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate() + "/" + ext +"'"
              }
            ,$go: {
              class: "android.widget.Button"
              ,setText: "'Compute'"
              ,setTextSize: 12
              ,setOnClickListener: {
                onClick:v => compute()
                }
              }
            }
          ,$ll2 : {
            class: "android.widget.LinearLayout"
            ,setOrientation : android.widget.LinearLayout.HORIZONTAL
            ,$country: {
              class: "android.widget.AutoCompleteTextView"
              ,setHint: "'specify country'"
              ,setEnabled: false
              ,setTextSize: 12
              }
            ,$show: {
              class: "android.widget.Button"
              ,setText: "'Report'"
              ,setEnabled: false
              ,setTextSize: 12
              ,setOnClickListener: {
                onClick:v => doReport(
                  ("" + $screen.$country
                    .getText()
                    .toString())
                  .replace(/ /g, "_")
                  ,$screen.$c2d)
                }
              }
            }
          }
        ,$llPalmares: {
          class: "android.widget.LinearLayout"
          ,setOrientation:android.widget.LinearLayout.HORIZONTAL
          ,$bDeaths: {
            class: "android.widget.Button"
            ,setText: "'Deaths/1M'"
            ,setEnabled: false
            ,setOnClickListener: {
              onClick: v => doPalmares($screen.$cPalmares, "" + v.getText(), "Deaths")
              }
            }
          ,$bCases: {
            class: "android.widget.Button"
            ,setText: "'Cases/1M'"
            ,setEnabled: false
            ,setOnClickListener: {
              onClick: v => doPalmares($screen.$cPalmares, "" + v.getText(), "Cases")
              }
            }
          ,$bDeathRateByCase: {
            class: "android.widget.Button"
            ,setText: "'Death/Case%'"
            ,setEnabled: false
            ,setOnClickListener: {
              onClick: v => doPalmares($screen.$cPalmares, "" + v.getText(), "DeathRateByCase")
              }
            }
          }
        ,$llRate: {
          class: "android.widget.LinearLayout"
          ,setOrientation:android.widget.LinearLayout.HORIZONTAL
          ,$bRateDeaths: {
            class: "android.widget.Button"
            ,setText: "'Deaths rate'"
            ,setEnabled: false
            ,setOnClickListener: {
              onClick: v => doPalmares($screen.$cPalmares, "" + v.getText(), "Deaths", 20)
              }
            }
          ,$bRateCases: {
            class: "android.widget.Button"
            ,setText: "'Cases rate'"
            ,setEnabled: false
            ,setOnClickListener: {
              onClick: v => doPalmares($screen.$cPalmares, "" + v.getText(), "Cases", 20)
              }
            }
          }
        ,$status: {
          class: "android.webkit.WebView"
          //,setTextSize: 10
          }
        ,$sv0: {
          class: "android.widget.ScrollView"
          //,setFillViewport: true
          ,$ll11: {
            class: "android.widget.LinearLayout"
            ,setOrientation : android.widget.LinearLayout.VERTICAL
            ,$c2d: {
              class: "android.widget.ImageView"
              }
            ,$cPalmares: {
              class: "android.widget.ImageView"
              }
            }
          }
        }
      }
    }
  };

var $screen = Lourah.android.Overview.buildFromSugar(screen);

[$screen.$c2d, $screen.$cPalmares].forEach((imageView) => {
    imageView.setOnTouchListener(
      new Lourah.view.GestureDetector.OnTouchScaleDetector(new (function (v) {
          var width = v.getWidth();
          var height = v.getHeight();
          this.step = 300;
          this.scaleRange = [.1, 10];
          this.onTouchScale = (view, motionEvent, scale, focusPoint) => {
            try {
              //view.getLayoutParams().width = width*scale;
              //view.getLayoutParams().height = height*scale;
              view.setScaleX(scale);
              view.setScaleY(scale);
              view.setPivotX(focusPoint.x);
              view.setPivotY(focusPoint.y);
              //view.requestLayout();
              } catch(e) {
              setStatus("onTouchScale::" + e);
              }
            };
          })(imageView)
        )
      );
    }
  );

Activity.setTitle("Covid-19 Analyzer 3.0");
Activity.setContentView($screen.$ll);

var statusHtml = "";
var statusHead = "<style>"
+ "* { font-size: 10px;font-family:'Helvetica Neue',sans-serif;line-height:10%; background-color: #ebebeb; }"
+ ".legend { color:blue; font-size:6px; }"
+ ".emphase { font-size:120%; background-color:#f7f700; }"
+ ".zoom { font-size:120%; }"
+ "h1 { color:#7f0000; font-size:24px;text-align:center;text-shadow:2px 2px #bfbfbf; }"
+ "h2 { color:#004f00; font-size:10px; }"
+ "ul { list-style-type:square;line-height:10%;padding-left:10px; }"
+ "</style>"

function spanText(className, text) {
  return "<span class='" + className + "'>" + text + "</span>";
  }

function flushStatus() {
  try {
  $screen.$status.loadData(
    //android.text.Html.fromHtml(
      "<html>"
      + "<head>" + statusHead + "</head>"
      + "<body>"
      + statusHtml
      + "</body>"
      + "</html>"
      //)
    , "text/html; charset=utf-8"
    , "UTF-8"
    );
    } catch(e) {
    console.log("flushStatus::" + e);
    }
  }

function setStatusCat(status) {
  //var s = $screen.$status;
  statusHtml = statusHtml + status;
  //s.setText(android.text.Html.fromHtml(s.getText() + status + "<p>"));
  flushStatus();
  }

function setStatus(status) {
  //var s = $screen.$status;
  //s.setText(android.text.Html.fromHtml(s.getText() + status));
  setStatusCat(status + "<br>");
  }

function clearStatus() {
  //$screen.$status.setText("");
  statusHtml = "";
  }

var report;




function compute() {
  try {
  var r = $screen.$date.getText().toString().split("/");
  report = new Lourah.covid19.Report(r[2], r[1], r[0], r[3]);
 
   var adapter = new android.widget.ArrayAdapter(
  Activity.getApplicationContext()
  ,android.R.layout.simple_spinner_dropdown_item|0
  ,report.getCountries().map(c => c.replace(/_/g, ' '))
    );

  $screen.$country.setAdapter(adapter);
  $screen.$country.setDropDownWidth(700);
  $screen.$country.setThreshold(1);
  $screen.$country.setEnabled(true);
  $screen.$show.setEnabled(true);
  $screen.$bDeaths.setEnabled(true);
  $screen.$bCases.setEnabled(true);
  $screen.$bDeathRateByCase.setEnabled(true);
  $screen.$bRateDeaths.setEnabled(true);
  $screen.$bRateCases.setEnabled(true);
    } catch(e) {
    console.log("compute::error::" + e);
    }
  }

function doReport(country, imageView) {
  try {
    clearStatus();
    aForecast = [1, 2, 5, 7, 10];
    setStatusCat("<div class='legend'>kind::total(daycount)::pondRate%(1)::dayRate% + forecast in " + aForecast + " days from rates</div>");
    //["France", "Italy", "Spain", "Germany", "United_States_of_America", "Switzerland"]
    //var country = ("" + $screen.$country.getText().toString()).replace(/ /g, "_");
    setStatus("<h1>" + country.replace(/_/g, " ") + "</h1>");
    var data = report.getData(country);
    var last = data[data.length - 1].computed;
    console.log("lastData::" + data.length +"::<" + data[data.length - 1].Day + ">");
    ["Cases", "Deaths"].forEach(kind => {
        var meanMeanPonderated = 0;
        var weight = 0;
        for(var mmpi = 0; mmpi < 3; mmpi++) {
          var d = data[data.length - 1 - mmpi].computed;
          var c = d[kind].count; //data[data.length - 1 - mmpi][kind];
          meanMeanPonderated += (d[kind].mean.ponderated - 1)*c;
          console.log(kind + "::" + mmpi + "::" + meanMeanPonderated);
          weight += c;
          }
        meanMeanPonderated = 1 + meanMeanPonderated/weight;
        if (isNaN(meanMeanPonderated)) meanMeanPonderated = 1;
        console.log("meanMeanPonderated::" + meanMeanPonderated);
        last[kind].mean.meanPonderated = meanMeanPonderated;
        var progression = 0;
        var progressionWindow = 15;
        for(var ip = 0; ip < progressionWindow; ip++) {
          progression += Number(data[data.length - 1 - ip].computed[kind].progression);

          }
        progression = progression/progressionWindow;
        last[kind].mean.progression = progression;
        setStatus("<h2>" + spanText("zoom", kind) + "::"
          + last[kind].total + " [pop:<span class='emphase'>"
            + (last[kind].total * 100/data[data.length - 1].PopData2019).toFixed(2)
            + "%</span>]"
          + " (+"
            + last[kind].count
            + " [<span class='emphase'>"
              + (last[kind].count * 1000000/data[data.length - 1].PopData2019).toFixed(2)
              + "/M</span>]"
            + ")"
          + "::"
          + spanText("zoom", ((last[kind].mean.meanPonderated - 1)*100).toFixed(2) + "%")
          + "::"
          + spanText("zoom", ((progression -1)*100).toFixed(2) + "%")
          + "</h2>"
          );

        setStatusCat("<ul>P forecast:");
        aForecast.forEach(day => {
            setStatusCat(day + ":+" + ((Math.floor(
                  Number(last[kind].total)
                  *Math.pow(Number(last[kind].mean.meanPonderated), day)
                  )) - last[kind].total)
              + ", "
              );
            });
        setStatusCat("</ul><ul>D forecast:");
        aForecast.forEach(day => {
            setStatusCat(day + ":+" + ((Math.floor(
                  Number(last[kind].total)
                  *Math.pow(Number(progression), day)
                  )) - last[kind].total)
              + ", "
              );
            });
        setStatus("</ul>");
        });
    setStatus("<br><div class='legend'>(1)pondRate: calculated ponderated mean of daily rate since beginning of statistical data</div>");
    graph(imageView, last, data);

    } catch(e) {
    setStatus("doReport::Error::" + e + "::" + e.stack);
    }
  }

function doPalmares(imageView, title, kind, rate) {
  try{
    var Color = Lourah.graphics.Color;
    drawPalmares(imageView
      ,title
      ,[
        { name: "France", color: Color.CYAN }
        //,{ name: "Luxembourg", color: Color.argb(255,0,255,0) }
        ,{ name: "Spain", color: Color.argb(255,255,140,0) }
        ,{ name: "Germany", color: Color.WHITE }
        //,{ name: "United_States_of_America", color: Color.MAGENTA }
        ,{ name: "Switzerland", color: Color.GRAY }
        ,{ name: "Belgium", color: Color.RED }
        //,{ name: "Brazil", color: Color.argb(255,255,0,127)}
        //,{ name: "Russia", color: Color.argb(255,255,0,167)}
        ,{ name: "Sweden", color: Color.argb(255,200,124,254)}
        ,{ name: "United_Kingdom", color: Color.argb(255,124,234,172)}
        ,{ name: "Italy", color: Color.argb(255,124*1.5,34*1,172*1.2)}
        ,{ name: "Indonesia", color: Color.argb(255,24,134,172)}
        /**/
        ]
      , kind
      , rate
      );
    } catch(e) {
    setStatus("doPalmares::error::" + e + "::" + e.stack);
    }
  }

function graph(imageView, last, data) {
  var c2d = new Lourah.graphics.g2d.Context(imageView);
  display("Deaths", last, data, 0, Lourah.graphics.Color.BLACK, 7, 20, 0);
  display("Cases", last, data, 5000, Lourah.graphics.Color.BLUE, 7, 200, Math.PI/288, Lourah.graphics.Color.argb(127, 245, 245, 220));

  function display(kind, last, data, z, color, future, yUnit, rotate, background) {
    var layer = c2d.createLayer();

    var paintCurve = Lourah.graphics.g2d.buildPaint({
        color: color
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 3
        ,textSize:40
        });

    var pAxis = Lourah.graphics.g2d.buildPaint({
        color: color
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 3
        ,textSize:40
        });

    var pGridUnit = Lourah.graphics.g2d.buildPaint({
        color: color
        ,style: android.graphics.Paint.Style.STROKE
        ,strokeWidth: 0.5
        ,textSize:40
        });

    var pText = Lourah.graphics.g2d.buildPaint({
        color: android.graphics.Color.RED
        ,style: android.graphics.Paint.Style.FILL
        ,textSize:35
        });

    var byMillion = (Number(last[kind].total)/data[data.length - 1].PopData2019)*1000000;

    var pond = (x) => (byMillion
      *Math.pow(Number(last[kind].mean.meanPonderated), x));

    var prog = (x) => (byMillion
      *Math.pow(Number(last[kind].mean.progression), x));

    var maxY = Math.max(
      pond(future - 1),
      prog(future - 1)
      );

    var xAxis = {
      min:-180
      ,max:future - 1
      }
    var yAxis = {
      min:-maxY*.05
      ,max: maxY
      }

    layer.setRotation(0, -rotate, rotate);
    layer.setViewPortX(xAxis.min , xAxis.max);
    layer.setZ(z);
    layer.setViewPortY(yAxis.min, yAxis.max);

    if (background) {
      var pBackground = Lourah.graphics.g2d.buildPaint({
          color: background
          ,style: android.graphics.Paint.Style.FILL
          ,textSize:40
          });

      var corners = [
        layer.getP2d([xAxis.min, yAxis.max])
        ,layer.getP2d([xAxis.max, yAxis.max])
        ,layer.getP2d([xAxis.max, yAxis.min])
        ,layer.getP2d([xAxis.min, yAxis.min])
        ];

      var pathBackground = new android.graphics.Path();
      pathBackground.moveTo(corners[0][0], corners[0][1]);
      pathBackground.lineTo(corners[1][0], corners[1][1]);
      pathBackground.lineTo(corners[2][0], corners[2][1]);
      pathBackground.lineTo(corners[3][0], corners[3][1]);
      pathBackground.lineTo(corners[0][0], corners[0][1]);
      layer.getCanvas().drawPath(
        pathBackground
        ,pBackground
        );
      }

    layer.createAxisX({
        min:xAxis.min
        ,max:xAxis.max
        ,unit:10
        ,paintGridUnit:pGridUnit
        ,paintTagUnit:pText
        }).draw(pAxis)
    .createAxisY({
        min:yAxis.min
        ,max:yAxis.max
        ,unit:yUnit //Math.floor(yAxis.max/10)
        ,paintGridUnit:pGridUnit
        ,paintTagUnit:pText
        }).draw(pAxis);

    var curve = layer.createCurveFx(
      prog
      , xAxis.min
      , xAxis.max
      , xAxis.max - xAxis.min
      );

    curve.draw(paintCurve);
    curve = layer.createCurveFx(
      pond
      , xAxis.min
      , xAxis.max
      , xAxis.max - xAxis.min
      );

    curve.draw(paintCurve);


    var serial =[];
    var kMillion = 1000000/data[data.length - 1].PopData2019;
    for(var i = Math.max(data.length + xAxis.min,0); i < data.length; i++) {
      serial.push([i - data.length + 1, kMillion*data[i].computed[kind].total]);
      }

    var spots = layer.createSerial(serial);
    spots.draw(paintCurve);

    var d = data[data.length - 1];

    layer.addLabel(
      "" + (kMillion*d.computed[kind].total).toFixed(2)
      ,[
        serial[serial.length - 1][0] + 1
        ,serial[serial.length - 1][1]*1.02
        ]
      ,pText
      );

    layer.addLabel(
      d.CountriesAndTerritories
      + " - "
      + d.Day + "/" + d.Month + "/" + d.Year
      ,[xAxis.min ,yAxis.max * .85]
      ,paintCurve
      );

    layer.addLabel(
      kind + "/" + "Million"
      ,[xAxis.min*.9 ,yAxis.max * .80]
      ,paintCurve
      );

    layer.drawLabels();

    }
  }

function drawPalmares(imageView, title, countries, kind, rate) {
  var c2d = new Lourah.graphics.g2d.Context(imageView);
  var layer = c2d.createLayer();
  var maxY = 0;
  var minY = 0;

  var history = -120;

  countries.forEach(country => {
      country.serial = [];
      var data = report.getData(country.name);
      country.kMillion = 1000000/data[data.length - 1].PopData2019;
      country.data = data;

      //var last = data[data.length - 1].computed;
      var y = 0;
      var score = 0;
      var kRate = 1000000/(rate * data[data.length - 1].PopData2019);
      for(var i = Math.max(data.length + history,0); i < data.length; i++) {
        switch(kind) {
          case "Deaths":
          case "Cases":
          if (!rate) {
            y = country.kMillion*data[i].computed[kind].total;
            score = y;
            } else {
            if (i === 0 || data[i - 1].computed[kind].total === 0) {
              y = 0;
              } else {
              var yLast = y;
              y = 0;
              var d = 0;
              for(var j = 0; j < rate; j++) {
                try { d += Number(data[i-j][kind]); }
                catch(e) { d += 0; }
                }
              y = kRate*d; //,(1000000 * (d/rate)/data[data.length - 1].PopData2019)/rate; //.computed[kind].total;


              if (y < 0) {
                // probably a fix issued
                // by country health authority
                continue;
                }
              }
            score = y;
            }
          break;
          case "DeathRateByCase":
          y = data[i].computed["Deaths"].total*100
          /data[i].computed["Cases"].total;
          score = y;
          break;
          default: throw "doPalmares::" + kind + "::unmanaged kind";
          }
        country.serial.push([i - data.length + 1, y]);
        if (y > maxY) maxY = y;
        //if (y < minY) minY = y;
        }
      country.score = score;
      });

  var xAxis = {
    min:history
    ,max:20
    }
  var yAxis = {
    min:minY?minY*1.05:-maxY*.05
    ,max: maxY*1.2
    }

  var yUnit = (kind === "Cases")?250:20;
  if (kind === "DeathRateByCase") yUnit = 1;
  if (rate) yUnit=10;


  var pAxis = Lourah.graphics.g2d.buildPaint({
      color: android.graphics.Color.WHITE
      ,style: android.graphics.Paint.Style.STROKE
      ,strokeWidth: 3
      ,textSize:20
      });

  var pGridUnit = Lourah.graphics.g2d.buildPaint({
      color: android.graphics.Color.WHITE
      ,style: android.graphics.Paint.Style.STROKE
      ,strokeWidth: 0.5
      ,textSize:20
      });

  var pText = Lourah.graphics.g2d.buildPaint({
      color: android.graphics.Color.RED
      ,style: android.graphics.Paint.Style.FILL
      ,setTypeface: android.graphics.Typeface.DEFAULT_BOLD
      ,textSize:30
      });

  var pBackground = Lourah.graphics.g2d.buildPaint({
      color: android.graphics.Color.BLACK //argb(255, 0, 0, 0)
      ,style: android.graphics.Paint.Style.FILL
      ,textSize:40
      });

  layer.getCanvas().drawRect(
    0
    , 0
    , c2d.getWidth()
    , c2d.getHeight()
    , pBackground
    )

  layer.setViewPortX(xAxis.min , xAxis.max);
  layer.setViewPortY(yAxis.min, yAxis.max);
  layer.createAxisX({
      min:xAxis.min
      ,max:xAxis.max
      ,unit:5
      ,paintGridUnit:pGridUnit
      ,paintTagUnit:pText
      }).draw(pAxis)
  .createAxisY({
      min:yAxis.min
      ,max:yAxis.max
      ,unit:yUnit //Math.floor(yAxis.max/10)
      ,paintGridUnit:pGridUnit
      ,paintTagUnit:pText
      }).draw(pAxis);

  countries
  .sort((a,b) => b.score - a.score)
  .forEach((country, i) => {
      var paintCurve = Lourah.graphics.g2d.buildPaint({
          color: country.color
          ,style: android.graphics.Paint.Style.STROKE
          ,strokeWidth: 3
          ,textSize:40
          });

      var spots = layer.createSerial(country.serial);
      spots.draw(paintCurve, rate);
      var d = country.data[country.data.length - 1];
      layer.addLabel(
        "" + country.score.toFixed(rate?4:2)
        ,[
          country.serial[country.serial.length - 1][0] + .7
          ,country.serial[country.serial.length - 1][1]*1.02
          ]
        ,paintCurve
        );
      layer.addLabel(
        country.name + ":" + country.score.toFixed(rate?4:2)
        + ""
        ,[xAxis.min*.92, yAxis.max * (.82 - .035*i)]
        ,paintCurve
        );
      });
  var r = $screen.$date.getText().toString().split("/");
  layer.addLabel(
    "Each country " + title
    + " " + r[2] + "/" + r[1] + "/" + r[0]
    ,[xAxis.min*.95, yAxis.max * (.85)]
    ,pText
    );
  layer.addLabel(
    "source: www.ecdc.europa.eu"
    ,[xAxis.min*.95, yAxis.max * (.025)]
    ,pText
    );
  layer.drawLabels();
  }
