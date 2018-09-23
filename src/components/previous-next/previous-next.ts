import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';
import * as $ from 'jquery';

/**
 * Represents a previous next kind of component.
 */
@Component({
  selector: 'previous-next',
  templateUrl: 'previous-next.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
  @Input()
  showLoader = false;
  @Output()
  previous = new EventEmitter();
  @Output()
  next = new EventEmitter();

  animationInProgress = false;

  private $wrappedCopy: string = null;
  private $wrappedOriginal: JQuery = null;
  private loading: Loading = null;

  constructor(
    private loadingCtrl: LoadingController,
    private cd: ChangeDetectorRef
  ) {}

  /**
   * Performs the next animation.
   */
  animateNext(): void {
    if (this.enableAnimations && this.animationInProgress) {
      this.prepareDom();
      this.performAnimation('translate--right', 'translate--left');
    } else {
      this.hideLoaderIfConfigured();
    }
  }

  /**
   * Performs the previous animation.
   */
  animatePrevious(): void {
    if (this.enableAnimations && this.animationInProgress) {
      this.prepareDom();
      this.performAnimation('translate--left', 'translate--right');
    } else {
      this.hideLoaderIfConfigured();
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

      const $wrappedCopy = $('.copyWrapper');
      $wrappedCopy.addClass(copyClass);

      $wrappedCopy.one('transitionend', () => this.cleanDom());
    }, delayThreshold);
  }

  /**
   * Prepares the DOM for the animation to start.
   */
  private prepareDom(): void {
    const $original = this.getContent();
    const $originalParent = $original.parent();

    // ? Maybe isn't faster than just modifying it
    // ? in place.

    $original.detach();
    this.$wrappedOriginal = this.createWrapper($original);
    this.$wrappedOriginal.appendTo($originalParent);

    const $content = $(this.dynamicContent.nativeElement);
    $content.html(this.$wrappedCopy);
    $content.append(this.$wrappedOriginal);
  }

  /**
   * Leaves the DOM in a correct state.
   */
  private cleanDom(): void {
    const $wrappedCopy = $('.copyWrapper');
    $wrappedCopy.remove();
    this.$wrappedCopy = null;

    const $originalContent = this.$wrappedOriginal.children().first();
    $originalContent.unwrap();

    this.hideLoaderIfConfigured();
    this.animationInProgress = false;
    this.cd.detectChanges();
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
  private prepareWrappedCopy(): string {
    const $copy = this.getClonedContent();
    return this.createWrapperAsText($copy);
  }

  /**
   * Clonates the current content.
   */
  private getClonedContent(): string {
    const $original = this.getContent();
    const $copy = $original.parent().html();
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
   * The operation is done using strings.
   * @param $el Element to wrap.
   */
  private createWrapperAsText(el: string): string {
    return `<div class="absoluteWrapper copyWrapper">${el}</div>`;
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
    if (!this.animationInProgress) {
      this.createAndPresentLoaderIfConfigured().then(() => {
        if (this.enableAnimations) {
          this.prepareAnimation();
        }

        this.previous.emit();
      });
    }
  }

  /**
   * Emits the next event.
   */
  emitNext(): void {
    if (!this.animationInProgress) {
      this.createAndPresentLoaderIfConfigured().then(() => {
        if (this.enableAnimations) {
          this.prepareAnimation();
        }

        this.next.emit();
      });
    }
  }

  /**
   * Creates and shows a loader.
   */
  private createAndPresentLoaderIfConfigured(): Promise<void> {
    if (this.showLoader) {
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
        showBackdrop: false
      });

      return this.loading.present();
    } else {
      return Promise.resolve();
    }
  }

  /**
   * Hides the loader if configured.
   */
  private hideLoaderIfConfigured(): void {
    if (this.showLoader && this.loading) {
      this.loading.dismiss();
    }
  }
}
