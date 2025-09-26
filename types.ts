
export interface BugReportItem {
  line_number: number | string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Information';
  bug_description: string;
  suggested_fix: string;
}

export enum AppState {
    Idle,
    DetectingBugs,
    GeneratingTests,
    Error,
}

export enum ViewType {
    Bugs,
    Tests,
}
