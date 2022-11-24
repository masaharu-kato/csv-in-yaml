interface TableMeta<T> {
  keys: { [k in keyof T]: string };
}

class Table<T> {
  rows: unknown[];
  meta: TableMeta<T>;

  constructor(rows: unknown[], meta: TableMeta<T>) {
    this.rows = rows;
    this.meta = meta;
  }

  *iterate() {
    for (const i in this.rows) {
      yield new Row(this, Number(i));
    }
  }
}

class Row<T> {
  table: Table<T>;
  index: number;

  constructor(table: Table<T>, index: number) {
    this.table = table;
    this.index = index;
  }
}

function main() {
  // const key2i: { [k: string]: number } = { id: 1, name: 2, age: 3 };
  const keys = ['id', 'name', 'age'];

  const rowHandler: ProxyHandler<string[][]> = {
    get: (obj: string[][], key: string) =>
      Object.fromEntries(keys.map((k, i) => [k, obj[Number(key)][i]])),
  };

  const rows = [
    [3, 'Tom Tanaka', 25],
    [10, 'Keiko Suzuki', 30],
    [6, 'John Saito', 28],
  ];

  // const table = new Proxy(rows, rowHandler);
  // table[Symbol.iterator] = () => {
  //   let index = 0;
  //   const length = rows.length;
  //   return {
  //     next: () => {
  //       return {value: table[index++], done: !(index < length) }
  //     }
  //   }
  // }

  // const table = new Proxy(rows, {
  //   get(target, key, receiver) {
  //     console.log('key:', key);
  //     if (key === Symbol.iterator) return target[Symbol.iterator].bind(target);
  //     else return Reflect.get(target, key, receiver);
  //   },
  // });

  const table = new Proxy(Array.prototype, {
    get(target: any[], property: string | symbol) {
      if (typeof property == 'string') {
        const index = Number(property);
        if (!isNaN(index)) {
          const row = rows[index];
          return Object.fromEntries(keys.map((k, i) => [k, row[i]]));
        }
        if (property === 'length') return rows.length;
      }
      return Reflect.get(target, property);
    },
    has(target, property) {
      const index = Number(property);
      if (typeof property == 'symbol') throw new Error('');
      if (
        property == 'length' ||
        (!isNaN(index) && index >= 0 && index < rows.length)
      )
        return true;
      return Reflect.has(target, property);
    },
  });

  for (const row of table) {
    console.log(row);
  }
}

main();
