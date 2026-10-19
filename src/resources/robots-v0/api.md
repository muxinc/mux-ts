# RobotsV0

## Jobs

Types:

- <code><a href="./src/resources/robots-v0/jobs/jobs.ts">JobDirectiveContext</a></code>
- <code><a href="./src/resources/robots-v0/jobs/jobs.ts">JobError</a></code>
- <code><a href="./src/resources/robots-v0/jobs/jobs.ts">JobResources</a></code>
- <code><a href="./src/resources/robots-v0/jobs/jobs.ts">JobStatus</a></code>
- <code><a href="./src/resources/robots-v0/jobs/jobs.ts">JobSummary</a></code>
- <code><a href="./src/resources/robots-v0/jobs/jobs.ts">OutputSteeringScope</a></code>
- <code><a href="./src/resources/robots-v0/jobs/jobs.ts">OutputSteeringTaxonomy</a></code>
- <code><a href="./src/resources/robots-v0/jobs/jobs.ts">OutputSteeringTaxonomyValue</a></code>
- <code><a href="./src/resources/robots-v0/jobs/jobs.ts">ReplacedTrack</a></code>
- <code><a href="./src/resources/robots-v0/jobs/jobs.ts">SlimlineAsset</a></code>

Methods:

- <code title="get /robots/v0/jobs">client.robotsV0.jobs.<a href="./src/resources/robots-v0/jobs/jobs.ts">list</a>({ ...params }) -> JobSummariesBasePage</code>
- <code title="post /robots/v0/jobs/{JOB_ID}/cancel">client.robotsV0.jobs.<a href="./src/resources/robots-v0/jobs/jobs.ts">cancel</a>(jobID) -> JobSummary</code>

### AskQuestions

Types:

- <code><a href="./src/resources/robots-v0/jobs/ask-questions.ts">AskQuestionsJob</a></code>
- <code><a href="./src/resources/robots-v0/jobs/ask-questions.ts">AskQuestionsJobOutputs</a></code>
- <code><a href="./src/resources/robots-v0/jobs/ask-questions.ts">AskQuestionsJobParameters</a></code>
- <code><a href="./src/resources/robots-v0/jobs/ask-questions.ts">AskQuestionsOutputSteering</a></code>

Methods:

- <code title="post /robots/v0/jobs/ask-questions">client.robotsV0.jobs.askQuestions.<a href="./src/resources/robots-v0/jobs/ask-questions.ts">create</a>({ ...params }) -> AskQuestionsJob</code>
- <code title="get /robots/v0/jobs/ask-questions/{JOB_ID}">client.robotsV0.jobs.askQuestions.<a href="./src/resources/robots-v0/jobs/ask-questions.ts">retrieve</a>(jobID) -> AskQuestionsJob</code>

### GenerateChapters

Types:

- <code><a href="./src/resources/robots-v0/jobs/generate-chapters.ts">GenerateChaptersJob</a></code>
- <code><a href="./src/resources/robots-v0/jobs/generate-chapters.ts">GenerateChaptersJobOutputs</a></code>
- <code><a href="./src/resources/robots-v0/jobs/generate-chapters.ts">GenerateChaptersJobParameters</a></code>
- <code><a href="./src/resources/robots-v0/jobs/generate-chapters.ts">GenerateChaptersOutputSteering</a></code>

Methods:

- <code title="post /robots/v0/jobs/generate-chapters">client.robotsV0.jobs.generateChapters.<a href="./src/resources/robots-v0/jobs/generate-chapters.ts">create</a>({ ...params }) -> GenerateChaptersJob</code>
- <code title="get /robots/v0/jobs/generate-chapters/{JOB_ID}">client.robotsV0.jobs.generateChapters.<a href="./src/resources/robots-v0/jobs/generate-chapters.ts">retrieve</a>(jobID) -> GenerateChaptersJob</code>

### FindKeyMoments

Types:

- <code><a href="./src/resources/robots-v0/jobs/find-key-moments.ts">FindKeyMomentsJob</a></code>
- <code><a href="./src/resources/robots-v0/jobs/find-key-moments.ts">FindKeyMomentsJobOutputs</a></code>
- <code><a href="./src/resources/robots-v0/jobs/find-key-moments.ts">FindKeyMomentsJobParameters</a></code>
- <code><a href="./src/resources/robots-v0/jobs/find-key-moments.ts">FindKeyMomentsOutputSteering</a></code>

