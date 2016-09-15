  var app = angular.module('app', []);

  app.controller('Controller', function appControllerFunction($scope, $http) {
    $scope.phrases = [];
    $scope.settings = {};
    $http.get('/TextFeed2Images/JsonServlet?action=flashBriefing').success(
      function(data) {
        $scope.phrases = data;
        if (supportsSpeechSynthesis()) {
          for (var i = 0; i < $scope.phrases.length; i++) {
            var tts = new SpeechSynthesisUtterance();
            tts.lang = 'en-US';
            tts.text = $scope.phrases[i];
            console.log(new Date() + " " + $scope.phrases[i]);
            speechSynthesis.speak(tts);
          }
        }
      }
    );
    $scope.saveSettings = function() {
      localStorage.setItem("teamSettings", JSON.stringify($scope.settings));
    }
    $scope.restoreSettings = function() {
      var settings = null;
      if (localStorage.getItem("teamSettings") != null) {
        settings = JSON.parse(localStorage.getItem("teamSettings"));
      }
      if (settings == null) {
        console.log("Settings are null from localStorage");
      } else {
        $scope.settings = settings;
        console.log(JSON.stringify($scope.settings));
      }

    }

    function supportsSpeechSynthesis() {
      var answer = 'speechSynthesis' in window;
      var message = "<p>SpeechSynthesisUtterance supported: <b>" + answer + "</b></p><p>User agent: " + navigator.userAgent + ".</p><p><a href='" + location.href + "'>" + location.href + "</p>";
      document.getElementById("messageId").innerHTML = message;
      return answer;
    }
  });
