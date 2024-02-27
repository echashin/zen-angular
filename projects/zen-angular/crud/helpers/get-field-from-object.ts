export function GetFieldFromObject<T = Record<string, any>>(obj: T, field: string): any {
  const fields: string[] = field.split('.');
  let currentValue: any = obj;

  for (const field of fields) {
    if (!currentValue[field]) return null;
    currentValue = currentValue[field];
  }

  return currentValue;
}
