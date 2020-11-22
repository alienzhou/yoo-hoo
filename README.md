# Yoo-Hoo

Yoo-Hoo! Its a tiny library for printing a noticeable banner of words for your project. Such as below,

```text
 /\\\    /\\\  /\\\\\\\\      /\\\\\\\\                /\\\    /\\\    /\\\\\\\\      /\\\\\\\\
 \/\\\   /\\\ /\\\_____/\\\  /\\\_____/\\\             \/\\\   \/\\\  /\\\_____/\\\  /\\\_____/\\\
   \/_\\\/\\\ \/\\\    \/\\\ \/\\\    \/\\\             \/\\\   \/\\\ \/\\\    \/\\\ \/\\\    \/\\\
      \/_\\\\  \/\\\    \/\\\ \/\\\    \/\\\  /\\\\\\\\\ \/\\\\\\\\\\\ \/\\\    \/\\\ \/\\\    \/\\\
         \/\\\  \/\\\    \/\\\ \/\\\    \/\\\ \/_______/  \/\\\____/\\\ \/\\\    \/\\\ \/\\\    \/\\\
          \/\\\  \/\\\    \/\\\ \/\\\    \/\\\             \/\\\   \/\\\ \/\\\    \/\\\ \/\\\    \/\\\
           \/\\\  \/_/\\\\\\\\\  \/_/\\\\\\\\\              \/\\\   \/\\\ \/_/\\\\\\\\\  \/_/\\\\\\\\\
            \/_/     \/_______/     \/_______/               \/_/    \/_/    \/_______/     \/_______/
```

Maybe useful when you want a banner for your project. Have fun!

---

## How to install

```bash
npm i yoo-hoo
```

## How to use

```js
import { yo } from 'yoo-hoo';

yo('GOOD');
```

## API

```typescript
// return the lines to print
yo(text: string, options?: Option): string[]
```

**Options:**

- spacing: `number`  The number of spacing between two characters. Default `1`.
- maxLineWidth: `number`  The max length of lines. If exceed `maxLineWidth` following characters will get a line feed. Default `Infinity`.
- color: `string`  Setting the color for print. Default `none`. There contains several values:
  - `random` choosing a random color from the palette
  - `none` with no color setting
  - any other color string supported by [chalk](https://github.com/chalk/chalk)
- silent: `boolean`  Whether to prevent print characters when calling `yo()`.

For example,

```typescript
yo('ho', { color: 'blue' });
```

Then it will print a blue `HO`.

## Characters Supported

- 26 letters: `A-Z` (letters will be converted to uppercase)
- 10 numbers: `0-9`
- some punctuations: `·` `*` `-` `|`

Characters that are not supported will be ignored.

## Run the example

```bash
npm run example
```

```text
 /\\\    /\\\  /\\\\\\\\      /\\\\\\\\                /\\\    /\\\    /\\\\\\\\      /\\\\\\\\
 \/\\\   /\\\ /\\\_____/\\\  /\\\_____/\\\             \/\\\   \/\\\  /\\\_____/\\\  /\\\_____/\\\
   \/_\\\/\\\ \/\\\    \/\\\ \/\\\    \/\\\             \/\\\   \/\\\ \/\\\    \/\\\ \/\\\    \/\\\
      \/_\\\\  \/\\\    \/\\\ \/\\\    \/\\\  /\\\\\\\\\ \/\\\\\\\\\\\ \/\\\    \/\\\ \/\\\    \/\\\
         \/\\\  \/\\\    \/\\\ \/\\\    \/\\\ \/_______/  \/\\\____/\\\ \/\\\    \/\\\ \/\\\    \/\\\
          \/\\\  \/\\\    \/\\\ \/\\\    \/\\\             \/\\\   \/\\\ \/\\\    \/\\\ \/\\\    \/\\\
           \/\\\  \/_/\\\\\\\\\  \/_/\\\\\\\\\              \/\\\   \/\\\ \/_/\\\\\\\\\  \/_/\\\\\\\\\
            \/_/     \/_______/     \/_______/               \/_/    \/_/    \/_______/     \/_______/
```