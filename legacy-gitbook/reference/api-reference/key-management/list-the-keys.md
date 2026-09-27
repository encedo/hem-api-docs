---
description: >-
  This key management operation allows the listing of the keys from the
  repository.
---

# List the keys

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
`keymgmt:list`
{% endtab %}
{% endtabs %}

## List the keys

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/keymgmt/list/:offset/:limit`

List the keys stored in the repository with pagination.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |

#### Request Body

| Name     | Type   | Description                                                                                                     |
| -------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| `offset` | Number | Skip `offset` entries.                                                                                          |
| `limit`  | Number | <p>(required<code>offset</code>to be set)<br>Limit the number of return entries, default is 15 if skipped. </p> |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "offset": 0,
  "total": 5,
  "listed": 5,
  "list": [{
	"kid": "d4fda14010b3acd0d5482d9881a03fbf",
	"created": 1647381409,
	"type": "ATT,PKEY,GENERIC_DER",
	"label": "TLS PrivateKey",
	"descr": "RE5TOmlwMTEuZW5jZS5kbw==",
	"updated": 1647381409
  }, {
	"kid": "761bbb76b4dcffd9a78df8b992caa0b6",
	"created": 1647381469,
	"type": "CERT,GENERIC_DER",
	"label": "TLS Certificate",
	"descr": "RE5TOmlwMTEuZW5jZS5kbw==",
	"updated": 1647381469
  }, {
	"kid": "8b7eeb47a28bedb068915bf6513815f1",
	"created": 1647804527,
	"type": "ATT,PKEY,ECDH,CURVE25519",
	"label": "Test key 1",
	"updated": 1647804527
  }, {
	"kid": "aad3eabce0b97242fe328fbb2973b17c",
	"created": 1647804552,
	"type": "ATT,PKEY,ECDH,ExDSA,SECP384R1",
	"label": "Signing key",
	"updated": 1647804552
  }, {
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

{% tab title="401: Missing or invalid JWT_TOKEN " %}

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

<table><thead><tr><th width="233.1444672548622">Name</th><th width="152.97998048105748">Type</th><th width="330.4018767763539">Description</th></tr></thead><tbody><tr><td><code>listed</code></td><td>Number</td><td>Number of listed keys</td></tr><tr><td><code>list</code></td><td>Array of objects</td><td>An array of keys details</td></tr><tr><td><code>offset</code></td><td>Number</td><td>Number of skipped keys (offset)</td></tr><tr><td><code>total</code></td><td>Number</td><td>Number of keys in repository</td></tr><tr><td>The <code>list</code> object contains:</td><td></td><td></td></tr><tr><td><code>created</code></td><td>Number</td><td>Creation timestamp</td></tr><tr><td><code>descr</code></td><td>String</td><td>Base64 encoded additional description</td></tr><tr><td><code>kid</code></td><td>String</td><td>Key ID, 32 chars hex string </td></tr><tr><td><code>label</code></td><td>String</td><td>Key label</td></tr><tr><td><code>type</code></td><td>String</td><td>Type of a key</td></tr><tr><td><code>updated</code></td><td>Number</td><td>Last update timestamp</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="325.86695271838636">Event</th><th width="195.99979283198675">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr></tbody></table>
