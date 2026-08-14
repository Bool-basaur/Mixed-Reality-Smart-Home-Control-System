export interface HADevice {
  id: string;

  name?: string;

  manufacturer?: string;

  model?: string;

  areaId?: string | null;

  identifiers?: string[][];
}