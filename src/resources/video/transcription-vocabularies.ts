// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { BasePage, type BasePageParams, PagePromise } from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Transcription Vocabularies allows you to provide collections of phrases like proper nouns, technical jargon, and uncommon words as part of captioning workflows. When using Auto-Generated Captions, Transcription Vocabularies increase the likelihood of correct speech recognition for these words and phrases.
 */
export class TranscriptionVocabularies extends APIResource {
  /**
   * Retrieves the details of a Transcription Vocabulary that has previously been
   * created. Supply the unique Transcription Vocabulary ID and Mux will return the
   * corresponding Transcription Vocabulary information. The same information is
   * returned when creating a Transcription Vocabulary.
   *
   * @example
   * ```ts
   * const transcriptionVocabulary =
   *   await client.video.transcriptionVocabularies.retrieve(
   *     'TRANSCRIPTION_VOCABULARY_ID',
   *   );
   * ```
   */
  retrieve(transcriptionVocabularyID: string, options?: RequestOptions): APIPromise<TranscriptionVocabulary> {
    return (
      this._client.get(path`/video/v1/transcription-vocabularies/${transcriptionVocabularyID}`, {
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: TranscriptionVocabulary }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Create a new Transcription Vocabulary.
   *
   * @example
   * ```ts
   * const transcriptionVocabulary =
   *   await client.video.transcriptionVocabularies.create({
   *     phrases: [
   *       'Mux',
   *       'Live Stream',
   *       'Playback ID',
   *       'video encoding',
   *     ],
   *     name: 'Mux API Vocabulary',
   *   });
   * ```
   */
  create(
    body: TranscriptionVocabularyCreateParams,
    options?: RequestOptions,
  ): APIPromise<TranscriptionVocabulary> {
    return (
      this._client.post('/video/v1/transcription-vocabularies', {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: TranscriptionVocabulary }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * Deletes a Transcription Vocabulary. The Transcription Vocabulary's ID will be
   * disassociated from any live streams using it. Transcription Vocabularies can be
   * deleted while associated live streams are active. However, the words and phrases
   * in the deleted Transcription Vocabulary will remain attached to those streams
   * while they are active.
   *
   * @example
   * ```ts
   * await client.video.transcriptionVocabularies.delete(
   *   'TRANSCRIPTION_VOCABULARY_ID',
   * );
   * ```
   */
  delete(transcriptionVocabularyID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/video/v1/transcription-vocabularies/${transcriptionVocabularyID}`, {
      defaultBaseURL: 'https://api.mux.com',
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Updates the details of a previously-created Transcription Vocabulary. Updates to
   * Transcription Vocabularies are allowed while associated live streams are active.
   * However, updates will not be applied to those streams while they are active.
   *
   * @example
   * ```ts
   * const transcriptionVocabulary =
   *   await client.video.transcriptionVocabularies.update(
   *     'TRANSCRIPTION_VOCABULARY_ID',
   *     {
   *       phrases: ['Mux', 'Live Stream', 'RTMP', 'Stream Key'],
   *       name: 'Mux API Vocabulary - Updated',
   *     },
   *   );
   * ```
   */
  update(
    transcriptionVocabularyID: string,
    body: TranscriptionVocabularyUpdateParams,
    options?: RequestOptions,
  ): APIPromise<TranscriptionVocabulary> {
    return (
      this._client.put(path`/video/v1/transcription-vocabularies/${transcriptionVocabularyID}`, {
        body,
        defaultBaseURL: 'https://api.mux.com',
        ...options,
      }) as APIPromise<{ data: TranscriptionVocabulary }>
    )._thenUnwrap((obj) => obj.data);
  }

  /**
   * List all Transcription Vocabularies.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const transcriptionVocabulary of client.video.transcriptionVocabularies.list()) {
   *   // ...
   * }
   * ```
   */
  list(
    query: TranscriptionVocabularyListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<TranscriptionVocabulariesBasePage, TranscriptionVocabulary> {
    return this._client.getAPIList(
      '/video/v1/transcription-vocabularies',
      BasePage<TranscriptionVocabulary>,
      { query, defaultBaseURL: 'https://api.mux.com', ...options },
    );
  }
}

export type TranscriptionVocabulariesBasePage = BasePage<TranscriptionVocabulary>;

export interface TranscriptionVocabulary {
  /**
   * Unique identifier for the Transcription Vocabulary
   */
  id: string;

  /**
   * Time the Transcription Vocabulary was created, defined as a Unix timestamp
   * (seconds since epoch).
   */
  created_at: string;

  /**
   * Time the Transcription Vocabulary was updated, defined as a Unix timestamp
   * (seconds since epoch).
   */
  updated_at: string;

  /**
   * The user-supplied name of the Transcription Vocabulary.
   */
  name?: string;

  /**
   * Arbitrary user-supplied metadata set for the Transcription Vocabulary. Max 255
   * characters.
   */
  passthrough?: string;

  /**
   * Phrases, individual words, or proper names to include in the Transcription
   * Vocabulary. When the Transcription Vocabulary is attached to a live stream's
   * `generated_subtitles` configuration, the probability of successful speech
   * recognition for these words or phrases is boosted.
   */
  phrases?: Array<string>;
}

export interface TranscriptionVocabularyResponse {
  data: TranscriptionVocabulary;
}

export interface TranscriptionVocabularyCreateParams {
  /**
   * Phrases, individual words, or proper names to include in the Transcription
   * Vocabulary. When the Transcription Vocabulary is attached to a live stream's
   * `generated_subtitles`, the probability of successful speech recognition for
   * these words or phrases is boosted.
   */
  phrases: Array<string>;

  /**
   * The user-supplied name of the Transcription Vocabulary.
   */
  name?: string;

  /**
   * Arbitrary user-supplied metadata set for the Transcription Vocabulary. Max 255
   * characters.
   */
  passthrough?: string;
}

export interface TranscriptionVocabularyUpdateParams {
  /**
   * Phrases, individual words, or proper names to include in the Transcription
   * Vocabulary. When the Transcription Vocabulary is attached to a live stream's
   * `generated_subtitles`, the probability of successful speech recognition for
   * these words or phrases is boosted.
   */
  phrases: Array<string>;

  /**
   * The user-supplied name of the Transcription Vocabulary.
   */
  name?: string;

  /**
   * Arbitrary user-supplied metadata set for the Transcription Vocabulary. Max 255
   * characters.
   */
  passthrough?: string;
}

export interface TranscriptionVocabularyListParams extends BasePageParams {}

export declare namespace TranscriptionVocabularies {
  export {
    type TranscriptionVocabulary as TranscriptionVocabulary,
    type TranscriptionVocabularyResponse as TranscriptionVocabularyResponse,
    type TranscriptionVocabulariesBasePage as TranscriptionVocabulariesBasePage,
    type TranscriptionVocabularyCreateParams as TranscriptionVocabularyCreateParams,
    type TranscriptionVocabularyUpdateParams as TranscriptionVocabularyUpdateParams,
    type TranscriptionVocabularyListParams as TranscriptionVocabularyListParams,
  };
}
