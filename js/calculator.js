function CalculatorCtrl($scope) {
  $scope.years = [
    {"year": 2, "modules": [
      // {"name": "Test Module", "credits": 10, "assessments": [
      //   {"name": "Assignment", "weight": 50, "mark": 80},
      //   {"name": "Exam", "weight": 50, "mark": 74}
      // ]},
      // {"name": "Test Module 2", "credits": 10, "assessments": []},
    ]},
    {"year": 3, "modules": [
      // {"name": "Test Module 3", "credits": 120, "assessments": []},
    ]}
  ];

  $scope.degreeLength = 3;

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

  $scope.addModule = function(yearIndex) {
    $scope.years[yearIndex].modules.push({"name": "", "credits": 10, "assessments": []});
  }

  $scope.deleteModule = function(year, moduleIndex) {
    year.modules.splice(moduleIndex, 1);
  }

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
}