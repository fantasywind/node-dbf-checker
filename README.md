# node-dbf-checker
Check DBF field value format

## Usage

```javascript
// ES6
import Checker, {
  Types as T,
} from 'node-dbf-checker';

const checker = new Checker('./path/to/dbf/file', {
  encoding: 'big5', // default utf8
});

checker.check({
  NAME: T.string.len(5).isRequired,
  AGE: T.number,
}).then((records) => {
  // do something...
}).catch((errors) => {
  // error handler
});
```
