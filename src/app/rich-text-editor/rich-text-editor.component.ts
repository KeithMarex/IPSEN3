import {Component, OnInit, Output} from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular';
import {EventEmitter} from '@angular/core';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss']
})
export class RichTextEditorComponent implements OnInit {
  public Editor = ClassicEditor;
  @Output() data = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onChange( { editor }: ChangeEvent ): void {
    const data = editor.getData();
    this.data.emit(data);
  }
}
