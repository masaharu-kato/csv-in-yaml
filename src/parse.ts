import YAML from 'yaml';
import { Reviver } from 'yaml/dist/doc/applyReviver';

interface CSVKeyOptions {
  header: string;
  rows: string;
  type: string;
}

type CSVObjects = {
  [name: number | string]: (row: { [k: string]: unknown }) => any;
};

interface CustomOptions {
  csv_keys?: CSVKeyOptions;
  csv_objects: CSVObjects;
}

class CustomReviver {
  more_reviver: Reviver;
  csv_keys?: CSVKeyOptions;
  csv_objects: CSVObjects;

  constructor(reviver?: Reviver, options?: CustomOptions) {
    this.more_reviver = reviver ? reviver : (_, v) => v;
    this.csv_keys = options?.csv_keys;
    this.csv_objects = options?.csv_objects ?? {};
  }

  reviver(key: unknown, value: unknown) {
    //  Revive CSV
    const value_with_csv = this.#_get_result(value);
    return this.more_reviver(key, value_with_csv);
  }

  #_get_result(value: unknown) {
    if (this.csv_keys === undefined) return value;
    if (!(value instanceof Object && this.csv_keys.rows in value)) return value;
    const data = value as { [k: string]: unknown };
    const rows = assume_array(data[this.csv_keys.rows]);
    const header = assume_array(data[this.csv_keys.header]);
    const type = String(data[this.csv_keys.type]);
    if (header) {
      if (type) {
        return rows.map((row) =>
          this.csv_objects[type](
            Object.fromEntries(header.map((k, i) => [k, row[i]]))
          )
        );
      }
      return rows.map((row) =>
        Object.fromEntries(header.map((k, i) => [k, row[i]]))
      );
    }
    if (type) {
      return rows.map((row) => this.csv_objects[type](row));
    }
    return rows;
  }
}

function assume_array(obj: unknown): Array<any> {
  if (obj == null || !(typeof (obj as any)[Symbol.iterator] === 'function')) {
    throw new Error('object is not iterable.');
  }
  return obj as Array<any>;
}

type Options = YAML.ParseOptions &
  YAML.DocumentOptions &
  YAML.SchemaOptions &
  YAML.ToJSOptions &
  CustomOptions;

export function parse(src: string, options?: Options): unknown;
export function parse(
  src: string,
  reviver: Reviver,
  options?: Options
): unknown;

export function parse(
  src: string,
  _opts_or_reviv?: Options | Reviver,
  _opts?: Options
): unknown {
  const has_reviver = _opts_or_reviv instanceof Function;
  const _more_reviver = has_reviver ? _opts_or_reviv : undefined;
  const _options = has_reviver ? _opts : _opts_or_reviv;
  const reviv = new CustomReviver(_more_reviver, _options);
  return YAML.parse(
    src,
    (k: unknown, v: unknown) => reviv.reviver(k, v),
    _options
  );
}
