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

The component is a rich text editor built with React. It provides a variety of features for text formatting, image insertion, and more. This documentation will guide you through the usage and customization of the editor component.

[Live Demo](https://zzzzzzzcccccc.github.io/package-lexical-editor/)

[Code sanbox](https://codesandbox.io/p/sandbox/k8lnkc)

## Installation

To use the component, you need to install the necessary dependencies. Ensure you have `react` and `react-dom` installed in your project.


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

| Property                       | Type                                              | Description |
|--------------------------------|-------------------------------------------------|-------------|
| `namespace`                    | `string`                                        | The namespace of the editor, typically used to uniquely identify an instance. |
| `className`                    | `string` _(optional)_                           | CSS class name for the outer container. |
| `style`                        | `React.CSSProperties` _(optional)_              | Inline styles for the outer container. |
| `editorClassName`              | `string` _(optional)_                           | CSS class name for the editor area. |
| `editorStyle`                  | `React.CSSProperties` _(optional)_              | Inline styles for the editor area. |
| `onError`                      | `(error: Error, editor: LexicalEditor) => void` _(optional)_ | Callback function for handling errors. |
| `placeholder`                  | `React.ReactNode` _(optional)_                  | Placeholder content for the editor. |
| `editMode`                     | `EditMode` _(optional)_                         | The editor mode. |
| `readOnly`                     | `boolean` _(optional)_                          | Whether the editor is in read-only mode. |
| `disabled`                     | `boolean` _(optional)_                          | Whether the editor is disabled. |
| `theme`                        | `EditorThemeClasses` _(optional)_               | Theme configuration for the editor. |
| `debug`                        | `boolean` _(optional)_                          | Whether to enable debug mode. |
| `autoFocus`                    | `EditorFocusOptions` _(optional)_               | Whether to auto-focus the editor and focus options. |
| `headerSlot`                   | `React.ReactNode` _(optional)_                  | Slot for custom header components. |
| `footerSlot`                   | `React.ReactNode` _(optional)_                  | Slot for custom footer components. |
| `floatMenuSlot`                | `React.ReactNode` _(optional)_                  | Slot for a floating menu. |
| `ignoreSelectionChange`        | `boolean` _(optional)_                          | Whether to ignore selection change events. |
| `outputValueSource`            | `ValueSource` _(optional)_                      | The source of the editor's output value. |
| `onChange`                     | `(payload: EditorOnChangePayload) => void` _(optional)_ | Callback function triggered when the content changes. |
| `onDragDropPasteFiles`         | `(target: Array<File>) => boolean` _(optional)_ | Callback for handling drag-and-drop or pasted files. Returns `true` if handled, `false` otherwise. |
| `triggerSpecialShortcutMenus`  | `Array<SpecialShortcutMenuOption>` _(optional)_ | Configuration for triggering special shortcut menus. |
| `triggerSpecialShortcutKey`    | `string` _(optional)_                           | Key for triggering special shortcut menus. |
| `variableMenus`                | `Array<VariableMenuOption>` _(optional)_        | List of variable menu options. |
| `maxLength`                    | `number` _(optional)_                           | Maximum character limit for input. |
| `enableMarkdownShortcut`       | `boolean` _(optional)_                          | Whether to enable Markdown shortcuts. |
| `enableDraggableBlock`         | `boolean` _(optional)_                          | Whether to enable draggable block elements. |
| `modalAnchor`                  | `HTMLElement` _(optional)_                      | DOM node where modal dialogs should be anchored. |
| `fetchMention`                 | `(query: string \| null) => Promise<Array<FetchMentionOption>>` _(optional)_ | Asynchronous function to fetch @ mention suggestions. |

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