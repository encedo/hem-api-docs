import MDXComponents from '@theme-original/MDXComponents';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DocCardList from '@theme/DocCardList';
import {Endpoint, Req, Roles, Scope, ResponseCodes, ResponseCode} from '@site/src/components/api';
import ContentRef from '@site/src/components/ContentRef';

// Components available in every MDX page without an import statement.
export default {
  ...MDXComponents,
  Tabs,
  TabItem,
  DocCardList,
  ContentRef,
  Endpoint,
  Req,
  Roles,
  Scope,
  ResponseCodes,
  ResponseCode,
};
