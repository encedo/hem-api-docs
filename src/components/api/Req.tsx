import React, {type ReactNode} from 'react';

/** Red asterisk marking a required header, parameter or body field (GitBook style). */
export default function Req(): ReactNode {
  return (
    <sup className="api-required" title="Required" aria-label="required">
      *
    </sup>
  );
}
