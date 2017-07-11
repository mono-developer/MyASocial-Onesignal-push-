angular.module('starter.services', [])

.factory('Creates', function($stateParams) {
  
  var creates = [{
    id: 0,
    title: 'Research Topics',
    url: 'https://www.asocialstrategy.com/research.php/?NoHeader',
    icon: 'icon ion-android-search'
  }, {
    id: 1,
    title: 'Create A Post',
    url: 'https://www.asocialstrategy.com/create.php/?NoHeader',
    icon: 'icon ion-android-textsms'
  }, {
    id: 2,
    title: 'My Posts',
    url: 'https://www.asocialstrategy.com/posts.php/?NoHeader',
    icon: 'icon ion-android-chat'
  }];

  return {
    all: function() {
      return creates;
    },
  };
})

.factory('Calendars', function ($http, $rootScope, $stateParams, $q, $cordovaCalendar) {

  var maindate = function(value)
    {
      var match_date;

      var dateStr = value.split("T")[0];
      var match = dateStr.match(/(\d{4})(\d{2})(\d{2})/);
      var betterDateStr = match[1] + '-' + match[2] + '-' + match[3] + "T" + value.split("T")[1];
      match_date =  new Date(betterDateStr);

      return match_date;
    };

    var aa = "20170216T14:00:00"
    console.log(maindate(aa));

  var incrementDate = function (date, amount) {
    var tmpDate = new Date(date);
    tmpDate.setDate(tmpDate.getDate() + amount);
    tmpDate.setHours(13);
    tmpDate.setMinutes(0);
    tmpDate.setSeconds(0);
    tmpDate.setMilliseconds(0);
    return tmpDate;
  };
  
  var incrementHour = function(date, amount) {
    var tmpDate = new Date(date);
    tmpDate.setHours(tmpDate.getHours() + amount);
    return tmpDate;
  };


  
  var url = "https://devsync.asocialstrategy.com/calfeed.php";
  var calendars = $http.get(url);

  var getEvents =  function() {

    var deferred = $q.defer();

      calendars.forEach(function(ev)
      {
        ev.enddate = incrementHour(ev.date, 1);
        console.log("enddatekkk" + ev.enddate);
        
        promises.push($cordovaCalendar.findEvent({

          title: ev.title,
          startdate: ev.calendar_date
          
        }));
      });

      $q.all(promises).then(function(response) {
            console.log("in the all done"); 
            //should be the same len as events
            for(var i=0;i<response.length;i++) {
              calendars[i].status = response[i].length === 1;
            }
            deferred.resolve(calendars);
          });
      return deferred.promise;
    };

  var addEvent = function(event) {
      var deferred = $q.defer();
    
      event.start_date = maindate(event.calendar_date);
      event.enddate = incrementHour(event.start_date, 1);
      console.log("start_date",event.start_date);
      console.log("end-date",event.enddate);

      $cordovaCalendar.createEvent({
        title: event.title,
        location: "",
        notes: event.description,
        startDate: maindate(event.calendar_date),
        endDate:incrementHour(event.start_date, 1)


    }).then(function (result) {

      console.log('success');
      console.dir(result);
      deferred.resolve(1);

    }, function (err) {

      console.log('error');
      console.dir(err);
      deferred.resolve(0);

    });     
    return deferred.promise;
  };

  var deleteEvent = function(event) {
    var deferred = $q.defer();
    
    $cordovaCalendar.deleteEvent({
        title: event.title,
        location: "",
        notes: event.description,
        startDate: maindate(event.calendar_date),
        endDate:incrementHour(event.start_date, 1)

    }).then(function (result) {

      console.log('success');
      console.dir(result);
      deferred.resolve(1);

    }, function (err) {

      console.log('error');
      console.dir(err);
      deferred.resolve(0);

    });     
    return deferred.promise;
  };
  
  return {
    get:getEvents,
    add:addEvent,
    delete:deleteEvent,
    all: function
     () {

        return calendars;
    }
  };


})

.factory('Events', function ($http, $rootScope, $stateParams, $q) {

  var url = "https://devsync.asocialstrategy.com/calfeed.php";

  var fakeEvents = $http.get(url);

  var getEvents = function() {
      var deferred = $q.defer();
    
      /*
      Logic is:
      For each, see if it exists an event.
      */
      var promises = [];
      fakeEvents.forEach(function(ev) {
        //add enddate as 1 hour plus
        // ev.enddate = incrementHour(ev.date, 1);
        // console.log('try to find '+JSON.stringify(ev));
        promises.push($cordovaCalendar.findEvent({
          title:ev.title,
          startDate:ev.date
        }));
      });
      
      $q.all(promises).then(function(results) {
        console.log("in the all done"); 
        //should be the same len as events
        for(var i=0;i<results.length;i++) {
          fakeEvents[i].status = results[i].length === 1;
        }
        deferred.resolve(fakeEvents);
      });
      
      return deferred.promise;
  }
  
  var addEvent = function(event) {
    var deferred = $q.defer();

    $cordovaCalendar.createEvent({
      title: event.title,
      notes: event.description,
      // startDate: event.date,
      startDate: event.calendar_date,
      endDate:event.enddate
    }).then(function (result) {
      console.log('success');console.dir(result);
      deferred.resolve(1);
    }, function (err) {
      console.log('error');console.dir(err);
      deferred.resolve(0);
    }); 
    
    return deferred.promise;

  }

  return {
    get: getEvents,
    add:addEvent
  }
 
})

.factory('SettingsFactory', [function() {
    var _settingsKey = "appSettings",
      defaultSettings = {
        pushEnabled:         false,
        calendarEnabled:     false,
        authEmail:           '',
      };

    function _retrieveSettings() {
      var settings = localStorage[_settingsKey];
      if(settings)
        return angular.fromJson(settings);
      return defaultSettings;
    }

    function _saveSettings(settings) {
      localStorage[_settingsKey] = angular.toJson(settings);
    }

    return {
      get: _retrieveSettings,
      set: _saveSettings,
      getPushEnabled: function() {
        return _retrieveSettings().pushEnabled;
      },
      setPushEnabled: function(enabled) {
        var settings = _retrieveSettings();
        settings.pushEnabled = enabled;
        _saveSettings(settings);
        window.plugins.OneSignal.setSubscription(enabled);
      },
      getCalendarEnabled: function() {
        return _retrieveSettings().calendarEnabled;
      },
      setCalendarEnabled: function(enabled) {
        var settings = _retrieveSettings();
        settings.calendarEnabled = enabled;
        _saveSettings(settings);
      },
      getAuthEmail: function() {
        return _retrieveSettings().authEmail;
      },
      setAuthEmail: function(email) {
        var settings = _retrieveSettings();
        settings.authEmail = email;
        _saveSettings(settings);
        window.plugins.OneSignal.syncHashedEmail(email);
      },
      getBgColor: function() {
        return _retrieveSettings().bgColor;
      },
      setBgColor: function(color) {
        var settings = _retrieveSettings();
        settings.bgColor = color;
        _saveSettings(settings);
      }
    }
}]);
