function CalculatorCtrl($scope) {
  $scope.years = [
    {"year": 2, "modules": [
      {"name": "Test Module", "credits": 10, "components": [
        {"name": "Assignment", "weight": 50, "mark": 80},
        {"name": "Exam", "weight": 50, "mark": 74}
      ]},
      {"name": "Test Module 2", "credits": 10, "components": []},
    ]},
    {"year": 3, "modules": [
      {"name": "Test Module 3", "credits": 120, "components": []},
    ]}
  ];
}