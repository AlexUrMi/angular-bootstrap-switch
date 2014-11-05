'use strict';

angular.module('frapontillo.bootstrap-switch')
  .directive('bsSwitch', function ($timeout, $parse) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        switchActive: '@',
        switchOnText: '@',
        switchOffText: '@',
        switchOnColor: '@',
        switchOffColor: '@',
        switchAnimate: '@',
        switchSize: '@',
        switchLabel: '@',
        switchIcon: '@',
        switchWrapper: '@',
        switchRadioOff: '@'
      },
      link: function link(scope, element, attrs, controller) {
        /**
         * Return the true value for this specific checkbox.
         * @returns {Object} representing the true view value; if undefined, returns true.
         */
        var getTrueValue = function() {
          var trueValue = $parse(attrs.ngTrueValue)(scope);
          if (!angular.isString(trueValue)) {
            trueValue = true;
          }
          return trueValue;
        };

        var getModelValueFor = function(viewValue) {
          var value;
          if (viewValue === true) {
            value = attrs.ngTrueValue;
          } else if (viewValue === false) {
            value = attrs.ngFalseValue;
          }
          return $parse(value)(scope);
        };

        /**
         * Listen to model changes.
         */
        var listenToModel = function () {

          scope.$watch('switchRadioOff', function (newValue) {
            element.bootstrapSwitch('radioAllOff', (newValue === true || newValue === 'true'));
          });

          // When the model changes
          controller.$formatters.push(function (newValue) {
            $timeout(function() {
              if (newValue !== undefined) {
                element.bootstrapSwitch('state', (newValue === getTrueValue()), true);
              }
            });
          });

          scope.$watch('switchActive', function (newValue) {
            var active = newValue === true || newValue === 'true' || !newValue;
            element.bootstrapSwitch('disabled', !active);
          });

          scope.$watch('switchOnText', function (newValue) {
            element.bootstrapSwitch('onText', getValueOrUndefined(newValue));
          });

          scope.$watch('switchOffText', function (newValue) {
            element.bootstrapSwitch('offText', getValueOrUndefined(newValue));
          });

          scope.$watch('switchOnColor', function (newValue) {
            attrs.dataOn = newValue;
            element.bootstrapSwitch('onColor', getValueOrUndefined(newValue));
          });

          scope.$watch('switchOffColor', function (newValue) {
            attrs.dataOff = newValue;
            element.bootstrapSwitch('offColor', getValueOrUndefined(newValue));
          });

          scope.$watch('switchAnimate', function (newValue) {
            element.bootstrapSwitch('animate', scope.$eval(newValue || 'true'));
          });

          scope.$watch('switchSize', function (newValue) {
            element.bootstrapSwitch('size', newValue);
          });

          scope.$watch('switchLabel', function (newValue) {
            element.bootstrapSwitch('labelText', newValue ? newValue : '&nbsp;');
          });

          scope.$watch('switchIcon', function (newValue) {
            if (newValue) {
              // build and set the new span
              var spanClass = '<span class=\'' + newValue + '\'></span>';
              element.bootstrapSwitch('labelText', spanClass);
            }
          });

          scope.$watch('switchWrapper', function (newValue) {
            // Make sure that newValue is not empty, otherwise default to null
            if (!newValue) {
              newValue = null;
            }
            element.bootstrapSwitch('wrapperClass', newValue);
          });
        };

        /**
         * Listen to view changes.
         */
        var listenToView = function () {
          // When the switch is clicked, set its value into the ngModel
          element.on('switchChange.bootstrapSwitch', function (e, data) {
            scope.$apply(function () {
              controller.$modelValue = getModelValueFor(data);
            });
          });
        };

        /**
         * Returns the value if it is truthy, or undefined.
         *
         * @param value The value to check.
         * @returns the original value if it is truthy, {@link undefined} otherwise.
         */
        var getValueOrUndefined = function (value) {
          return (value ? value : undefined);
        };

        // Bootstrap the switch plugin
        element.bootstrapSwitch({
          state: controller.$modelValue === getTrueValue()
        });

        // Listen and respond to model changes
        listenToModel();

        // Listen and respond to view changes
        listenToView();

        // On destroy, collect ya garbage
        scope.$on('$destroy', function () {
          element.bootstrapSwitch('destroy');
        });
      }
    };
  })
  .directive('bsSwitch', function () {
    return {
      restrict: 'E',
      require: 'ngModel',
      template: '<input bs-switch>',
      replace: true
    };
  });
