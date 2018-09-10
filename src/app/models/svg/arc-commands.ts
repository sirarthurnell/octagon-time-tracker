/**
 * Represents a point.
 */
interface Point {
  x: number;
  y: number;
}

/**
 * Contains commands to draw arcs.
 */
export class ArcCommands {
  /**
   * Create the SVG path commands necessary to
   * create an arc.
   * @param x X coordinate of the center.
   * @param y Y coordinate of the center.
   * @param radius Radius of the arc.
   * @param startAngle Start angle in degrees.
   * @param endAngle End angle in degrees.
   */
  static createArcCommands(x, y, radius, startAngle, endAngle): string {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y
    ].join(' ');

    return d;
  }

  /**
   * Converts polar coordinates to cartesian ones.
   * @param centerX X coordinate of the center.
   * @param centerY Y coordinate of the center.
   * @param radius Radius of the arc.
   * @param angleInDegrees Angle in degrees.
   */
  static polarToCartesian(centerX, centerY, radius, angleInDegrees): Point {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }
}
