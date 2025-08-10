export enum BatchType {
  HM = 'hm', // Holerite Mensal
  HF = 'hf', // Holerite de Férias
  H13 = 'h13', // Holerite de Décimo Terceiro
  HR = 'hr', // Holerite de Rescisão
  HA = 'ha', // Holerite de Adiantamento
  HPLR = 'hplr', // Holerite de Participação nos Lucros e Resultados (PLR)
}

export const BATCH_TYPE = {
  HM: BatchType.HM,
  HF: BatchType.HF,
  H13: BatchType.H13,
  HR: BatchType.HR,
  HA: BatchType.HA,
  HPLR: BatchType.HPLR,
} as const;

export type BatchTypeType = keyof typeof BATCH_TYPE;
