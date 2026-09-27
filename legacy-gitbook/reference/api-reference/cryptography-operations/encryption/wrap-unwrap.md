---
description: These two endpoint implements the NIST Key Wrapping scheme.
---

# Wrap/Unwrap

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

## Wrap

## Wrap a message

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/crypto/cipher/wrap`

Wrap plain message using the NIST Key Wrapping scheme.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                    | Type   | Description                                             |
| --------------------------------------- | ------ | ------------------------------------------------------- |
| `alg`                                   | String | Algorithm to use (e.g. AES256)                          |
| `ext_kid`                               | String | External Key ID, 32 chars hex string                    |
| `kid`<mark style="color:red;">\*</mark> | String | Key ID, 32 chars hex string                             |
| `msg`<mark style="color:red;">\*</mark> | String | Data message to wrap (max. 2048 bytes)                  |
| `pubkey`                                | String | Base64 encoded external public key                      |
| `ctx`                                   | String | Additional context data (HKDF argument) (max. 64 bytes) |
| `iv`                                    | String | Optional IV data                                        |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "wrapped": "ot5cd+SCF6w9dxdjtLnnr96yIMJQWVzb"
}
```
{% endtab %}

{% tab title="400: Incorrect arguments" %}

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

| Value  | Description               |
| ------ | ------------------------- |
| AES128 | Regarding NIST SP 800-38F |
| AES192 | Regarding NIST SP 800-38F |
| AES256 | Regarding NIST SP 800-38F |

#### Response data for successful operation

<table><thead><tr><th>Name</th><th width="150">Type</th><th width="317">Description</th></tr></thead><tbody><tr><td><code>wrapped</code></td><td>String</td><td>Base64 encoded wrapped data</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="331.79608650875383">Event</th><th>Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_CRYPTO_WRAP</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_CRYPTO_WRAP</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_CRYPTO_WRAP</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>

## Unwrap

## Unwarp a message

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/crypto/cipher/unwrap`

Unwrap the encrypted message using the NIST Key Wrapping scheme.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                    | Type   | Description                                             |
| --------------------------------------- | ------ | ------------------------------------------------------- |
| `alg`                                   | String | Algorithm to use (e.g. AES256)                          |
| `ext_kid`                               | String | External Key ID, 32 chars hex string                    |
| `iv`                                    | String | Ciphertext IV                                           |
| `kid`<mark style="color:red;">\*</mark> | String | Key ID, 32 chars hex string                             |
| `msg`<mark style="color:red;">\*</mark> | String | Data message to unwrap (max. 2048 bytes)                |
| `pubkey`                                | String | Base64 encoded external public key                      |
| `ctx`                                   | String | Additional context data (HKDF argument) (max. 64 bytes) |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "unwrapped": "SGVsbG9Xb3JsZDAxMjM0NQ=="
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

Check the list [here](wrap-unwrap.md#possible-alg-values).

#### Response data for successful operation

<table><thead><tr><th>Name</th><th width="150">Type</th><th width="314">Description</th></tr></thead><tbody><tr><td><code>unwrapped</code></td><td>String</td><td>Base64 encoded unwraped data</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="323.40287769784175">Event</th><th>Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_CRYPTO_UNWRAP</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_CRYPTO_UNWRAP</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_CRYPTO_UNWRAP</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
