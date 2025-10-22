---
description: >-
  Get an audit log signing key (all configuration) and on Encedo PPA only get a
  log list & files.
---

# Audit log

#### Allowed users

{% tabs %}
{% tab title="User" %}
Allowed
{% endtab %}

{% tab title="Master" %}
Allowed
{% endtab %}

{% tab title="ExtAuth" %}
Allowed
{% endtab %}
{% endtabs %}

#### Required access scope

{% tabs %}
{% tab title="Main" %}
`logger:get`
{% endtab %}
{% endtabs %}

## Get a log signing key

## Get a log signing key

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/logger/key`

Return a key used to sign the log file header as proof of the source's digital authenticity.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |

#### Response status code

{% tabs %}
{% tab title="200 Operation successful" %}
```javascript
{
  "key": "T61jY1AgV5XUW++eAcQibRDFOl5KjKwLGdo+U0def8A=",
  "nonce": "P4M0YrCmPemejJg2zRYFPl4uZu7p8kG1IQDnrRHLMZg=",
  "nonce_signed": "/rgJmzoAbGLIQEg/meAxF2vrYWcvFnbeMNkaQDfS8RKvaBuj7/HPcObkz9X0HX+V53xyh8YJR+lJ6AO727PRBQ=="
}
```
{% endtab %}

{% tab title="401: Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="403: Incorrect access 'scope'" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="194.97343904397093">Name</th><th width="150">Type</th><th width="331.5087912218958">Description</th></tr></thead><tbody><tr><td><code>key</code></td><td>String</td><td>Base64 encoded ED25519 public key</td></tr><tr><td><code>nonce</code></td><td>String</td><td>Base64 encoded random nonce</td></tr><tr><td><code>nonce_signed</code></td><td>String</td><td>Base64 encoded ED25519 signature of the <code>nonce</code>.</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="312.286881197334">Event</th><th width="196.25301309836226">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr></tbody></table>

## Get a list of log entries

{% hint style="info" %}
Embedded Flash Drive is available on Encedo PPA only. On Encedo EPA these two endpoints are not available, response code 404 will be returned.
{% endhint %}

## Get a list of logs

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/logger/list/:offset`

Get a list of available log files.

#### Path Parameters

| Name     | Type   | Description                  |
| -------- | ------ | ---------------------------- |
| `offset` | Number | Skip '`offset`' logs entries |

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "total": 3,
  "id": ["62310b2b", "62310bf6", "6231f603"]
}
```
{% endtab %}

{% tab title="401: Missing or invalid access token" %}

{% endtab %}

{% tab title="403: Incorrect access scope" %}

{% endtab %}

{% tab title="404: Missing log entries" %}

{% endtab %}

{% tab title="406: Operation failed" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="150">Name</th><th width="150">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>total</code></td><td>Number</td><td>Total number of logs entries.</td></tr><tr><td><code>id</code></td><td>Array of strings</td><td>An array of logs File IDs</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="287.9532482372591">Event</th><th width="207.16684471498795">Result</th><th width="150">Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_LOGGER_LIST_LOG</td><td>LOG_RESULT_OK</td><td>200</td></tr><tr><td>LOG_TYPE_LOGGER_LIST_LOG</td><td>LOG_RESULT_FAILED</td><td>404</td></tr></tbody></table>

{% hint style="info" %}
A maximum of 128 log entries are returned by one call. Use the `offset`argument for pagination.&#x20;
{% endhint %}

## Get a log file

{% hint style="info" %}
Embedded Flash Drive is available on Encedo PPA only. On Encedo EPA these two endpoints are not available, response code 404 will be returned.
{% endhint %}

## Get a log file

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/logger/:id`

Get a log file for a given ID.

#### Path Parameters

| Name                                   | Type   | Description             |
| -------------------------------------- | ------ | ----------------------- |
| `id`<mark style="color:red;">\*</mark> | String | File ID e.g. "62310b2b" |

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |

#### Response status code

{% tabs %}
{% tab title="200: File content retrieved" %}
```
# Encedo HEM v0.9.77 (#ff0a263)
0|62310ba5|0|0|NgPWx9MnmngrKa7xkSuQnDcwBlDV5JeR0OoX6gFyMpo|sMfJhY2jjkQLb7dVGlWf_GynEOTZVh5tO33k8Iq52jB0CAECs1ysU3NenhlmWBWyTo1XEaqL-ysBVB7quNHDBA|XEwWbRXrh65JPjAjb-9bwg
1|62310ba5|1|0|||rfB1gKL0hTi5tGh8PDerAA
2|62310ba5|7|0|||dsutQDgmuLtecPIwPDctdA
3|62310ba5|13|0||NQsxYg|bODm1bUzTiX6qS7LheDJFA
4|62310ba6|1d|0|M||9b_vMf0QXC-qEhi-kQ4zpg
5|62310bdd|12|0|U||Rhwgm9ZQx-RGfrjESNxhDQ
6|62310c0c|2|0|U||IhCfo8F_OHBLhgOGXE5vPA

```
{% endtab %}

{% tab title="401: Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="403: Incorrect access scope" %}

{% endtab %}

{% tab title="404: File not found " %}

{% endtab %}

{% tab title="406: Operation failed (e.g. file busy)" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}
{% endtabs %}

#### Log entries

<table><thead><tr><th width="334.8587157312168">Event</th><th width="197.09712995439233">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_LOGGER_READ_LOG</td><td>LOG_RESULT_OK</td><td>200</td></tr><tr><td>LOG_TYPE_LOGGER_READ_LOG</td><td>LOG_RESULT_FAILED</td><td>404</td></tr></tbody></table>
