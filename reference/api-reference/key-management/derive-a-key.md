---
description: >-
  This key management operation allows to derive a new key and save it inside
  the device's secure repository.
---

# Derive a key

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
`keymgmt:ecdh`
{% endtab %}

{% tab title="Alternative" %}
`keymgmt:gen`
{% endtab %}
{% endtabs %}

## Derive a new key

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/keymgmt/derive`

Derive (create) a new key using ECDH with a source key and save it.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                      | Type   | Description                            |
| ----------------------------------------- | ------ | -------------------------------------- |
| `descr`                                   | String | Base64 encoded additional description  |
| `ext_kid`                                 | String | External Key ID, 32 chars hex string   |
| `kid`<mark style="color:red;">\*</mark>   | String | Key ID, 32 chars hex string            |
| `label`<mark style="color:red;">\*</mark> | String | Label of a key                         |
| `mode`                                    | String | Key operation mode (for NIST ECC only) |
| `pubkey`                                  | String | Base64 encoded external public key     |
| `type`<mark style="color:red;">\*</mark>  | String | Type of key to create                  |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "kid":"bd0958e1499ecfd51ea62a3f49a84cad"
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

{% hint style="warning" %}
To generate ECC keys (NISP & SECP only), the generated seed needs to be validated to ensure it is in the correct range. As a result, this endpoint can fail without being an error.
{% endhint %}

#### Response data for successful operation

<table><thead><tr><th width="151.33333333333331">Name</th><th width="150">Type</th><th width="375.40425531914894">Description</th></tr></thead><tbody><tr><td><code>kid</code></td><td>String</td><td>Key ID, 32-character hex string </td></tr></tbody></table>

#### Possible key `type`

Please refer to the list [here](https://docs.encedo.com/hem-api/reference/api-reference/key-management/create-a-key#possible-key-type); note that ML-KEM and ML-DSA keys cannot be derived, only generated. These exceptions apply to the list.

#### Possible key `mode` (for NIST ECC keys only)

Check the list [here](https://docs.encedo.com/hem-api/reference/api-reference/key-management/create-a-key#possible-key-mode-for-nist-ecc-keys-only).

#### Log entries

<table><thead><tr><th width="322.3333333333333"></th><th></th><th></th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_KEY_DERIVE</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_KEY_DERIVE</td><td>LOG_RESULT_ERROR</td><td>406</td></tr><tr><td>LOG_TYPE_KEY_DERIVE</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
