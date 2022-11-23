import fs from 'fs';
import { parse } from '../src';

describe('Test parse csv-in-yaml', () => {
  test.each([
    'file',
    //  TODO: More files
  ])('Test parse %s.yaml', (filename) => {
    const log = jest.spyOn(console, 'log').mockReturnValue();

    const file = fs.readFileSync(`tests/res/${filename}.yaml`, 'utf8');
    const data = parse(file);

    const answer_file = fs.readFileSync(`tests/res/${filename}.json`, 'utf8');
    const answer = JSON.parse(answer_file);
    expect(data).toEqual(answer);

    log.mockRestore();
  });
});
