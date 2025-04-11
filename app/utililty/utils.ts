import { format } from 'date-fns';

export function arrayEquals(a1: any[], a2: any[]) {
  if (a1.length !== a2.length) {
    return false;
  }

  let i = a1.length;
  while (i--) {
    if (a1[i] !== a2[i]) return false;
  }
  return true;
}

export function formatDate(dateString: string) {
  if (!dateString) return 'Date N/A';
  try {
    return format(new Date(dateString), 'YYYY-MM-DD HH:mm:ss');
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; 
  }
}
