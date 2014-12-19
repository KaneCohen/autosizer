# Autosizer

Apply to any textarea on the page and let it automatically resize to fit  
any text typed or pasted inside.

Demo: <http://jsfiddle.net/bs5dLx7g/8/>

## Usage

Autosizer can be inserted into page as an ordinary script, or it could be  
loaded as an AMD or CommonJS module.

Autosizer also support usage as a jQuery plugin, but jQuery is **not required**.

````
// Use as a jQuery plugin.
$('textarea').autosizer();

// Use as an AMD module.
define(['autosizer', function(autosizer) {
  var el = document.getElementById('my-text');
  var as = new autosizer(el);
});
````

## Options

Besides an element, autosizer accepts an object with several possible options  

`maxHeight: null` (default) Set up a maximum height textarea could be resized up to.  
This option could be also set up via CSS as a `max-height` rule on a textarea.

`styles: []` List of styles which Autosizer will go over when creating invisible  
clone of a textarea. In most cases it should be left unchanged, since Autosizer  
covers most of the rules which might affect textarea.

Default styles are:  
'width', 'lineHeight', 'fontFamily', 'fontSize', 'fontWeight',  
'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing',  
'textIndent', 'boxSizing'
