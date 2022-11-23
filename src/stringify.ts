import YAML from 'yaml';
import { Replacer } from 'yaml/dist/doc/Document';

class CustomReplacer {
  more_replacer: (key: unknown, value: unknown) => unknown;

  constructor(replacer?: Replacer) {
    this.more_replacer = replacer
      ? replacer instanceof Array
        ? (k, v) => (replacer.includes(k) ? v : undefined)
        : replacer
      : (_, v) => v;
  }

  reviver(key: unknown, value: unknown) {
    //  TODO: Implement
    return this.more_replacer(key, value);
  }
}

type Options = YAML.DocumentOptions &
  YAML.SchemaOptions &
  YAML.ParseOptions &
  YAML.CreateNodeOptions &
  YAML.ToStringOptions;

export function stringify(src: string, options?: Options): unknown;
export function stringify(
  src: string,
  replacer: Replacer,
  options?: Options
): unknown;

export function stringify(
  src: string,
  _opts_or_repl?: Options | Replacer,
  _opts?: Options
): unknown {
  const has_replacer =
    _opts_or_repl instanceof Function || _opts_or_repl instanceof Array;
  const _more_reviver = has_replacer ? _opts_or_repl : undefined;
  const _options = has_replacer ? _opts : _opts_or_repl;
  const replacer = new CustomReplacer(_more_reviver);
  return YAML.stringify(
    src,
    (k: unknown, v: unknown) => replacer.reviver(k, v),
    _options
  );
}
