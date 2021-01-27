export class DuplicateColors{

  private static COLOR_ONE = '#66ff33';
  private static COLOR_TWO = '#00ccff';
  private static COLOR_THREE = '#9966ff';
  private static COLOR_FOUR = '#cc3399';
  private static COLOR_FIVE = '#9966ff';
  private static COLOR_SIX = '#006600';
  private static COLOR_SEVEN = '#3333cc';
  private static COLOR_EIGHT = '#990033';
  private static COLOR_NINE = '#993300';
  private static COLOR_TEN = '#666633';


    public static getDuplicateColor(n: number): string {
    const colorNumber = n % 10;
    switch (colorNumber) {
      case 0:
        return this.COLOR_TEN;
      case 1:
        return this.COLOR_ONE;
      case 2:
        return this.COLOR_TWO;
      case 3:
        return this.COLOR_THREE;
      case 4:
        return this.COLOR_FOUR;
      case 5:
        return this.COLOR_FIVE;
      case 6:
        return this.COLOR_SIX;
      case 7:
        return this.COLOR_SEVEN;
      case 8:
        return this.COLOR_EIGHT;
      case 9:
        return this.COLOR_NINE;
    }
  }
}
