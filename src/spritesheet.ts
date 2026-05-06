// 8 rows × 8 columns spritesheet (1536×1536, 192×192 per frame).
// Only animation rows actually used are listed.

export const SHEET_COLS = 8;
export const FRAME_W    = 192;
export const FRAME_H    = 192;

export const ANIM_ROWS: Record<string, number> = {
  idle:  0,
  run:   2,
  sleep: 3,
  react: 4,
};
