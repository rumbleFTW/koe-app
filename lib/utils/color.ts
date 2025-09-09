export const getContrastingTextColor = (bgColor: string) => {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return brightness > 128 ? 'text-black' : 'text-white';
};

export const getBorderColor = (bgColor: string) => {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return brightness > 128 ? 'border-gray-600' : 'border-white';
};
