angular.module('uploadr.controllers') 
  .controller('HomeCtrl', ['$scope', '$http',
    function($scope, $http) {

      function csvToArray(strData) {
        var strDelimiter = ",",
              objPattern = new RegExp(("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                                      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                                      "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");

        var arrData = [[]];
        var arrMatches = null;

        while (arrMatches = objPattern.exec(strData)) {
          var strMatchedDelimiter = arrMatches[1];
          if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            arrData.push([]);
          }
          if (arrMatches[2]) {
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
          } else {
            var strMatchedValue = arrMatches[3];
          }
          arrData[arrData.length - 1].push(strMatchedValue);
        }
        return (arrData);
      }

      function convertCsvToJsonData(csvFile) {
        var lines = csvToArray(csvFile),
           result = [],
          headers = lines[0];

        for(var i = 1; i < lines.length; i++) {
          obj = {},
          currentline = lines[i];

          for(var j = 0; j < headers.length; j++) {
            var attributesAreDefined = (headers[j] && currentline[j]);
            var attributesAreValid = attributesAreDefined && (headers[j].trim() !== "" && currentline[j].trim() !== "");

            if(attributesAreValid) {
              obj[headers[j]] = currentline[j];
            }
          }

          if(_.keys(obj).length) {
            result.push(obj);
          }
        }

        return result;
      }

      function loadCsvFile() {
        $scope.processing = true;
        var file = document.querySelector('#csv-input').files[0];

        if(file) {
          var reader = new FileReader();
          reader.readAsText(file);
        }

        reader.onload = function(event) {
          var textFile =  event.target.result;
          var result = convertCsvToJsonData(textFile);

          if(result.length) {
            $http.post('/import_to_database', {
              csvArray: result
            })
            .success(function(resp) {
              $scope.processing = false;
              alert('success');
            })
            .error(function(err) {
              $scope.processing = false;
              alert(err);
            });
          }
        };
      }

      $scope.initialize = function() {
        var csvFileElement = angular.element(document.querySelector('#csv-input'));
        
        csvFileElement.on('change', loadCsvFile);
      };
    }
  ]
);
