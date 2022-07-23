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
        this.idx = column + row*COLUMNS;
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


    var pBackground = new Lourah.android.games.Screen.Pane();
    pBackground.setFrame(0,0, screen.getWidth(), screen.getWidth());
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
    var pw = screen.getWidth()/COLUMNS - 2*colMargin;
    var ph = screen.getWidth()/ROWS - 2*rowMargin;
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


    var tw = new Lourah.android.games.Screen.Pane(android.webkit.WebView);
    tw.setFrame(100, screen.getWidth() + 100, screen.getWidth() -200, 350);
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

    Lourahbble.board.status = tw.getView();
    Lourahbble.board.screen = screen;
    })();

Lourah.jsFramework.setOnBackButtonListener(() => {
    console.log("Back Button pressed");
    return false;
    });

Activity. setTitle("Test Lourahbble");
Activity. setContentView(Lourahbble.board.screen.getLayout());

var logger = new Logger(Lourahbble.board.status);

logger.say("hello");
logger.error("ow crash");
