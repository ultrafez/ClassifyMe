function CalculatorCtrl($scope) {
  $scope.years = [
    {"year": 2, "modules": [
      {"name": "Test Module", "credits": 10, "assessments": [
        {"name": "Assignment", "weight": 50, "mark": 80},
        {"name": "Exam", "weight": 50, "mark": 74}
      ]},
      {"name": "Test Module 2", "credits": 10, "assessments": []},
    ]},
    {"year": 3, "modules": [
      {"name": "Test Module 3", "credits": 120, "assessments": []},
    ]}
  ];

  $scope.addModule = function(yearIndex) {
    $scope.years[yearIndex].modules.push({"name": "", "credits": "", "assessments": []});
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
}