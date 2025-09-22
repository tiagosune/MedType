import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Bold, Italic, Strikethrough, Subscript, Superscript, Code } from '@ckeditor/ckeditor5-basic-styles';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { FontColor, FontBackgroundColor, FontFamily, FontSize } from '@ckeditor/ckeditor5-font';
import { Link } from '@ckeditor/ckeditor5-link';
import { List, TodoList } from '@ckeditor/ckeditor5-list';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { Image, ImageUpload } from '@ckeditor/ckeditor5-image';
import { CKFinderUploadAdapter } from '@ckeditor/ckeditor5-adapter-ckfinder';
import { Undo } from '@ckeditor/ckeditor5-undo';
import { Indent } from '@ckeditor/ckeditor5-indent';

class CustomEditor extends ClassicEditor {}

CustomEditor.builtinPlugins = [
    Essentials,
    Bold,
    Italic,
    Strikethrough,
    Subscript,
    Superscript,
    Code,
    Paragraph,
    Heading,
    FontColor,
    FontBackgroundColor,
    FontFamily,
    FontSize,
    Link,
    List,
    TodoList,
    BlockQuote,
    CodeBlock,
    Image,
    ImageUpload,
    CKFinderUploadAdapter,
    Undo,
    Indent
];

CustomEditor.defaultConfig = {
    toolbar: {
        items: [
            'heading',
            '|',
            'bold', 'italic', 'strikethrough', 'subscript', 'superscript', 'code',
            '|',
            'fontColor', 'fontBackgroundColor', 'fontFamily', 'fontSize',
            '|',
            'link', 'bulletedList', 'numberedList', 'todoList',
            '|',
            'blockQuote', 'codeBlock',
            '|',
            'insertImage', 'imageUpload',
            '|',
            'undo', 'redo', 'indent', 'outdent'
        ]
    },
    language: 'pt-br'
};

export default CustomEditor;
