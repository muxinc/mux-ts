# Data

## Dimensions

Types:

- <code><a href="./src/resources/data/dimensions.ts">DimensionValue</a></code>
- <code><a href="./src/resources/data/dimensions.ts">DimensionsResponse</a></code>

Methods:

- <code title="get /data/v1/dimensions">client.data.dimensions.<a href="./src/resources/data/dimensions.ts">list</a>() -> DimensionsResponse</code>
- <code title="get /data/v1/dimensions/{DIMENSION_ID}">client.data.dimensions.<a href="./src/resources/data/dimensions.ts">listValues</a>(dimensionID, { ...params }) -> DimensionValuesBasePage</code>
- <code title="get /data/v1/dimensions/{DIMENSION_ID}/elements">client.data.dimensions.<a href="./src/resources/data/dimensions.ts">listTraceElements</a>(dimensionID, { ...params }) -> DimensionValuesBasePage</code>

## Monitoring

Types:

- <code><a href="./src/resources/data/monitoring/monitoring.ts">MonitoringListDimensionsResponse</a></code>

Methods:

- <code title="get /data/v1/monitoring/dimensions">client.data.monitoring.<a href="./src/resources/data/monitoring/monitoring.ts">listDimensions</a>() -> MonitoringListDimensionsResponse</code>

### Metrics

Types:

- <code><a href="./src/resources/data/monitoring/metrics.ts">MetricListResponse</a></code>
- <code><a href="./src/resources/data/monitoring/metrics.ts">MetricGetBreakdownResponse</a></code>
- <code><a href="./src/resources/data/monitoring/metrics.ts">MetricGetBreakdownTimeseriesResponse</a></code>
- <code><a href="./src/resources/data/monitoring/metrics.ts">MetricGetHistogramTimeseriesResponse</a></code>
- <code><a href="./src/resources/data/monitoring/metrics.ts">MetricGetTimeseriesResponse</a></code>

Methods:

- <code title="get /data/v1/monitoring/metrics">client.data.monitoring.metrics.<a href="./src/resources/data/monitoring/metrics.ts">list</a>() -> MetricListResponse</code>
- <code title="get /data/v1/monitoring/metrics/{MONITORING_METRIC_ID}/breakdown">client.data.monitoring.metrics.<a href="./src/resources/data/monitoring/metrics.ts">getBreakdown</a>(monitoringMetricID, { ...params }) -> MetricGetBreakdownResponse</code>
- <code title="get /data/v1/monitoring/metrics/{MONITORING_METRIC_ID}/timeseries">client.data.monitoring.metrics.<a href="./src/resources/data/monitoring/metrics.ts">getTimeseries</a>(monitoringMetricID, { ...params }) -> MetricGetTimeseriesResponse</code>
- <code title="get /data/v1/monitoring/metrics/{MONITORING_METRIC_ID}/breakdown-timeseries">client.data.monitoring.metrics.<a href="./src/resources/data/monitoring/metrics.ts">getBreakdownTimeseries</a>(monitoringMetricID, { ...params }) -> MetricGetBreakdownTimeseriesResponse</code>
- <code title="get /data/v1/monitoring/metrics/{MONITORING_HISTOGRAM_METRIC_ID}/histogram-timeseries">client.data.monitoring.metrics.<a href="./src/resources/data/monitoring/metrics.ts">getHistogramTimeseries</a>(monitoringHistogramMetricID, { ...params }) -> MetricGetHistogramTimeseriesResponse</code>

## Errors

Types:

- <code><a href="./src/resources/data/errors.ts">ErrorsResponse</a></code>

Methods:

- <code title="get /data/v1/errors">client.data.errors.<a href="./src/resources/data/errors.ts">list</a>({ ...params }) -> ErrorsResponse</code>

## Exports

Types:

- <code><a href="./src/resources/data/exports.ts">VideoViewExportsResponse</a></code>

Methods:

- <code title="get /data/v1/exports/views">client.data.exports.<a href="./src/resources/data/exports.ts">listVideoViews</a>() -> VideoViewExportsResponse</code>

## Incidents

Types:

- <code><a href="./src/resources/data/incidents.ts">Incident</a></code>
- <code><a href="./src/resources/data/incidents.ts">IncidentBreakdown</a></code>
- <code><a href="./src/resources/data/incidents.ts">IncidentNotification</a></code>
- <code><a href="./src/resources/data/incidents.ts">IncidentNotificationRule</a></code>
- <code><a href="./src/resources/data/incidents.ts">IncidentResponse</a></code>
- <code><a href="./src/resources/data/incidents.ts">NotificationRule</a></code>

