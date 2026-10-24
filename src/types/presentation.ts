export type AgentStatus =
  | 'INITIALIZING'
  | 'AWAITING_USER_PARAMS'
  | 'PLANNING'
  | 'GENERATING_ASSETS'
  | 'CODING_SLIDES'
  | 'QA_PROBING'
  | 'COMPLETED'
  | 'FAILED';

export interface MissionStep {
  step: number;
  title: string;
  completed: boolean;
  active?: boolean;
}

export interface LockedParams {
  page_count: number;
  page_count_mode?: 'AUTO' | 'MANUAL';
  reasoning_for_page_count?: string;
  language: string;
  audience: string;
  tone: string;
}

export interface VisualSystem {
  theme_name: string;
  primary_bg: string;
  secondary_bg?: string;
  accent_color: string;
  text_primary: string;
  text_muted?: string;
  font_family: string;
  css_file_path?: string;
  cover_image_path?: string;
}

export type LayoutType =
  | 'cover_split_right_image'
  | 'horizontal_milestone_chain'
  | 'quadrant_matrix'
  | 'two_column_comparison'
  | 'stepped_process_flow'
  | 'stat_hero_with_breakdown'
  | 'hierarchical_cards_grid'
  | 'architecture_flow_diagram'
  | 'takeaway_synthesis_closing';

export interface OutlineItem {
  page_number: number;
  file_name: string;
  title: string;
  subtitle?: string;
  layout_type: LayoutType;
  visual_component: string;
  key_points: string[];
  source_reference?: string;
}

export interface GeneratedPage {
  page_number: number;
  file_path: string;
  title: string;
  layout_type: LayoutType;
  status: 'QUEUED' | 'GENERATING' | 'DOM_FIXED' | 'VISION_VERIFIED' | 'FAILED';
  retries: number;
  html: string;
  probe_result?: RenderProbeResult;
}

export interface RenderProbeIssue {
  type: 'VERTICAL_OVERFLOW' | 'HORIZONTAL_OVERFLOW' | 'ELEMENT_OUT_OF_BOUNDS' | 'INTERNAL_CLIPPING' | 'ELEMENT_COLLISION' | 'BROKEN_RESOURCE';
  overflow_px?: number;
  element?: string;
  description: string;
  src?: string;
}

export interface RenderProbeResult {
  page_number: number;
  file_name: string;
  passed: boolean;
  issues: RenderProbeIssue[];
}

export interface QAReport {
  vision_checked: boolean;
  dom_probe_passed: boolean;
  issues_found_and_fixed: string[];
  unresolved_p0_issues: string[];
}

export interface PresentationState {
  job_id: string;
  status: AgentStatus;
  topic: string;
  mission_progress: MissionStep[];
  locked_params: LockedParams;
  visual_system: VisualSystem;
  outline: OutlineItem[];
  generated_pages: Record<number, GeneratedPage>;
  qa_report: QAReport;
  active_page_index: number;
}

export interface ToolExecution {
  id: string;
  name:
    | 'load_skill'
    | 'read_file'
    | 'request_user_parameters'
    | 'update_mission_progress'
    | 'lock_outline'
    | 'generate_image'
    | 'write_file'
    | 'write_page'
    | 'batch_edit_pages'
    | 'screenshot_and_understand_image'
    | 'render_probe_all';
  args: any;
  result?: any;
  status: 'running' | 'completed' | 'failed';
  timestamp: string;
  detailMessage?: string;
}
