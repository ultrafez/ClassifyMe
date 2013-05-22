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
  $scope.hasStarted = false;
  $scope.years = defaultYearData;
  $scope.degreeLength = 3;
  $scope.classification = null;
  $scope.medianIndex = 35; // array index for the median module score
  $scope.higherIndex = 29; // array index for the just-above median module score

  // Define regex validation for credits - multiples of 5
  $scope.creditsRegex = /^[0-9]*[05]$/;
  $scope.integerRegex = /^[0-9]+$/;

  // Load saved data from local storage into Angular model
  $scope.loadLocalStorage = function() {
    if (!localStorageService.isSupported()) return;

    if (localStorageService.get('degreeLength') == null) return;

    $scope.hasStarted = localStorageService.get('hasStarted') == "true"
    $scope.degreeLength = parseInt(localStorageService.get('degreeLength'));
    $scope.years = jQuery.parseJSON(localStorageService.get('years'));
    $scope.classification = jQuery.parseJSON(localStorageService.get('classification'));
  }

  // Save current data into local storage
  $scope.saveLocalStorage = function() {
    if (!localStorageService.isSupported()) return;

    localStorageService.add('hasStarted', $scope.hasStarted.toString());
    localStorageService.add('degreeLength', $scope.degreeLength);
    localStorageService.add('years', JSON.stringify($scope.years));
    localStorageService.add('classification', JSON.stringify($scope.classification));
  }

  // Reset the whole form
  $scope.resetData = function() {
    if (confirm("Are you sure you want to reset all of your entered information?")) {
      $scope.hasStarted = false;
      $scope.degreeLength = 3;
      $scope.classification = null;
      $scope.years = defaultYearData;
    }
  }

  // Is saving/loading of user data possible?
  $scope.savingAvailable = function() {
    return localStorageService.isSupported();
  }

  $scope.begin = function() {
    $scope.hasStarted = true;
  }

  $scope.$watch('degreeLength', function(newValue, oldValue) {
    if (newValue == 4) {
      // Set the grade distribution indices (used in the classification calculation to work out the median and just-above the median)
      $scope.medianIndex = 59;
      $scope.higherIndex = 49;
    } else {
      // Set the grade distribution indices (used in the classification calculation to work out the median and just-above the median)
      $scope.medianIndex = 35;
      $scope.higherIndex = 29;
    }

    if (newValue === oldValue) return;

    if (newValue == 4 && oldValue == 3) {
      // Add 4th year into the "years" array
      $scope.years.push({"year": 4, "modules": []});
      return;
    }

    if (newValue == 3 && oldValue == 4) {
      // Remove the 4th year
      $scope.years.splice(2, 1);
      return;
    }
  });

  // When the user changes any of their module data, save it to local storage.
  $scope.$watch('years', function(newValue, oldValue) {
    if (newValue === oldValue) return;

    // Calculate the final degree classification.
    $scope.calculateClassification();

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
    return Math.round(moduleMark); // apply rounding to the nearest integer for module scores
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
    module.assessments.push(angular.copy(module.assessments[assessmentIndex]));
  }

  $scope.deleteAssessment = function(module, assessmentIndex) {
    module.assessments.splice(assessmentIndex, 1);
  }


  /* CLASSIFICATION */


  // Calculate the student's degree classification based on the information they have entered.
  $scope.calculateClassification = function() {
    /* DEFINE GRADE BANDS */
    // First grade band is used for the weighted average band
    var GRADE_BANDS_1 = [
      {name: "First",                 lower: 69.5,  upper: 101,   isBorderline: false}, // not 100, because the check performed is "x < upper", and x=100 would fail that check
      {name: "First/2.1 borderline",  lower: 68,    upper: 69.5,  isBorderline: true},
      {name: "2.1",                   lower: 59.5,  upper: 68,    isBorderline: false},
      {name: "2.1/2.2 borderline",    lower: 58,    upper: 59.5,  isBorderline: true},
      {name: "2.2",                   lower: 49.5,  upper: 58,    isBorderline: false},
      {name: "2.2/Third borderline",  lower: 48,    upper: 49.5,  isBorderline: true},
      {name: "Third",                 lower: 44.5,  upper: 48,    isBorderline: false},
      {name: "Third/Pass borderline", lower: 43.5,  upper: 44.5,  isBorderline: true},
      {name: "Pass",                  lower: 39.5,  upper: 43.5,  isBorderline: false},
      {name: "Pass/Fail borderline",  lower: 38,    upper: 39.5,  isBorderline: true},
      {name: "Fail",                  lower: 0,     upper: 38,    isBorderline: false}
    ];

    // Second grade band is used for the grade distribution band
    var GRADE_BANDS_2 = [
      {name: "First", lower: 69.5,  upper: 101,  fullBandEquivalentIndex: 0}, // not 100, because the check performed is "x < upper", and x=100 would fail that check
      {name: "2.1",   lower: 59.5,  upper: 69.5, fullBandEquivalentIndex: 2}, // fullBandEquivalentIndex is the index of GRADE_BANDS_1 that contains the equivalent band. Used in calculation 2.
      {name: "2.2",   lower: 49.5,  upper: 59.5, fullBandEquivalentIndex: 4},
      {name: "Third", lower: 44.5,  upper: 49.5, fullBandEquivalentIndex: 6},
      {name: "Pass",  lower: 39.5,  upper: 44.5, fullBandEquivalentIndex: 8},
      {name: "Fail",  lower: 0,     upper: 39.5, fullBandEquivalentIndex: 10}
    ];

    // Table of conversions between the first and second calculation grade bands, and the outcome band. Taken from the guidance PDF.
    var CLASSIFICATION_COMBINATIONS = [
      {calc1: 0,  calc2: 0,   outcomeBand: 0},
      {calc1: 0,  calc2: 1,   outcomeBand: 0},
      {calc1: 0,  calc2: 2,   outcomeBand: 1},
      {calc1: 1,  calc2: 0,   outcomeBand: 0},
      {calc1: 1,  calc2: 1,   outcomeBand: 1},
      {calc1: 1,  calc2: 2,   outcomeBand: 2},
      {calc1: 2,  calc2: 0,   outcomeBand: 1},
      {calc1: 2,  calc2: 1,   outcomeBand: 2},
      {calc1: 2,  calc2: 2,   outcomeBand: 2},
      {calc1: 2,  calc2: 3,   outcomeBand: 2},
      {calc1: 2,  calc2: 4,   outcomeBand: 3},
      {calc1: 3,  calc2: 2,   outcomeBand: 2},
      {calc1: 3,  calc2: 3,   outcomeBand: 3},
      {calc1: 3,  calc2: 4,   outcomeBand: 4},
      {calc1: 4,  calc2: 2,   outcomeBand: 3},
      {calc1: 4,  calc2: 3,   outcomeBand: 4},
      {calc1: 4,  calc2: 4,   outcomeBand: 4},
      {calc1: 4,  calc2: 5,   outcomeBand: 4},
      {calc1: 4,  calc2: 6,   outcomeBand: 5},
      {calc1: 5,  calc2: 4,   outcomeBand: 4},
      {calc1: 5,  calc2: 5,   outcomeBand: 5},
      {calc1: 5,  calc2: 6,   outcomeBand: 6},
      {calc1: 6,  calc2: 4,   outcomeBand: 5},
      {calc1: 6,  calc2: 5,   outcomeBand: 6},
      {calc1: 6,  calc2: 6,   outcomeBand: 6},
      {calc1: 6,  calc2: 7,   outcomeBand: 6},
      {calc1: 6,  calc2: 8,   outcomeBand: 7},
      {calc1: 7,  calc2: 6,   outcomeBand: 6},
      {calc1: 7,  calc2: 7,   outcomeBand: 7},
      {calc1: 7,  calc2: 8,   outcomeBand: 8},
      {calc1: 8,  calc2: 6,   outcomeBand: 7},
      {calc1: 8,  calc2: 7,   outcomeBand: 8},
      {calc1: 8,  calc2: 8,   outcomeBand: 8},
      {calc1: 8,  calc2: 9,   outcomeBand: 8},
      {calc1: 8,  calc2: 10,  outcomeBand: 9},
      {calc1: 9,  calc2: 8,   outcomeBand: 8},
      {calc1: 9,  calc2: 9,   outcomeBand: 9},
      {calc1: 9,  calc2: 10,  outcomeBand: 10},
      {calc1: 10, calc2: 8,   outcomeBand: 9},
      {calc1: 10, calc2: 9,   outcomeBand: 10},
      {calc1: 10, calc2: 10,  outcomeBand: 10}
    ];

    /* PREPARE GRADE PROFILE
     * Weight the modules by credit value, to take account of the fact that different modules may carry different credit values
     * For maximum compatibility with different module sizes, we convert all modules into 5-credit modules.
     */
    var yearsGrades = [];
    for (var i=0; i<$scope.years.length; i++) {
      year = $scope.years[i];
      var modulesGrades = [];
      for (var j=0; j<year.modules.length; j++) {
        var module = year.modules[j];
        if (module.credits !== undefined && module.credits % 5 == 0) {
          var mark = $scope.moduleMark(module);
          for (var k=0; k<module.credits/5; k++) {
            modulesGrades.push(mark);
          }
        } else {
          // A module has an invalid number of credits entered. The calculation cannot continue.
          $scope.classification = null;
          return;
        }
      }

      // There should be modules summing to 120 credits per year in a correctly filled-in form - if this isn't the case, stop now.
      if (modulesGrades.length != 120/5) {
        $scope.classification = null;
        return;
      }
      yearsGrades.push(modulesGrades);
    }

    /* Weight the module results by level, to take account of the fact that level 3 and 4 modules carry twice the weight of level 2 */
    yearsGrades[1].push.apply(yearsGrades[1], yearsGrades[1]); // third year
    if ($scope.degreeLength == 4) {
      yearsGrades[2].push.apply(yearsGrades[2], yearsGrades[2]); // fourth year
    }

    // Put all credits into one array, since knowing which year they came from isn't needed any more.
    var allGrades = yearsGrades[0].concat(yearsGrades[1]);
    if ($scope.degreeLength == 4) {
      allGrades = allGrades.concat(yearsGrades[2]);
    }


    /* CALCULATION 1: WEIGHTED AVERAGE GRADE
     * Calculate the average module percentage. This then determines the student's first grade band.
     */
    var weightedAverageGrade = 0;
    for (var i=0; i<allGrades.length; i++) {
      weightedAverageGrade += allGrades[i];
    }
    weightedAverageGrade /= allGrades.length;

    // Find the band that the weighted average falls in
    var weightedAverageGradeBandIndex;
    for (var bandIndex=0; bandIndex<GRADE_BANDS_1.length; bandIndex++) {
      band = GRADE_BANDS_1[bandIndex];
      if (weightedAverageGrade >= band.lower && weightedAverageGrade < band.upper) {
        weightedAverageGradeBandIndex = bandIndex;
        break;
      }
    }

    /* CALCULATION 2: DISTRIBUTION OF WEIGHTED GRADES
     * The median grade (36th for 3-year, 60th for 4-year) indicates the second grade band. Another grade is checked (30th for 3-year,
     * 50th for 4-year) to determine whether the student should be in the borderline band to the grade above. If the further-up grade
     * is in a higher band, then the outcome is the borderline band with the band above.
     */
    allGrades.sort(function(a,b) {return b - a;}); // sort numerically in descending order

    var medianGrade = allGrades[$scope.medianIndex];
    var higherGrade = allGrades[$scope.higherIndex];

    // Find the band for the two grades
    var medianBandIndex;
    var higherBandIndex;
    for (var bandIndex=0; bandIndex<GRADE_BANDS_2.length; bandIndex++) {
      band = GRADE_BANDS_2[bandIndex];
      if (medianGrade >= band.lower && medianGrade < band.upper) {
        medianBandIndex = bandIndex;
      }
      if (higherGrade >= band.lower && higherGrade < band.upper) {
        higherBandIndex = bandIndex;
      }
    }

    // If the two bands are the same, then the final band for calculation 2 is that band. If the "higher" band is of the next band up, then
    // the student gets the borderline band.
    var gradeDistributionBandIndex;
    if (medianBandIndex == higherBandIndex) {
      gradeDistributionBandIndex = GRADE_BANDS_2[medianBandIndex].fullBandEquivalentIndex;
    } else {
      gradeDistributionBandIndex = GRADE_BANDS_2[medianBandIndex].fullBandEquivalentIndex - 1; // -1 gets the borderline band for the band above
    }

    /* DETERMINE COMBINED CALCULATED DEGREE CLASS
     * The two calculated bands are combined to form an almost-final degree class.
     * For ease of reading and coding, the classification combination table from the guidance PDF will be used to look up the final classification.
     */
    var combinedClassificationBandIndex = -1; // -1 represents final classification not found, which happens in rare cases where the first and second calculation bands are too far apart.
    for (var classificationIndex=0; classificationIndex<CLASSIFICATION_COMBINATIONS.length; classificationIndex++) {
      var band = CLASSIFICATION_COMBINATIONS[classificationIndex];
      if (band.calc1 == weightedAverageGradeBandIndex && band.calc2 == gradeDistributionBandIndex) {
        combinedClassificationBandIndex = band.outcomeBand;
        break;
      }
    }


    /* DETERMINE FINAL DEGREE CLASS
     * For students whose combined band is borderline, the average weighted grade of modules taken in the final year is used to determine which classification
     * either side of the border the student should get.
     */
    var finalClassificationBandIndex;
    var weightedAverageFinalYearGrade = 0;
    if (combinedClassificationBandIndex != -1) {
      if (GRADE_BANDS_1[combinedClassificationBandIndex].isBorderline) {
        // Calculate average final year grade
        for (var i=0; i<yearsGrades[yearsGrades.length-1].length; i++) {
          weightedAverageFinalYearGrade += yearsGrades[yearsGrades.length-1][i];
        }
        weightedAverageFinalYearGrade /= yearsGrades[yearsGrades.length-1].length;

        // Find the band that the average final year grade belongs to
        for (var i=0; i<GRADE_BANDS_2.length; i++) {
          var band = GRADE_BANDS_2[i];
          if (weightedAverageFinalYearGrade >= band.lower && weightedAverageFinalYearGrade < band.upper) {
            finalClassificationBandIndex = band.fullBandEquivalentIndex;
            break;
          }
        }
      } else {
        // The combined grade isn't borderline, so no more calculation necessary
        finalClassificationBandIndex = combinedClassificationBandIndex;
      }
    } else {
      // The combined band grade wasn't calculable, so we can't calculate any further
      finalClassificationBandIndex = combinedClassificationBandIndex;
    }

    // Get the band object for the final classification
    var finalBandObject;
    if (finalClassificationBandIndex == -1) {
      finalBandObject = false;
    } else {
      finalBandObject = GRADE_BANDS_1[finalClassificationBandIndex];
    }

    var combinedBandObject;
    if (combinedClassificationBandIndex == -1) {
      combinedBandObject = false;
    } else {
      combinedBandObject = GRADE_BANDS_1[combinedClassificationBandIndex];
    }
    
    $scope.classification = {
      finalBand: finalBandObject,                                             // Object containing details of the final calculated classification band
      finalBandIncalculable: combinedBandObject===false,                      // Was the final band incalculable because the first and second calculation bands were too different?
      combinedBand: combinedBandObject,                                       // The band calculated by combining the first and second calculations. This is pre-adjustment for borderline bands.
      weightedAverageGradeBand: GRADE_BANDS_1[weightedAverageGradeBandIndex], // The band object for your weighted average module score.
      gradeDistributionBand: GRADE_BANDS_1[gradeDistributionBandIndex],       // The band object for your grade distribution.
      weightedAverageGrade: weightedAverageGrade,                             // The weighted average module score.
      weightedAverageFinalYearGrade: weightedAverageFinalYearGrade,           // The weighted average of the modules in the final year.
      allGrades: allGrades                                                    // An array of module scores (split into 5-credit units) in descending order.
    }
  }
}

// Enable popovers
$(function() {
  $('.js-activate-popover').popover();
  $('#grade-distribution .description').tooltip();
});