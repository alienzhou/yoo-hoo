# Hey

```bash
/\\\    /\\\   /\\\\\\\\\\  /\\\    /\\\
\/\\\   \/\\\  \/\\\_____/  \/\\\   /\\\
 \/\\\   \/\\\  \/\\\         \/_\\\/\\\
  \/\\\\\\\\\\\  \/\\\\\\\\\\    \/_\\\\
   \/\\\____/\\\  \/\\\_____/       \/\\\
    \/\\\   \/\\\  \/\\\             \/\\\
     \/\\\   \/\\\  \/\\\\\\\\\\      \/\\\
      \/_/    \/_/   \/________/       \/_/
```

Hey,

Print the funny words you want in the console. Have fun!

---

## How to install

```bash
npm i @infra-node/hey
```

## How to use

```js
import { hey } from '@infra-node/hey';

hey('Hey·Leslie');
```

## API

```typescript
// return the lines to print
hey(text: string, options?: Option): string[]
```

**Options:**

- spacing: `number`  The number of spacing between two characters. Default `1`.
- maxLineWidth: `number`  The max length of lines. If exceed `maxLineWidth` following characters will get a line feed. Default `Infinity`.
- color: `string`  Setting the color for print. Default `none`. There contains several values:
  - `random` choosing a random color from the palette
  - `none` with no color setting
  - any other color string supported by [chalk](https://github.com/chalk/chalk)
- characterDir: `string`  The directory where to load customized characters. Default `''`.
- silent: `boolean`  Whether to prevent print characters when calling `hey`.

For example,

```typescript
hey('yo', { color: 'blue' });
```

Then it will print a blue `YO`.

## Run the example

```bash
npm run example
```

```bash
/\\\    /\\\   /\\\\\\\\\\  /\\\    /\\\       /\\\          /\\\\\\\\\\     /\\\\\\\\\\  /\\\         /\\\\\\\\   /\\\\\\\\\\
\/\\\   \/\\\  \/\\\_____/  \/\\\   /\\\       \/\\\         \/\\\_____/    /\\\_______/  \/\\\        \/_/\\\_/   \/\\\_____/
 \/\\\   \/\\\  \/\\\         \/_\\\/\\\        \/\\\         \/\\\         \/\\\          \/\\\          \/\\\     \/\\\
  \/\\\\\\\\\\\  \/\\\\\\\\\\    \/_\\\\   /\\\  \/\\\         \/\\\\\\\\\\  \/\\\\\\\\\\   \/\\\          \/\\\     \/\\\\\\\\\\
   \/\\\____/\\\  \/\\\_____/       \/\\\  \/_/   \/\\\         \/\\\_____/   \/_______/\\\  \/\\\          \/\\\     \/\\\_____/
    \/\\\   \/\\\  \/\\\             \/\\\         \/\\\         \/\\\                 \/\\\  \/\\\          \/\\\     \/\\\
     \/\\\   \/\\\  \/\\\\\\\\\\      \/\\\         \/\\\\\\\\\\  \/\\\\\\\\\\   /\\\\\\\\\/   \/\\\\\\\\\\  /\\\\\\\\  \/\\\\\\\\\\
      \/_/    \/_/   \/________/       \/_/          \/________/   \/________/   \/_______/     \/________/  \/______/   \/________/
```