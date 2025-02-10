import React, { useRef, useState } from "react";
import {
    HtmlEditor,
    Image,
    Inject,
    Link,
    QuickToolbar,
    RichTextEditorComponent,
    Toolbar,
    EmojiPicker,
} from "@syncfusion/ej2-react-richtexteditor";


const MessageBody = ({ selectedPhone, onMessageChange }) => {
    const rteRef = useRef(null);
    const [editorContent, setEditorContent] = useState('');

    const handleEditorChange = (args) => {
        setEditorContent(args.value);
        console.log('Editor content changed:', args);
        onMessageChange(rteRef.current.getText());
    };


    const toolbarSettings = {
        items: [
            "Bold",
            "Italic",
            "Underline",
            "StrikeThrough",
            "FontName",
            "FontSize",
            "FontColor",
            "BackgroundColor",
            "LowerCase",
            "UpperCase",
            "EmojiPicker",
            "|",
            "Formats",
            "Alignments",
            "OrderedList",
            "UnorderedList",
            "Outdent",
            "Indent",
            "|",
            "CreateLink",
            "Image",
            "|",
            "ClearFormat",
            "Print",
            "SourceCode",
            "FullScreen",
            "|",
            "Undo",
            "Redo",
        ],
    };

    return (
        <>
            <div style={{ width: "60%", height: "auto" }}>
                <label>
                    <h3>Type a Message:</h3>
                </label>
                <RichTextEditorComponent
                    height={250}
                    toolbarSettings={toolbarSettings}
                    ref={rteRef}
                    change={handleEditorChange}
                >
                    <Inject
                        services={[
                            Toolbar,
                            Image,
                            Link,
                            HtmlEditor,
                            QuickToolbar,
                            EmojiPicker,
                        ]}
                    />
                </RichTextEditorComponent>
            </div>
            <pre>{editorContent}</pre>
        </>
    );
};

export default MessageBody;
