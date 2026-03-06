import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Polyline, Polygon } from 'react-native-svg';

export interface IconProps {
  size?: number;
  color?: string;
  style?: object;
}

const defaultSize = 24;

/**
 * Grid/Table icon
 */
export const GridIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <Line x1="3" y1="9" x2="21" y2="9" />
      <Line x1="3" y1="15" x2="21" y2="15" />
      <Line x1="9" y1="3" x2="9" y2="21" />
      <Line x1="15" y1="3" x2="15" y2="21" />
    </Svg>
  </View>
);

/**
 * Arrow up icon for sort ascending
 */
export const ArrowUpIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Line x1="12" y1="19" x2="12" y2="5" />
      <Polyline points="5,12 12,5 19,12" />
    </Svg>
  </View>
);

/**
 * Arrow down icon for sort descending
 */
export const ArrowDownIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Polyline points="19,12 12,19 5,12" />
    </Svg>
  </View>
);

/**
 * Copy/Clipboard icon
 */
export const CopyIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <Path d="M5,15 L3,15 C1.89543,15 1,14.1046 1,13 L1,3 C1,1.89543 1.89543,1 3,1 L13,1 C14.1046,1 15,1.89543 15,3 L15,5" />
    </Svg>
  </View>
);

/**
 * Close/X icon
 */
export const CloseIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  </View>
);

/**
 * Refresh icon
 */
export const RefreshIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Polyline points="23,4 23,10 17,10" />
      <Polyline points="1,20 1,14 7,14" />
      <Path d="M3.51,9 C4.01717,7.56678 4.87913,6.2854 6.01547,5.27542 C7.15182,4.26543 8.52547,3.55976 10.0083,3.22426 C11.4911,2.88875 13.0348,2.93434 14.4952,3.35677 C15.9556,3.77921 17.2853,4.56471 18.36,5.64 L23,10 M1,14 L5.64,18.36 C6.71475,19.4353 8.04437,20.2208 9.50481,20.6432 C10.9652,21.0657 12.5089,21.1112 13.9917,20.7757 C15.4745,20.4402 16.8482,19.7346 17.9845,18.7246 C19.1209,17.7146 19.9828,16.4332 20.49,15" />
    </Svg>
  </View>
);

/**
 * Filter/Funnel icon
 */
export const FilterIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
    </Svg>
  </View>
);

/**
 * Code/JSON icon
 */
export const CodeIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Polyline points="16,18 22,12 16,6" />
      <Polyline points="8,6 2,12 8,18" />
    </Svg>
  </View>
);

/**
 * Calendar/Date icon
 */
export const CalendarIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  </View>
);

/**
 * Database/Server icon
 */
export const DatabaseIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M12,2 C16.4183,2 20,3.11929 20,4.5 L20,19.5 C20,20.8807 16.4183,22 12,22 C7.58172,22 4,20.8807 4,19.5 L4,4.5 C4,3.11929 7.58172,2 12,2 Z" />
      <Path d="M20,4.5 C20,5.88071 16.4183,7 12,7 C7.58172,7 4,5.88071 4,4.5" />
      <Path d="M20,12 C20,13.3807 16.4183,14.5 12,14.5 C7.58172,14.5 4,13.3807 4,12" />
    </Svg>
  </View>
);

/**
 * Chevron left icon
 */
export const ChevronLeftIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Polyline points="15,18 9,12 15,6" />
    </Svg>
  </View>
);

/**
 * Chevron right icon
 */
export const ChevronRightIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Polyline points="9,18 15,12 9,6" />
    </Svg>
  </View>
);

/**
 * Key icon for primary key
 */
export const KeyIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21,2 L19,4 L21,2 Z M19,4 L21,6 L15,12 L13,12 L13,10 L19,4 Z M12.22,12 C12.72,12.62 13,13.39 13,14.25 C13,16.32 11.32,18 9.25,18 C7.18,18 5.5,16.32 5.5,14.25 C5.5,12.18 7.18,10.5 9.25,10.5 C10.11,10.5 10.88,10.78 11.5,11.28 L12.22,12 Z" />
      <Circle cx="9.25" cy="14.25" r="1" />
    </Svg>
  </View>
);

/**
 * Link icon for foreign key
 */
export const LinkIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M10,13 C10.4295,13.5741 10.9774,14.0492 11.6066,14.3929 C12.2357,14.7367 12.9315,14.9411 13.6467,14.9923 C14.3618,15.0435 15.0796,14.9404 15.7513,14.6898 C16.4231,14.4392 17.0331,14.0471 17.54,13.54 L20.54,10.54 C21.4508,9.59699 21.9548,8.33397 21.9434,7.02299 C21.932,5.71201 21.4061,4.45794 20.479,3.53087 C19.5519,2.6038 18.2979,2.07799 16.9869,2.06663 C15.6759,2.05527 14.4129,2.55921 13.47,3.47 L11.75,5.18" />
      <Path d="M14,11 C13.5705,10.4259 13.0226,9.95083 12.3934,9.60707 C11.7643,9.26331 11.0685,9.05889 10.3533,9.00768 C9.63816,8.95646 8.92037,9.05964 8.24861,9.31023 C7.57685,9.56082 6.96684,9.95294 6.46,10.46 L3.46,13.46 C2.54921,14.403 2.04527,15.666 2.05663,16.977 C2.06799,18.288 2.5938,19.5421 3.52087,20.4691 C4.44794,21.3962 5.70201,21.922 7.01299,21.9334 C8.32397,21.9447 9.58699,21.4408 10.53,20.53 L12.24,18.82" />
    </Svg>
  </View>
);

