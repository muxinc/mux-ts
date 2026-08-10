// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as DirectivesAPI from './directives/directives';
import {
  Directive,
  DirectiveCreateParams,
  DirectiveListParams,
  DirectiveSubject,
  Directives,
  DirectivesBasePage,
  ShotsResourceDeclaration,
  TrackResourceDeclaration,
  WorkflowBinding,
} from './directives/directives';
import * as JobsAPI from './jobs/jobs';
import {
  JobDirectiveContext,
  JobError,
  JobListParams,
  JobResources,
  JobStatus,
  JobSummariesBasePage,
  JobSummary,
  Jobs,
  OutputSteeringScope,
  OutputSteeringTaxonomy,
  OutputSteeringTaxonomyValue,
  SlimlineAsset,
} from './jobs/jobs';

export class Robots extends APIResource {
  jobs: JobsAPI.Jobs = new JobsAPI.Jobs(this._client);
  directives: DirectivesAPI.Directives = new DirectivesAPI.Directives(this._client);
}

Robots.Jobs = Jobs;
Robots.Directives = Directives;

export declare namespace Robots {
  export {
    Jobs as Jobs,
    type JobDirectiveContext as JobDirectiveContext,
    type JobError as JobError,
    type JobResources as JobResources,
    type JobStatus as JobStatus,
    type JobSummary as JobSummary,
    type OutputSteeringScope as OutputSteeringScope,
    type OutputSteeringTaxonomy as OutputSteeringTaxonomy,
    type OutputSteeringTaxonomyValue as OutputSteeringTaxonomyValue,
    type SlimlineAsset as SlimlineAsset,
    type JobSummariesBasePage as JobSummariesBasePage,
    type JobListParams as JobListParams,
  };

  export {
    Directives as Directives,
    type Directive as Directive,
    type DirectiveSubject as DirectiveSubject,
    type ShotsResourceDeclaration as ShotsResourceDeclaration,
    type TrackResourceDeclaration as TrackResourceDeclaration,
    type WorkflowBinding as WorkflowBinding,
    type DirectivesBasePage as DirectivesBasePage,
    type DirectiveCreateParams as DirectiveCreateParams,
    type DirectiveListParams as DirectiveListParams,
  };
}
