import { DateTzPipe } from './date-tz.pipe';

describe('DateTzPipe', () => {
  it('create an instance', () => {
    const pipe = new DateTzPipe(null);
    expect(pipe).toBeTruthy();
  });
});
