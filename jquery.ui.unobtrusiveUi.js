/*! jQueryUI Unobtrusive - v1.0 - 2013-08-14
https://github.com/rpety/jQueryUi-Unobtrusive
* Copyright 2013 Réfi Péter; Licensed GPL V2 */

(function ($) {
  var defaultUiElements = function () {
    return [
      {
        name: "accordion",
        functions: []
      },
      {
        name: "autocomplete",
        functions: ["source","position.using"]
      },
      {
        name: "button",
        functions: []
      },
      {
        name: "datepicker",
        functions: ["beforeShow", "beforeShowDay", "calculateWeek", "onChangeMonthYear", "onClose", "onSelect"]
      },
      {
        name: "dialog",
        functions: []
      },
      {
        name: "menu",
        functions: []
      },
      {
        name: "progressbar",
        functions: []
      },
      {
        name: "slider",
        functions: []
      },
      {
        name: "spinner",
        functions: ["incremental"]
      },
      {
        name: "tabs",
        functions: []
      },
      {
        name: "tooltip",
        functions: ["content"]
      },
      {
        name: "draggable",
        functions: ["helper"]
      },
      {
        name: "droppable",
        functions: ["accept"]
      },
      {
        name: "resizable",
        functions: []
      },
      {
        name: "selectable",
        functions: []
      },
      {
        name: "sortable",
        functions: ["helper"]
      },
    ];
  };

  $.widget("ui.unobtrusiveUi", {
    version: "1.0.0",
    defaultElement: "<body>",
    options:
    {
      controls: defaultUiElements(),
      attributePrefix: "",
      functionSeparator: ".",
      functionRootObject: window
    },
    _create: function () {
      this._findTargets();
      for (var i = 0; i < this.targets.length; i++) {
        var currentTarget = this.targets[i];
        var currentControl = this.targets[i].control;
        for (var j = 0; j < currentTarget.elements.length; j++) {
          var currentElement = currentTarget.elements[j];
          var optionsValue = currentElement.attr(this._getAttributeName(currentControl.name));
          var parseSucceed = true;
          var options = undefined;
          if (optionsValue !== undefined && optionsValue !== "") {
            try {
              options = JSON.parse(optionsValue);
            } catch (e) {
              this._reportError("Can't parse options.", currentElement);
              parseSucceed = false;
            }
          } else {
            options = {};
          }
          if (parseSucceed) {
            for (var k = 0; k < currentControl.functions.length; k++) {
              var currentFunction = currentControl.functions[k];
              this._changeStringToFunction(currentFunction, options);
            }
            if (typeof currentElement[currentControl.name] === "function") {
              currentElement[currentControl.name](options);
            } else {
              this._reportError('Missing widget function("' + currentControl.name + '")', currentElement);
            }
          }
        }
      }
    },
    _destroy: function () {
      this._findTargets();
      for (var i = 0; i < this.targets.length; i++) {
        var currentTarget = this.targets[i];
        var currentControl = currentTarget.control;
        for (var j = 0; j < currentTarget.elements.length; j++) {
          var currentElement = currentTarget.elements[j];
          if (typeof currentElement[currentControl.name] === "function") {
            currentElement[currentControl.name]("destroy");
          } else {
            this._reportError('Missing widget function("' + currentControl.name + '")', currentElement);
          }
        }
      }
    },
    _findTargets: function () {
      this.targets = [];
      for (var i = 0; i < this.options.controls.length; i++) {
        var currentControl = this.options.controls[i];
        var attributeName = this._getAttributeName(currentControl.name);
        var currentTarget = {};

        currentTarget.control = currentControl;
        currentTarget.elements = [];
        this.element.find("[" + attributeName + "]").each(function () {
          currentTarget.elements.push($(this));
        });
        this.targets.push(currentTarget);
      }
    },
    _getAttributeName: function (name) {
      if (this.options.attributePrefix === "") {
        return "data-" + name;
      } else {
        return "data-" + this.options.attributePrefix + "-" + name;
      }
    },
    _changeStringToFunction: function (functionPath, options) {
      if (functionPath === undefined || functionPath === null) return;

      var pathParts = functionPath.split(this.options.functionSeparator);
      var currentObject = options;
      for (var i = 0; i < pathParts.length - 1; i++) {
        currentObject = currentObject[pathParts[i]];
        if (currentObject === undefined) return;
      }
      var currentValue = currentObject[pathParts[pathParts.length - 1]];
      if (typeof currentValue !== "string") return;
      var functionReference = this._resolveFunction(currentValue);
      if (typeof functionReference !== "function") return;
      currentObject[pathParts[pathParts.length - 1]] = functionReference;
    },
    _resolveFunction: function (functionPath) {
      if (functionPath === undefined || functionPath === null) return undefined;

      var pathParts = functionPath.split(this.options.functionSeparator);
      var currentObject = this.options.functionRootObject;
      for (var i = 0; i < pathParts.length; i++) {
        currentObject = currentObject[pathParts[i]];
        if (currentObject === undefined) break;
      }

      return typeof currentObject === "function" ? currentObject : undefined;
    },
    _reportError: function (msg, element) {
      var report = 'Error occured in process the elements. Message:"' + msg + '"';
      if (element[0] !== undefined && element[0] !== null && element[0]["outerHTML"] != undefined) {
        report += " Element: " + element[0].outerHTML;
      }
      console.log(report);
    }
  });

  $(document).ready(function () {
    $(document).unobtrusiveUi();
  });
})(jQuery);
