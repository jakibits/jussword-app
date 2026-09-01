export type VibePreset = 'all' | 'readable' | 'memorable' | 'pin';
export type MemorableStyle = 'pseudowords' | 'passphrase';

export interface GeneratePasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous?: boolean;
  vibe: VibePreset;
  // Memorable mode options
  memorableStyle?: MemorableStyle;
  wordCount?: number;
  separator?: string;
  capitalize?: boolean;
  includeNumber?: boolean;
}

export interface PasswordAnalysis {
  entropyBits: number;
  strengthScore: number; // 0 to 4
  strengthLabel: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  crackTimeEstimate: string;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSymbols: boolean;
}

// Standard character sets
const UPPERCASE_ALL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_ALL = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS_ALL = '0123456789';
const SYMBOLS_ALL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Readable character sets (excluding confusing glyphs: 0, O, o, 1, l, I, |, `, ')
const UPPERCASE_READABLE = 'ABCDEFGHJKMNPQRSTUVWXYZ';
const LOWERCASE_READABLE = 'abcdefghjkmnpqrstuvwxyz';
const NUMBERS_READABLE = '23456789';
const SYMBOLS_READABLE = '@#$%*+-=?';

// Ambiguous characters to filter when excludeAmbiguous is true
const AMBIGUOUS_CHARS = new Set(['0', 'O', 'o', '1', 'l', 'I', '|', '`', "'", '"', ';', ':']);

// Phonetic Consonants and Vowels for Pseudo-Words
const CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
const VOWELS = 'aeiou';

// Rich Diceware-style curated word list (safe, distinct, memorable)
const WORD_LIST = [
  'amber', 'anchor', 'anthem', 'apollo', 'arctic', 'arrow', 'aspen', 'astral',
  'atlas', 'aurora', 'autumn', 'avatar', 'badger', 'balsam', 'banner', 'beacon',
  'beaver', 'beetle', 'breeze', 'birch', 'blizzard', 'blossom', 'boulder',
  'bronze', 'cactus', 'canyon', 'cascade', 'castle', 'cedar', 'celestial', 'cipher',
  'cliff', 'clover', 'cobalt', 'comet', 'copper', 'coral', 'cosmos', 'cradle',
  'crater', 'creek', 'crystal', 'current', 'cypress', 'delta', 'desert', 'diamond',
  'dolphin', 'dragon', 'dune', 'eagle', 'echo', 'eclipse', 'ember', 'emerald',
  'falcon', 'feather', 'ferret', 'fjord', 'flame', 'flint', 'flora', 'forest',
  'fossil', 'fox', 'frost', 'galaxy', 'garnet', 'geyser', 'glacier', 'glade',
  'glow', 'granite', 'grove', 'harbor', 'harvest', 'haven', 'hawk', 'hazel',
  'helix', 'horizon', 'iceberg', 'iguana', 'impact', 'indigo', 'island', 'jasper',
  'javelin', 'jungle', 'jupiter', 'lagoon', 'lantern', 'larch', 'lark', 'laser',
  'legend', 'lightning', 'lotus', 'lunar', 'lynx', 'magnet', 'magnolia', 'mammoth',
  'mantis', 'maple', 'marble', 'matrix', 'meadow', 'meteor', 'mineral', 'mirage',
  'monarch', 'moonlight', 'moss', 'mountain', 'nebula', 'neon', 'nest', 'neutron',
  'nexus', 'nimble', 'nitro', 'nova', 'oasis', 'oak', 'obsidian', 'ocean',
  'onyx', 'opal', 'optics', 'orbit', 'orchid', 'origami', 'osprey', 'otter',
  'ozone', 'panda', 'panther', 'pebble', 'pelican', 'phantom', 'phoenix', 'photon',
  'pinnacle', 'planet', 'plasma', 'polar', 'prism', 'pulsar', 'pyramid', 'quantum',
  'quartz', 'quiver', 'radar', 'radiant', 'rainbow', 'raven', 'ravine', 'reef',
  'relic', 'ridge', 'ripple', 'river', 'robin', 'rocket', 'ruby', 'saddle',
  'safari', 'sage', 'samurai', 'sapphire', 'satellite', 'savanna', 'scalar', 'sequoia',
  'serenity', 'shadow', 'shield', 'sierra', 'silver', 'solace', 'solar', 'sonar',
  'sparrow', 'spectra', 'sphinx', 'spirit', 'spruce', 'starlight', 'stellar', 'storm',
  'summit', 'sunburst', 'sunset', 'swift', 'tempest', 'thistle', 'thunder', 'tide',
  'timber', 'titan', 'topaz', 'torrent', 'trajectory', 'tundra', 'twilight', 'typhoon',
  'valley', 'valkyrie', 'vector', 'velocity', 'velvet', 'vessel', 'victor', 'vortex',
  'voyage', 'vulcan', 'walnut', 'waterfall', 'wave', 'whisper', 'willow', 'wind',
  'winter', 'wizard', 'wolf', 'zenith', 'zephyr', 'zodiac'
];

/**
 * Fast, cryptographically secure random integer in [0, max - 1]
 */
export function getCryptoRandomInt(max: number): number {
  if (max <= 1) return 0;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

/**
 * Cryptographic batch random bytes filler
 */
function getRandomBytes(count: number): Uint32Array {
  const array = new Uint32Array(count);
  crypto.getRandomValues(array);
  return array;
}

/**
 * Cryptographic Fisher-Yates array shuffle in place
 */
function shuffleArray<T>(array: T[]): T[] {
  const randomValues = getRandomBytes(array.length);
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomValues[i] % (i + 1);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
 * Filter ambiguous characters from a string
 */
function filterAmbiguous(str: string): string {
  return str
    .split('')
    .filter((char) => !AMBIGUOUS_CHARS.has(char))
    .join('');
}

/**
 * Generate standard password with character guarantees
 */
function generateStandardPassword(options: GeneratePasswordOptions): string {
  const { length, uppercase, lowercase, numbers, symbols, excludeAmbiguous, vibe } = options;
  const isReadable = vibe === 'readable';

  let uSet = isReadable ? UPPERCASE_READABLE : UPPERCASE_ALL;
  let lSet = isReadable ? LOWERCASE_READABLE : LOWERCASE_ALL;
  let nSet = isReadable ? NUMBERS_READABLE : NUMBERS_ALL;
  let sSet = isReadable ? SYMBOLS_READABLE : SYMBOLS_ALL;

  if (excludeAmbiguous && !isReadable) {
    uSet = filterAmbiguous(uSet);
    lSet = filterAmbiguous(lSet);
    nSet = filterAmbiguous(nSet);
    sSet = filterAmbiguous(sSet);
  }

  const activePools: string[] = [];
  if (uppercase && uSet.length > 0) activePools.push(uSet);
  if (lowercase && lSet.length > 0) activePools.push(lSet);
  if (numbers && nSet.length > 0) activePools.push(nSet);
  if (symbols && sSet.length > 0) activePools.push(sSet);

  // Fallback if no pool active
  if (activePools.length === 0) {
    activePools.push(lSet.length > 0 ? lSet : LOWERCASE_ALL);
  }

  const combinedCharset = activePools.join('');
  const passwordChars: string[] = [];

  // Guarantee at least 1 character from each active character group if length permits
  const guaranteeCount = Math.min(activePools.length, length);
  for (let i = 0; i < guaranteeCount; i++) {
    const pool = activePools[i];
    passwordChars.push(pool[getCryptoRandomInt(pool.length)]);
  }

  // Fill the remaining length with random chars from combined pool
  const remainingCount = length - passwordChars.length;
  if (remainingCount > 0) {
    const randomIndexes = getRandomBytes(remainingCount);
    for (let i = 0; i < remainingCount; i++) {
      const idx = randomIndexes[i] % combinedCharset.length;
      passwordChars.push(combinedCharset[idx]);
    }
  }

  // Cryptographically shuffle to eliminate positional bias
  return shuffleArray(passwordChars).join('');
}

/**
 * Generate Phonetic Consonant-Vowel-Consonant (CVC) Pronounceable Pseudo-Words
 * Creates fun, unique, non-existing pronounceable words (e.g. BikVopSud, zalmupkef82)
 */
function generatePronounceablePseudoWords(options: GeneratePasswordOptions): string {
  const targetLength = Math.max(4, Math.min(64, options.length));
  const capitalize = options.capitalize ?? true;
  const includeNumber = options.includeNumber ?? false;
  const includeSymbols = options.symbols ?? false;

  let numSuffix = '';
  if (includeNumber) {
    numSuffix = (getCryptoRandomInt(90) + 10).toString(); // e.g. 42
  }

  let symSuffix = '';
  if (includeSymbols) {
    const syms = '!@#$%*+-=?';
    symSuffix = syms[getCryptoRandomInt(syms.length)];
  }

  const effectiveLength = Math.max(3, targetLength - numSuffix.length - symSuffix.length);
  let result = '';
  let capitalizeNext = capitalize;

  while (result.length < effectiveLength) {
    const remaining = effectiveLength - result.length;

    const c1 = CONSONANTS[getCryptoRandomInt(CONSONANTS.length)];
    const v = VOWELS[getCryptoRandomInt(VOWELS.length)];
    const c2 = CONSONANTS[getCryptoRandomInt(CONSONANTS.length)];

    let syllable = '';
    if (remaining === 1) {
      syllable = (result.length > 0 && VOWELS.includes(result[result.length - 1])) ? c1 : v;
    } else if (remaining === 2) {
      syllable = c1 + v;
    } else {
      syllable = c1 + v + c2;
    }

    if (capitalizeNext) {
      syllable = syllable.charAt(0).toUpperCase() + syllable.slice(1);
    }

    result += syllable;
    capitalizeNext = capitalize && (result.length % 3 === 0);
  }

  return result.substring(0, effectiveLength) + numSuffix + symSuffix;
}

/**
 * Generate memorable word passphrase (Diceware style)
 */
function generateMemorablePassphrase(options: GeneratePasswordOptions): string {
  const wordCount = options.wordCount || Math.max(3, Math.min(8, Math.round(options.length / 4)));
  const separator = options.separator ?? '-';
  const capitalize = options.capitalize ?? true;
  const includeNumber = options.includeNumber ?? false;

  const chosenWords: string[] = [];
  const randomIndices = getRandomBytes(wordCount + 2);

  for (let i = 0; i < wordCount; i++) {
    let word = WORD_LIST[randomIndices[i] % WORD_LIST.length];
    if (capitalize) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    chosenWords.push(word);
  }

  if (includeNumber) {
    const num = (randomIndices[wordCount] % 90 + 10).toString(); // 2-digit number
    chosenWords.push(num);
  }

  return chosenWords.join(separator);
}

/**
 * Generate numeric PIN
 */
function generatePin(length: number): string {
  const pinLength = Math.max(4, Math.min(16, length));
  const randomBytes = getRandomBytes(pinLength);
  let pin = '';
  for (let i = 0; i < pinLength; i++) {
    pin += NUMBERS_ALL[randomBytes[i] % NUMBERS_ALL.length];
  }
  return pin;
}

/**
 * Main password generation router
 */
export function generatePassword(options: GeneratePasswordOptions): string {
  if (options.vibe === 'pin') {
    return generatePin(options.length);
  }

  if (options.vibe === 'memorable') {
    if (options.memorableStyle === 'pseudowords') {
      return generatePronounceablePseudoWords(options);
    }
    return generateMemorablePassphrase(options);
  }

  return generateStandardPassword(options);
}

/**
 * Calculate Shannon Entropy and security analysis
 */
export function analyzePassword(password: string, vibe: VibePreset = 'all'): PasswordAnalysis {
  if (!password) {
    return {
      entropyBits: 0,
      strengthScore: 0,
      strengthLabel: 'Very Weak',
      crackTimeEstimate: 'Instant',
      hasUppercase: false,
      hasLowercase: false,
      hasNumbers: false,
      hasSymbols: false,
    };
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);

  let poolSize = 0;
  if (hasUppercase) poolSize += 26;
  if (hasLowercase) poolSize += 26;
  if (hasNumbers) poolSize += 10;
  if (hasSymbols) poolSize += 33;

  if (poolSize === 0) poolSize = 26;

  // Entropy calculation
  let entropyBits = 0;
  if ((vibe === 'memorable') && (password.includes('-') || password.includes('.') || password.includes('_') || password.includes(' '))) {
    const parts = password.split(/[-._\s]/).filter(Boolean);
    entropyBits = Math.round(parts.length * Math.log2(WORD_LIST.length));
  } else {
    entropyBits = Math.round(password.length * Math.log2(poolSize));
  }

  // Determine strength score (0 - 4) based on both entropy and character diversity
  let strengthScore = 0;
  let strengthLabel: PasswordAnalysis['strengthLabel'] = 'Very Weak';

  const typesCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;

  if (entropyBits >= 80 && password.length >= 14 && typesCount >= 3) {
    strengthScore = 4;
    strengthLabel = 'Very Strong';
  } else if (entropyBits >= 60 && password.length >= 10 && typesCount >= 2) {
    strengthScore = 3;
    strengthLabel = 'Strong';
  } else if (entropyBits >= 40 && password.length >= 8) {
    strengthScore = 2;
    strengthLabel = 'Good';
  } else if (entropyBits >= 24 && password.length >= 6) {
    strengthScore = 1;
    strengthLabel = 'Fair';
  } else {
    strengthScore = 0;
    strengthLabel = password.length > 0 ? 'Weak' : 'Very Weak';
  }

  // Estimate crack time assuming 100 billion (10^11) guesses per second
  let crackTimeEstimate = 'Instant';
  if (entropyBits < 28) {
    crackTimeEstimate = '< 1 second';
  } else if (entropyBits < 36) {
    crackTimeEstimate = 'A few seconds';
  } else if (entropyBits < 46) {
    crackTimeEstimate = 'A few minutes';
  } else if (entropyBits < 56) {
    crackTimeEstimate = 'A few hours';
  } else if (entropyBits < 66) {
    crackTimeEstimate = 'A few months';
  } else if (entropyBits < 78) {
    crackTimeEstimate = 'Several centuries';
  } else if (entropyBits < 96) {
    crackTimeEstimate = 'Millions of years';
  } else {
    crackTimeEstimate = 'Trillions of centuries';
  }

  return {
    entropyBits,
    strengthScore,
    strengthLabel,
    crackTimeEstimate,
    hasUppercase,
    hasLowercase,
    hasNumbers,
    hasSymbols,
  };
}
