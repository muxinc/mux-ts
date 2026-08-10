// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * DRM Configurations allow you to adjust the security level of content delivered through Mux Video's Digital Rights Management (DRM) feature.
 */
export class DRMConfigurations extends APIResource {
  /**
   * Returns a list of DRM Configurations
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const drmConfiguration of client.video.drmConfigurations.list()) {
   *   // ...
   * }
   * ```
   */
  list(
    query: DRMConfigurationListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<DRMConfigurationsBasePage, DRMConfiguration> {
    return this._client.getAPIList('/video/v1/drm-configurations', BasePage<DRMConfiguration>, {
      query,
      defaultBaseURL: 'https://api.mux.com',
      ...options,
    });
  }

  /**
   * Retrieves a single DRM Configuration.
   *
   * @example
   * ```ts
   * const drmConfiguration =
   *   await client.video.drmConfigurations.retrieve(
   *     'DRM_CONFIGURATION_ID',
   *   );
   * ```
   */
  retrieve(drmConfigurationID: string, options?: RequestOptions): APIPromise<DRMConfiguration> {
    return (
      this._client.get(path`/video/v1/drm-configurations/${drmConfigurationID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: DRMConfiguration }>
    )._thenUnwrap((obj) => obj.data);
  }
}

export type DRMConfigurationsBasePage = BasePage<DRMConfiguration>;

export interface DRMConfiguration {
  /**
   * Unique identifier for the DRM Configuration. Max 255 characters.
   */
  id: string;
}

export interface DRMConfigurationListParams extends BasePageParams {}

export declare namespace DRMConfigurations {
  export {
    type DRMConfiguration as DRMConfiguration,
    type DRMConfigurationsBasePage as DRMConfigurationsBasePage,
    type DRMConfigurationListParams as DRMConfigurationListParams,
  };
}
