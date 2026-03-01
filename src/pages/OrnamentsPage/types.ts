// src/pages/OrnamentsPage/types.ts
export interface Ornament {
  id: string;
  name: string;
  pathD: string;
  tooltipPosition: { top: string; left: string };
  description: string | React.ReactNode;
  image: string;
  labelPosition?: { x: number; y: number }; 
}
