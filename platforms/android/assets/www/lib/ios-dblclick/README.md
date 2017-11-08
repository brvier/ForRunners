# iosDblclick
Directive to handle double click event for web application running on iOS Safari (it works on every browser, but was made because iOS Safari doesn't recognize dblclick event).

Use it exactly like `ng-dblclick` directive by passing it a function to execute when event is triggered.

## Usage
```html
<div ios-dblclick="myMethod()"></div>
```

## Installation
Get source file using bower or simply download it from Github.
```
bower install --save ios-dblclick
```

Include `ios-dblclick.js` in your `index.html` file.
```html
<script src="bower_components/ios-dblclick/ios-dblclick.js"></script>
```

Then include iosDblclick as a dependency in your angular module.
```javascript
angular.module('myApp', ['iosDblclick']);
```

## Contributing
Feel free to open issue or submit pull request to improve this directive !

## License
This directive is published under MIT license, see LICENSE file.
