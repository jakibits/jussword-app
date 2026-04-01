type GeneratePasswordOptions = {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  vibe: 'all' | 'readable' | 'memorable';
};

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

const UPPERCASE_READABLE = 'ABCDEFGHJKMNPQRSTUVWXYZ';
const LOWERCASE_READABLE = 'abcdefghjkmnpqrstuvwxyz';
const NUMBERS_READABLE = '23456789';
const SYMBOLS_READABLE = '@#$%*+-=?';

const CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
const VOWELS = 'aeiou';

const WORDS = [
  'correct', 'horse', 'battery', 'staple', 'cloud', 'river', 'mountain', 'forest',
  'ocean', 'desert', 'valley', 'island', 'meadow', 'canyon', 'glacier', 'volcano',
  'thunder', 'lightning', 'rainbow', 'sunset', 'sunrise', 'moonlight', 'starlight', 'twilight',
  'breeze', 'storm', 'wave', 'tide', 'current', 'stream', 'cascade', 'waterfall',
  'eagle', 'falcon', 'hawk', 'raven', 'sparrow', 'robin', 'cardinal', 'bluebird',
  'wolf', 'bear', 'fox', 'deer', 'rabbit', 'squirrel', 'otter', 'beaver',
  'maple', 'oak', 'pine', 'birch', 'willow', 'cedar', 'aspen', 'spruce',
  'amber', 'jade', 'ruby', 'pearl', 'coral', 'crystal', 'diamond', 'emerald',
  'bronze', 'silver', 'golden', 'copper', 'iron', 'steel', 'marble', 'granite',
  'winter', 'spring', 'summer', 'autumn', 'season', 'harvest', 'blossom', 'frost'
];

function getRandomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function getRandomChar(charset: string): string {
  return charset[getRandomInt(charset.length)];
}

function generateStandardPassword(options: GeneratePasswordOptions): string {
  let charset = '';
  const { uppercase, lowercase, numbers, symbols, vibe } = options;

  if (vibe === 'readable') {
    if (uppercase) charset += UPPERCASE_READABLE;
    if (lowercase) charset += LOWERCASE_READABLE;
    if (numbers) charset += NUMBERS_READABLE;
    if (symbols) charset += SYMBOLS_READABLE;
  } else {
    if (uppercase) charset += UPPERCASE;
    if (lowercase) charset += LOWERCASE;
    if (numbers) charset += NUMBERS;
    if (symbols) charset += SYMBOLS;
  }

  if (charset === '') {
    charset = LOWERCASE;
  }

  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += getRandomChar(charset);
  }

  return password;
}

function generateMemorablePassword(length: number): string {
  const targetLength = length;

  if (targetLength >= 15) {
    const wordCount = Math.max(2, Math.floor(targetLength / 6));
    const words: string[] = [];

    for (let i = 0; i < wordCount; i++) {
      words.push(WORDS[getRandomInt(WORDS.length)]);
    }

    let passphrase = words.join('');

    while (passphrase.length < targetLength) {
      passphrase += WORDS[getRandomInt(WORDS.length)];
    }

    if (passphrase.length > targetLength) {
      passphrase = passphrase.substring(0, targetLength);
    }

    return passphrase;
  } else {
    let password = '';
    const syllableLength = 3;
    const syllableCount = Math.ceil(targetLength / syllableLength);

    for (let i = 0; i < syllableCount; i++) {
      const consonant1 = getRandomChar(CONSONANTS);
      const vowel = getRandomChar(VOWELS);
      const consonant2 = getRandomChar(CONSONANTS);
      const syllable = consonant1 + vowel + consonant2;

      password += syllable;

      if (password.length >= targetLength) {
        break;
      }
    }

    return password.substring(0, targetLength);
  }
}

export function generatePassword(options: GeneratePasswordOptions): string {
  if (options.vibe === 'memorable') {
    return generateMemorablePassword(options.length);
  }

  return generateStandardPassword(options);
}
