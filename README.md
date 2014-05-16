# Node-InAppChecker

![dependencies](https://david-dm.org/PinchProject/Node-InAppChecker.png)

## Install

```
[sudo] npm install node-inapp-checker
```

## Usage

```javascript
var IAPChecker = require('node-inapp-checker');

/*
	Create an instance of IAPChecker with a secret used when verifying an 
	auto renewable receipt and a boolean to verify the receipt at Apple
	production or sandbox server.
*/
var iap = new IAPChecker(/* secret */, /* production */);

checkReceipt(/* well formatted receipt */, function(err, valid, message, data){
	if (!err) {
		/* check that the product_id of the receipt matches the product_id of your In-App Purchase */
		if ( data.receipt.product_id !== /* Your Product ID (String) */ ) {
			/* do something if the user is using a fake receipt. */
		}
	
	
		/* do something if OK */
	} else {
		/* do something if there is an error */
	}
});
```

## API

* **`checkAutoRenewReceipt(receipt, callback)`**

	Check the auto renewable receipt. A secret must be set when using this method. A response will be send back to the callback.

* **`checkReceipt(receipt, callback)`**

	Check receipt. A response will be send back to the callback.

* **`setSecret(secret)`**

	Set the instance secret.


## Fake Purchases That Pass Validation

From [Hussain Fakhruddin's blog](http://blog.hussulinux.com/2013/04/apple-ios-in-app-purchase-hacking-how-to-prevent-specially-com-zeptolab-ctrbonus-superpower1-hacks/comment-page-1/#comment-33261):

Many jailbroken iOS devices just change the outgoing purchase receipt to an existing valid purchase receipt. (There are background apps to do this). Our server will then send this to Apple server for verification and guess what, apple will send a confirmation! A sheer good trick. But we’re smarter. Check if the product id is one of your products or not. If not, just cancel it out. The most famous spoofed product id is **com.zeptolab.ctrbonus.superpower1**.  If you encounter any product ID apart from your own, then simply block them. They are not genuine at all!



## License

(The MIT License)

Copyright (C) 2013 PinchProject

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Change log

#### v0.1.1

* update package module version(s)
* add **david-dm.org** support

#### v0.1.0

* first release
