// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AnnotationsAPI from './annotations';
import {
  Annotation,
  AnnotationCreateParams,
  AnnotationInput,
  AnnotationListParams,
  AnnotationResponse,
  AnnotationUpdateParams,
  Annotations,
  AnnotationsBasePage,
  ListAnnotationsResponse,
} from './annotations';
import * as DimensionsAPI from './dimensions';
import {
  DimensionListTraceElementsParams,
  DimensionListValuesParams,
  DimensionValue,
  DimensionValuesBasePage,
  Dimensions,
  DimensionsResponse,
} from './dimensions';
import * as ErrorsAPI from './errors';
import { ErrorListParams, Errors, ErrorsResponse } from './errors';
import * as ExportsAPI from './exports';
import { Exports, VideoViewExportsResponse } from './exports';
import * as IncidentsAPI from './incidents';
import {
  Incident,
  IncidentBreakdown,
  IncidentListParams,
  IncidentListRelatedParams,
  IncidentNotification,
  IncidentNotificationRule,
  IncidentResponse,
  Incidents,
  IncidentsBasePage,
  NotificationRule,
} from './incidents';
import * as MetricsAPI from './metrics';
import {
  AllMetricValuesResponse,
  BreakdownValue,
  BreakdownValuesBasePage,
  InsightsResponse,
  MetricGetInsightsParams,
  MetricGetOverallValuesParams,
  MetricGetTimeseriesParams,
  MetricListBreakdownValuesParams,
  MetricListParams,
  MetricTimeseriesDataResponse,
  Metrics,
  OverallValuesResponse,
} from './metrics';
import * as RealTimeAPI from './real-time';
import {
  RealTime,
  RealTimeBreakdownResponse,
  RealTimeDimensionsResponse,
  RealTimeHistogramTimeseriesResponse,
  RealTimeMetricsResponse,
  RealTimeRetrieveBreakdownParams,
  RealTimeRetrieveHistogramTimeseriesParams,
  RealTimeRetrieveTimeseriesParams,
  RealTimeTimeseriesResponse,
} from './real-time';
import * as VideoViewsAPI from './video-views';
import {
  AbridgedVideoView,
  AbridgedVideoViewsBasePage,
  VideoViewListParams,
  VideoViewResponse,
  VideoViews,
} from './video-views';
import * as EngagementAPI from './engagement/engagement';
import { Engagement, EngagementHeatmap, EngagementHotspots, Hotspot } from './engagement/engagement';
import * as MonitoringAPI from './monitoring/monitoring';
import { Monitoring, MonitoringListDimensionsResponse } from './monitoring/monitoring';

export class Data extends APIResource {
  dimensions: DimensionsAPI.Dimensions = new DimensionsAPI.Dimensions(this._client);
  monitoring: MonitoringAPI.Monitoring = new MonitoringAPI.Monitoring(this._client);
  errors: ErrorsAPI.Errors = new ErrorsAPI.Errors(this._client);
  exports: ExportsAPI.Exports = new ExportsAPI.Exports(this._client);
  incidents: IncidentsAPI.Incidents = new IncidentsAPI.Incidents(this._client);
  metrics: MetricsAPI.Metrics = new MetricsAPI.Metrics(this._client);
  realTime: RealTimeAPI.RealTime = new RealTimeAPI.RealTime(this._client);
  videoViews: VideoViewsAPI.VideoViews = new VideoViewsAPI.VideoViews(this._client);
  annotations: AnnotationsAPI.Annotations = new AnnotationsAPI.Annotations(this._client);
  engagement: EngagementAPI.Engagement = new EngagementAPI.Engagement(this._client);
}

Data.Dimensions = Dimensions;
Data.Monitoring = Monitoring;
Data.Errors = Errors;
Data.Exports = Exports;
Data.Incidents = Incidents;
Data.Metrics = Metrics;
Data.RealTime = RealTime;
Data.VideoViews = VideoViews;
Data.Annotations = Annotations;
Data.Engagement = Engagement;

