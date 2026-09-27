---
description: >-
  Those basic cryptography operations allow the calculation and verify HMAC
  messages.
---

# HMAC

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

## Hash&#x20;

## Gen an HMAC of a message

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/crypto/hmac/hash`

Return an HMAC of a given message.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                    | Type   | Description                                      |
| --------------------------------------- | ------ | ------------------------------------------------ |
| `alg`                                   | String | Algorithm to use (e.g. SHA2-256)                 |
| `ext_kid`                               | String | External Key ID, 32 chars hex string             |
| `msg`<mark style="color:red;">\*</mark> | String | Base64 encoded message to hmac (max. 2048 bytes) |
| `pubkey`                                | String | Base64 encoded external public key               |
| `kid`<mark style="color:red;">\*</mark> | String | Key ID, 32 chars hex string                      |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "mac": "otGuoI+uH8K6cWk6Qnx3vNGKDjFv2zTF0dUM73a3YMo="
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

{% hint style="info" %}
The key type pointed to `ext_kid` or represented by `pubkey` MUST be the same as the `kid` key type. Otherwise, indirect ECDH will fail.
{% endhint %}

#### Possible `alg` values

| Agorithm | Description   |
| -------- | ------------- |
| SHA2-256 | SHA2-256 HMAC |
| SHA2-384 | SHA2-384 HMAC |
| SHA2-512 | SHA2-512 HMAC |
| SHA3-256 | SHA3-256 HMAC |
| SHA3-384 | SHA3-384 HMAC |
| SHA3-512 | SHA3-512 HMAC |

#### Response data for successful operation

<table><thead><tr><th width="178.33333333333331">Name</th><th width="150">Type</th><th width="351.15457413249214">Description</th></tr></thead><tbody><tr><td><code>mac</code></td><td>String</td><td>Base64 encoded HMAC value</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="325.0534743906417">Event</th><th width="187.83797352806937">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_CRYPTO_HMAC_HASH</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_CRYPTO_HMAC_HASH</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_CRYPTO_HMAC_HASH</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>

## Verify

## Verify an HMAC of the message

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/crypto/hmac/verify`

Verify the hash of a given message.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                    | Type   | Description                                                    |
| --------------------------------------- | ------ | -------------------------------------------------------------- |
| `alg`                                   | String | Algorithm to use (e.g. SHA2-256)                               |
| `ext_kid`                               | String | External Key ID, 32 chars hex string                           |
| `mac`<mark style="color:red;">\*</mark> | String | MAC calculated by `hash` operation                             |
| `msg`<mark style="color:red;">\*</mark> | String | Base64 encoded HMAC of a message to validate (max. 2048 bytes) |
| `pubkey`                                | String | Base64 encoded external public key                             |
| `kid`<mark style="color:red;">\*</mark> | String | Key ID, 32 chars hex string                                    |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}

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

{% hint style="info" %}
The key type pointed to `ext_kid` or represented by `pubkey` MUST be the same as the `kid` key type. Otherwise, indirect ECDH will fail.
{% endhint %}

#### Possible `alg` values

Check the list [here](hmac.md#possible-alg-values).

#### Log entries

<table><thead><tr><th width="326.61465421240234">Event</th><th width="198.4704834493687">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_CRYPTO_HMAC_HASH</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_CRYPTO_HMAC_HASH</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_CRYPTO_HMAC_HASH</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
