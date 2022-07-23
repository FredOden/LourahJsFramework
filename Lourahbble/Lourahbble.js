var Lourahbble = Lourahbble || {};

Activity.importScript(Lourah.jsFramework.dir() + "/Logger.js");

(function () {
    if (Lourahbble.board) return;
    Activity.importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.games.Screen.js');
    const    L2={ color: android.graphics.Color.CYAN }
    ,L3={ color: android.graphics.Color.BLUE }
    ,W2={ color: android.graphics.Color.MAGENTA }
    ,W3={ color: android.graphics.Color.RED }
    ,__={ color: android.graphics.Color.LTGRAY }
    ;

    const ROWS = 15;
    const COLUMNS = 15;
    Lourahbble.board = {
      layout: [
        W3,__,__,L2,__,__,__,W3,__,__,__,L2,__,__,W3
        ,__,W2,__,__,__,L3,__,__,__,L3,__,__,__,W2,__
        ,__,__,W2,__,__,__,L2,__,L2,__,__,__,W2,__,__
        ,L2,__,__,W2,__,__,__,L2,__,__,__,W2,__,__,L2
        ,__,__,__,__,W2,__,__,__,__,__,W2,__,__,__,__
        ,__,L3,__,__,__,L3,__,__,__,L3,__,__,__,L3,__
        ,__,__,L2,__,__,__,L2,__,L2,__,__,__,L2,__,__
        ,W3,__,__,L2,__,__,__,W2,__,__,__,L2,__,__,W3
        ,__,__,L2,__,__,__,L2,__,L2,__,__,__,L2,__,__
        ,__,L3,__,__,__,L3,__,__,__,L3,__,__,__,L3,__
        ,__,__,__,__,W2,__,__,__,__,__,W2,__,__,__,__
        ,L2,__,__,W2,__,__,__,L2,__,__,__,W2,__,__,L2
        ,__,__,W2,__,__,__,L2,__,L2,__,__,__,W2,__,__
        ,__,W2,__,__,__,L3,__,__,__,L3,__,__,__,W2,__
        ,W3,__,__,L2,__,__,__,W3,__,__,__,L2,__,__,W3
        ]
      ,Cell: function(pane, row, column) {
        var letter;
        
        this.idx = column + row*COLUMNS;
        this.setLetter = (l) => {
          letter = l;
          if (l) letter.setCell(this);
          }
        this.getLetter = () => letter;
        this.layout = Lourahbble.board.layout[this.idx];
        pane.setName("Cell");
        var paint = new android.graphics.Paint();
        paint.setStyle(android.graphics.Paint.Style.FILL);
        paint.setColor(Lourahbble.board.layout[this.idx].color);
        this.paintCell = () => {
          var canvas = pane.getCanvas();
          canvas.drawRect(0, 0, canvas.getWidth(), canvas.getHeight(), paint);
          pane.flush();
          }
        pane.setHandler((p) => {
            this.paintCell();
            })
        }
      };

    var screen = new Lourah.android.games.Screen(Activity);

    var screenWidth = 1.5 * screen.getWidth();
    var screenHeight = 1.5 * screen.getHeight();

    var pBackground = new Lourah.android.games.Screen.Pane();
    pBackground.setFrame(0,0, screenWidth, screenWidth);
    function drawBackground(pane) {
      var canvas = pane.getCanvas();
      canvas.drawColor(android.graphics. Color.GREEN);
      pane.flush();
      console.log("drawn background");
      }
    pBackground.setHandler((pane) => {
        drawBackground(pane);
        });
    screen.addPane(pBackground);

    var colMargin = 3;
    var rowMargin = 3;
    var pw = screenWidth/COLUMNS - 2*colMargin;
    var ph = screenWidth/ROWS - 2*rowMargin;
    var cells = [];

    for(var row = 0; row < ROWS; row++) {
      for (var column = 0 ; column < COLUMNS; column++) {
        var pane = new Lourah.android.games.Screen.Pane();
        pane.setFrame(
          colMargin + column*(2*colMargin + pw)
          ,rowMargin + row*(2*rowMargin + ph)
          ,pw
          ,ph
          )
        screen.addPane(pane);
        cells.push(new Lourahbble.board.Cell(pane, row, column));
        }
      }

    var getColumn = (x) => Math.floor((x + pw/2 - colMargin)/(2*colMargin + pw));
    var getRow = (y) => Math.floor((y + ph/2 - rowMargin)/(2*rowMargin + ph));

    var tw = new Lourah.android.games.Screen.Pane(android.webkit.WebView);
    tw.setFrame(100, screenWidth + 100, screenWidth -200, 350);
    tw.setHandler(
      pane => {
        var border = new android.graphics.drawable.GradientDrawable();
        border.setColor(android.graphics. Color.argb(255,16,16,16)); //white background
        border.setStroke(1, android.graphics. Color.RED); //black border with full opacity
        Lourah. jsFramework. uiThread(() => {
            try {
              if(android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.JELLY_BEAN) {
                pane.getView().setBackgroundDrawable(border);
                } else {
                pane.getView().setBackground(border);
                }
              try {
                pane.getView().setVerticalScrollBarEnabled(true);
                //pane.getView().setMovementMethod(new android.text.method.ScrollingMovementMethod());
                } catch(e) {
                console.log("scrolling::" + e);
                }
              /*
              pane.getView().loadData(
                "hi boys!\nand girls\n".repeat(500)
                , "text/html; charset=utf-8"
                , "UTF-8"
                );
              */
              pane.getView().setVisibility(android.widget.TextView.VISIBLE);
              //console.log("tw::" + pane.getView().getText());
              } catch(e) {
              console.log("WebView::" + e);
              }
            //pane.getView().invalidate();
            });
        }
      );
    screen.addPane(tw);

    Lourahbble.board.Letter = function(letter, weight) {
      var pane = new Lourah.android.games.Screen.Pane();
      pane.setFrame(0,screenWidth + 100,pw,ph);
      var cell;
      this.setCell = (c) => {
        cell = c;
        if (!c && cell) cell.setLetter();
        }
      this.paintCell = () => {
        var canvas = pane.getCanvas();
        var rectF = new android.graphics.RectF(0, 0, canvas.getWidth(), canvas.getHeight());

        var paintBackground = new android.graphics.Paint();
        paintBackground.setColor(android.graphics.Color.parseColor("#afcfcf90"));
        paintBackground.setStyle(android.graphics.Paint.Style.FILL);
        canvas.drawRoundRect(rectF, 20, 20, paintBackground);
        var paintLetter = new android.graphics.Paint();
        paintLetter.setColor(android.graphics.Color.BLACK);
        paintLetter.setStyle(android.graphics.Paint.Style.FILL);
        //paintLetter.setColor(android.graphics.Color.MAGENTA);
        var [width, height] = [canvas.getWidth(), canvas.getHeight()];
        var fullSize = (width + height)/2;
        paintLetter.setTextSize(.7*fullSize);
        paintLetter.setStrokeWidth(0);
        paintLetter.setTextAlign(android.graphics.Paint.Align.CENTER);
        paintLetter.setShadowLayer(20, -10, 10, android.graphics.Color.BLACK);

        var [xText, yText] = [
          .7*width/2
          , .9*height/2
          - (
            paintLetter.descent()
            +
            paintLetter.ascent()
            )/2
          ];

        canvas.drawText(letter, xText, yText, paintLetter);
        paintLetter.setTextSize(.45*fullSize);
        paintLetter.setShadowLayer(0,0,0,0);
        paintLetter.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        [xText, yText] = [
          1.5*width/2
          , 1.5*height/2
          - (
            paintLetter.descent()
            +
            paintLetter.ascent()
            )/2
          ];
        canvas.drawText("" + weight, xText, yText, paintLetter);
        pane.flush();
        }

      var initialPosition;

      this.onTouchListener = (pane, me) => {
        pane.getView().getParent().requestDisallowInterceptTouchEvent(true);
        this.setCell();
        var f = pane.getFrame();
        var [x, y] = [
          f.x + me.getX() - f.width/2
          ,f.y + me.getY() - f.height/2
          ];

        pane.setFrame(
          x
          ,y
          ,f.width
          ,f.height
          );
        if (me.getAction() === android.view.MotionEvent.ACTION_UP) {
          //console.log("::" + android.view.MotionEvent.actionToString(me.getAction()) + "(" + [getColumn(x),getRow(y)] + ")");
          var [row, column] = [getRow(y), getColumn(x)];
          var [tx, ty] = initialPosition;
          var idx = column + row*COLUMNS;
          if (idx < cells.length && !cells[idx].getLetter()) {
            cells[idx].setLetter(this);
            [tx, ty] = [
              colMargin + getColumn(x)*(2*colMargin + pw)
              ,rowMargin + getRow(y)*(2*rowMargin + ph)];
            }
          pane.setFrame(
            tx
            ,ty
            ,f.width
            ,f.height
            )
          }
        pane.getView().bringToFront();
        pane.updateFrame();
        return true;
        }

      pane.setHandler((pane) => {
          var f = pane.getFrame();
          initialPosition = [f.x, f.y];
          pane.setOnTouchListener(this.onTouchListener);
          this.paintCell();
          });
      screen.addPane(pane);
      }


    Lourahbble.board.status = tw.getView();
    Lourahbble.board.screen = screen;
    })();

Lourah.jsFramework.setOnBackButtonListener(() => {
    console.log("Back Button pressed");
    return false;
    });

Activity. setTitle("Test Lourahbble");
var sv = new android.widget.HorizontalScrollView(Activity.getApplicationContext());
sv.addView(Lourahbble.board.screen.getLayout());
Activity. setContentView(sv);

var logger = new Logger(Lourahbble.board.status);

logger.say("hello");
logger.error("ow crash");

var z = new Lourahbble.board.Letter("K", 10);
