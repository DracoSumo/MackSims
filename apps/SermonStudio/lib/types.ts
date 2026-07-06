// lib/types.ts

/**
 * Structured sermon outline. Added for beta; older saved sermons may not
 * have this field, so always normalize with defaultOutline() when loading.
 */
export type SermonOutline = {
  keyPoints: string[];      // main preaching points, in order
  illustrations: string[];  // stories, examples, media cues
  application: string;      // "so what" — practical application / call to action
};

export function defaultOutline(): SermonOutline {
  return { keyPoints: [], illustrations: [], application: '' };
}

export type Sermon = {
  id?: string;
  title: string;
  theme: string;
  /** ISO date string: YYYY-MM-DD */
  date: string;
  passages: string[];     // e.g., ["John 3:16", "Psalm 23:1"]
  notes: string;
  setlist: number[];      // song ids
  isSeriesItem: boolean;
  seriesId: string;       // series UUID or ''
  /** Optional for backwards compatibility with previously saved sermons. */
  outline?: SermonOutline;
};

export type Series = {
  id: string;
  name: string;
  color: string;
};

export type Song = {
  id: number;
  title: string;
  artist: string;
  themes: string[];
  tempo: 'slow' | 'mid' | 'up';
};

export type Verse = {
  ref: string;
  text: Record<string, string>; // { KJV: '...', ESV: '...' }
  themes: string[];
};
