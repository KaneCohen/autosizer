# Autosizer

Apply to any textarea on the page and let it automatically resize to fit  
any text typed or pasted inside.

Demo: <http://kanecohen.github.io/autosizer/>

## Usage

Autosizer can be inserted into page as an ordinary script, or it could be  
loaded as an AMD or CommonJS module.

Autosizer also support usage as a jQuery plugin, but jQuery is **not required**.

````
var Autosizer = require('autosizer');
var as = new Autosizer('.my-textarea');
````

## Options

Besides an element, autosizer accepts an object with several possible options  

`follow: true` When set to true, scrollbar will always try to stay in a constant  
position related to where typing caret is located.

`viewportMargin: null` Limits maximum height before textarea hits bottom of the  
viewport.
