import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Represents a previous next kind of component.
 */
@Component({
  selector: 'previous-next',
  templateUrl: 'previous-next.html'
})
export class PreviousNextComponent {
  @Input() text = '';
  @Input() textClass = '';
  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();

  /**
   * Emits the previous event.
   */
  emitPrevious(): void {
    this.previous.emit();
  }

  /**
   * Emits the next event.
   */
  emitNext(): void {
    this.next.emit();
  }
}
