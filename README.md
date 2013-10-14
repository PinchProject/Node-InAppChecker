# IAPChecker

An iOS in-application purchase receipt verifier.

## Contributors

* [objectiveSee](https://github.com/objectiveSee)


## How To

### Install

```
npm install iapc
```

### Use

```
var IAPChecker = require('iapc');

/*
	Create an instance of IAPChecker with a password used when verifying an 
	auto renewable receipt and a boolean to verify the receipt at Apple
	production or sandbox server.
*/

var iapc = new IAPChecker('MyPassword'[, true]);

checkReceipt(
	MyReceipt,
	function(err, data) {
		if (err) return console.log(err);
		
		// receipt is valid
	}
);
```

## API

* **`IAPChecker(password, production)`**

	Create an instance of IAPChecker. All parameters are optional. `password` must be set if you want to verify an auto-renewable subscription receipt, and set `production` to work in production environment.

* **`checkAutoRenewReceipt(receipt, callback)`**

	Check the auto renewable receipt. A password must be set when using this method. A response will be send back to the callback.

* **`checkReceipt(receipt, callback)`**

	Check receipt. A response will be send back to the callback.

* **`setPassword(password)`**

	Set the instance password.