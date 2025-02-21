export interface WidgetConfig {
  colors: ColorConfig;
  icons: IconConfig;
  text: TextConfig;
}

export interface ColorConfig {
  success: string;
}

export interface IconConfig {
  track: string;
  trackCompleted: string;
  completed: string;
  inProgress: string;
  notStarted: string;
  certification: string;
  certificationInProgress: string;
}

export interface TextConfig {
  completed: string;
  trackCompleted: string;
  error: string;
  loginPrompt: string;
}

export interface CourseData {
  id: string;
  completedAt?: string;
  enrolledAt: string;
}

export interface CourseStatus {
  text: string;
  style: string;
}

export interface WidgetState {
  selectedTrack: TrackName;
  userCourses: CourseData[];
  isLoading: boolean;
  error?: string;
}

export type TrackName = string;
export type CertificationName = string;

export interface CourseInfo {
  title: string;
  tracks: TrackName[];
  certification?: {
    name: CertificationName;
    order: number;
  };
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