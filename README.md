jQueryUi-Unobtrusive
====================

Unobtrusive library for jQueryUi

The library use "data-" attributes to find the jQueryUi widgets.
By default use the function name after the prefix and the value of the attribute will be the JSON representation of the options. (data-button='{"icons":{"primary":"ui-icon-alert"}}')
Note that JSON not handling function names so you have to put quotes like any other string and the library will resolve it to function reference. You can select funtion by path originated from window object (default) separate the object names with dots (default) like "myViewObject.OnOkClick" which will be resolved as window.myViewObject.OnOkClick.
