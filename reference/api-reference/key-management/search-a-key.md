---
description: >-
  This key management operation allows searching the repository for a key based
  on the key 'descr' field.
---

# Search a key

#### Allowed users

{% tabs %}
{% tab title="User" %}
Allowed
{% endtab %}

{% tab title="Master" %}
Not allowed
{% endtab %}

{% tab title="ExtAuth" %}
Allowed
{% endtab %}
{% endtabs %}

#### Required access scope

{% tabs %}
{% tab title="Main" %}
`keymgmt:search`

If the configuration option `allow_keysearch` is set to `true`, then the search is possible without the `Authorization` header under the condition of having the minimum first 6 bytes of `descr` field provided.
{% endtab %}

{% tab title="Alternative" %}
`keymgmt:list`

`auth:ext:pair`
{% endtab %}
{% endtabs %}

## Search for a key(s)

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/keymgmt/search`

Search the keys stored in the repository by pattern.

#### Headers

| Name                                           | Type   | Description       |
| ---------------------------------------------- | ------ | ----------------- |
| Authorization                                  | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark> | String | application/json  |

#### Request Body

| Name                                      | Type   | Description                                                |
| ----------------------------------------- | ------ | ---------------------------------------------------------- |
| `descr`<mark style="color:red;">\*</mark> | String | Pattern to search for.                                     |
| `offset`                                  | Number | Skip `offset` entries.                                     |
| `limit`                                   | Number | Limit number of return entries, default is 15 if skipped.  |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "offset": 0,
  "total": 5,
  "listed": 1,
  "list": [{
  	"kid": "4111bc76291bff8d319a056f15bb46f0",
	"created": 1647802803,
	"type": "ATT,PKEY,ECDH,CURVE448",
	"label": "Chris main Transfer key",
	"descr": "RVRTRlRYNTcyMDc0NzI1MjI1NTE3OWNocmlzQGVuY2Vkby5jb20=",
	"updated": 1647802803
  }]
}
```
{% endtab %}

{% tab title="400: Incorrect argument(s)" %}

{% endtab %}

{% tab title="401: Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="403: Incorrect access scope" %}

{% endtab %}

{% tab title="406: Operation failed" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}

{% tab title="418: TLS connection required" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

This operation returns the same data as the "_List the keys"_ endpoint. Check for details [here](https://docs.encedo.com/hem-api/reference/api-reference/key-management/list-the-keys#response-data-for-successful-operation).

#### Log entries

<table><thead><tr><th width="329.31109107303877">Event</th><th>Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr></tbody></table>
