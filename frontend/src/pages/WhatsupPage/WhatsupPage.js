import React from "react";
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

const WhatsupPage = () => {
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
            "EmojiPicker", // Make sure EmojiPicker is added
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
            <div>
                <h2>Send a message</h2>
            </div>
            <div style={{ width: "100%", height: "auto" }}>
                <RichTextEditorComponent
                    height={250}
                    toolbarSettings={toolbarSettings}
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
        </>
    );
};

export default WhatsupPage;
