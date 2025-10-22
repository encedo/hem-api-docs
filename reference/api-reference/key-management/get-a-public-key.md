---
description: >-
  This key management operation allows retrieving the public key of an
  asymmetric key stored inside the device's secure repository.
---

# Get a public key

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
`keymgmt:get`
{% endtab %}

{% tab title="Alternative" %}
`keymgmt:gen`

`keymgmt:use:<KID>`

&#x20;

where `<KID>` is a Key ID as a a 32-character hexadecimal string
{% endtab %}
{% endtabs %}

## Get a public key

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/keymgmt/get/:kid`

Get a public key from the asymmetric key only.

#### Query Parameters

| Name                                    | Type   | Description                      |
| --------------------------------------- | ------ | -------------------------------- |
| `kid`<mark style="color:red;">\*</mark> | String | Key ID, 32-character hex string  |

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "type": "CURVE25519",
  "pubkey": "IYBby9t5R6aiQ13CE0RJ7Z0jIMOIXGLN+U9Tebo3/CU=",
  "updated": 1647787070
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

{% tab title="418: TLS  connection required" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="160.25255562236921">Name</th><th width="150">Type</th><th width="361.188144481763">Description</th></tr></thead><tbody><tr><td><code>pubkey</code></td><td>String</td><td>Base64 encoded public key</td></tr><tr><td><code>type</code></td><td>String</td><td>Type of a key</td></tr><tr><td><code>updated</code></td><td>String</td><td>Last update timestamp</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="324.9298781307262">Event</th><th width="193.89682999470637">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr></tbody></table>
