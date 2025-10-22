---
description: >-
  This section describes two endpoints functional for key-encapsulation PQC
  operations - ML-KEM, FIPS 203 compliant.
---

# ML-KEM

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

## Encapsulation&#x20;

## Generate a shared secret&#x20;

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/crypto/pqc/mlkem/encaps`

The encapsulation algorithm ML-KEM accepts an encapsulation key as input, generates randomness internally, and outputs a ciphertext CT and a shared key SS.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                    | Type   | Description                                       |
| --------------------------------------- | ------ | ------------------------------------------------- |
| `kid`<mark style="color:red;">\*</mark> | String | Key ID, 32-character hex string encapsulation key |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "ct": "4IzdVAZlsNHaUXGNaPMUg139TwnW5QB7WvVKAMEFnHF3JT122JTTnCHuZ1Z6sc2Hvz3WETWJ0ePKUVRJ5HzxDQ==",
  "ss": "YBby9t5R6aiQ13CE0RJ7Z0jIMOIXGLN+U9Tebo3/CU=",
  "alg": "MLKEM512"  
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

#### Possible `alg` values

| Algorithm | Description                         |
| --------- | ----------------------------------- |
| MLKEM512  | Regarding FIPS 203, ML-KEM-512 key  |
| MLKEM768  | Regarding FIPS 203, ML-KEM-768 key  |
| MLKEM1024 | Regarding FIPS 203, ML-KEM-1024 key |

#### Response data for successful operation

<table><thead><tr><th width="150">Name</th><th width="150">Type</th><th width="424">Description</th></tr></thead><tbody><tr><td><code>alg</code></td><td>String</td><td>ML-KEM algorithm type represented by the <code>kid</code></td></tr><tr><td><code>ct</code></td><td>String</td><td>Base64 encoded ciphertext</td></tr><tr><td><code>ss</code></td><td>String</td><td>Base64 encoded shared secret</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="384.93515116204316">Event</th><th width="205.40302898534424">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_CRYPTO_PQC_MLKEM_ENCAPS</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_CRYPTO_PQC_MLKEM_ENCAPS</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_CRYPTO_PQC_MLKEM_ENCAPS</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>

## Decapsulation

## Extract the shared secret

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/crypto/pqc/mlkem/decaps`

The decapsulation algorithm accepts a decapsulation key and an ML-KEM ciphertext as input, does not use any randomness, and outputs a shared.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                    | Type   | Description                                       |
| --------------------------------------- | ------ | ------------------------------------------------- |
| `ct`                                    | String | Base64 encoded ciphertext returned by `encaps`    |
| `kid`<mark style="color:red;">\*</mark> | String | Key ID, 32-character hex string decapsulation key |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```json
{
  "ss": "YBby9t5R6aiQ13CE0RJ7Z0jIMOIXGLN+U9Tebo3/CU="
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

#### Log entries

<table><thead><tr><th width="386.363059708843">Event</th><th width="211">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_CRYPTO_PQC_MLKEM_DECAPS</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_CRYPTO_PQC_MLKEM_DECAPS</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_CRYPTO_PQC_MLKEM_DECAPS</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
