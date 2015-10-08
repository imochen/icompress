# imgcompress

> base on imagemin for image compress

## Install

```javascript
npm install icompress
```

## Usage

```javascript

var icompress = require('icompress');

icompress('images/*.{gif,jpg,png}','images/min/').then(function( res ){
	//do something	
});

/**
 * @param  {[path]} src  [image path]
 * @param  {[dir]} dest [output dirname]
 * @return {[object]}      [promise]
 */

/*
@return
{
	original : 17004,
	result : 9750,
	src : '/var/www/tmp/image.jpg'
}
 */
}

```