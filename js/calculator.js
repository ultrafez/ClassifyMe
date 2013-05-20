function CalculatorCtrl($scope, localStorageService) {
  // Define the default years/modules data for new users
  var defaultYearData = [
    {"year": 2, "modules": [
      // {"name": "Test Module", "isSingleRow": false, "credits": 10, "assessments": [
      //   {"name": "Assignment", "weight": 50, "mark": 80},
      //   {"name": "Exam", "weight": 50, "mark": 74}
      // ]},
      // {"name": "Test Module 2", "isSingleRow": true, "credits": 10, "assessments": []},
    ]},
    {"year": 3, "modules": [
      // {"name": "Test Module 3", "isSingleRow": true, "credits": 120, "assessments": []},
    ]}
  ];

  // Set default data for new users
  $scope.years = defaultYearData;
  $scope.degreeLength = 3;

  // Load saved data from local storage into Angular model
  $scope.loadLocalStorage = function() {
    if (!localStorageService.isSupported()) return;

    if (localStorageService.get('degreeLength') == null) return;

    $scope.degreeLength = parseInt(localStorageService.get('degreeLength'));
    $scope.years = jQuery.parseJSON(localStorageService.get('years'));
  }

  // Save current data into local storage
  $scope.saveLocalStorage = function() {
    if (!localStorageService.isSupported()) return;

    localStorageService.add('degreeLength', $scope.degreeLength);
    localStorageService.add('years', JSON.stringify($scope.years));
  }

  // Reset the whole form
  $scope.resetData = function() {
    if (confirm("Are you sure you want to reset all of your entered information?")) {
      $scope.degreeLength = 3;
      $scope.years = defaultYearData;
    }
  }

  // Is saving/loading of user data possible?
  $scope.savingAvailable = function() {
    return localStorageService.isSupported();
  }

  $scope.$watch('degreeLength', function(newValue, oldValue) {
    if (newValue === oldValue) return;

    if (newValue == 4 && oldValue == 3) {
      $scope.years.push({"year": 4, "modules": []});
      return;
    }

    if (newValue == 3 && oldValue == 4) {
      $scope.years.splice(2, 1);
      return;
    }
  });

  // When the user changes any of their module data, save it to local storage.
  $scope.$watch('years', function(newValue, oldValue) {
    if (newValue === oldValue) return;

    // Save the data to local storage for user convenience
    $scope.saveLocalStorage();
  }, true);

  // Load saved data on page load
  $scope.loadLocalStorage();


  /* YEARS */


  $scope.totalCredits = function(year) {
    total = 0;
    angular.forEach(year.modules, function(value, key) {
      if (value.credits !== undefined) {
        total += value.credits;
      }
    });
    return total;
  }

  // How many credits are needed to complete the year?
  $scope.creditsNeeded = function(year) {
    return 120 - $scope.totalCredits(year);
  }

  // If the user has entered modules worth more than 120 credits total, how many credits over are they?
  $scope.creditsOver = function(year) {
    return Math.max(0, $scope.totalCredits(year) - 120);
  }

  // Calculate the overall mark for the year (excluding modules with invalid credits or marks)
  $scope.yearMark = function(year) {
    yearMark = 0;
    angular.forEach(year.modules, function(module, key) {
      if (module.credits !== undefined) {
        yearMark += $scope.moduleMark(module) * (module.credits / 120);
      }
    });
    return yearMark;
  }


  /* MODULES */


  $scope.addModule = function(yearIndex) {
    $scope.years[yearIndex].modules.push({"name": "", "credits": 10, "isSingleRow": true, "assessments": [{"name": "Whole Module", "weight": 100, "mark": 70}] });
  }

  $scope.deleteModule = function(year, moduleIndex) {
    year.modules.splice(moduleIndex, 1);
  }

  // Calculate the mark for the module as a weighted sum of the marks of the assessments.
  $scope.moduleMark = function(module) {
    moduleMark = 0;
    angular.forEach(module.assessments, function(assessment, key) {
      if (assessment.mark !== undefined && assessment.weight !== undefined) {
        moduleMark += assessment.mark * (assessment.weight / 100);
      }
    });
    return moduleMark;
  }

  // Get the total weighting of the assessments in the module.
  $scope.totalWeight = function(module) {
    total = 0;
    angular.forEach(module.assessments, function(assessment, key) {
      if (assessment.weight !== undefined) {
        total += assessment.weight;
      }
    });
    return total;
  }

  // Convert a single-row module (where the user can enter their mark) into one where the assessments can be entered manually.
  $scope.convertToMultiple = function(module) {
    module.isSingleRow = false;
  }


  /* ASSESSMENTS */


  $scope.addAssessment = function(module) {
    module.assessments.push({"name": "", "weight": "", "mark": ""});
  }

  $scope.duplicateAssessment = function(module, assessmentIndex) {
    console.log(module.assessments[assessmentIndex]);
    module.assessments.push(angular.copy(module.assessments[assessmentIndex]));
  }

  $scope.deleteAssessment = function(module, assessmentIndex) {
    module.assessments.splice(assessmentIndex, 1);
  }

}