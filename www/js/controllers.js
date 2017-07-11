angular.module('starter.controllers', [])

.controller('getStartedCtrl', function( $scope,$state, $ionicSlideBoxDelegate, SettingsFactory) {
  // ['$scope', '$state', 'SettingsFactory', function( $scope, $state, SettingsFactory )

 $scope.sliderOptions = {
    effect: 'slide',
    pagination: 'false',
    initialSlide: 0
  }
  $scope.slideChanged = function(index)
  {
    $scope.slideIndex = index;
  }

  var pushEnabled = SettingsFactory.getPushEnabled();
  var calendarEnabled = SettingsFactory.getCalendarEnabled();
  //alert('handling');
  if ( pushEnabled || calendarEnabled ) {
    // skip registration
    $state.go('tab.calendar');
  }
  $scope.handleGetStarted = function() {

    var pushEnabled = SettingsFactory.getPushEnabled();
    var calendarEnabled = SettingsFactory.getCalendarEnabled();

    //alert('handling');
    if ( ! pushEnabled || ! calendarEnabled ) {
      // then we need to go to registration
      // alert( 'push or calendar off' );
      $state.go('registration');

    } else {
      // skip registration
      $state.go('tab.calendar');
    }
  };
})

.controller('registrationCtrl',  function($scope, $state, SettingsFactory, Calendars, $ionicPlatform,$cordovaCalendar,$timeout) {

  // $scope.settings = SettingsFactory.get();

  // var pushEnabled = SettingsFactory.getPushEnabled();
  // var calendarEnabled = SettingsFactory.getCalendarEnabled();

  // $scope.registrationModel = {
  //     pushEnabled: pushEnabled,
  //     calendarEnabled: calendarEnabled,
  // };


  $scope.completeRegistration = function() {

    SettingsFactory.setPushEnabled($scope.registrationModel['pushEnabled']);
    SettingsFactory.setCalendarEnabled($scope.registrationModel['calendarEnabled']);

    window.plugins.OneSignal.setSubscription($scope.registrationModel['pushEnabled']);

    $state.go('tab.calendar');
  };

  $scope.settings = SettingsFactory.get();

  var pushEnabled = SettingsFactory.getPushEnabled();
  var calendarEnabled = SettingsFactory.getCalendarEnabled();
  $scope.settingsModel = {
    pushEnabled: {
      checked: pushEnabled
    },
    calendarEnabled: {
      checked: calendarEnabled
    }
  };

  $scope.pushEnabledChange = function() {
    SettingsFactory.setPushEnabled($scope.settingsModel.pushEnabled.checked);
  };
  $scope.calendarEnabledChange = function() {
    SettingsFactory.setCalendarEnabled($scope.settingsModel.calendarEnabled.checked);

    if($scope.settingsModel.calendarEnabled.checked == true)
    {

      $scope.addEvents();
    }
    else if($scope.settingsModel.calendarEnabled.checked == false)
    {
        $scope.deleteEvents();
    }
  };
 
    
    Calendars.all().success(function (response) {
      $scope.calendars = response;
    });
 

  $scope.addEvents = function() {

      $scope.calendars.forEach(function(calendar, index){
        console.log("aa="+JSON.stringify(calendar));
        Calendars.add(calendar).then(function(result) {
          console.log("done adding event, result is "+result);
          if(result === 1) {
            //update the event
            $timeout(function() {
              $scope.calendars[index].status = true;
              $scope.$apply();
            });
          } else {
            }
          });
        });
    };
  $scope.deleteEvents = function() {

      $scope.calendars.forEach(function(calendar, index){
        console.log("aa="+JSON.stringify(calendar));
        Calendars.delete(calendar).then(function(result) {
          console.log("done deleting event, result is "+result);
          if(result === 1) {
            //update the event
            $timeout(function() {
              $scope.calendars[index].status = true;
              $scope.$apply();
            });
          } else {
            }
          });
        });
    };
})

