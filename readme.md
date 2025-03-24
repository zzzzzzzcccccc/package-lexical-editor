# A react rich text component from lexical

## Install

### NPM

```shell
npm install awesome-lexical-react-editor
```

### Yarn

```shell
yarn add awesome-lexical-react-editor
```

### Pnpm

```shell
pnpm install awesome-lexical-react-editor
```

## Overview

The `src/editor` component is a rich text editor built with React. It provides a variety of features for text formatting, image insertion, and more. This documentation will guide you through the usage and customization of the editor component.

[Live Demo](https://zzzzzzzcccccc.github.io/package-lexical-editor/)

[Code sanbox](https://codesandbox.io/p/sandbox/k8lnkc)

## Installation

To use the `src/editor` component, you need to install the necessary dependencies. Ensure you have `react` and `react-dom` installed in your project.


## Simple Examlpe

To see a complete example of how to use the editor, you can refer to the `App.tsx` file in the `src` directory. This file demonstrates how to set up the editor, handle various events, and configure different options.

Here is a quick link to the file: [App.tsx](src/App.tsx)


```tsx
import React, { useRef, useState, Suspense } from 'react';
import { EditorRef, VariableMenuOption } from 'awesome-lexical-react-editor';

const LazyEditor = React.lazy(() => import('awesome-lexical-react-editor'))

const App = () => {
  const editorRef = useRef<EditorRef>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const variableMenus: VariableMenuOption[] = [
    {
      variable: '{{ person.name }}',
      option: <span>Person Name</span>
    },
    {
      variable: '{{ person.age }}',
      option: <span>Person Age</span>
    },
    {
      variable: '{{ person.email }}',
      option: <span>Person Email</span>
    }
  ];

  const handleOnChange = (payload) => {
    console.log('Content changed:', payload);
  };

  const handleOnDragDropPasteFiles = (files: File[]) => {
    console.log('Files dragged, dropped, or pasted:', files);
    return true;
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyEditor
        namespace='example'
        readOnly={readOnly}
        disabled={disabled}
        variableMenus={variableMenus}
        onChange={handleOnChange}
        onDragDropPasteFiles={handleOnDragDropPasteFiles}
        ref={editorRef}
      />
      <div className='actions'>
        <button type='button' onClick={() => setReadOnly((prev) => !prev)}>
          {readOnly ? 'Enable Editing' : 'Disable Editing'}
        </button>
        <button type='button' onClick={() => setDisabled((prev) => !prev)}>
          {disabled ? 'Enable Editor' : 'Disable Editor'}
        </button>
        <button type='button' onClick={() => editorRef.current?.insertValue('<p>New content</p>', 'html')}>
          Insert HTML
        </button>
        <button type='button' onClick={() => editorRef.current?.insertImage({ src: 'image.jpg', altText: 'An image' })}>
          Insert Image
        </button>
      </div>
    </Suspense>
  );
};

export default App;
```

## React Props

| Configuration | Type | Description |
| --- | --- | --- |
| `block` | `string` | Current block element type |
| `bold` | `boolean` | Is bold |
| `italic` | `boolean` | Is italic |
| `underline` | `boolean` | Is underlined |
| `lowercase` | `boolean` | Is lowercase |
| `uppercase` | `boolean` | Is uppercase |
| `capitalize` | `boolean` | Is capitalized |
| `highlight` | `boolean` | Is highlighted |
| `strikethrough` | `boolean` | Is strikethrough |
| `code` | `boolean` | Is code block |
| `link` | `string` | Link address |
| `align` | `string` | Alignment |
| `fontColor` | `string` | Font color |
| `backgroundColor` | `string` | Background color |
| `fontSize` | `string` | Font size |
| `fontFamily` | `string` | Font family |
| `disabled` | `boolean` | Is disabled |
| `readOnly` | `boolean` | Is read-only |
| `canRedo` | `boolean` | Can redo |
| `canUndo` | `boolean` | Can undo |
| `formatAlign` | `(align: string) => void` | Set alignment |
| `formatFontColor` | `(color: string) => void` | Set font color |
| `formatBackgroundColor` | `(color: string) => void` | Set background color |
| `formatFontSize` | `(size: string) => void` | Set font size |
| `formatFontFamily` | `(family: string) => void` | Set font family |
| `formatBlock` | `(block: string) => void` | Set block element type |
| `formatBold` | `() => void` | Set bold |
| `formatItalic` | `() => void` | Set italic |
| `formatLink` | `(link: string) => void` | Set link |
| `formatUnderline` | `() => void` | Set underline |
| `formatLowercase` | `() => void` | Set lowercase |
| `formatUppercase` | `() => void` | Set uppercase |
| `formatCapitalize` | `() => void` | Set capitalize |
| `formatHighlight` | `() => void` | Set highlight |
| `formatStrikethrough` | `() => void` | Set strikethrough |
| `formatCode` | `() => void` | Set code block |
| `clearFormatting` | `() => void` | Clear formatting |
| `undo` | `() => void` | Undo |
| `redo` | `() => void` | Redo |
| `onChange` | `(payload: EditorOnChangePayload) => void` | Callback on content change |
| `onDragDropPasteFiles` | `(files: File[]) => boolean` | Callback on drag, drop, or paste files |
| `fetchMention` | `(query: string) => Promise<FetchMentionOption[]>` | Fetch mention options |
| `triggerSpecialShortcutKey` | `string` | Special shortcut trigger character |
| `triggerSpecialShortcutMenus` | `SpecialShortcutMenuOption[]` | Special shortcut menu options |
| `variableMenus` | `VariableMenuOption[]` | Variable menu options |

## React component ref

| Method | Type | Description |
| --- | --- | --- |
| `updateValue` | `(value: string, source: ValueSource) => void` | Update the editor value |
| `insertValue` | `(value: string, source: ValueSource) => void` | Insert value into the editor |
| `insertImage` | `(payload: InsertImagePayload) => void` | Insert an image |
| `insertMedia` | `(payload: InsertMediaPayload) => void` | Insert media |
| `insertIframe` | `(payload: InsertIframePayload) => void` | Insert an iframe |
| `insertVariable` | `(payload: InsertVariablePayload) => void` | Insert a variable |
| `clearValue` | `() => void` | Clear the editor value |
| `formatBlock` | `(block: string) => void` | Set block element type |
| `formatAlign` | `(align: string) => void` | Set alignment |
| `formatFontColor` | `(color: string) => void` | Set font color |
| `formatBackgroundColor` | `(color: string) => void` | Set background color |
| `formatFontFamily` | `(family: string) => void` | Set font family |
| `formatFontSize` | `(size: string) => void` | Set font size |
| `formatLink` | `(link: string) => void` | Set link |
| `formatBold` | `() => void` | Set bold |
| `formatItalic` | `() => void` | Set italic |
| `formatUnderline` | `() => void` | Set underline |
| `formatLowercase` | `() => void` | Set lowercase |
| `formatUppercase` | `() => void` | Set uppercase |
| `formatCapitalize` | `() => void` | Set capitalize |
| `formatStrikethrough` | `() => void` | Set strikethrough |
| `formatHighlight` | `() => void` | Set highlight |
| `clearFormatting` | `() => void` | Clear formatting |
| `focus` | `() => void` | Focus the editor |
| `blur` | `() => void` | Blur the editor |
| `undo` | `() => void` | Undo the last action |
| `redo` | `() => void` | Redo the last undone action |