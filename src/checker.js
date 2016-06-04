import StreamParser from 'stream-dbf';
import iconv from 'iconv-lite';
import Promise from 'bluebird';
import { EventEmitter } from 'events';
import ChainValidator, {
  Types as T,
} from 'chainable-validator';

export const Types = T;

function validate(formula, records, done) {
  const validator = new ChainValidator(formula, {
    log: false,
  });
  const errors = [];

  validator.on('error', (e) => errors.push(e));

  records.forEach((record) => validator.validate(record));

  if (errors.length) {
    throw errors;
  } else {
    done(records);
  }
}

export class Checker extends EventEmitter {
  constructor(file, options = {
    encoding: 'utf8',
  }) {
    super();

    const parser = new StreamParser(file);

    // Set to buffer reader
    parser.header.fields.forEach((field) => {
      field.raw = true;
    });

    this.readStream = parser.stream;
    this.encoding = options.encoding;
    this.records = [];
    this.isRead = false;

    this.readStream.on('data', (record) => {
      Object.keys(record).forEach((key) => {
        if (Buffer.isBuffer(record[key])) {
          record[key] = iconv.decode(record[key], this.encoding);
        }
      });

      this.records.push(record);
    });

    this.readStream.on('end', () => {
      this.emit('fileRead', this.records);
      this.isRead = true;
    });
  }

  check(formula = {}) {
    return new Promise((resolve, reject) => {
      if (this.isRead) {
        try {
          validate(formula, this.records, resolve);
        } catch (errRefs) {
          const err = new Error('Validate Failed.');
          err.refs = errRefs;

          reject(err);
        }
      } else {
        this.once('fileRead', (records) => {
          try {
            validate(formula, records, resolve);
          } catch (errRefs) {
            const err = new Error('Validate Failed.');
            err.refs = errRefs;

            reject(err);
          }
        });
      }
    });
  }
}

Checker.Types = T;

export default Checker;
