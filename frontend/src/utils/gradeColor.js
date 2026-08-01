export const getGradeColor = (grade) => {
  const grades = {
    'A+': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'A': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'A-': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'B+': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'B': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'B-': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'C+': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'C': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'D': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'F': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return grades[grade] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
};