.controller('CalendarCtrl', function($scope, $cordovaInAppBrowser, Calendars) {

   var options = {
      location: 'no',
      toolbar: 'yes',
      toolbarposition: 'top',
      closebuttoncaption: '< Back'
   };

    Calendars.all().success(function (response) {
      $scope.calendars = response;
      console.log($scope.calendars);

    });
     $scope.openBrowser = function(url) {
      $cordovaInAppBrowser.open(url, '_blank', options);
    }
})

.controller('CreatesCtrl', function($scope, $cordovaInAppBrowser, Creates) {

  $scope.creates = Creates.all();
  console.log($scope.creates);

   var options = {
      location: 'no',
      toolbar: 'yes',
      toolbarposition: 'top',
      closebuttoncaption: '< Back'
   };
   $scope.localBrowser = function(url) {
      $cordovaInAppBrowser.open(url, '_blank', options);
    }
})

.controller('NotificationCtrl', function($scope, SettingsFactory, Calendars, $ionicPlatform,$cordovaCalendar,$timeout) {

  $scope.settings = SettingsFactory.get();

  var pushEnabled = SettingsFactory.getPushEnabled();
  var calendarEnabled = SettingsFactory.getCalendarEnabled();
  $scope.settingsModel = {
    pushEnabled: {
      checked: pushEnabled
    },
    calendarEnabled: {
      checked: calendarEnabled
    }
  };

  $scope.pushEnabledChange = function() {
    SettingsFactory.setPushEnabled($scope.settingsModel.pushEnabled.checked);
  };
  $scope.calendarEnabledChange = function() {
    SettingsFactory.setCalendarEnabled($scope.settingsModel.calendarEnabled.checked);

    if($scope.settingsModel.calendarEnabled.checked == true)
    {

      $scope.addEvents();
    }
    else if($scope.settingsModel.calendarEnabled.checked == false)
    {
        $scope.deleteEvents();
    }
  };
 $ionicPlatform.ready(function() {
    
    Calendars.all().success(function (response) {
      $scope.calendars = response;
    });
  });

  $scope.addEvents = function() {

    // console.log("cccc");
    // console.log(Calendars.addEvent($scope.calendars[0]));

    // Calendars.add($scope.calendars[0]).then(function(result) {
    //     console.log("done adding event, result is "+result);
    //     if(result === 1) {
    //       //update the event
    //       $timeout(function() {
    //         $scope.calendars[0].status = true;
    //         $scope.$apply();
    //       });
    //     } else {
    //       //For now... maybe just tell the user it didn't work?
    //     }
    //   });
    // // // console.log("aa="+JSON.stringify($scope.calendars));
      $scope.calendars.forEach(function(calendar, index){
        console.log("aa="+JSON.stringify(calendar));
        Calendars.add(calendar).then(function(result) {
          console.log("done adding event, result is "+result);
          if(result === 1) {
            //update the event
            $timeout(function() {
              $scope.calendars[index].status = true;
              $scope.$apply();
            });
          } else {
            }
          });
        });
    };
  $scope.deleteEvents = function() {


     // Calendars.delete($scope.calendars[0]).then(function(result) {
     //    console.log("done adding event, result is "+result);
     //    if(result === 1) {
     //      //update the event
     //      $timeout(function() {
     //        $scope.calendars[0].status = true;
     //        $scope.$apply();
     //      });
     //    } else {
     //      //For now... maybe just tell the user it didn't work?
     //    }
     //  });
    // // console.log("aa="+JSON.stringify($scope.calendars));

      $scope.calendars.forEach(function(calendar, index){
        console.log("aa="+JSON.stringify(calendar));
        Calendars.delete(calendar).then(function(result) {
          console.log("done deleting event, result is "+result);
          if(result === 1) {
            //update the event
            $timeout(function() {
              $scope.calendars[index].status = true;
              $scope.$apply();
            });
          } else {
            }
          });
        });
    };
})

.controller('HelpCtrl', function($scope) {})
