import fs from 'fs';
import { stringify } from '../src';

describe('Test stringify csv-in-yaml', () => {
  test.each([
    'file',
    //  TODO: More files
  ])('Test stringify data from %s.json', (filename) => {
    const log = jest.spyOn(console, 'log').mockReturnValue();

    const file = fs.readFileSync(`tests/res/${filename}.json`, 'utf8');
    const data = JSON.parse(file);
    const result = stringify(data);

    const answer_file = fs.readFileSync(`tests/res/${filename}.yaml`, 'utf8');
    expect(result).toEqual(answer_file);

    log.mockRestore();
  });
});
