import YAML from 'yaml';
import { Reviver } from 'yaml/dist/doc/applyReviver';

class CustomReviver {
  more_reviver: Reviver;

  constructor(reviver?: Reviver) {
    this.more_reviver = reviver ? reviver : (_, v) => v;
  }

  reviver(key: unknown, value: unknown) {
    //  TODO: Implement
    return this.more_reviver(key, value);
  }
}

type Options = YAML.ParseOptions &
  YAML.DocumentOptions &
  YAML.SchemaOptions &
  YAML.ToJSOptions;

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
  const reviv = new CustomReviver(_more_reviver);
  return YAML.parse(
    src,
    (k: unknown, v: unknown) => reviv.reviver(k, v),
    _options
  );
}
