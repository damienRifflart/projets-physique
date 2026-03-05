export interface SimParams {
  vx0: number;
  vy0: number;
  vz0: number;
  omega: number;
  x0: number;
  y0: number;
  z0: number;
}

export interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  step?: number;
  onChange: (v: number) => void;
}

export interface PlotProps {
  params: SimParams;
}

export interface FormulaProps {
  params: SimParams;
}