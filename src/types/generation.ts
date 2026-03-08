/**
 * Asset and Generation types
 */

// ============================================================
// Assets
// ============================================================

export interface AssetLists {
  screenshots: string[];
  icons: string[];
  mascots: string[];
}

// ============================================================
// Generation
// ============================================================

export interface GenerationResult {
  path: string;
  relativePath?: string;
  status: 'success' | 'error';
  error?: string;
}

export interface GenerationProgress {
  type: 'start' | 'progress' | 'complete';
  current?: number;
  total?: number;
  item?: string;
  results?: GenerationResult[];
  outputDir?: string;
}