Methods:

- <code title="post /robots/v0/jobs/find-key-moments">client.robotsV0.jobs.findKeyMoments.<a href="./src/resources/robots-v0/jobs/find-key-moments.ts">create</a>({ ...params }) -> FindKeyMomentsJob</code>
- <code title="get /robots/v0/jobs/find-key-moments/{JOB_ID}">client.robotsV0.jobs.findKeyMoments.<a href="./src/resources/robots-v0/jobs/find-key-moments.ts">retrieve</a>(jobID) -> FindKeyMomentsJob</code>

### Moderate

Types:

- <code><a href="./src/resources/robots-v0/jobs/moderate.ts">ActionOnFlagged</a></code>
- <code><a href="./src/resources/robots-v0/jobs/moderate.ts">ModerateJob</a></code>
- <code><a href="./src/resources/robots-v0/jobs/moderate.ts">ModerateJobOutputs</a></code>
- <code><a href="./src/resources/robots-v0/jobs/moderate.ts">ModerateJobParameters</a></code>
- <code><a href="./src/resources/robots-v0/jobs/moderate.ts">ModerateOutputSteering</a></code>

Methods:

- <code title="post /robots/v0/jobs/moderate">client.robotsV0.jobs.moderate.<a href="./src/resources/robots-v0/jobs/moderate.ts">create</a>({ ...params }) -> ModerateJob</code>
- <code title="get /robots/v0/jobs/moderate/{JOB_ID}">client.robotsV0.jobs.moderate.<a href="./src/resources/robots-v0/jobs/moderate.ts">retrieve</a>(jobID) -> ModerateJob</code>

### Summarize

Types:

- <code><a href="./src/resources/robots-v0/jobs/summarize.ts">SummarizeJob</a></code>
- <code><a href="./src/resources/robots-v0/jobs/summarize.ts">SummarizeJobOutputs</a></code>
- <code><a href="./src/resources/robots-v0/jobs/summarize.ts">SummarizeJobParameters</a></code>
- <code><a href="./src/resources/robots-v0/jobs/summarize.ts">SummarizeOutputSteering</a></code>
- <code><a href="./src/resources/robots-v0/jobs/summarize.ts">SummaryTagTaxonomy</a></code>

Methods:

- <code title="post /robots/v0/jobs/summarize">client.robotsV0.jobs.summarize.<a href="./src/resources/robots-v0/jobs/summarize.ts">create</a>({ ...params }) -> SummarizeJob</code>
- <code title="get /robots/v0/jobs/summarize/{JOB_ID}">client.robotsV0.jobs.summarize.<a href="./src/resources/robots-v0/jobs/summarize.ts">retrieve</a>(jobID) -> SummarizeJob</code>

### TranslateCaptions

Types:

- <code><a href="./src/resources/robots-v0/jobs/translate-captions.ts">TranslateCaptionsJob</a></code>
- <code><a href="./src/resources/robots-v0/jobs/translate-captions.ts">TranslateCaptionsJobOutputs</a></code>
- <code><a href="./src/resources/robots-v0/jobs/translate-captions.ts">TranslateCaptionsJobParameters</a></code>
- <code><a href="./src/resources/robots-v0/jobs/translate-captions.ts">TranslateCaptionsReplaceExistingTracks</a></code>

Methods:

- <code title="post /robots/v0/jobs/translate-captions">client.robotsV0.jobs.translateCaptions.<a href="./src/resources/robots-v0/jobs/translate-captions.ts">create</a>({ ...params }) -> TranslateCaptionsJob</code>
- <code title="get /robots/v0/jobs/translate-captions/{JOB_ID}">client.robotsV0.jobs.translateCaptions.<a href="./src/resources/robots-v0/jobs/translate-captions.ts">retrieve</a>(jobID) -> TranslateCaptionsJob</code>

### EditCaptions

Types:

- <code><a href="./src/resources/robots-v0/jobs/edit-captions.ts">EditCaptionsJob</a></code>
- <code><a href="./src/resources/robots-v0/jobs/edit-captions.ts">EditCaptionsJobOutputs</a></code>
- <code><a href="./src/resources/robots-v0/jobs/edit-captions.ts">EditCaptionsJobParameters</a></code>
- <code><a href="./src/resources/robots-v0/jobs/edit-captions.ts">EditCaptionsSpeakerReplacement</a></code>

