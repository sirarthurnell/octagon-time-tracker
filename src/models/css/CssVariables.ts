/**
 * Eases access to CSS variables from TS.
 */
export class CssVariables {
  /**
   * Gets the working time color.
   */
  static get workingTimeColor(): string {
    return CssVariables.getGlobalCssVariable('--working-time-color');
  }

  /**
   * Gets the resting time color.
   */
  static get restingTimeColor(): string {
    return CssVariables.getGlobalCssVariable('--resting-time-color');
  }

  /**
   * Gets the value of the specified global CSS variable.
   * @param name Name of the variable.
   */
  private static getGlobalCssVariable(name: string): string {
    return this.getCssVariable(document.body, name);
  }

  /**
   * Gets the value of the specified CSS variable.
   * @param el Element where the variable was defined.
   * @param name Name of the variable.
   */
  private static getCssVariable(el: HTMLElement, name: string): string {
    const style = window.getComputedStyle(el);
    return style.getPropertyValue(name);
  }
}
