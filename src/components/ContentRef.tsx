import React, {type ReactNode} from 'react';
import {useActivePlugin, useActiveVersion, useDocById} from '@docusaurus/plugin-content-docs/client';
import DocCard from '@theme/DocCard';

export type ContentRefProps = {
  /** Doc id, e.g. `preliminary/quick-start` or `reference/api-reference/system/index`. */
  id: string;
  /** Optional label override (defaults to the document title). */
  label?: string;
};

/**
 * GitBook-style "content-ref" card linking to another page of the same docs instance.
 * Title and description come from the target document's metadata; the link resolves inside
 * the current variant (default or Diag), so the reader never leaves it.
 */
export default function ContentRef({id, label}: ContentRefProps): ReactNode {
  const plugin = useActivePlugin({failfast: true});
  const version = useActiveVersion(plugin?.pluginId);
  const doc = useDocById(id);
  const globalDoc = version?.docs.find((d) => d.id === id);
  if (!doc || !globalDoc) {
    throw new Error(`<ContentRef id="${id}" />: no such document in docs instance "${plugin?.pluginId}"`);
  }
  return (
    <div className="content-ref">
      <DocCard
        item={{
          type: 'link',
          href: globalDoc.path,
          label: label ?? doc.title,
          docId: id,
          description: doc.description,
        }}
      />
    </div>
  );
}
