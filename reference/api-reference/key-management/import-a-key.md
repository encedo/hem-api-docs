---
description: >-
  This key management operation allows importing of a public key to the keys
  repository and treats it as a trusted key afterwards.
---

# Import a key

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
`keymgmt:imp`
{% endtab %}
{% endtabs %}

## Import a public key

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/keymgmt/import`

Import a public key and save it in the repository of keys.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                       | Type   | Description                            |
| ------------------------------------------ | ------ | -------------------------------------- |
| `descr`                                    | String | Base64 encoded additional description  |
| `label`<mark style="color:red;">\*</mark>  | String | Label of a key                         |
| `mode`                                     | String | Key operation mode (for NIST ECC only) |
| `pubkey`<mark style="color:red;">\*</mark> | String | Base64 encoded external public key     |
| `type`<mark style="color:red;">\*</mark>   | String | Type of key to create                  |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "kid":"d51ea62a3f49a84cadbd0958e1499ecf"
}
```
{% endtab %}

{% tab title="401: Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="403: Incorrect access scope" %}

{% endtab %}

{% tab title="406: Operation failed" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}

{% tab title="400: Incorrect argument(s)" %}

{% endtab %}

{% tab title="418: TLS connection required" %}

{% endtab %}
{% endtabs %}

#### Possible `pubkey` type

| Type       | Description                  |
| ---------- | ---------------------------- |
| SECP256R1  | NIST P-256 ECC key           |
| SECP384R1  | NIST P-384 ECC key           |
| SECP521R1  | NIST P-521 ECC key           |
| SECP256K1  | SEC2-v2 ECC key              |
| CURVE25519 | CURVE25519 ECC ECDH only key |
| CURVE448   | CURVE4ECC ECDH only key      |
| ED25519    | ED25519 ECC EdDSA only key   |
| ED448      | ED448 ECC EdDSA only key     |
| MLKEM512   | ML-KEM-512 key               |
| MLKEM768   | ML-KEM-768 key               |
| MLKEM1024  | ML-KEM-1024 key              |
| MLDSA44    | ML-DSA-44 key                |
| MLDSA65    | ML-DSA-65 key                |
| MLDSA87    | ML-DSA-87 key                |

#### Possible key `mode` (for NIST ECC keys only)

Check the list [here](https://docs.encedo.com/hem-api/reference/api-reference/key-management/create-a-key#possible-key-mode-for-nist-ecc-keys-only).

#### Response data for successful operation

<table><thead><tr><th width="164.94430495061005">Name</th><th width="150">Type</th><th width="333">Description</th></tr></thead><tbody><tr><td><code>kid</code></td><td>String</td><td>Key ID, 32-character hex string </td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="327.3333333333333">Event</th><th>Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_KEY_IMPORT</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_KEY_IMPORT</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_KEY_IMPORT</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
