import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bold, Italic, Underline, Link, X, ChevronDown, 
  AlignLeft, AlignCenter, AlignRight, Minus, Plus, 
  Type, Palette, Maximize2, ImagePlus 
} from 'lucide-react';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  editorProps?: {
    placeholder?: string;
  };
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value = '', onChange }) => {
  const [showLinkDialog, setShowLinkDialog] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);
  const [showHeadingsDropdown, setShowHeadingsDropdown] = useState<boolean>(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState<boolean>(false);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState<number>(100);
  const [showImageControls, setShowImageControls] = useState<boolean>(false);
  const MAX_CHARS = 999999;
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastSelection = useRef<Range | null>(null);
  const lastCursorPosition = useRef<number>(0);

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48];
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080',
    '#800000', '#808000', '#008000', '#800080', '#008080', '#000080'
  ];

  


  const restoreCursorPosition = useCallback((): void => {
    if (editorRef.current && lastCursorPosition.current > 0) {
      let charIndex = 0;
      const range = document.createRange();
      range.setStart(editorRef.current, 0);
      range.collapse(true);

      const nodeStack: ChildNode[] = [editorRef.current as ChildNode];
      let node;
      let foundStart = false;
      let stop = false;

      while (!stop && (node = nodeStack.pop())) {
        if (node.nodeType === 3 && node instanceof Text) {
          const textNode = node as Text;
          const nextCharIndex = charIndex + textNode.length;
      
          if (
            !foundStart &&
            lastCursorPosition.current >= charIndex &&
            lastCursorPosition.current <= nextCharIndex
          ) {
            range.setStart(textNode, lastCursorPosition.current - charIndex);
            foundStart = true;
          }
      
          if (foundStart && lastCursorPosition.current <= nextCharIndex) {
            range.setEnd(textNode, lastCursorPosition.current - charIndex);
            stop = true;
          }
      
          charIndex = nextCharIndex;
        } else {
          let i = node.childNodes.length;
          while (i--) {
            nodeStack.push(node.childNodes[i]);
          }
        }
      }

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      moveCursorToEnd();
    }
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      if (value) {
        editorRef.current.innerHTML = value;
      } else {
        editorRef.current.innerHTML = '';
      }
      restoreCursorPosition();
    }
    updateCharCount();
  }, [value, restoreCursorPosition]);

  const updateCharCount = (): void => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      setCharCount(text.length);
    }
  };

  const saveCursorPosition = (): void => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      lastCursorPosition.current = preCaretRange.toString().length;
    }
  };

  const notifyParent = (): void => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = (): void => {
    saveCursorPosition();
    
    if (editorRef.current && editorRef.current.innerText.length >= MAX_CHARS) {
      const content = editorRef.current.innerText.substring(0, MAX_CHARS);
      editorRef.current.innerText = content;
      restoreCursorPosition();
    }

    updateCharCount();
    handleTextSelection();
    notifyParent();
  };

  const execCommand = (command: string, value: string | null = null): void => {
    if (charCount < MAX_CHARS || command === 'undo' || command === 'redo') {
      saveCursorPosition();
      document.execCommand(command, false, value || undefined);
      restoreCursorPosition();
      updateCharCount();
      notifyParent();
    }
  };

  const handleTextSelection = (): void => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      lastSelection.current = selection.getRangeAt(0);
      setSelectedText(selection.toString());
      
      // Check if an image is selected
      const node = selection.anchorNode;
      if (node && node.parentNode && (node.parentNode as HTMLElement).tagName === 'IMG') {
        const img = node.parentNode as HTMLImageElement;
        setSelectedImage(img);
        // Get current image size
        const currentWidth = img.style.width;
        if (currentWidth) {
          setImageSize(parseInt(currentWidth));
        } else {
          setImageSize(100);
        }
        setShowImageControls(true);
      } else if (!selection.toString()) {
        setSelectedImage(null);
        setShowImageControls(false);
      }
    }
  };

  const insertLink = (): void => {
    if (charCount >= MAX_CHARS) {
      alert(`لقد وصلت إلى الحد الأقصى لعدد الأحرف (${MAX_CHARS})`);
      return;
    }

    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      setSelectedText(selection.toString());
      setShowLinkDialog(true);
    } else {
      alert('الرجاء تحديد نص أولاً لإضافة رابط');
    }
  };

  const applyLink = (): void => {
    if (!linkUrl || !selectedText) return;

    const selection = window.getSelection();
    if (selection && lastSelection.current) {
      selection.removeAllRanges();
      selection.addRange(lastSelection.current);
      
      const span = document.createElement('span');
      span.id = 'temp-selection-span';
      span.textContent = selectedText;
      
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);
      
      const anchor = document.createElement('a');
      anchor.href = linkUrl.includes('://') ? linkUrl : `https://${linkUrl}`;
      anchor.target = '_blank';
      anchor.className = 'text-blue-600 hover:text-blue-800 underline';
      anchor.textContent = selectedText;
      
      const tempSpan = document.getElementById('temp-selection-span');
      if (tempSpan) {
        tempSpan.replaceWith(anchor);
      }

      editorRef.current?.focus();
      updateCharCount();
      notifyParent();
    }

    setShowLinkDialog(false);
    setLinkUrl('');
    setSelectedText('');
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain').substring(0, MAX_CHARS - charCount);
    saveCursorPosition();
    document.execCommand('insertText', false, text);
    restoreCursorPosition();
    updateCharCount();
    notifyParent();
  };

  const applyHeading = (level: number): void => {
    if (charCount >= MAX_CHARS) {
      alert(`لقد وصلت إلى الحد الأقصى لعدد الأحرف (${MAX_CHARS})`);
      return;
    }

    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      saveCursorPosition();
      const range = selection.getRangeAt(0).cloneRange();
      
      let parentElement = range.startContainer.parentElement;
      while (parentElement && parentElement !== editorRef.current) {
        if (/^H[1-6]$/.test(parentElement.tagName)) {
          const textNode = document.createTextNode(parentElement.textContent || '');
          parentElement.replaceWith(textNode);
          
          range.selectNode(textNode);
          selection.removeAllRanges();
          selection.addRange(range.cloneRange());
          parentElement = textNode.parentElement;
        } else {
          parentElement = parentElement.parentElement;
        }
      }

      const heading = document.createElement(`h${level}`);
      
      try {
        range.surroundContents(heading);
      } catch (e) {
        const extractedContents = range.extractContents();
        heading.appendChild(extractedContents);
        range.insertNode(heading);
        console.log(e);
      }

      editorRef.current?.focus();
      restoreCursorPosition();
      notifyParent();
    } else {
      alert('الرجاء تحديد نص أولاً لتطبيق العنوان');
    }
    setShowHeadingsDropdown(false);
  };

  const handleImageUpload = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          saveCursorPosition();
          insertImageElement(event.target.result as string);
          restoreCursorPosition();
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = (e: React.MouseEvent, img: HTMLImageElement): void => {
    e.stopPropagation();
    const range = document.createRange();
    range.selectNode(img);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      setSelectedImage(img);
      const currentWidth = img.style.width;
      if (currentWidth) {
        setImageSize(parseInt(currentWidth));
      } else {
        setImageSize(100);
      }
      setShowImageControls(true);
    }
  };

  const insertImageElement = (imageData: string): void => {
    const img = document.createElement('img');
    img.src = imageData;
    img.alt = 'الصورة المرفوعة';
    img.className = 'my-4 max-w-full cursor-pointer mx-auto block';
    img.style.width = `${imageSize}%`;
    img.style.transition = 'width 0.2s ease-in-out';

    // img.onclick = (e: React.MouseEvent) => handleImageClick(e, img);

    img.onclick = (e: MouseEvent) => {
      handleImageClick(e as unknown as React.MouseEvent, img);
    };
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
    } else {
      document.execCommand('insertHTML', false, img.outerHTML);
    }

    setSelectedImage(img);
    setShowImageControls(true);
    editorRef.current?.focus();
    updateCharCount();
    notifyParent();
  };

  const setTextAlignment = (align: string): void => {
    saveCursorPosition();
    document.execCommand('justify' + align.charAt(0).toUpperCase() + align.slice(1));
    restoreCursorPosition();
    notifyParent();
  };

  const setFontSize = (size: number): void => {
    saveCursorPosition();
    document.execCommand('fontSize', false, '7');
    const fontElements = editorRef.current?.getElementsByTagName('font');
    if (fontElements && fontElements.length > 0) {
      const lastFont = fontElements[fontElements.length - 1];
      lastFont.removeAttribute('size');
      lastFont.style.fontSize = `${size}px`;
    }
    restoreCursorPosition();
    notifyParent();
  };

  const setTextColor = (color: string): void => {
    saveCursorPosition();
    document.execCommand('foreColor', false, color);
    setSelectedColor(color);
    restoreCursorPosition();
    notifyParent();
  };

  const adjustImageSize = (change: number | 'custom', customValue?: number): void => {
    if (!selectedImage) return;

    let newSize: number;
    if (change === 'custom' && customValue !== undefined) {
      newSize = Math.max(10, Math.min(200, customValue));
    } else if (typeof change === 'number') {
      newSize = Math.max(10, Math.min(200, imageSize + change));
    } else {
      return;
    }

    setImageSize(newSize);
    selectedImage.style.width = `${newSize}%`;
    notifyParent();
  };

  const resetImageSize = (): void => {
    if (selectedImage) {
      setImageSize(100);
      selectedImage.style.width = '100%';
      notifyParent();
    }
  };

  const removeImage = (): void => {
    if (selectedImage && selectedImage.parentNode) {
      selectedImage.parentNode.removeChild(selectedImage);
      setSelectedImage(null);
      setShowImageControls(false);
      notifyParent();
    }
  };

  const moveCursorToEnd = (): void => {
    if (editorRef.current) {
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      editorRef.current.focus();
    }
  };

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === editorRef.current || (e.target as HTMLElement).tagName !== 'IMG') {
      setSelectedImage(null);
      setShowImageControls(false);
    }
    saveCursorPosition();
  };

  return (
    <div className="mx-auto my-6" dir="rtl">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div className="flex space-x-1 rtl:space-x-reverse flex-wrap">
            <button
              onClick={() => execCommand('bold')}
              className="p-2 rounded-md hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
              title="عريض"
              type="button"
            >
              <Bold size={18} />
            </button>
            <button
              onClick={() => execCommand('italic')}
              className="p-2 rounded-md hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
              title="مائل"
              type="button"
            >
              <Italic size={18} />
            </button>
            <button
              onClick={() => execCommand('underline')}
              className="p-2 rounded-md hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
              title="تحته خط"
              type="button"
            >
              <Underline size={18} />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowHeadingsDropdown(!showHeadingsDropdown)}
                className="p-2 rounded-md hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                title="العناوين"
                type="button"
              >
                <span className="font-bold">العناوين</span>
                <ChevronDown size={16} className="mr-1" />
              </button>
              
              {showHeadingsDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <button
                      key={level}
                      onClick={() => applyHeading(level)}
                      className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    >
                      عنوان {level} (H{level})
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
                className="p-2 rounded-md hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                title="حجم الخط"
                type="button"
              >
                <Type size={18} />
                <ChevronDown size={16} className="mr-1" />
              </button>
              
              {showFontSizeDropdown && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200 max-h-60 overflow-y-auto">
                  {fontSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setFontSize(size);
                        setShowFontSizeDropdown(false);
                      }}
                      className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                      style={{ fontSize: `${size}px` }}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded-md hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
                title="لون الخط"
                type="button"
              >
                <Palette size={18} />
              </button>
              
              {showColorPicker && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-2">
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setTextColor(color);
                          setShowColorPicker(false);
                        }}
                        className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-400"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="mt-2 flex items-center">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => {
                        setTextColor(e.target.value);
                        setSelectedColor(e.target.value);
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={insertLink}
              className="p-2 rounded-md hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
              title="إضافة رابط"
              type="button"
            >
              <Link size={18} />
            </button>
            
            <button
              onClick={handleImageUpload}
              className="p-2 rounded-md hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
              title="إضافة صورة"
              type="button"
            >
              <ImagePlus size={18} />
            </button>
            
            {selectedImage && showImageControls && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse bg-gray-200 rounded-md px-2">
                <button
                  onClick={() => adjustImageSize(-10)}
                  className="p-1 rounded-md hover:bg-gray-300 text-gray-700"
                  title="تصغير الصورة"
                  type="button"
                >
                  <Minus size={16} />
                </button>
                
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={imageSize}
                    onChange={(e) => adjustImageSize('custom', parseInt(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm w-12 text-center">{imageSize}%</span>
                </div>
                
                <button
                  onClick={() => adjustImageSize(10)}
                  className="p-1 rounded-md hover:bg-gray-300 text-gray-700"
                  title="تكبير الصورة"
                  type="button"
                >
                  <Plus size={16} />
                </button>
                
                <button
                  onClick={resetImageSize}
                  className="p-1 rounded-md hover:bg-gray-300 text-gray-700"
                  title="إعادة تعيين الحجم"
                  type="button"
                >
                  <Maximize2 size={16} />
                </button>
                
                <button
                  onClick={removeImage}
                  className="p-1 rounded-md hover:bg-red-100 text-red-700"
                  title="حذف الصورة"
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            <button
              onClick={() => setTextAlignment('left')}
              className="p-2 rounded-md hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
              title="محاذاة لليسار"
              type="button"
            >
              <AlignLeft size={18} />
            </button>
            <button
              onClick={() => setTextAlignment('center')}
              className="p-2 rounded-md hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
              title="محاذاة للوسط"
              type="button"
            >
              <AlignCenter size={18} />
            </button>
            <button
              onClick={() => setTextAlignment('right')}
              className="p-2 rounded-md hover:bg-gray-200 text-gray-700 hover:text-gray-900 transition-colors"
              title="محاذاة لليمين"
              type="button"
            >
              <AlignRight size={18} />
            </button>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            charCount >= MAX_CHARS 
              ? 'bg-red-100 text-red-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {charCount}/{MAX_CHARS}
          </div>
        </div>

        <div
          ref={editorRef}
          contentEditable
          onInput={handleEditorInput}
          onMouseUp={handleTextSelection}
          onKeyUp={(e) => {
            handleTextSelection();
            if (e.key !== 'Backspace' && e.key !== 'Delete') {
              handleEditorInput();
            }
          }}
          onClick={handleEditorClick}
          onPaste={handlePaste}
          className="min-h-[200px] p-4 focus:outline-none text-gray-800 leading-relaxed"
          dir="auto"
          style={{
            fontFamily: "'Cairo', sans-serif",
          }}
        />
      </div>

      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">إضافة رابط</h3>
              <button
                onClick={() => setShowLinkDialog(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النص المحدد</label>
                <input
                  type="text"
                  value={selectedText}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 rtl:space-x-reverse border-t border-gray-200">
              <button
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                onClick={applyLink}
                disabled={!linkUrl || !selectedText}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  !linkUrl || !selectedText
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                تطبيق الرابط
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;