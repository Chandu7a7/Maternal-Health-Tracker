export const getTrimester = (month) => {
  if (month <= 3) return 1;
  if (month <= 6) return 2;
  return 3;
};

export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const getRiskColor = (risk) => {
  switch (risk?.toLowerCase()) {
    case 'high':
      return '#C62828';
    case 'medium':
      return '#F9A825';
    case 'safe':
    default:
      return '#2E7D32';
  }
};

export const getRiskEmoji = (risk) => {
  switch (risk?.toLowerCase()) {
    case 'high':
      return '🚨';
    case 'medium':
      return '⚠️';
    case 'safe':
    default:
      return '✅';
  }
};
