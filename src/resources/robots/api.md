# Robots

## Jobs

Types:

- <code><a href="./src/resources/robots/jobs/jobs.ts">JobDirectiveContext</a></code>
- <code><a href="./src/resources/robots/jobs/jobs.ts">JobError</a></code>
- <code><a href="./src/resources/robots/jobs/jobs.ts">JobResources</a></code>
- <code><a href="./src/resources/robots/jobs/jobs.ts">JobStatus</a></code>
- <code><a href="./src/resources/robots/jobs/jobs.ts">JobSummary</a></code>
- <code><a href="./src/resources/robots/jobs/jobs.ts">OutputSteeringScope</a></code>
- <code><a href="./src/resources/robots/jobs/jobs.ts">OutputSteeringTaxonomy</a></code>
- <code><a href="./src/resources/robots/jobs/jobs.ts">OutputSteeringTaxonomyValue</a></code>
- <code><a href="./src/resources/robots/jobs/jobs.ts">SlimlineAsset</a></code>

Methods:

- <code title="get /robots/v0/jobs">client.robots.jobs.<a href="./src/resources/robots/jobs/jobs.ts">list</a>({ ...params }) -> JobSummariesBasePage</code>
- <code title="post /robots/v0/jobs/{JOB_ID}/cancel">client.robots.jobs.<a href="./src/resources/robots/jobs/jobs.ts">cancel</a>(jobID) -> JobSummary</code>

### AskQuestions

Types:

- <code><a href="./src/resources/robots/jobs/ask-questions.ts">AskQuestionsJob</a></code>
- <code><a href="./src/resources/robots/jobs/ask-questions.ts">AskQuestionsJobOutputs</a></code>
- <code><a href="./src/resources/robots/jobs/ask-questions.ts">AskQuestionsJobParameters</a></code>

Methods:

- <code title="post /robots/v0/jobs/ask-questions">client.robots.jobs.askQuestions.<a href="./src/resources/robots/jobs/ask-questions.ts">create</a>({ ...params }) -> AskQuestionsJob</code>
- <code title="get /robots/v0/jobs/ask-questions/{JOB_ID}">client.robots.jobs.askQuestions.<a href="./src/resources/robots/jobs/ask-questions.ts">retrieve</a>(jobID) -> AskQuestionsJob</code>

### GenerateChapters

Types:

- <code><a href="./src/resources/robots/jobs/generate-chapters.ts">GenerateChaptersJob</a></code>
- <code><a href="./src/resources/robots/jobs/generate-chapters.ts">GenerateChaptersJobOutputs</a></code>
- <code><a href="./src/resources/robots/jobs/generate-chapters.ts">GenerateChaptersJobParameters</a></code>
- <code><a href="./src/resources/robots/jobs/generate-chapters.ts">GenerateChaptersOutputSteering</a></code>

Methods:

- <code title="post /robots/v0/jobs/generate-chapters">client.robots.jobs.generateChapters.<a href="./src/resources/robots/jobs/generate-chapters.ts">create</a>({ ...params }) -> GenerateChaptersJob</code>
- <code title="get /robots/v0/jobs/generate-chapters/{JOB_ID}">client.robots.jobs.generateChapters.<a href="./src/resources/robots/jobs/generate-chapters.ts">retrieve</a>(jobID) -> GenerateChaptersJob</code>

### FindKeyMoments

Types:

- <code><a href="./src/resources/robots/jobs/find-key-moments.ts">FindKeyMomentsJob</a></code>
- <code><a href="./src/resources/robots/jobs/find-key-moments.ts">FindKeyMomentsJobOutputs</a></code>
- <code><a href="./src/resources/robots/jobs/find-key-moments.ts">FindKeyMomentsJobParameters</a></code>
- <code><a href="./src/resources/robots/jobs/find-key-moments.ts">FindKeyMomentsOutputSteering</a></code>

Methods:

- <code title="post /robots/v0/jobs/find-key-moments">client.robots.jobs.findKeyMoments.<a href="./src/resources/robots/jobs/find-key-moments.ts">create</a>({ ...params }) -> FindKeyMomentsJob</code>
- <code title="get /robots/v0/jobs/find-key-moments/{JOB_ID}">client.robots.jobs.findKeyMoments.<a href="./src/resources/robots/jobs/find-key-moments.ts">retrieve</a>(jobID) -> FindKeyMomentsJob</code>

### Moderate

Types:

- <code><a href="./src/resources/robots/jobs/moderate.ts">ActionOnFlagged</a></code>
- <code><a href="./src/resources/robots/jobs/moderate.ts">ModerateJob</a></code>
- <code><a href="./src/resources/robots/jobs/moderate.ts">ModerateJobOutputs</a></code>
- <code><a href="./src/resources/robots/jobs/moderate.ts">ModerateJobParameters</a></code>

Methods:

- <code title="post /robots/v0/jobs/moderate">client.robots.jobs.moderate.<a href="./src/resources/robots/jobs/moderate.ts">create</a>({ ...params }) -> ModerateJob</code>
- <code title="get /robots/v0/jobs/moderate/{JOB_ID}">client.robots.jobs.moderate.<a href="./src/resources/robots/jobs/moderate.ts">retrieve</a>(jobID) -> ModerateJob</code>

### Summarize

Types:

- <code><a href="./src/resources/robots/jobs/summarize.ts">SummarizeJob</a></code>
- <code><a href="./src/resources/robots/jobs/summarize.ts">SummarizeJobOutputs</a></code>
- <code><a href="./src/resources/robots/jobs/summarize.ts">SummarizeJobParameters</a></code>
- <code><a href="./src/resources/robots/jobs/summarize.ts">SummarizeOutputSteering</a></code>
- <code><a href="./src/resources/robots/jobs/summarize.ts">SummaryTagTaxonomy</a></code>

Methods:

- <code title="post /robots/v0/jobs/summarize">client.robots.jobs.summarize.<a href="./src/resources/robots/jobs/summarize.ts">create</a>({ ...params }) -> SummarizeJob</code>
- <code title="get /robots/v0/jobs/summarize/{JOB_ID}">client.robots.jobs.summarize.<a href="./src/resources/robots/jobs/summarize.ts">retrieve</a>(jobID) -> SummarizeJob</code>

### TranslateCaptions

Types:

- <code><a href="./src/resources/robots/jobs/translate-captions.ts">TranslateCaptionsJob</a></code>
- <code><a href="./src/resources/robots/jobs/translate-captions.ts">TranslateCaptionsJobOutputs</a></code>
- <code><a href="./src/resources/robots/jobs/translate-captions.ts">TranslateCaptionsJobParameters</a></code>

Methods:

- <code title="post /robots/v0/jobs/translate-captions">client.robots.jobs.translateCaptions.<a href="./src/resources/robots/jobs/translate-captions.ts">create</a>({ ...params }) -> TranslateCaptionsJob</code>
- <code title="get /robots/v0/jobs/translate-captions/{JOB_ID}">client.robots.jobs.translateCaptions.<a href="./src/resources/robots/jobs/translate-captions.ts">retrieve</a>(jobID) -> TranslateCaptionsJob</code>

### EditCaptions

Types:

- <code><a href="./src/resources/robots/jobs/edit-captions.ts">EditCaptionsJob</a></code>
- <code><a href="./src/resources/robots/jobs/edit-captions.ts">EditCaptionsJobOutputs</a></code>
- <code><a href="./src/resources/robots/jobs/edit-captions.ts">EditCaptionsJobParameters</a></code>

Methods:

- <code title="post /robots/v0/jobs/edit-captions">client.robots.jobs.editCaptions.<a href="./src/resources/robots/jobs/edit-captions.ts">create</a>({ ...params }) -> EditCaptionsJob</code>
- <code title="get /robots/v0/jobs/edit-captions/{JOB_ID}">client.robots.jobs.editCaptions.<a href="./src/resources/robots/jobs/edit-captions.ts">retrieve</a>(jobID) -> EditCaptionsJob</code>

### FindBestThumbnails

Types:

- <code><a href="./src/resources/robots/jobs/find-best-thumbnails.ts">FindBestThumbnailsJob</a></code>
- <code><a href="./src/resources/robots/jobs/find-best-thumbnails.ts">FindBestThumbnailsJobOutputs</a></code>
- <code><a href="./src/resources/robots/jobs/find-best-thumbnails.ts">FindBestThumbnailsJobParameters</a></code>
- <code><a href="./src/resources/robots/jobs/find-best-thumbnails.ts">FindBestThumbnailsOutputSteering</a></code>

Methods:

- <code title="post /robots/v0/jobs/find-best-thumbnails">client.robots.jobs.findBestThumbnails.<a href="./src/resources/robots/jobs/find-best-thumbnails.ts">create</a>({ ...params }) -> FindBestThumbnailsJob</code>
- <code title="get /robots/v0/jobs/find-best-thumbnails/{JOB_ID}">client.robots.jobs.findBestThumbnails.<a href="./src/resources/robots/jobs/find-best-thumbnails.ts">retrieve</a>(jobID) -> FindBestThumbnailsJob</code>

### FindScenes

Types:

- <code><a href="./src/resources/robots/jobs/find-scenes.ts">FindScenesJob</a></code>
- <code><a href="./src/resources/robots/jobs/find-scenes.ts">FindScenesJobOutputs</a></code>
- <code><a href="./src/resources/robots/jobs/find-scenes.ts">FindScenesJobParameters</a></code>
- <code><a href="./src/resources/robots/jobs/find-scenes.ts">FindScenesOutputSteering</a></code>

Methods:

- <code title="post /robots/v0/jobs/find-scenes">client.robots.jobs.findScenes.<a href="./src/resources/robots/jobs/find-scenes.ts">create</a>({ ...params }) -> FindScenesJob</code>
- <code title="get /robots/v0/jobs/find-scenes/{JOB_ID}">client.robots.jobs.findScenes.<a href="./src/resources/robots/jobs/find-scenes.ts">retrieve</a>(jobID) -> FindScenesJob</code>

### GenerateEngagementInsights

Types:

- <code><a href="./src/resources/robots/jobs/generate-engagement-insights.ts">GenerateEngagementInsightsJob</a></code>
- <code><a href="./src/resources/robots/jobs/generate-engagement-insights.ts">GenerateEngagementInsightsJobOutputs</a></code>
- <code><a href="./src/resources/robots/jobs/generate-engagement-insights.ts">GenerateEngagementInsightsJobParameters</a></code>

Methods:

- <code title="post /robots/v0/jobs/generate-engagement-insights">client.robots.jobs.generateEngagementInsights.<a href="./src/resources/robots/jobs/generate-engagement-insights.ts">create</a>({ ...params }) -> GenerateEngagementInsightsJob</code>
- <code title="get /robots/v0/jobs/generate-engagement-insights/{JOB_ID}">client.robots.jobs.generateEngagementInsights.<a href="./src/resources/robots/jobs/generate-engagement-insights.ts">retrieve</a>(jobID) -> GenerateEngagementInsightsJob</code>

### GeneratePremiumCaptions

Types:

- <code><a href="./src/resources/robots/jobs/generate-premium-captions.ts">GeneratePremiumCaptionsJob</a></code>
- <code><a href="./src/resources/robots/jobs/generate-premium-captions.ts">GeneratePremiumCaptionsJobOutputs</a></code>
- <code><a href="./src/resources/robots/jobs/generate-premium-captions.ts">GeneratePremiumCaptionsJobParameters</a></code>