export declare namespace Data {
  export {
    Dimensions as Dimensions,
    type DimensionValue as DimensionValue,
    type DimensionsResponse as DimensionsResponse,
    type DimensionValuesBasePage as DimensionValuesBasePage,
    type DimensionListValuesParams as DimensionListValuesParams,
    type DimensionListTraceElementsParams as DimensionListTraceElementsParams,
  };

  export {
    Monitoring as Monitoring,
    type MonitoringListDimensionsResponse as MonitoringListDimensionsResponse,
  };

  export { Errors as Errors, type ErrorsResponse as ErrorsResponse, type ErrorListParams as ErrorListParams };

  export { Exports as Exports, type VideoViewExportsResponse as VideoViewExportsResponse };

  export {
    Incidents as Incidents,
    type Incident as Incident,
    type IncidentBreakdown as IncidentBreakdown,
    type IncidentNotification as IncidentNotification,
    type IncidentNotificationRule as IncidentNotificationRule,
    type IncidentResponse as IncidentResponse,
    type NotificationRule as NotificationRule,
    type IncidentsBasePage as IncidentsBasePage,
    type IncidentListRelatedParams as IncidentListRelatedParams,
    type IncidentListParams as IncidentListParams,
  };

  export {
    Metrics as Metrics,
    type AllMetricValuesResponse as AllMetricValuesResponse,
    type BreakdownValue as BreakdownValue,
    type InsightsResponse as InsightsResponse,
    type MetricTimeseriesDataResponse as MetricTimeseriesDataResponse,
    type OverallValuesResponse as OverallValuesResponse,
    type BreakdownValuesBasePage as BreakdownValuesBasePage,
    type MetricListParams as MetricListParams,
    type MetricListBreakdownValuesParams as MetricListBreakdownValuesParams,
    type MetricGetOverallValuesParams as MetricGetOverallValuesParams,
    type MetricGetInsightsParams as MetricGetInsightsParams,
    type MetricGetTimeseriesParams as MetricGetTimeseriesParams,
  };

  export {
    RealTime as RealTime,
    type RealTimeBreakdownResponse as RealTimeBreakdownResponse,
    type RealTimeDimensionsResponse as RealTimeDimensionsResponse,
    type RealTimeHistogramTimeseriesResponse as RealTimeHistogramTimeseriesResponse,
    type RealTimeMetricsResponse as RealTimeMetricsResponse,
    type RealTimeTimeseriesResponse as RealTimeTimeseriesResponse,
    type RealTimeRetrieveBreakdownParams as RealTimeRetrieveBreakdownParams,
    type RealTimeRetrieveTimeseriesParams as RealTimeRetrieveTimeseriesParams,
    type RealTimeRetrieveHistogramTimeseriesParams as RealTimeRetrieveHistogramTimeseriesParams,
  };

  export {
    VideoViews as VideoViews,
    type AbridgedVideoView as AbridgedVideoView,
    type VideoViewResponse as VideoViewResponse,
    type AbridgedVideoViewsBasePage as AbridgedVideoViewsBasePage,
    type VideoViewListParams as VideoViewListParams,
  };

  export {
    Annotations as Annotations,
    type Annotation as Annotation,
    type AnnotationInput as AnnotationInput,
    type AnnotationResponse as AnnotationResponse,
    type ListAnnotationsResponse as ListAnnotationsResponse,
    type AnnotationsBasePage as AnnotationsBasePage,
    type AnnotationListParams as AnnotationListParams,
    type AnnotationCreateParams as AnnotationCreateParams,
    type AnnotationUpdateParams as AnnotationUpdateParams,
  };

  export {
    Engagement as Engagement,
    type EngagementHeatmap as EngagementHeatmap,
    type EngagementHotspots as EngagementHotspots,
    type Hotspot as Hotspot,
  };
}
