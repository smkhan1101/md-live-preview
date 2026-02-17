export const STORAGE_NAMESPACE = 'md-live-preview';
export const GITHUB_REPO_URL = 'https://github.com/smkhan1101/md-live-preview';
export const STORAGE_KEY_CONTENT = 'content';
export const STORAGE_KEY_SYNC_SCROLL = 'syncScroll';
export const STORAGE_KEY_THEME = 'theme';
export const STORAGE_KEY_NAVBAR_EXPANDED = 'navbarExpanded';
export const CONFIRM_RESET_MESSAGE = 'Reset to default? Your current content will be lost.';

export const DEFAULT_MARKDOWN = `# Markdown syntax guide

## Headers

# Heading 1
## Heading 2
###### Heading 6

## Emphasis

*Italic* and **bold**
_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
  * Nested

### Ordered

1. First
2. Second
3. Third

## Links & Images

[Link text](https://example.com)

![Markdown](/markdown.svg "Markdown logo")

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax.

## Tables

| Left   | Center | Right |
| :----- | :----: | ----: |
| left   | center | right |

## Code

Inline \`code\` and a block:

\`\`\`js
const hello = 'world';
console.log(hello);
\`\`\`
`;
