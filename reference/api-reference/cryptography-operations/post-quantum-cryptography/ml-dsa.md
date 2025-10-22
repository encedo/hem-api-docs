---
description: >-
  These two basic cryptography operations allow the calculation and verification
  of the ML-DSA signatures.
---

# ML-DSA

#### Allowed users

{% tabs %}
{% tab title="User" %}
Allowed
{% endtab %}

{% tab title="Alternative" %}
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

## Sign&#x20;

## Sign a message

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/crypto/pqc/mldsa/sign`

Return an ML-DSA signature of the given message.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                    | Type   | Description                                             |
| --------------------------------------- | ------ | ------------------------------------------------------- |
| `ctx`                                   | String | Base64 encoded additional context data (max. 255 bytes) |
| `kid`<mark style="color:red;">\*</mark> | String | Key ID, 32 chars hex string                             |
| `msg`<mark style="color:red;">\*</mark> | String | Data message to sign (max. 2048 bytes)                  |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "sign": "4IzdVAZlsNHaUXGNaPMUg139TwnW5QB7WvVKA...22JTTnCHuZ1Z6sc2Hvz3WETWJ0ePKUVRJ5HzxDQ==",
  "alg": "MLDSA44"  
}
```
{% endtab %}

{% tab title="400: Bad Request Incorrect argument(s)" %}

{% endtab %}

{% tab title="401: Unauthorized Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="403: Forbidden Incorrect access scope" %}

{% endtab %}

{% tab title="406: Not Acceptable Operation failed" %}

{% endtab %}

{% tab title="409: Conflict Incorrect internal state" %}

{% endtab %}

{% tab title="418: I'm a Teapot TLS (https) connection required" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="150">Name</th><th width="150">Type</th><th width="424">Description</th></tr></thead><tbody><tr><td><code>sign</code></td><td>String</td><td>Base64 encoded signature</td></tr><tr><td><code>alg</code></td><td>String</td><td>ML-DSA algorithm type represented by the <code>kid</code></td></tr></tbody></table>

#### Possible `alg` values

| Algorithm | Description                      |
| --------- | -------------------------------- |
| MLDSA44   | Regarding FIPS 204 ML-DSA-44 key |
| MLDSA65   | Regarding FIPS 204 ML-DSA-65 key |
| MLDSA87   | Regarding FIPS 204 ML-DSA-87 key |

#### Log entries

<table><thead><tr><th width="324.88626370187603">Event</th><th width="187.90302898534424">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_CRYPTO_PQC_MLDSA_SIGN</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_CRYPTO_PQC_MLDSA_SIGN</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_CRYPTO_PQC_MLDSA_SIGN</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>

## Verify

## Verify the message signature

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/crypto/pqc/mldsa/verify`

Verify the signature of the given message.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                     | Type   | Description                                            |
| ---------------------------------------- | ------ | ------------------------------------------------------ |
| `ctx`                                    | String | Base64 encoded additional context data (max. 64 bytes) |
| `kid`<mark style="color:red;">\*</mark>  | String | Key ID, 32 chars hex string                            |
| `msg`<mark style="color:red;">\*</mark>  | String | Data message to verify (max. 2048 bytes)               |
| `sign`<mark style="color:red;">\*</mark> | String | Signature to validate returned by `sign`               |

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

#### Log entries

<table><thead><tr><th width="376.40287769784175">Event</th><th width="247.81847014557846">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_CRYPTO_PQC_MLDSA_VERIFY</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_CRYPTO_PQC_MLDSA_VERIFY</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_CRYPTO_PQC_MLDSA_VERIFY</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
