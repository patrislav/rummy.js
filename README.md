# Rummy.js [![Build Status][travis-image]][travis-url] [![NPM Version][npm-image]][npm-url]

Rummy.js is a Javascript library for managing Rummy games.

**Warning!** This library is currently under heavy development. The API is
unstable and may change at any moment without prior notice. Use at your own
risk.

## Installation

```bash
$ npm install rummy
```

## Usage

```javascript
// Using ES5 require()
var Rummy = require('rummy').Rummy,
    rummy = new Rummy(options);

// Using ES2015 modules
import Rummy from 'rummy';
var rummy = new Rummy(options);
```

## API

### Constructor

The Rummy() constructor takes an optional parameter with initial configuration.
Consult the `.options` method for reference.

```javascript
// Create with default configuration
var rummy = new Rummy();

// Equivalent to rummy.options({ minMeld: 30 })
var rummy = new Rummy({ minMeld: 30 });
```

### .isValidGroup

Returns true if the supplied group is valid or false if it's not.

```javascript
// The two calls are equivalent and return true
rummy.isValidGroup('8s 9s 10s X Qs');
rummy.isValidGroup(['8s', '9s', '10s', 'X', 'Qs']);
```

### .options

When this method is called with no parameters it will return an object with all
current options.

```javascript
var options = rummy.options();
```

When it's called with a string it will return the value of the option.

```javascript
var minMeld = rummy.options('minMeld');
```

When it's called with an object it will merge the object into the configuration.

```javascript
rummy.options({ minMeld: 30 });
var minMeld = rummy.options('minMeld'); // will return 30
```

## Licence

Copyright (c) 2016, Patryk Kalinowski

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

[travis-image]: https://img.shields.io/travis/patrislav/rummy.js/master.svg
[travis-url]: https://travis-ci.org/patrislav/rummy.js
[npm-image]: https://img.shields.io/npm/v/rummy.svg
[npm-url]: https://npmjs.org/package/rummy
