import React, {type ReactNode} from 'react';

export type EndpointProps = {
  /** HTTP method, upper case. */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Path as in the OpenAPI file, e.g. `/api/keymgmt/get/{kid}`. */
  path: string;
  /** operationId from api/hem-api-<version>.yaml; used as the anchor and by scripts/check-api-docs.mjs. */
  operationId?: string;
  /** Host shown in front of the path. */
  host?: string;
};

/** GitBook-style endpoint line: coloured method badge followed by the full URL. */
export default function Endpoint({
  method,
  path,
  operationId,
  host = 'https://my.ence.do',
}: EndpointProps): ReactNode {
  const parts = path.split(/(\{[^}]+\})/g).filter(Boolean);
  return (
    <div className="api-endpoint" id={operationId} data-operation-id={operationId}>
      <span className={`api-method api-method--${method.toLowerCase()}`}>{method}</span>
      <code className="api-endpoint__url">
        <span className="api-endpoint__host">{host}</span>
        {parts.map((part, i) =>
          part.startsWith('{') ? (
            <var key={i} className="api-endpoint__param">
              {part}
            </var>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          ),
        )}
      </code>
    </div>
  );
}
