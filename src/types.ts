export type TrackName = 'Everyone' | 'Advanced' | 'Android' | 'Backend' | 'Frontend' | 'iOS';
export type CertificationName = 'Associate' | 'Professional';

export interface CourseInfo {
  title: string;
  tracks: TrackName[];
  certification?: {
    name: CertificationName;
    order: number;
  };
}

export interface CourseData {
  id: string;
  completedAt: string;
}

export interface Config {
  width: string;

  position: {
    top: string;
    right: string;
  };
  colors: {
    primary: string;
    background: string;
    border: string;
    text: string;
    textMuted: string;
    success: string;
    dropdownBg: string;
  };
  icons: {
    notStarted: string;
    inProgress: string;
    completed: string;
  };
};