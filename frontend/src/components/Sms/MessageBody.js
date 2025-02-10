import React, { useRef } from "react";
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
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

const MessageBody = ({ selectedPhone }) => {
    const rteRef = useRef(null);

    const handleSend = () => {
        if (rteRef.current) {
            const message = rteRef.current.getText().trim(); // Get text without HTML tags
            if (!selectedPhone) {
                alert("⚠️ Please select a contact first!");
                return;
            }
            if (!message) {
                alert("⚠️ Please type a message!");
                return;
            }
            alert(
                `Messae sent succesfully✅\n📞contact: ${selectedPhone}\n💬Message: ${message}`
            );
        }
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
            <ButtonComponent
                type="button"
                cssClass="e-primary"
                style={{ margin: "10px" }}
                onClick={handleSend}
            >
                Send
            </ButtonComponent>
        </>
    );
};

export default MessageBody;
