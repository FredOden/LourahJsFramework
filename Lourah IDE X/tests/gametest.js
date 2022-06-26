Lourah.jsFramework.setOnBackButtonListener(() => {
    console.log("Back Button pressed");
    return false;
    });

Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.games.Screen.js');


var movePane = (pane, me) => {
  var f = pane.getFrame();
  pane.setFrame(
    f.x + me.getX() - f.width/2
    ,f.y + me.getY() - f.height/2
    ,f.width
    ,f.height
    );
  pane.updateFrame();
  return true;
  };


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
    ,textSize : 150
    });

var paintMotion = Lourah.graphics.g2d.buildPaint({
    style: android.graphics.Paint.Style.FILL
    ,color: android.graphics.Color.GREEN
    ,textSize : 70
    });

/*
paintLetter.setXfermode(new android.graphics.PorterDuffXfermode(
    android.graphics.PorterDuff.Mode.DST
    ));
*/

pane0.setHandler((pane) => {
    var canvas = pane.getCanvas();
    
    pane.setOnTouchListener(movePane);
    
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
pane1.setFrame(350, 150, 800, 1000, pane0);



pane1.setHandler((pane) => {
    var canvas = pane.getCanvas();
    pane.setOnTouchListener((pane, motionEvent) => {
        //console.log("pane1::" + motionEvent.toString);
        canvas.drawColor(
          android.graphics.Color.YELLOW
          ,android.graphics.PorterDuff.Mode.SRC_IN
          );
        canvas.drawText("Motion"
          , motionEvent.getX()
          ,motionEvent.getY()
          ,paintMotion
          );
        pane.flush();

        return true;
        });
    canvas.drawColor(android.graphics. Color.YELLOW);
    canvas.drawText("pane1", 10, 50, paint);
    for(var i = 0; i < 360; i+=10) {
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

    pane.setOnTouchListener(movePane);
    
    for(var i = 0; i < 360; i+=10) {

      canvas.drawColor(
        android.graphics.Color.TRANSPARENT
        ,android.graphics.PorterDuff.Mode.SRC_IN
        );

      canvas.drawText(i, 135, 260, paintLetter);
      //canvas.drawCircle(200, 200, 20, paintLetter);
      pane.rotate(i);
      pane.flush();
      java.lang.Thread.sleep(10);
      }
    });
screen.addPane(pane2);



Activity.setTitle("gametest.js");
Activity.setContentView(screen.getLayout())
