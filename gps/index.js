Activity.importScript(Lourah.jsFramework.parentDir() + "/Overview.js");


Lourah.jsFramework.setOnBackButtonListener(() => {
    return false;
    });


var board = (new Lourah.android.Overview({
      ll : {
        class : "android.widget.LinearLayout"
        ,attributes : {
          setOrientation : android.widget.LinearLayout.VERTICAL
          }
        ,content : {
          scroll : {
            class : "android.widget.ScrollView"
            ,content : {
              tLocation : {
                class : "android.widget.TextView"
                ,attributes: {
                  setTextColor: android.graphics.Color.GREEN
                  ,setBackgroundColor : android.graphics.Color.BLACK
                  } // attributes
                } // tv

              } // scroll.content
            } // scroll
          ,tStatus : {
            class : "android.widget.TextView"
            ,attributes: {
              setTextColor: android.graphics.Color.BLUE
              ,setBackgroundColor : android.graphics.Color.GRAY
              } // attributes
            } // tStatus

          } // ll.content
        } // ll
      })).$();


Activity.setTitle("location by Lourah");

Activity.setContentView(board.ll);

var locations = [];
var i = -1;
var HERE = .1;
var skip = 0;

let locationListener = new android.location.LocationListener({
    onLocationChanged:location => {
      /*
      console.log("location::" + location);
      if (i !== -1 && locations[i].distanceTo(location) < HERE ) {
        board.tStatus.setText(skip++ + "::skip::" + i);
        return;
        }
      */
      locations.push(location);
      i++;
      board.tLocation.append(i + "::" + location.getLatitude() + "," + location.getLongitude() + "::" + location.getProvider()
        + "::"
        + (i?locations[i - 1].distanceTo(location):0) 
        + '\n');
      }
    ,onProviderDisabled: provider => {
      board.tStatus.setText("providerDisabled::" + provider);
      }
    ,onProviderEnabled: provider => {
      board.tStatus.setText("providerEnabled::" + provider);
      }
    ,onStatusChanged : (provider, status, extras) => {
      board.tStatus.setText("::statusChanged::" + provider + "::"+ status);
      }
    ,onBind: intent => null
    }
  );

var locationManager = Activity.getSystemService(android.content.Context.LOCATION_SERVICE);
var isEnabled = {
  gps: locationManager.isProviderEnabled(
    android.location.LocationManager.GPS_PROVIDER
    )
  ,network: isNetworkEnabled = locationManager.isProviderEnabled(
    android.location.LocationManager.NETWORK_PROVIDER
    )
  }


board.tStatus.setText("isEnabled::" + JSON.stringify(isEnabled));

if (isEnabled.gps) {
locationManager.requestLocationUpdates(
  android.location.LocationManager.GPS_PROVIDER,
  5000,
  1,
  locationListener);
  }

if (isEnabled.network) {
locationManager.requestLocationUpdates(
  android.location.LocationManager.NETWORK_PROVIDER,
  5000,
  1,
  locationListener);
  }

