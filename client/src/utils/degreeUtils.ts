import { DEGREES } from "../../../shared/constants";

export const getDegreeLabel = (value: string): string => {
  const degree = DEGREES.find((d) => d.value === value);
  return degree?.label || value;
};
