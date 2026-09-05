export const MIN_BATCH_YEAR = 2023;
export const MAX_BATCH_YEAR = 2035;

export const YEARS = Array.from(
  { length: MAX_BATCH_YEAR - MIN_BATCH_YEAR + 1 },
  (_, index) => MIN_BATCH_YEAR + index,
);

export type TeamFormData = {
  name: string;
  role: string;
  batchYear: number;
  linkedin: string;
  github: string;
  order: number;
};

export const emptyTeamForm: TeamFormData = {
  name: "",
  role: "",
  batchYear: 2026,
  linkedin: "",
  github: "",
  order: 0,
};