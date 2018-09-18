import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import * as $ from 'jquery';

/**
 * Represents a previous next kind of component.
 */
@Component({
  selector: 'previous-next',
  templateUrl: 'previous-next.html'
})
export class PreviousNextComponent {
  @ViewChild('dynamicContent')
  dynamicContent: ElementRef;
  @Input()
  text = '';
  @Input()
  textClass = '';
  @Input()
  enableAnimations = true;
  @Output()
  previous = new EventEmitter();
  @Output()
  next = new EventEmitter();

  animationInProgress = false;

  private $wrappedCopy: JQuery = null;
  private $wrappedOriginal: JQuery = null;

  /**
   * Performs the next animation.
   */
  animateNext(): void {
    if (this.enableAnimations && this.animationInProgress) {
      this.prepareDom();
      this.performAnimation('translate--right', 'translate--left');
    }
  }

  /**
   * Performs the previous animation.
   */
  animatePrevious(): void {
    if (this.enableAnimations && this.animationInProgress) {
      this.prepareDom();
      this.performAnimation('translate--left', 'translate--right');
    }
  }

  /**
   * Performs the animation.
   * @param originalClass Class animation for the original content.
   * @param copyClass Class animation for the copy content.
   */
  private performAnimation(originalClass: string, copyClass: string): void {
    this.$wrappedOriginal.addClass(originalClass);

    const delayThreshold = 50;

    setTimeout(() => {
      this.$wrappedOriginal.removeClass(originalClass);
      this.$wrappedCopy.addClass(copyClass);

      this.$wrappedCopy.one('transitionend', () => this.cleanDom());
    }, delayThreshold);
  }

  /**
   * Prepares the DOM for the animation to start.
   */
  private prepareDom(): void {
    const $original = this.getContent();
    this.$wrappedOriginal = this.createWrapper($original);

    const $content = $(this.dynamicContent.nativeElement);
    $content.append([this.$wrappedOriginal, this.$wrappedCopy]);
  }

  /**
   * Leaves the DOM in a correct state.
   */
  private cleanDom(): void {
    this.$wrappedCopy.remove();
    this.$wrappedCopy = null;

    const $originalContent = this.$wrappedOriginal.children().first();
    $originalContent.unwrap();

    this.animationInProgress = false;
  }

  /**
   * Prepares the DOM for the animation.
   */
  prepareAnimation(): void {
    this.$wrappedCopy = this.prepareWrappedCopy();
    this.animationInProgress = true;
  }

  /**
   * Creates the copy of the original to be animated.
   */
  private prepareWrappedCopy(): JQuery {
    const $copy = this.getClonedContent();
    return this.createWrapper($copy);
  }

  /**
   * Clonates the current content.
   */
  private getClonedContent(): JQuery {
    const $original = this.getContent();
    const $copy = $original.clone();
    return $copy;
  }

  /**
   * Gets the content as a JQuery object.
   */
  private getContent(): JQuery {
    const $content = $(this.dynamicContent.nativeElement);
    const $contentFirstChild = $content.children().first();
    return $contentFirstChild;
  }

  /**
   * Wraps the element into an absolute container.
   * @param $el Element to wrap.
   */
  private createWrapper($el: JQuery): JQuery {
    let $absoluteWrapper = $('<div class="absoluteWrapper"></div>');
    $absoluteWrapper.append($el);
    return $absoluteWrapper;
  }

  /**
   * Controls the swipe event.
   */
  swipe(event): void {
    const LEFT = 4;
    const RIGHT = 2;

    if (!this.comesFromIonicItem(event)) {
      if (event.direction === RIGHT) {
        this.emitNext();
      } else if (event.direction === LEFT) {
        this.emitPrevious();
      }
    }
  }

  /**
   * Checks if the event comes from an
   * ionic item (probably from a list).
   * @param event Event.
   */
  comesFromIonicItem(event): boolean {
    const partOfIonItem =
      event.target &&
      event.target.offsetParent &&
      event.target.offsetParent.nodeName === 'ION-ITEM';
    const ionItemOptions =
      event.target && event.target.nodeName === 'ION-ITEM-OPTIONS';
    return partOfIonItem || ionItemOptions;
  }

  /**
   * Emits the previous event.
   */
  emitPrevious(): void {
    if (this.enableAnimations && !this.animationInProgress) {
      this.prepareAnimation();
    }

    this.previous.emit();
  }

  /**
   * Emits the next event.
   */
  emitNext(): void {
    if (this.enableAnimations && !this.animationInProgress) {
      this.prepareAnimation();
    }

    this.next.emit();
  }
}
