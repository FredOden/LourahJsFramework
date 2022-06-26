Lourah.jsFramework.setOnBackButtonListener(() => {
    console.log("Back Button pressed");
    return false;
    });

Activity. importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.games.Screen.js');

var first = true;
var initial;

var movePane = (pane, me) => {
  var f = pane.getFrame();
  if (first) {
    initial = [f.x, f.y];
    first = false;
    }
  var x, y;
  if (me.getAction() === android.view.MotionEvent.ACTION_UP) {
    [x, y] = initial;
    } else {
    [x, y] = [
      f.x + me.getX() - f.width/2
      ,f.y + me.getY() - f.height/2
      ];
    }

  pane.setFrame(
    x
    ,y
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

*/
var paintBorderLight = Lourah.graphics.g2d.buildPaint({
    style: android.graphics.Paint.Style.STROKE
    ,color: android.graphics.Color.LTGRAY
    ,strokeWidth: 10
    });

var paintBorderDark = Lourah.graphics.g2d.buildPaint({
    style: android.graphics.Paint.Style.STROKE
    ,color: android.graphics.Color.DKGRAY
    ,strokeWidth: 10
    });


function Cell(i, xStep, yStep) {
  var pane = new Lourah.android.games.Screen.Pane();
  pane.setFrame(i*xStep, screen.getHeight() - 2*yStep, .9*xStep, yStep);
  //console.log("Cell(" + [i, i*xStep,screen.getHeight() - 2*yStep] + ")");
  
  this.paintCell = (text) => {
    var c = pane.getCanvas();
    c.drawColor(android.graphics.Color.GREEN
      //,android.graphics.PorterDuff.Mode.CLEAR
      );
    c.drawText(text, 0, .8*yStep, paintLetter);
    
    c.drawLine(0,5,pane.getWidth(), 5, paintBorderLight);
    c.drawLine(pane.getWidth() - 5, 0, pane.getWidth() - 5, pane.getHeight(), paintBorderLight);
    c.drawLine(pane.getWidth(),pane.getHeight() - 5, 0, pane.getHeight() - 5, paintBorderDark);
    c.drawLine(5, pane.getHeight(), 5, 0, paintBorderDark);
    
    pane.rotate(i);
    pane.flush();
    }
  
  pane.setHandler((pane) => {
      var f = pane.getFrame();
      const initialPosition = [f.x, f.y];

      pane.setOnTouchListener((pane, me) => {
          var x, y;
          var f = pane.getFrame();
          if (me.getAction() === android.view.MotionEvent.ACTION_UP) {
            [x, y] = initialPosition;
            } else {
            [x, y] = [
              f.x + me.getX() - f.width/2
              ,f.y + me.getY() - f.height/2
              ];
            }
          pane.setFrame(
            x
            ,y
            ,f.width
            ,f.height
            );
          //console.log(i + "::" + android.view.MotionEvent.actionToString(me.getAction()) + "(" + [x,y] + ")");
          pane.updateFrame();
          return true;
          });
      this.paintCell(i);
      });
  screen.addPane(pane);
  }

var cells= [];
const MAX_CELLS = 10;

var [xStep, yStep] = [
  Math.floor(screen.getWidth()/MAX_CELLS)
  ,Math.floor(screen.getHeight()/MAX_CELLS)
  ];
for (var i = 0; i < MAX_CELLS; i++) {
  cells.push(new Cell(i, xStep, yStep));
  }




Activity.setTitle("gametest.js");
Activity.setContentView(screen.getLayout())
