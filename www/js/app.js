
/* Add your OneAll Subdomain Here */
var oneall_subdomain = 'asocialstrategy';

/* Leave As Is */
var oneall_connection_token = '';
var oneall_identity = '';


angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, SettingsFactory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      
      StatusBar.styleDefault();
    }

    window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 0});

        var pushEnabled = SettingsFactory.getPushEnabled();
        var notificationOpenedCallback = function(jsonData) {
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        };
        // TODO : replace dev app id with production app id
        window.plugins.OneSignal
          .startInit("0249417b-abac-44c8-87e8-22c4eebe2c0c")
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit();

        window.plugins.OneSignal.setSubscription(pushEnabled); // disable if not set up yet


    if (typeof window.calfeed_data != 'undefined' && window.calfeed_data) {
      var success = function(result) {
        var current_id = window.localStorage.getItem('calfeed-current');
        console.log("Event created successfully");
        window.localStorage.setItem('calfeed-'+current_id,'set');
      };
      var error = function(err) {console.error("There was an error: " + err);};
                       console.log('starting to add events');
      angular.forEach(window.calfeed_data, function(value,key){
        if ( window.localStorage.getItem('calfeed-'+value.id) !== undefined && window.localStorage.getItem('calfeed-'+value.id) == 'set' ) {
          console.log('already set');
          return;
        }
        var calendar_date = value.calendar_date;
        if (typeof calendar_date == 'undefined' || calendar_date == '') {
          console.log('no calendar_date supplied');
          return; // invalid date supplied
        }
        function pad(number, length){
          var str = "" + number
          while (str.length < length) {
            str = '0'+str
          }
          return str
        }

        var offset = new Date().getTimezoneOffset();
        offset = ((offset<0? '+':'-')+ // Note the reversed sign!
        pad(parseInt(Math.abs(offset/60)), 2)+
        pad(Math.abs(offset%60), 2));
        var date_start = new Date(calendar_date+offset);
        if ( Object.prototype.toString.call(date_start) === "[object Date]" ) {
          if ( isNaN(date_start.getTime()) ) {
            console.log('invalid date supplied');
            return;
          }
        } else {
          console.log('invalid date supplied');
          return;
        }
        var date_end = new Date(date_start.getTime()+5*60000); // add 5 minutes
        window.localStorage.setItem('calfeed-current',value.id);
        window.plugins.calendar.createEvent(value.title,'ASocialStrategy.com',value.description, date_start,date_end,success,error);
      });
    }

  });
})


.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
})
.config(function($sceDelegateProvider) {
   $sceDelegateProvider.resourceUrlWhitelist([
     'self',
     'https://www.asocialstrategy.com/research.php/?NoHeader/**'
   ]);
 })

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

.state('getStarted', {
    url: '/getstarted',
    templateUrl: 'templates/getStarted.html',
    controller: 'getStartedCtrl'
  })


   .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  
  .state('tab.calendar', {
    url: '/calendar',
    views: {
      'tab-calendar': {
        templateUrl: 'templates/tab-calendar.html',
        controller: 'CalendarCtrl'
      }
    }
  })

  .state('registration', {
    url: '/registration',
    templateUrl: 'templates/registration.html',
    controller: 'registrationCtrl'
  })  

  .state('tab.creates', {
      url: '/creates',
      views: {
        'tab-creates': {
          templateUrl: 'templates/tab-create.html',
          controller: 'CreatesCtrl'
        }
      }
    })
   

  .state('tab.notification', {
    url: '/notification',
    views: {
      'tab-notification': {
        templateUrl: 'templates/tab-notification.html',
        controller: 'NotificationCtrl'
      }
    }
  })


  .state('tab.help', {
    url: '/help',
    views: {
      'tab-help': {
        templateUrl: 'templates/tab-help.html',
        controller: 'HelpCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  // $urlRouterProvider.otherwise('/tab/calendar');
  $urlRouterProvider.otherwise('/getstarted');

});
