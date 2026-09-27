---
description: >-
  This key management operation allows the creation of a new key and saving it
  inside the device's secure repository.
---

# Create a key

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
`keymgmt:gen`
{% endtab %}
{% endtabs %}

## Create a new key

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/keymgmt/create`

Create a new key and save it.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                      | Type   | Description                            |
| ----------------------------------------- | ------ | -------------------------------------- |
| `label`<mark style="color:red;">\*</mark> | String | Label of a key                         |
| `mode`                                    | String | Key operation mode (for NIST ECC only) |
| `type`<mark style="color:red;">\*</mark>  | String | Type of key to create                  |
| `descr`                                   | String | Base64 encoded additional description  |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "kid":"09bd0958e1499ecfd51ea62a3f49a84c"
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

#### Possible `key` type

<table><thead><tr><th width="358.0508474576271">Type</th><th>Description</th></tr></thead><tbody><tr><td>SECP256R1</td><td>NIST P-256 ECC key</td></tr><tr><td>SECP384R1</td><td>NIST P-384 ECC key</td></tr><tr><td>SECP521R1</td><td>NIST P-521 ECC key</td></tr><tr><td>SECP256K1</td><td>SEC2-v2 ECC key</td></tr><tr><td>CURVE25519</td><td>CURVE25519 ECC ECDH only key</td></tr><tr><td>CURVE448</td><td>CURVE4ECC ECDH only key</td></tr><tr><td>ED25519</td><td>ED25519 ECC EdDSA only key</td></tr><tr><td>ED448</td><td>ED448 ECC EdDSA only key</td></tr><tr><td>SHA2-256</td><td>SHA2-256 HMAC symmetric key</td></tr><tr><td>SHA2-384</td><td>SHA2-384 HMAC symmetric key</td></tr><tr><td>SHA2-512</td><td>SHA2-512 HMAC symmetric key</td></tr><tr><td>SHA3-256</td><td>SHA3-256 HMAC symmetric key</td></tr><tr><td>SHA3-384</td><td>SHA3-384 HMAC symmetric key</td></tr><tr><td>SHA3-512</td><td>SHA3-512 HMAC symmetric key</td></tr><tr><td>AES128</td><td>AES 128 bits symmetric key</td></tr><tr><td>AES192</td><td>AES 192 bits symmetric key</td></tr><tr><td>AES256</td><td>AES 256 bits symmetric key</td></tr><tr><td>MLKEM512</td><td>ML-KEM-512 key</td></tr><tr><td>MLKEM768</td><td>ML-KEM-768 key</td></tr><tr><td>MLKEM1024</td><td>ML-KEM-1024 key</td></tr><tr><td>MLDSA44</td><td>ML-DSA-44 key</td></tr><tr><td>MLDSA65</td><td>ML-DSA-65 key</td></tr><tr><td>MLDSA87</td><td>ML-DSA-87 key</td></tr></tbody></table>

#### Possible key `mode` (for NIST ECC keys only)

| Mode       | Description                    |
| ---------- | ------------------------------ |
| ECDH       | Limit usage to ECDH only.      |
| ExDSA      | Limit usage to ExDSA only.     |
| ECDH,ExDSA | Allow both ECDH and ECDH mode. |

#### Response data for successful operation

<table><thead><tr><th width="184.33036861366998">Name</th><th width="150">Type</th><th width="339.97660022233055">Description</th></tr></thead><tbody><tr><td><code>kid</code></td><td>String</td><td>Key ID, 32 chars hex string </td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="329.5688729874776">Event</th><th>Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_KEY_GENERATION</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_KEY_GENERATION</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_KEY_GENERATION</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
