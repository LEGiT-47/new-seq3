const flavourPalette = [
  'bg-red-500 text-white border-red-500',
  'bg-orange-500 text-white border-orange-500',
  'bg-amber-400 text-black border-amber-400',
  'bg-yellow-400 text-black border-yellow-400',
  'bg-lime-300 text-black border-lime-300',
  'bg-green-500 text-white border-green-500',
  'bg-emerald-500 text-white border-emerald-500',
  'bg-teal-500 text-white border-teal-500',
  'bg-cyan-500 text-white border-cyan-500',
  'bg-sky-500 text-white border-sky-500',
  'bg-blue-500 text-white border-blue-500',
  'bg-indigo-500 text-white border-indigo-500',
  'bg-violet-500 text-white border-violet-500',
  'bg-pink-500 text-white border-pink-500',
  'bg-rose-500 text-white border-rose-500',
];

const keywordMap = [
  { test: /bbq|barbeque|barbecue|smoky/i, style: 'bg-red-500 text-white border-red-500' },
  { test: /peri|chilli|chili|tandoori|masala|chatpata|hing|jeera|pepper/i, style: 'bg-orange-500 text-white border-orange-500' },
  { test: /cheese|cream/i, style: 'bg-yellow-400 text-black border-yellow-400' },
  { test: /mint|pudina|green chutney/i, style: 'bg-green-500 text-white border-green-500' },
  { test: /lime|nimbu|lemon|tomato/i, style: 'bg-lime-300 text-black border-lime-300' },
  { test: /salt/i, style: 'bg-slate-200 text-slate-900 border-slate-300' },
];

const hash = (value = '') => {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0;
  }
  return h;
};

export const getFlavourColorClass = (flavour) => {
  const text = String(flavour || '').trim();
  if (!text) return 'bg-gray-100 text-gray-700 border-gray-200';

  const keywordMatch = keywordMap.find((item) => item.test.test(text));
  if (keywordMatch) return keywordMatch.style;

  return flavourPalette[hash(text.toLowerCase()) % flavourPalette.length];
};
