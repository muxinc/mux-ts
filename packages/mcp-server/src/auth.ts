// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { IncomingMessage } from 'node:http';
import { ClientOptions } from '@mux/ts';
import { McpOptions } from './options';

export const parseClientAuthHeaders = (req: IncomingMessage, required?: boolean): Partial<ClientOptions> => {
  if (req.headers.authorization) {
    const scheme = req.headers.authorization.split(' ')[0]!;
    const value = req.headers.authorization.slice(scheme.length + 1);
    switch (scheme) {
      case 'Basic':
        const rawValue = Buffer.from(value, 'base64').toString();
        return {
          tokenId: rawValue.slice(0, rawValue.search(':')),
          tokenSecret: rawValue.slice(rawValue.search(':') + 1),
        };
      case 'Bearer':
        return { authorizationToken: req.headers.authorization.slice('Bearer '.length) };
      default:
        throw new Error(
          'Unsupported authorization scheme. Expected the "Authorization" header to be a supported scheme (Basic, Bearer).',
        );
    }
  } else if (required) {
    throw new Error('Missing required Authorization header; see WWW-Authenticate header for details.');
  }

  const tokenId =
    Array.isArray(req.headers['x-mux-token-id']) ?
      req.headers['x-mux-token-id'][0]
    : req.headers['x-mux-token-id'];
  const tokenSecret =
    Array.isArray(req.headers['x-mux-token-secret']) ?
      req.headers['x-mux-token-secret'][0]
    : req.headers['x-mux-token-secret'];
  const authorizationToken =
    Array.isArray(req.headers['x-mux-authorization-token']) ?
      req.headers['x-mux-authorization-token'][0]
    : req.headers['x-mux-authorization-token'];
  return { tokenId, tokenSecret, authorizationToken };
};

export const getStainlessApiKey = (req: IncomingMessage, mcpOptions: McpOptions): string | undefined => {
  // Try to get the key from the x-stainless-api-key header
  const headerKey =
    Array.isArray(req.headers['x-stainless-api-key']) ?
      req.headers['x-stainless-api-key'][0]
    : req.headers['x-stainless-api-key'];
  if (headerKey && typeof headerKey === 'string') {
    return headerKey;
  }

  // Fall back to value set in the mcpOptions (e.g. from environment variable), if provided
  return mcpOptions.stainlessApiKey;
};
