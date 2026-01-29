import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent, ClipboardEvent } from 'react';
import { Bold, Italic, Underline, Link } from 'lucide-react';

interface RichTextEditorProps {
  initialValue?: string;
  onChange?: (html: string) => void;
}

interface TextSelection {
  text: string;
  range?: Range;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  initialValue = '', 
  onChange 
}) => {
    const [showLinkDialog, setShowLinkDialog] = useState<boolean>(false);
    const [selectedText, setSelectedText] = useState<string>('');
    const [linkUrl, setLinkUrl] = useState<string>('');
    const [charCount, setCharCount] = useState<number>(0);
    
    const MAX_CHARS = 400;
    const editorRef = useRef<HTMLDivElement>(null);
    const selectionRef = useRef<Range | null>(null);

    useEffect(() => {
        if (editorRef.current && initialValue) {
            editorRef.current.innerHTML = initialValue;
        }
        updateCharCount();
    }, [initialValue]);

    const updateCharCount = (): void => {
        if (editorRef.current) {
            const text = editorRef.current.innerText;
            setCharCount(text.length);
        }
    };

    const notifyParent = (): void => {
        if (onChange && editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleEditorInput = (): void => {
        if (!editorRef.current) return;
        
        if (editorRef.current.innerText.length >= MAX_CHARS) {
            const content = editorRef.current.innerText.substring(0, MAX_CHARS);
            editorRef.current.innerText = content;

            const range = document.createRange();
            const selection = window.getSelection();
            
            if (selection && editorRef.current.firstChild) {
                range.selectNodeContents(editorRef.current);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        updateCharCount();
        handleTextSelection();
        notifyParent();
    };

    const execCommand = (command: string, value: string | null = null): void => {
        if (charCount < MAX_CHARS || command === 'undo' || command === 'redo') {
            document.execCommand(command, false, value);
            editorRef.current?.focus();
            updateCharCount();
            notifyParent();
        }
    };

    const handleTextSelection = (): void => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            setSelectedText(selection.toString());
        }
    };

    const saveSelection = (): void => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            selectionRef.current = selection.getRangeAt(0);
        }
    };

    const restoreSelection = (): void => {
        if (selectionRef.current) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(selectionRef.current);
        }
    };

    const insertLink = (): void => {
        if (charCount >= MAX_CHARS) {
            alert(`لقد وصلت للحد الأقصى (${MAX_CHARS}) من الحروف`);
            return;
        }

        saveSelection();
        
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            setSelectedText(selection.toString());
            setShowLinkDialog(true);
        } else {
            alert('يرجى تحديد نص أولاً لإضافة رابط');
        }
    };

    const applyLink = (): void => {
        if (!linkUrl || !selectedText || !editorRef.current) return;

        restoreSelection();
        
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            const fullUrl = linkUrl.includes('://') ? linkUrl : `https://${linkUrl}`;
            document.execCommand('createLink', false, fullUrl);
            
            const anchors = editorRef.current.getElementsByTagName('a');
            if (anchors.length > 0) {
                const lastAnchor = anchors[anchors.length - 1];
                lastAnchor.target = '_blank';
                lastAnchor.className = 'fw-bold text-decoration-underline text-primary';
            }
            
            editorRef.current.focus();
            updateCharCount();
            notifyParent();
        }

        setShowLinkDialog(false);
        setLinkUrl('');
        setSelectedText('');
    };

    const handlePaste = (e: ClipboardEvent<HTMLDivElement>): void => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain').substring(0, MAX_CHARS - charCount);
        document.execCommand('insertText', false, text);
        updateCharCount();
        notifyParent();
    };

    const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>): void => {
        handleTextSelection();
        if (e.key !== 'Backspace' && e.key !== 'Delete') {
            handleEditorInput();
        }
    };

    const handleLinkUrlChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setLinkUrl(e.target.value);
    };

    const handleLinkKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            applyLink();
        }
    };

    return (
        <div className="container mt-3 mb-3" dir="rtl">
            <div className="card">
                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <div className="btn-toolbar">
                        <div className="btn-group me-2">
                            <button
                                onClick={() => execCommand('bold')}
                                className="btn btn-outline-secondary"
                                title="عريض"
                                type="button"
                            >
                                <Bold size={16} />
                            </button>
                            <button
                                onClick={() => execCommand('italic')}
                                className="btn btn-outline-secondary"
                                title="مائل"
                                type="button"
                            >
                                <Italic size={16} />
                            </button>
                            <button
                                onClick={() => execCommand('underline')}
                                className="btn btn-outline-secondary"
                                title="تحته خط"
                                type="button"
                            >
                                <Underline size={16} />
                            </button>
                            <button
                                onClick={insertLink}
                                className="btn btn-outline-secondary"
                                title="إضافة رابط"
                                type="button"
                            >
                                <Link size={16} />
                            </button>
                        </div>
                    </div>
                    <span className={`badge ${charCount >= MAX_CHARS ? 'bg-danger' : 'bg-primary'}`}>
                        {charCount}/{MAX_CHARS}
                    </span>
                </div>

                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleEditorInput}
                    onMouseUp={handleTextSelection}
                    onKeyUp={handleKeyUp}
                    onPaste={handlePaste}
                    className="card-body"
                    dir="auto"
                    style={{
                        minHeight: '200px',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        fontFamily: 'Cairo, sans-serif',
                        textAlign: 'right'
                    }}
                />
            </div>

            {/* Link Dialog */}
            {showLinkDialog && (
                <div className="modal show d-block bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">إضافة رابط</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowLinkDialog(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">النص المحدد:</label>
                                    <input
                                        type="text"
                                        value={selectedText}
                                        readOnly
                                        className="form-control bg-light"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">رابط URL:</label>
                                    <input
                                        type="url"
                                        value={linkUrl}
                                        onChange={handleLinkUrlChange}
                                        className="form-control"
                                        placeholder="https://example.com"
                                        onKeyPress={handleLinkKeyPress}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    onClick={() => setShowLinkDialog(false)}
                                    className="btn btn-secondary"
                                    type="button"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={applyLink}
                                    className="btn btn-primary"
                                    disabled={!linkUrl || !selectedText}
                                    type="button"
                                >
                                    تطبيق الرابط
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RichTextEditor;