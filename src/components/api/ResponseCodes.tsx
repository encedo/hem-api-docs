import React, {type ReactNode} from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import STATUS_TEXTS from './statusTexts';

export type ResponseCodeProps = {
  /** HTTP status code, e.g. "200". */
  code: string | number;
  /** Short meaning; defaults to the standard text for the code. */
  title?: string;
  /** Example response body (usually a ```json block). */
  children?: ReactNode;
};

/** Data-only element: rendered by the surrounding <ResponseCodes>. */
export function ResponseCode(_props: ResponseCodeProps): ReactNode {
  return null;
}

/** GitBook-style "Response status code" tabs, one tab per <ResponseCode>. */
export function ResponseCodes({children}: {children?: ReactNode}): ReactNode {
  const items = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<ResponseCodeProps> =>
      React.isValidElement(child) && typeof (child.props as ResponseCodeProps).code !== 'undefined',
  );
  if (items.length === 0) {
    return null;
  }
  return (
    <Tabs className="api-response-codes">
      {items.map((item, index) => {
        const code = String(item.props.code);
        const title = item.props.title ?? STATUS_TEXTS[code] ?? '';
        return (
          <TabItem key={`${code}-${index}`} value={`${code}-${index}`} label={title ? `${code}: ${title}` : code}>
            {item.props.children ?? <p className="api-response-codes__empty">No response body.</p>}
          </TabItem>
        );
      })}
    </Tabs>
  );
}

export default ResponseCodes;
