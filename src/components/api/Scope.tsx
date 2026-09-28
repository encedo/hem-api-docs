import React, {type ReactNode} from 'react';

export type ScopeProps = {
  /** Main access scope(s) required by the endpoints on this page. */
  main?: string | string[];
  /** Alternative scope(s) that are also accepted. */
  alt?: string | string[];
  /** Free-text remark. */
  note?: string;
};

const asList = (v?: string | string[]): string[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

/** "Required access scope" row. */
export default function Scope({main, alt, note}: ScopeProps): ReactNode {
  const mains = asList(main);
  const alts = asList(alt);
  return (
    <div className="api-meta api-scope">
      <span className="api-meta__label">Required access scope</span>
      {mains.length === 0 && alts.length === 0 && !note && <span className="api-scope__none">none</span>}
      {mains.map((s) => (
        <code key={s} className="api-scope__value">
          {s}
        </code>
      ))}
      {alts.length > 0 && (
        <span className="api-scope__alt">
          <span className="api-scope__alt-label">alternative:</span>
          {alts.map((s) => (
            <code key={s} className="api-scope__value">
              {s}
            </code>
          ))}
        </span>
      )}
      {note && <span className="api-scope__note">{note}</span>}
    </div>
  );
}
