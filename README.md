# csv-in-yaml

CSV/TSV Embed in YAML

## Install

Install via npm:

```
npm i csv-in-yaml
```

## Tutorial

```ts
import { read_yaml } from 'csv-in-yaml';

interface Person {
  id: number;
  name: string;
  age: number;
}

async function main() {
  for await (const row of read_yaml<Person>('res/persons.yaml', {
    id: 'id',
    name: 'name',
    age: 'age',
  })) {
    console.log(`${row.name}, ${row.age} years old, id is ${row.id}.`);
  }
}

main();
```

Run the above script with the TSV file saved as `res/persons.tsv`:

```tsv:res/persons.tsv
id	name	age
1	John Tanaka	25
2	Taro Suzuki	31
3	Tom Sato	17
4	Judy Foobar	25
5	Unnamed	27
6	Sachi Piyo	20
```

Result:

```
John Tanaka, 25 years old, id is 1.
Taro Suzuki, 31 years old, id is 2.
Tom Sato, 17 years old, id is 3.
Judy Foobar, 25 years old, id is 4.
Unnamed, 27 years old, id is 5.
Sachi Piyo, 20 years old, id is 6.
```