Methods:

- <code title="post /robots/v0/jobs/edit-captions">client.robotsV0.jobs.editCaptions.<a href="./src/resources/robots-v0/jobs/edit-captions.ts">create</a>({ ...params }) -> EditCaptionsJob</code>
- <code title="get /robots/v0/jobs/edit-captions/{JOB_ID}">client.robotsV0.jobs.editCaptions.<a href="./src/resources/robots-v0/jobs/edit-captions.ts">retrieve</a>(jobID) -> EditCaptionsJob</code>

### FindBestThumbnails

Types:

- <code><a href="./src/resources/robots-v0/jobs/find-best-thumbnails.ts">FindBestThumbnailsJob</a></code>
- <code><a href="./src/resources/robots-v0/jobs/find-best-thumbnails.ts">FindBestThumbnailsJobOutputs</a></code>
- <code><a href="./src/resources/robots-v0/jobs/find-best-thumbnails.ts">FindBestThumbnailsJobParameters</a></code>
- <code><a href="./src/resources/robots-v0/jobs/find-best-thumbnails.ts">FindBestThumbnailsOutputSteering</a></code>

Methods:

- <code title="post /robots/v0/jobs/find-best-thumbnails">client.robotsV0.jobs.findBestThumbnails.<a href="./src/resources/robots-v0/jobs/find-best-thumbnails.ts">create</a>({ ...params }) -> FindBestThumbnailsJob</code>
- <code title="get /robots/v0/jobs/find-best-thumbnails/{JOB_ID}">client.robotsV0.jobs.findBestThumbnails.<a href="./src/resources/robots-v0/jobs/find-best-thumbnails.ts">retrieve</a>(jobID) -> FindBestThumbnailsJob</code>

### FindScenes

Types:

- <code><a href="./src/resources/robots-v0/jobs/find-scenes.ts">FindScenesJob</a></code>
- <code><a href="./src/resources/robots-v0/jobs/find-scenes.ts">FindScenesJobOutputs</a></code>
- <code><a href="./src/resources/robots-v0/jobs/find-scenes.ts">FindScenesJobParameters</a></code>
- <code><a href="./src/resources/robots-v0/jobs/find-scenes.ts">FindScenesOutputSteering</a></code>

Methods:

- <code title="post /robots/v0/jobs/find-scenes">client.robotsV0.jobs.findScenes.<a href="./src/resources/robots-v0/jobs/find-scenes.ts">create</a>({ ...params }) -> FindScenesJob</code>
- <code title="get /robots/v0/jobs/find-scenes/{JOB_ID}">client.robotsV0.jobs.findScenes.<a href="./src/resources/robots-v0/jobs/find-scenes.ts">retrieve</a>(jobID) -> FindScenesJob</code>

### GenerateEngagementInsights

Types:

- <code><a href="./src/resources/robots-v0/jobs/generate-engagement-insights.ts">GenerateEngagementInsightsJob</a></code>
- <code><a href="./src/resources/robots-v0/jobs/generate-engagement-insights.ts">GenerateEngagementInsightsJobOutputs</a></code>
- <code><a href="./src/resources/robots-v0/jobs/generate-engagement-insights.ts">GenerateEngagementInsightsJobParameters</a></code>

Methods:

- <code title="post /robots/v0/jobs/generate-engagement-insights">client.robotsV0.jobs.generateEngagementInsights.<a href="./src/resources/robots-v0/jobs/generate-engagement-insights.ts">create</a>({ ...params }) -> GenerateEngagementInsightsJob</code>
- <code title="get /robots/v0/jobs/generate-engagement-insights/{JOB_ID}">client.robotsV0.jobs.generateEngagementInsights.<a href="./src/resources/robots-v0/jobs/generate-engagement-insights.ts">retrieve</a>(jobID) -> GenerateEngagementInsightsJob</code>

### GeneratePremiumCaptions

Types:

- <code><a href="./src/resources/robots-v0/jobs/generate-premium-captions.ts">GeneratePremiumCaptionsJob</a></code>
- <code><a href="./src/resources/robots-v0/jobs/generate-premium-captions.ts">GeneratePremiumCaptionsJobOutputs</a></code>
- <code><a href="./src/resources/robots-v0/jobs/generate-premium-captions.ts">GeneratePremiumCaptionsJobParameters</a></code>
- <code><a href="./src/resources/robots-v0/jobs/generate-premium-captions.ts">GeneratePremiumCaptionsReplaceExistingTracks</a></code>

