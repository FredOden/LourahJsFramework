Lourah.jsFramework.setOnBackButtonListener(() => {
    console.log("Back Button pressed");
    return false;
    });

Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.games.Screen.js');
var screen = new Lourah.android.games.Screen(Activity);

var pane0 = new Lourah.android.games.Screen.Pane();


pane0.setFrame(100, 100, 500, 500);

var paint = Lourah.graphics.g2d.buildPaint({
    style: android.graphics.Paint.Style.FILL
    ,color: android.graphics.Color.WHITE
    ,textSize : 40
    });

var paintLetter = Lourah.graphics.g2d.buildPaint({
    style: android.graphics.Paint.Style.FILL
    ,color: android.graphics.Color.BLUE
    ,textSize : 200
    });

pane0.setHandler((pane) => {
    var canvas = pane.getCanvas();
    var layer = new Lourah.graphics.g2d.Layer(pane);
    canvas.drawColor(android.graphics. Color.RED);
    layer.setViewPortY(-50,50);
    layer.setViewPortX(-20,20);
    layer.addLabel("Layer/pane0", [-10,20], paint);
    layer.setRotation(0,0,Math.PI/3);

    var s = layer.createSerial([[-10,10],[10,10],[10,-10],[-10,-10]]);
    s.draw(paint, true);
    layer.drawLabels();
    pane.rotate(30);
    pane.flush();
    });

screen.addPane(pane0);

var pane1 = new Lourah.android.games.Screen.Pane();
pane1.setFrame(350, 150, 200, 600, pane0);
pane1.setHandler((pane) => {
    var canvas = pane.getCanvas();
    for(var i = 0; i < 360; i++) {
      canvas.drawColor(android.graphics. Color.YELLOW);
      canvas.drawText("pane1", 10, 50, paint);
      pane.rotate(-2*i);
      pane.flush();
      java.lang.Thread.sleep(10);
      }
    });
screen.addPane(pane1);

var pane2 = new Lourah.android.games.Screen.Pane();
pane2.setFrame(100, 100, 400, 400);
pane2.setHandler((pane) => {
    var canvas = pane.getCanvas();
    for(var i = 0; i < 360; i++) {
      canvas.drawText("A", 135, 260, paintLetter);
      //canvas.drawCircle(200, 200, 20, paintLetter);
      pane.rotate(i);
      pane.flush();
      java.lang.Thread.sleep(10);
      }
    });
screen.addPane(pane2);


Activity.setTitle("gametest.js");
Activity.setContentView(screen.getLayout())