Methods:

- <code title="get /data/v1/incidents/{INCIDENT_ID}">client.data.incidents.<a href="./src/resources/data/incidents.ts">retrieve</a>(incidentID) -> IncidentResponse</code>
- <code title="get /data/v1/incidents/{INCIDENT_ID}/related">client.data.incidents.<a href="./src/resources/data/incidents.ts">listRelated</a>(incidentID, { ...params }) -> IncidentsBasePage</code>
- <code title="get /data/v1/incidents">client.data.incidents.<a href="./src/resources/data/incidents.ts">list</a>({ ...params }) -> IncidentsBasePage</code>

## Metrics

Types:

- <code><a href="./src/resources/data/metrics.ts">AllMetricValuesResponse</a></code>
- <code><a href="./src/resources/data/metrics.ts">BreakdownValue</a></code>
- <code><a href="./src/resources/data/metrics.ts">InsightsResponse</a></code>
- <code><a href="./src/resources/data/metrics.ts">MetricTimeseriesDataResponse</a></code>
- <code><a href="./src/resources/data/metrics.ts">OverallValuesResponse</a></code>

Methods:

- <code title="get /data/v1/metrics/comparison">client.data.metrics.<a href="./src/resources/data/metrics.ts">list</a>({ ...params }) -> AllMetricValuesResponse</code>
- <code title="get /data/v1/metrics/{METRIC_ID}/breakdown">client.data.metrics.<a href="./src/resources/data/metrics.ts">listBreakdownValues</a>(metricID, { ...params }) -> BreakdownValuesBasePage</code>
- <code title="get /data/v1/metrics/{METRIC_ID}/overall">client.data.metrics.<a href="./src/resources/data/metrics.ts">getOverallValues</a>(metricID, { ...params }) -> OverallValuesResponse</code>
- <code title="get /data/v1/metrics/{METRIC_ID}/insights">client.data.metrics.<a href="./src/resources/data/metrics.ts">getInsights</a>(metricID, { ...params }) -> InsightsResponse</code>
- <code title="get /data/v1/metrics/{METRIC_ID}/timeseries">client.data.metrics.<a href="./src/resources/data/metrics.ts">getTimeseries</a>(metricID, { ...params }) -> MetricTimeseriesDataResponse</code>

## RealTime

Types:

- <code><a href="./src/resources/data/real-time.ts">RealTimeBreakdownResponse</a></code>
- <code><a href="./src/resources/data/real-time.ts">RealTimeDimensionsResponse</a></code>
- <code><a href="./src/resources/data/real-time.ts">RealTimeHistogramTimeseriesResponse</a></code>
- <code><a href="./src/resources/data/real-time.ts">RealTimeMetricsResponse</a></code>
- <code><a href="./src/resources/data/real-time.ts">RealTimeTimeseriesResponse</a></code>

Methods:

- <code title="get /data/v1/realtime/metrics/{REALTIME_METRIC_ID}/breakdown">client.data.realTime.<a href="./src/resources/data/real-time.ts">retrieveBreakdown</a>(realtimeMetricID, { ...params }) -> RealTimeBreakdownResponse</code>
- <code title="get /data/v1/realtime/metrics/{REALTIME_METRIC_ID}/timeseries">client.data.realTime.<a href="./src/resources/data/real-time.ts">retrieveTimeseries</a>(realtimeMetricID, { ...params }) -> RealTimeTimeseriesResponse</code>
- <code title="get /data/v1/realtime/metrics">client.data.realTime.<a href="./src/resources/data/real-time.ts">listMetrics</a>() -> RealTimeMetricsResponse</code>
- <code title="get /data/v1/realtime/metrics/{REALTIME_HISTOGRAM_METRIC_ID}/histogram-timeseries">client.data.realTime.<a href="./src/resources/data/real-time.ts">retrieveHistogramTimeseries</a>(realtimeHistogramMetricID, { ...params }) -> RealTimeHistogramTimeseriesResponse</code>
- <code title="get /data/v1/realtime/dimensions">client.data.realTime.<a href="./src/resources/data/real-time.ts">listDimensions</a>() -> RealTimeDimensionsResponse</code>

## VideoViews

Types:

- <code><a href="./src/resources/data/video-views.ts">AbridgedVideoView</a></code>
- <code><a href="./src/resources/data/video-views.ts">VideoViewResponse</a></code>

Methods:

