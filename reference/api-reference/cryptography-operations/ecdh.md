---
description: >-
  This basic cryptography operation allows the calculation of the ECDH between a
  trusted key or by an external public key.
---

# ECDH

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
`keymgmt:use:<KID>`

&#x20;

where `<KID>` is a Key ID as a 32-character hexadecimal string
{% endtab %}
{% endtabs %}

## Generate ECDH&#x20;

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/crypto/ecdh`

Return raw or hashed ECDH results between given arguments.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                    | Type   | Description                                                                          |
| --------------------------------------- | ------ | ------------------------------------------------------------------------------------ |
| `alg`                                   | String | Algorithm used to hash the result (e.g. SHA2-256) - if omitted, raw ECDH is returned |
| `kid`<mark style="color:red;">\*</mark> | String | Key ID, 32-character hex string                                                      |
| `pubkey`                                | String | Base64 encoded external public key                                                   |
| `ext_kid`                               | String | External Key ID, 32-character hex string                                             |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "ecdh": "AZlsNHaUXGNaPMUg139TwnW5QB7WvVKAMEFnHF3JT122JTTnCHuZ1Z6sc2Hvz3WETWJ0ePKUVRJ5HzxDQ4IzdV=="
}
```
{% endtab %}

{% tab title="400: Incorrect arguments" %}

{% endtab %}

{% tab title="401: Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="403: Incorrect access scope" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}

{% tab title="406: Operation failed" %}

{% endtab %}

{% tab title="418: TLS connection required" %}

{% endtab %}
{% endtabs %}

{% hint style="info" %}
The key type pointed to `ext_kid` or represented by `pubkey` MUST be the same as the `kid` key type. Otherwise, indirect ECDH will fail.
{% endhint %}

#### Possible `alg` values

| Value    | Description                          |
| -------- | ------------------------------------ |
| SHA2-256 | Use SHA2-256 to hash the ECDH result |
| SHA2-384 | Use SHA2-384 to hash the ECDH result |
| SHA2-512 | Use SHA2-512 to hash the ECDH result |
| SHA3-256 | Use SHA3-256 to hash the ECDH result |
| SHA3-384 | Use SHA3-384 to hash the ECDH result |
| SHA3-512 | Use SHA3-512 to hash the ECDH result |

#### Response data for successful operation

<table><thead><tr><th width="185.18596563581963">Name</th><th width="150">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>ecdh</code></td><td>String</td><td>Base64 encoded the ECDH result</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="330.003866557372">Event</th><th>Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_CRYPTO_ECDH</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_CRYPTO_ECDH</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_CRYPTO_ECDH</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
