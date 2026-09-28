/**
 * Ejected from @docusaurus/theme-classic (DocItem/Content) to render the page description as a
 * GitBook-style subtitle under the title. Everything else is the original implementation.
 */
import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import type {Props} from '@theme/DocItem/Content';

function useSyntheticTitle(): string | null {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender = !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

export default function DocItemContent({children}: Props): ReactNode {
  const syntheticTitle = useSyntheticTitle();
  const {frontMatter} = useDoc();
  // Only an explicit front-matter description is shown (metadata.description falls back to an
  // excerpt of the content, which would duplicate the first paragraph).
  const subtitle = frontMatter.description;
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
          {subtitle && <p className="doc-subtitle">{subtitle}</p>}
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
