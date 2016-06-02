# node-dbf-checker
Check DBF field value format

## Usage

```
const Checker = require('node-dbf-checker');

const checker = new Checker('./path/to/dbf/file', {
  encoding: 'big5' // default utf8
});

checker.check({
  NAME: Checker.Types.STRING(5).isRequired,
  AGE: Checker.Types.INTEGER,
  LATITUDE: Checker.Types.FLOAT,
}).then((records) => {
  // do something...
}).catch((err) => {
  // error handler
});
```
