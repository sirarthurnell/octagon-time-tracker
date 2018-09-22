import * as tinycolor from 'tinycolor2';

/**
 * Blenders colors.
 */
export class ColorBlender {
  /**
   * Lightens a color in HEX format.
   * @param color Color to lighten.
   * @param percent Percent (from 0 to 100).
   */
  static lighten(color: string, percent: number): string {
    return tinycolor(color)
      .lighten(percent)
      .toHexString();
  }
}