- <code title="get /data/v1/video-views">client.data.videoViews.<a href="./src/resources/data/video-views.ts">list</a>({ ...params }) -> AbridgedVideoViewsBasePage</code>
- <code title="get /data/v1/video-views/{VIDEO_VIEW_ID}">client.data.videoViews.<a href="./src/resources/data/video-views.ts">retrieve</a>(videoViewID) -> VideoViewResponse</code>

## Annotations

Types:

- <code><a href="./src/resources/data/annotations.ts">Annotation</a></code>
- <code><a href="./src/resources/data/annotations.ts">AnnotationInput</a></code>
- <code><a href="./src/resources/data/annotations.ts">AnnotationResponse</a></code>
- <code><a href="./src/resources/data/annotations.ts">ListAnnotationsResponse</a></code>

Methods:

- <code title="get /data/v1/annotations">client.data.annotations.<a href="./src/resources/data/annotations.ts">list</a>({ ...params }) -> AnnotationsBasePage</code>
- <code title="get /data/v1/annotations/{ANNOTATION_ID}">client.data.annotations.<a href="./src/resources/data/annotations.ts">retrieve</a>(annotationID) -> Annotation</code>
- <code title="post /data/v1/annotations">client.data.annotations.<a href="./src/resources/data/annotations.ts">create</a>({ ...params }) -> Annotation</code>
- <code title="delete /data/v1/annotations/{ANNOTATION_ID}">client.data.annotations.<a href="./src/resources/data/annotations.ts">delete</a>(annotationID) -> void</code>
- <code title="patch /data/v1/annotations/{ANNOTATION_ID}">client.data.annotations.<a href="./src/resources/data/annotations.ts">update</a>(annotationID, { ...params }) -> Annotation</code>

## Engagement

Types:

- <code><a href="./src/resources/data/engagement/engagement.ts">EngagementHeatmap</a></code>
- <code><a href="./src/resources/data/engagement/engagement.ts">EngagementHotspots</a></code>
- <code><a href="./src/resources/data/engagement/engagement.ts">Hotspot</a></code>

### Assets

Types:

- <code><a href="./src/resources/data/engagement/assets.ts">AssetHeatmapResponse</a></code>
- <code><a href="./src/resources/data/engagement/assets.ts">AssetHotspotsResponse</a></code>

Methods:

- <code title="get /data/v1/engagement/assets/{ASSET_ID}/heatmap">client.data.engagement.assets.<a href="./src/resources/data/engagement/assets.ts">heatmap</a>(assetId, { ...params }) -> AssetHeatmapResponse</code>
- <code title="get /data/v1/engagement/assets/{ASSET_ID}/hotspots">client.data.engagement.assets.<a href="./src/resources/data/engagement/assets.ts">hotspots</a>(assetId, { ...params }) -> AssetHotspotsResponse</code>

### PlaybackIds

Types:

- <code><a href="./src/resources/data/engagement/playback-ids.ts">PlaybackIdsHeatmapResponse</a></code>
- <code><a href="./src/resources/data/engagement/playback-ids.ts">PlaybackIdsHotspotsResponse</a></code>

Methods:

- <code title="get /data/v1/engagement/playback-ids/{PLAYBACK_ID}/heatmap">client.data.engagement.playbackIds.<a href="./src/resources/data/engagement/playback-ids.ts">heatmap</a>(playbackId, { ...params }) -> PlaybackIdsHeatmapResponse</code>
- <code title="get /data/v1/engagement/playback-ids/{PLAYBACK_ID}/hotspots">client.data.engagement.playbackIds.<a href="./src/resources/data/engagement/playback-ids.ts">hotspots</a>(playbackId, { ...params }) -> PlaybackIdsHotspotsResponse</code>

### Videos

Types:

- <code><a href="./src/resources/data/engagement/videos.ts">VideoHeatmapResponse</a></code>
- <code><a href="./src/resources/data/engagement/videos.ts">VideoHotspotsResponse</a></code>

Methods:

- <code title="get /data/v1/engagement/videos/{VIDEO_ID}/heatmap">client.data.engagement.videos.<a href="./src/resources/data/engagement/videos.ts">heatmap</a>(videoID, { ...params }) -> VideoHeatmapResponse</code>
- <code title="get /data/v1/engagement/videos/{VIDEO_ID}/hotspots">client.data.engagement.videos.<a href="./src/resources/data/engagement/videos.ts">hotspots</a>(videoID, { ...params }) -> VideoHotspotsResponse</code>
