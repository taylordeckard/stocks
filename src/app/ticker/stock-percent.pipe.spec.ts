import { StockPercentPipe } from './stock-percent.pipe';

describe('StockPercentPipe', () => {
  it('create an instance', () => {
    const pipe = new StockPercentPipe();
    expect(pipe).toBeTruthy();
  });
});
