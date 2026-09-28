/**
 * Ejected from @docusaurus/theme-classic (DocCard/Heading): renders the card title without the
 * emoji icon (📄️ / 🗃) that the default theme puts in front of it.
 */
import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import Heading from '@theme/Heading';
import Text from '@theme/DocCard/Heading/Text';
import type {Props} from '@theme/DocCard/Heading';

export default function DocCardHeading({item, title}: Props): ReactNode {
  return (
    <Heading as="h2" className={clsx(ThemeClassNames.docs.docCard.heading, 'docCardHeading')} title={title}>
      <Text item={item} title={title} />
    </Heading>
  );
}
