import StreamParser from 'stream-dbf';
import iconv from 'iconv-lite';
import Promise from 'bluebird';
import { EventEmitter } from 'events';

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

    this.readStream.on('data', (record) => {
      Object.keys(record).forEach((key) => {
        if (Buffer.isBuffer(record[key])) {
          record[key] = iconv.decode(record[key], this.encoding);
        }
      });
    });

    this.readStream.on('end', () => {
      this.emit('fileRead');
    });
  }

  check(formula = {}) {
    return new Promise((resolve) => {
      console.log('Formula', formula);

      resolve();
    });
  }
}

export default Checker;
