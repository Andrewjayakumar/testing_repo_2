import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output} from '@angular/core';

import { UtilityService } from '../core/services/utility.service';

declare const tinymce: any;
declare var $: any;
@Component({
    selector: 'appc-tiny-editor',
    template: `<textarea id="{{elementId}}"></textarea> <input name="image" type="file" id="upload" style="display: none;" class="hidden" onchange="">`
})
export class TinyEditorComponent implements AfterViewInit, OnDestroy {
    // Things worth noting are
    // 1 - All plugins that you want to use has to be added to your angular-cli.json configuration file.
    // 2 - TinyMCE needs a unique id to be able to show more than one editor at a time, so we send in an id string through
    // an input from the parent component.
    // 3 - To clean up and remove the editor when the SimpleTinyComponent is destroyed we first save a reference to the editor
    // in the setup method when we initialize the editor and then, in the ngOnDestroy lifecycle hook, we run the tinymce.remove()
    // function passing in this reference.

    @Input()
    public elementId: String;
    @Input() model: String;
  /*  @Output()
    public onEditorKeyup = new EventEmitter<any>();*/
    
    public editor: any;
    @Input() height: any;
    @Output()
    public onBlurred = new EventEmitter<any>();
    
    constructor(private us: UtilityService) { }
    public ngAfterViewInit() {
      this.us.loadScript('https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.5.5/tinymce.min.js')
        .subscribe(tm => {
            this.us.loadScript('./assets/tinymce/theme.min.js')
                .subscribe(mt => {
                    this.us.loadScript('./assets/tinymce/link/plugin.min.js')
                        .subscribe(lp => {
                            this.us.loadScript('./assets/tinymce/image/plugin.js')
                            this.us.loadScript('./assets/tinymce/paste/plugin.min.js')
                                .subscribe(pp => {
                                    this.us.loadScript('./assets/tinymce/noneditable/plugin.min.js')
                                        .subscribe(nep => {

                                            tinymce.init({
                                                selector: '#' + this.elementId,
                                                height: this.height,
                                                plugins: ['advlist autolink lists link image charmap print preview hr anchor pagebreak',
                                                    'searchreplace wordcount visualblocks visualchars code fullscreen',
                                                    'insertdatetime media nonbreaking save table contextmenu directionality',
                                                    'emoticons template paste textcolor colorpicker textpattern imagetools toc'],
                                                toolbar: "undo redo bold italic underline strikethrough fontsize blockquote fontselect alignleft aligncenter alignright alignjustify forecolor backcolor link image inserttable | cell row column deletetable div advlist lists",
                                                skin_url: '/assets/skins/lightgray',
                                                content_css: [
                                                    '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i'
                                                ],
                                                setup: (editor: any) => {
                                                    this.editor = editor;
                                                    /*editor.on('keyup', () => {
                                                        const content = editor.getContent();
                                                        this.onEditorKeyup.emit(content);
                                                        this.model = content;
                                                    });*/
                                                    editor.on('blur', (e) => {
                                                        const content = editor.getContent();
                                                        this.onBlurred.emit(content);
                                                        this.model = content;
                                                        e.stopPropagation();
                                                    });
                                                },
                                                init_instance_callback: (editor: any) => {
                                                    this.editor.setContent(this.model)
                                                },
                                                file_picker_callback: function (callback, value, meta) {
                                                    if (meta.filetype == 'image') {
                                                        $('#upload').trigger('click');
                                                        $('#upload').on('change', function () {
                                                            var file = this.files[0];
                                                            var reader = new FileReader();
                                                            reader.onload = function (e: any) {
                                                                callback(e.target.result, {
                                                                    alt: ''
                                                                });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        });
                                                    }
                                                },
                                            });
                                        });
                                });
                        });
                });

        });
    }

    public ngOnDestroy() {
        debugger;
        for (var i = tinymce.editors.length - 1; i > -1; i--) {
            var ed_id = tinymce.editors[i].id;
            tinymce.execCommand("mceRemoveEditor", true, ed_id);
        }
        tinymce.remove(this.editor);
        tinymce.remove();
    }
}
