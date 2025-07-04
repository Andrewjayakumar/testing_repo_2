declare var require;
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer,
  ɵlooseIdentical
} from '@angular/core';
import * as MediumEditor from 'medium-editor';
import { UUID } from 'angular2-uuid';

const mediumEditorColorButtons = require('medium-editor-colorpicker-buttons').get(MediumEditor);
const TextColorButtonClass = mediumEditorColorButtons.TextColorButtonClass;
/**
 * Medium Editor wrapper directive.
 *
 * Examples
 * <medium-editor
      [(editorModel)]="textVar"
 *    [editorOptions]="{'toolbar': {'buttons': ['bold', 'italic', 'underline', 'h1', 'h2', 'h3']}}"
 *    [editorPlaceholder]="placeholderVar"></medium-editor>
 */
@Directive({
  selector: 'medium-editor'
})
export class MediumEditorDirective implements OnInit, OnChanges, OnDestroy {

  private lastViewModel: string;
  private element: HTMLElement;
  private editor: any;
  private active: boolean;

  @Input('editorModel') model: any;
  @Input('editorOptions') options: any;
  @Input('editorPlaceholder') placeholder: string;

  @Output('editorModelChange') update = new EventEmitter();
  @Output('editorImageClick') imageclick = new EventEmitter();
  constructor(private el?: ElementRef) { }

  ngOnInit() {
    this.element = this.el.nativeElement;
    this.element.innerHTML = '<div class="me-editable">' + this.model + '</div>';
    this.active = true;
    for (let i = 0; i < this.element.querySelectorAll('img').length; i++) {
      if (this.element.querySelectorAll('img')[i].id == "")
        this.element.querySelectorAll('img')[i].id = UUID.UUID();

      this.element.querySelectorAll('img')[i].addEventListener('click', this.onClick.bind(this));
    }
    for (let i = 0; i < this.element.querySelectorAll('.collageImageUplod').length; i++) {
      if (this.element.querySelectorAll('.collageImageUplod')[i].id == "")
        this.element.querySelectorAll('.collageImageUplod')[i].id = UUID.UUID();

      this.element.querySelectorAll('.collageImageUplod')[i].addEventListener('click', this.onClick.bind(this));
    }
    if (this.placeholder && this.placeholder.length) {
      this.options.placeholder = {
        text: this.placeholder
      };
    }
    this.options.extensions.textcolor = new TextColorButtonClass(/* options? */);
    // Global MediumEditor
    this.editor = new MediumEditor('.me-editable', this.options);
    this.editor.subscribe('editableInput', (event, editable) => {
      this.updateModel();
    });
  }
  onClick(event) {
    this.imageclick.emit(event);
  }
  refreshView() {
    if (this.editor) {
      this.editor.setContent(this.model);
    }
  }

  ngOnChanges(changes): void {
    if (this.isPropertyUpdated(changes, this.lastViewModel)) {
      this.lastViewModel = this.model;
      this.refreshView();
    }
  }

  /**
   * Emit updated model
   */
  updateModel(): void {
    for (let i = 0; i < this.editor.elements[0].querySelectorAll('img').length; i++) {
      if (this.editor.elements[0].querySelectorAll('img')[i].id == "")
        this.editor.elements[0].querySelectorAll('img')[i].id = UUID.UUID();

      this.editor.elements[0].querySelectorAll('img')[i].addEventListener('click', this.onClick.bind(this));
    }
    for (let i = 0; i < this.editor.elements[0].querySelectorAll('.collageImageUplod').length; i++) {
      if (this.editor.elements[0].querySelectorAll('.collageImageUplod')[i].id == "")
        this.editor.elements[0].querySelectorAll('.collageImageUplod')[i].id = UUID.UUID();

      this.editor.elements[0].querySelectorAll('.collageImageUplod')[i].addEventListener('click', this.onClick.bind(this));
    }
    let value = this.editor.getContent();
    value = value.replace(/&nbsp;/g, '')
      .replace(/<p><br><\/p>/g, '')
      .trim();
    this.lastViewModel = value;
    this.update.emit(value);
  }

  /**
   * Remove MediumEditor on destruction of directive
   */
  ngOnDestroy(): void {
    //this.editor.destroy();
  }

  isPropertyUpdated(changes, viewModel) {
    if (!changes.hasOwnProperty('model')) { return false; }

    const change = changes.model;

    if (change.isFirstChange()) {
      return true;
    }
    return !ɵlooseIdentical(viewModel, change.currentValue);
  }
}