/**
 * Warning icon
 */
export const WarningIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M10.29,3.86 L1.82,18 C1.64,18.3 1.55,18.64 1.55,19 C1.55,19.83 2.22,20.5 3.05,20.5 L20.95,20.5 C21.78,20.5 22.45,19.83 22.45,19 C22.45,18.64 22.36,18.3 22.18,18 L13.71,3.86 C13.32,3.18 12.69,2.75 12,2.75 C11.31,2.75 10.68,3.18 10.29,3.86 Z" />
      <Line x1="12" y1="9" x2="12" y2="13" />
      <Circle cx="12" cy="17" r="1" fill={color} />
    </Svg>
  </View>
);

/**
 * Document/File icon
 */
export const DocumentIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M14,2 L6,2 C4.89543,2 4,2.89543 4,4 L4,20 C4,21.1046 4.89543,22 6,22 L18,22 C19.1046,22 20,21.1046 20,20 L20,8 L14,2 Z" />
      <Polyline points="14,2 14,8 20,8" />
      <Line x1="16" y1="13" x2="8" y2="13" />
      <Line x1="16" y1="17" x2="8" y2="17" />
      <Polyline points="10,9 9,9 8,9" />
    </Svg>
  </View>
);

/**
 * Check/Success icon
 */
export const CheckIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Polyline points="20,6 9,17 4,12" />
    </Svg>
  </View>
);

/**
 * List icon for indexes
 */
export const ListIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Line x1="8" y1="6" x2="21" y2="6" />
      <Line x1="8" y1="12" x2="21" y2="12" />
      <Line x1="8" y1="18" x2="21" y2="18" />
      <Circle cx="4" cy="6" r="1" fill={color} />
      <Circle cx="4" cy="12" r="1" fill={color} />
      <Circle cx="4" cy="18" r="1" fill={color} />
    </Svg>
  </View>
);

/**
 * Play/Execute icon
 */
export const PlayIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={0}>
      <Polygon points="5,3 19,12 5,21 5,3" />
    </Svg>
  </View>
);

/**
 * Download icon for export
 */
export const DownloadIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M21,15 L21,19 C21,20.1046 20.1046,21 19,21 L5,21 C3.89543,21 3,20.1046 3,19 L3,15" />
      <Polyline points="7,10 12,15 17,10" />
      <Line x1="12" y1="15" x2="12" y2="3" />
    </Svg>
  </View>
);

/**
 * Funnel icon for filter (alias for FilterIcon)
 */
export const FunnelIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
    </Svg>
  </View>
);

/**
 * Server/Database icon for empty state
 */
export const ServerIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <Rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <Circle cx="6" cy="6" r="1" fill={color} />
      <Circle cx="6" cy="18" r="1" fill={color} />
    </Svg>
  </View>
);

/**
 * Chevron back icon (alias for left)
 */
export const ChevronBackIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Polyline points="15,18 9,12 15,6" />
    </Svg>
  </View>
);

/**
 * Chevron forward icon (alias for right)
 */
export const ChevronForwardIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Polyline points="9,18 15,12 9,6" />
    </Svg>
  </View>
);

/**
 * Check circle icon
 */
export const CheckCircleIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="9,12 11,14 15,10" />
    </Svg>
  </View>
);

/**
 * Close circle icon
 */
export const CloseCircleIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx="12" cy="12" r="10" />
      <Line x1="15" y1="9" x2="9" y2="15" />
      <Line x1="9" y1="9" x2="15" y2="15" />
    </Svg>
  </View>
);

/**
 * Arrow forward icon
 */
export const ArrowForwardIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Polyline points="12,5 19,12 12,19" />
    </Svg>
  </View>
);

/**
 * Code brackets icon for DDL view
 */
export const CodeBracketsIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M8,3 L4,3 C2.89543,3 2,3.89543 2,5 L2,19 C2,20.1046 2.89543,21 4,21 L8,21" />
      <Path d="M16,3 L20,3 C21.1046,3 22,3.89543 22,5 L22,19 C22,20.1046 21.1046,21 20,21 L16,21" />
    </Svg>
  </View>
);

/**
 * Stats/Bar chart icon for column statistics
 */
export const StatsIcon: React.FC<IconProps> = ({ size = defaultSize, color = 'currentColor', style }) => (
  <View style={style}>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x="18" y="3" width="4" height="18" />
      <Rect x="10" y="8" width="4" height="13" />
      <Rect x="2" y="13" width="4" height="8" />
    </Svg>
  </View>
);