Methods:

- <code title="post /robots/v0/jobs/generate-premium-captions">client.robotsV0.jobs.generatePremiumCaptions.<a href="./src/resources/robots-v0/jobs/generate-premium-captions.ts">create</a>({ ...params }) -> GeneratePremiumCaptionsJob</code>
- <code title="get /robots/v0/jobs/generate-premium-captions/{JOB_ID}">client.robotsV0.jobs.generatePremiumCaptions.<a href="./src/resources/robots-v0/jobs/generate-premium-captions.ts">retrieve</a>(jobID) -> GeneratePremiumCaptionsJob</code>

### TranslateAudio

Types:

- <code><a href="./src/resources/robots-v0/jobs/translate-audio.ts">TranslateAudioJob</a></code>
- <code><a href="./src/resources/robots-v0/jobs/translate-audio.ts">TranslateAudioJobOutputs</a></code>
- <code><a href="./src/resources/robots-v0/jobs/translate-audio.ts">TranslateAudioJobParameters</a></code>
- <code><a href="./src/resources/robots-v0/jobs/translate-audio.ts">TranslateAudioReplaceExistingTracks</a></code>

Methods:

- <code title="post /robots/v0/jobs/translate-audio">client.robotsV0.jobs.translateAudio.<a href="./src/resources/robots-v0/jobs/translate-audio.ts">create</a>({ ...params }) -> TranslateAudioJob</code>
- <code title="get /robots/v0/jobs/translate-audio/{JOB_ID}">client.robotsV0.jobs.translateAudio.<a href="./src/resources/robots-v0/jobs/translate-audio.ts">retrieve</a>(jobID) -> TranslateAudioJob</code>

## Directives

Types:

- <code><a href="./src/resources/robots-v0/directives/directives.ts">Directive</a></code>
- <code><a href="./src/resources/robots-v0/directives/directives.ts">DirectiveSubject</a></code>
- <code><a href="./src/resources/robots-v0/directives/directives.ts">ShotsResourceDeclaration</a></code>
- <code><a href="./src/resources/robots-v0/directives/directives.ts">TrackResourceDeclaration</a></code>
- <code><a href="./src/resources/robots-v0/directives/directives.ts">WorkflowBinding</a></code>

Methods:

- <code title="post /robots/v0/directives">client.robotsV0.directives.<a href="./src/resources/robots-v0/directives/directives.ts">create</a>({ ...params }) -> Directive</code>
- <code title="get /robots/v0/directives">client.robotsV0.directives.<a href="./src/resources/robots-v0/directives/directives.ts">list</a>({ ...params }) -> DirectivesBasePage</code>
- <code title="get /robots/v0/directives/{DIRECTIVE_ID}">client.robotsV0.directives.<a href="./src/resources/robots-v0/directives/directives.ts">retrieve</a>(directiveID) -> Directive</code>
- <code title="delete /robots/v0/directives/{DIRECTIVE_ID}">client.robotsV0.directives.<a href="./src/resources/robots-v0/directives/directives.ts">delete</a>(directiveID) -> void</code>

### Runs

Types:

- <code><a href="./src/resources/robots-v0/directives/runs.ts">DirectiveRun</a></code>
- <code><a href="./src/resources/robots-v0/directives/runs.ts">DirectiveRunDetail</a></code>
- <code><a href="./src/resources/robots-v0/directives/runs.ts">NodeState</a></code>

Methods:

- <code title="post /robots/v0/directives/{DIRECTIVE_ID}/runs">client.robotsV0.directives.runs.<a href="./src/resources/robots-v0/directives/runs.ts">create</a>(directiveID, { ...params }) -> DirectiveRun</code>
- <code title="get /robots/v0/directives/{DIRECTIVE_ID}/runs">client.robotsV0.directives.runs.<a href="./src/resources/robots-v0/directives/runs.ts">list</a>(directiveID, { ...params }) -> DirectiveRunDetailsBasePage</code>
- <code title="get /robots/v0/directives/{DIRECTIVE_ID}/runs/{RUN_ID}">client.robotsV0.directives.runs.<a href="./src/resources/robots-v0/directives/runs.ts">retrieve</a>(directiveID, runID) -> DirectiveRunDetail</code>
