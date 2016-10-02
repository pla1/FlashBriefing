  var app = angular.module('app', []);

  app.controller('Controller', function appControllerFunction($scope, $http) {
      $scope.settings = {};
      var tts = null;
      $scope.load = function() {
          $scope.phrases = [];
          $scope.saveSettings();
          $scope.getPhrases();
      }
      $scope.getPhrases = function() {
          var url = '/TextFeed2Images/JsonServlet?action=flashBriefing';
          console.log("URL: " + url);
          $http.post(url, $scope.settings).success(
              function(data) {
                  for (var i = 0; i < data.length; i++) {
                      var phrase = {};
                      phrase.text = data[i];
                      phrase.playing = false;
                      $scope.phrases.push(phrase);
                  }
                  if ($scope.phrases.length > 0) {
                      var phrase = {};
                      phrase.text = "Here is your flash briefing.";
                      $scope.phrases.unshift(phrase);
                      phrase = {};
                      phrase.text = "That's all for your flash briefing.";
                      $scope.phrases.push(phrase);
                  }
                  if (supportsSpeechSynthesis()) {
                    $scope.nowPlayingIndex = 0;
                      for (var i = 0; i < $scope.phrases.length; i++) {
                          tts = new SpeechSynthesisUtterance();
                          tts.lang = 'en-US';
                          tts.text = $scope.phrases[i].text;
                          console.log(new Date() + " " + $scope.phrases[i].text);
                          speechSynthesis.speak(tts);
                          tts.onend = function(event) {
                              console.log('Utterance has finished speaking: ' + event.utterance.text);
                              $scope.nowPlayingIndex++;
                              $scope.$apply();
                          }
                          tts.onstart = function(event) {
                              console.log('Utterance has started to speak: ' + event.utterance.text);
                          }
                      }
                  } else {
                      alert("This browser does not support text to speech.");
                  }
              }
          );
      }

      $scope.saveSettings = function() {
          localStorage.setItem("flashBriefingSettings", JSON.stringify($scope.settings));
      }
      $scope.restoreSettings = function() {
          var settings = null;
          if (localStorage.getItem("flashBriefingSettings") != null) {
              settings = JSON.parse(localStorage.getItem("flashBriefingSettings"));
          }
          if (settings == null) {
              console.log("Settings are null from localStorage");
              $scope.settings.nflCheckbox = false;
              $scope.settings.weatherCheckbox = false;
              $scope.settings.latitude = 30;
              $scope.settings.longitude = -79;
          } else {
              $scope.settings = settings;
              console.log(JSON.stringify($scope.settings));
          }
          if ($scope.settings.latitude == 30) {
              if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError);
              } else {
                  $scope.load();
              }
          } else {
              $scope.load();
          }
      }

      function supportsSpeechSynthesis() {
          var answer = 'speechSynthesis' in window;
          return answer;
      }

      function geoLocationSuccess(position) {
          console.log("geoLocationSuccess");
          $scope.settings.latitude = position.coords.latitude;
          $scope.settings.longitude = position.coords.longitude;
          $scope.saveSettings();
          $scope.load();
      }

      function geoLocationError() {
          console.log("geoLocationError");
          $scope.settings.latitude = 30;
          $scope.settings.longitude = -79;
          $scope.load();
      }
      $scope.restoreSettings();
  });