Methods:

- <code title="post /robots/v0/jobs/generate-premium-captions">client.robots.jobs.generatePremiumCaptions.<a href="./src/resources/robots/jobs/generate-premium-captions.ts">create</a>({ ...params }) -> GeneratePremiumCaptionsJob</code>
- <code title="get /robots/v0/jobs/generate-premium-captions/{JOB_ID}">client.robots.jobs.generatePremiumCaptions.<a href="./src/resources/robots/jobs/generate-premium-captions.ts">retrieve</a>(jobID) -> GeneratePremiumCaptionsJob</code>

### TranslateAudio

Types:

- <code><a href="./src/resources/robots/jobs/translate-audio.ts">TranslateAudioJob</a></code>
- <code><a href="./src/resources/robots/jobs/translate-audio.ts">TranslateAudioJobOutputs</a></code>
- <code><a href="./src/resources/robots/jobs/translate-audio.ts">TranslateAudioJobParameters</a></code>

Methods:

- <code title="post /robots/v0/jobs/translate-audio">client.robots.jobs.translateAudio.<a href="./src/resources/robots/jobs/translate-audio.ts">create</a>({ ...params }) -> TranslateAudioJob</code>
- <code title="get /robots/v0/jobs/translate-audio/{JOB_ID}">client.robots.jobs.translateAudio.<a href="./src/resources/robots/jobs/translate-audio.ts">retrieve</a>(jobID) -> TranslateAudioJob</code>

## Directives

Types:

- <code><a href="./src/resources/robots/directives/directives.ts">Directive</a></code>
- <code><a href="./src/resources/robots/directives/directives.ts">DirectiveSubject</a></code>
- <code><a href="./src/resources/robots/directives/directives.ts">ShotsResourceDeclaration</a></code>
- <code><a href="./src/resources/robots/directives/directives.ts">TrackResourceDeclaration</a></code>
- <code><a href="./src/resources/robots/directives/directives.ts">WorkflowBinding</a></code>

Methods:

- <code title="post /robots/v0/directives">client.robots.directives.<a href="./src/resources/robots/directives/directives.ts">create</a>({ ...params }) -> Directive</code>
- <code title="get /robots/v0/directives">client.robots.directives.<a href="./src/resources/robots/directives/directives.ts">list</a>({ ...params }) -> DirectivesBasePage</code>
- <code title="get /robots/v0/directives/{DIRECTIVE_ID}">client.robots.directives.<a href="./src/resources/robots/directives/directives.ts">retrieve</a>(directiveID) -> Directive</code>
- <code title="delete /robots/v0/directives/{DIRECTIVE_ID}">client.robots.directives.<a href="./src/resources/robots/directives/directives.ts">delete</a>(directiveID) -> void</code>

### Runs

Types:

- <code><a href="./src/resources/robots/directives/runs.ts">DirectiveRun</a></code>
- <code><a href="./src/resources/robots/directives/runs.ts">DirectiveRunDetail</a></code>
- <code><a href="./src/resources/robots/directives/runs.ts">NodeState</a></code>

Methods:

- <code title="post /robots/v0/directives/{DIRECTIVE_ID}/runs">client.robots.directives.runs.<a href="./src/resources/robots/directives/runs.ts">create</a>(directiveID, { ...params }) -> DirectiveRun</code>
- <code title="get /robots/v0/directives/{DIRECTIVE_ID}/runs">client.robots.directives.runs.<a href="./src/resources/robots/directives/runs.ts">list</a>(directiveID, { ...params }) -> DirectiveRunDetailsBasePage</code>
- <code title="get /robots/v0/directives/{DIRECTIVE_ID}/runs/{RUN_ID}">client.robots.directives.runs.<a href="./src/resources/robots/directives/runs.ts">retrieve</a>(directiveID, runID) -> DirectiveRunDetail</code>
