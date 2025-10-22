---
description: >-
  These operations allow the read and update of the device configuration. This
  section includes Secure Enclave provisioning (on Encedo PPA only and during
  manufacture only).
---

# Configuration

## Manage device configuration

#### Allowed users

{% tabs %}
{% tab title="User" %}
Allowed
{% endtab %}

{% tab title="Master" %}
Allowed
{% endtab %}

{% tab title="ExtAuth" %}
Allowed only to call _**Get configuration.**_
{% endtab %}
{% endtabs %}

#### Required access scope

{% tabs %}
{% tab title="Main" %}
`system:config`
{% endtab %}

{% tab title="Alternative" %}
#### Allowed only to call _**Get configuration.**_

`auth:ext:pair`

`logger:get`
{% endtab %}
{% endtabs %}

## Get configuration

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/system/config`

Read the device configuration data.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "iat": 1647381403,
  "uts": 1647381403,
  "devid": "2023b758c209269a",
  "instanceid": "f4980240-da72-13e3-f45c-2ffbde2a1800",
  "eid": "ff6/rpgprw6OjcPbedIB5LbsxjZqmnf43J1zeK1x82I=",
  "eid_sign": "T61jY1AgV5XUW++eAcQibRDFOl5KjKwLGdo+U0def8A=",
  "user": "John Doe",
  "email": "john@example.com",
  "hostname": "example.ence.do",
  "dnsd": true,
  "trusted_ts": true,
  "trusted_backend": true,
  "allow_keysearch": true,
  "origin": "*",
  "ctx": 0,
  "http_option_hsts": true,
  "http_option_dosprot_mode": 1,  
  "ip": "192.168.11.1/24",
  "genuine_id": "0123eb561f5ea073ee",
  "storage_mode": 81,
  "storage_disk0size": 8388607,
  "storage_capacity": 120979451,
  "spk": "fi2bgSQwaGhLkRi016q9saqeTWvrLyU08nM8hJUpTBg=",
  "nonce": "fOw1YvMYWIqbTfrxgQFzEuvcJozIRqEVKluO9KDza0w="
}
```
{% endtab %}

{% tab title="401: Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="403: Incorrect access scope" %}

{% endtab %}

{% tab title="400: Incorrect argument(s)" %}

{% endtab %}

{% tab title="406: Operation failed" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="252.03007256335948">Value</th><th width="118">Type</th><th width="349.8708147630104">Description</th></tr></thead><tbody><tr><td><code>allow_keysearch</code></td><td>Bool</td><td>True if an allowed search for a key without authentication.<br></td></tr><tr><td><code>ctx</code></td><td>Number</td><td>Instance context id.</td></tr><tr><td><code>devid</code></td><td>String</td><td>Device unique ID.</td></tr><tr><td><code>dnsd</code></td><td>string</td><td>True if build-in DNS server is enabled.</td></tr><tr><td><code>eid</code></td><td>String</td><td>EncedoID, public key of the instance.</td></tr><tr><td><code>eid_sign</code></td><td>String</td><td>Audit log signing public key.</td></tr><tr><td><code>email</code></td><td>String</td><td>Email address.</td></tr><tr><td><code>genuine_id</code></td><td>String</td><td>Secure Enclave serial number (on Encedo PPA only).</td></tr><tr><td><code>http_option_dosprot_mode</code></td><td>Number</td><td>Timeout (disabled if 0) to finish the HTTP request in 0.5sec multipliers.</td></tr><tr><td><code>http_option_hsts</code></td><td>Bool</td><td>True enable HSTS HTTP security headers.</td></tr><tr><td><code>hostname</code></td><td>String</td><td>Hostname, domain name associated with this device.</td></tr><tr><td><code>iat</code></td><td>Number</td><td>Current timestamp.</td></tr><tr><td><code>instanceid</code></td><td>String</td><td>Instance unique ID</td></tr><tr><td><code>ip</code></td><td>String</td><td>IP address associated with this device.</td></tr><tr><td><code>nonce</code></td><td>String</td><td>Random nonce.</td></tr><tr><td><code>origin</code></td><td>String</td><td>CORS allowed origins.</td></tr><tr><td><code>spk</code></td><td>String</td><td>Session public key.</td></tr><tr><td><code>storage_capacity</code></td><td>Number</td><td>Capacity (in sectors) of embedded microSD card (on Encedo PPA only).</td></tr><tr><td><code>storage_disk0size</code></td><td>Number</td><td>Capacity (in sectors) of regular Disk 0  (on Encedo PPA only).</td></tr><tr><td><code>storage_mode</code></td><td>Number</td><td>Dsks 0 default mode and encryption mode of Disk 1 (on Encedo PPA only). </td></tr><tr><td><code>trusted_backend</code></td><td>Bool</td><td>True is backend is trusted and can control this instance.</td></tr><tr><td><code>trusted_ts</code></td><td>Bool</td><td>True is backend is a trusted time source.</td></tr><tr><td><code>user</code></td><td>String</td><td>Username, display name.</td></tr><tr><td><code>uts</code></td><td>Number</td><td>Last RTC update timestamp.</td></tr></tbody></table>



## Update configuration

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/system/config`

Change some configuration data, e.g. options, password or update TLS certificate.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

<table><thead><tr><th width="279">Name</th><th width="148">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>allow_keysearch</code></td><td>Bool</td><td>True if an allowed search for a key without authentication.</td></tr><tr><td><code>email</code></td><td>String</td><td>Contact email address</td></tr><tr><td><code>storage_mode</code></td><td>Number</td><td>Disk0 default mode and Disk1 encryption mode (on Encedo PPA only)</td></tr><tr><td><code>wipeout</code></td><td>Bool</td><td>True to wipe out the device (reset to factory default).</td></tr><tr><td><code>origin</code></td><td>String</td><td>CORS access control data</td></tr><tr><td><code>trusted_ts</code></td><td>Bool</td><td>True is backend is a trusted time source.</td></tr><tr><td><code>trusted_backend</code></td><td>Bool</td><td>True is backend is trusted and can control this instance.</td></tr><tr><td><code>tls</code></td><td>String</td><td>TLS x509 certificate data (check below)</td></tr><tr><td><code>user</code></td><td>String</td><td>Username</td></tr><tr><td><code>userkey</code></td><td>String</td><td>New password public key</td></tr><tr><td><code>userkey_nonce</code></td><td>String</td><td>New password authentication nonce</td></tr><tr><td><code>userkey_hmac</code></td><td>String</td><td>New password authentication code</td></tr><tr><td><code>ctx</code></td><td>Number</td><td>Instance context id.</td></tr><tr><td><code>dnsd</code></td><td>Bool</td><td>True to enable DNS server </td></tr><tr><td><code>storage_disk0size</code></td><td>Number</td><td>Disk0 size in sectors (on Encedo PPA only)</td></tr><tr><td><code>gen_csr</code></td><td>Bool</td><td>True if requesting CSR generation</td></tr><tr><td><code>emp</code></td><td>String</td><td>(optional) Ephemeral public key (transport key)</td></tr><tr><td><code>key</code></td><td>String</td><td>(optional) Encrypted private key</td></tr><tr><td><code>crt</code></td><td>String</td><td>Base64 encoded DER x509 certificate</td></tr><tr><td><code>tls</code> consists of:</td><td>String</td><td></td></tr><tr><td><code>http_option_hsts</code></td><td>Bool</td><td>True enable HSTS HTTP security headers</td></tr><tr><td><code>http_option_dosprot_mode</code></td><td>Number</td><td>Timeout (disabled if 0) to finish the HTTP request in 0.5sec multipliers</td></tr></tbody></table>

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "csr": "MIICATCCAaagAwIBAgIBbTAKBggqhkjOPQQDAjBCMQswCQYDVQQGEwJVSzEXMBUGA1UECgwORW5jZWRvIExpbWl0ZWQxGjAYBgNVBAMMEUVuY2VkbyBDdXN0b2R5IENBMB4XDTIwMTAwNTE5MjkzM1oXDTIzMTAwNTE5MjkzM1owQDELMAkGA1UEBhMCVUsxEzARBgNVBAoMCkVuY2VkbyBMdGQxHDAaBgNVBAMMEyMwMTIzZWI1NjFmNWVhMDczZWUwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASdUuVLRdTcTd1DSu/6qTdh562q5WsXGEcHBP/gpUvHcU/501HwR2NybMmFQQ7/HgLgCYgaTPE+kvq6Lb0AuRf/o4GOMIGLMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMB0GA1UdDgQWBBSqAknAzbCHMuji+7pJhSslHyuApTAfBgNVHSMEGDAWgBR5VVeOla0ntTsGycLKHAI2qA58BjAuBgNVHREEJzAloCMGCSsGAQQBg7cnAaAWBBRGRaJpZ1sXy+HKN/vFyusw810N+DAKBggqhkjOPQQDAgNJADBGAiEA7un6HD6upjiPmhCLYMCk3fxNZyx6cZMNWzQV7LozMTMCIQDptL4bvTeMymy5WiGKrFPkDv7f+Nz9x5vop9vZry0N1Q==",
  "genuine": "qgJJwM2whzLo4vu6SYUrJR8rgKU=.MTY0NzY0MTI4NQ==.MEYCIQCYDC9IDlnGlkBI7/1YPMSIC/31nfiFUISpWEb3Pw5vAgIhAPIcyOufL4MQPwl/dUpM4W8gi+IECx9i9m1LcSHo8Bqo",
  "updated": true,
  "reboot_required": true
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
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="245.02199661590527">Name</th><th width="150">Type</th><th width="331.03021193294364">Description</th></tr></thead><tbody><tr><td><code>csr</code></td><td>String</td><td>Requested x509 CSR, base64 encoded DER file.</td></tr><tr><td><code>genuine</code></td><td>String</td><td>Attestation data.</td></tr><tr><td><code>reboot_required</code></td><td>Bool</td><td>True if a reboot is required for changes to take effect.</td></tr><tr><td><code>updated</code></td><td>Bool</td><td>True is configuration have been changed.</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="329.3333333333333">Event</th><th width="200.03450449488588">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_CONFIG_UPDATED</td><td>LOG_RESULT_OK</td><td>200</td></tr><tr><td>LOG_TYPE_CONFIG_UPDATED</td><td>LOG_RESULT_FAILED</td><td>406</td></tr></tbody></table>

## Get device attestation data

{% hint style="info" %}
This endpoint is available only on Encedo PPA.
{% endhint %}

{% hint style="info" %}
This endpoint is ignoring access `scope`, effectively any `scope` value is allowed as long as the `JWT_TOKEN` is valid.
{% endhint %}

{% hint style="info" %}
`The Authorization` header is not required on fresh, not personalised devices.
{% endhint %}

## Device attestation

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/system/config/attestation`

Obtain device attestation data, which serves as proof of genuineness.

#### Headers

| Name          | Type   | Description       |
| ------------- | ------ | ----------------- |
| Authorization | String | Bearer JWT\_TOKEN |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "crt": "MIICATCCAaagAwIBAgIBbTAKBggqhkjOPQQDAjBCMQswCQYDVQQGEwJVSzEXMBUGA1UECgwORW5jZWRvIExpbWl0ZWQxGjAYBgNVBAMMEUVuY2VkbyBDdXN0b2R5IENBMB4XDTIwMTAwNTE5MjkzM1oXDTIzMTAwNTE5MjkzM1owQDELMAkGA1UEBhMCVUsxEzARBgNVBAoMCkVuY2VkbyBMdGQxHDAaBgNVBAMMEyMwMTIzZWI1NjFmNWVhMDczZWUwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASdUuVLRdTcTd1DSu/6qTdh562q5WsXGEcHBP/gpUvHcU/501HwR2NybMmFQQ7/HgLgCYgaTPE+kvq6Lb0AuRf/o4GOMIGLMA4GA1UdDwEB/wQEAwIHgDAJBgNVHRMEAjAAMB0GA1UdDgQWBBSqAknAzbCHMuji+7pJhSslHyuApTAfBgNVHSMEGDAWgBR5VVeOla0ntTsGycLKHAI2qA58BjAuBgNVHREEJzAloCMGCSsGAQQBg7cnAaAWBBRGRaJpZ1sXy+HKN/vFyusw810N+DAKBggqhkjOPQQDAgNJADBGAiEA7un6HD6upjiPmhCLYMCk3fxNZyx6cZMNWzQV7LozMTMCIQDptL4bvTeMymy5WiGKrFPkDv7f+Nz9x5vop9vZry0N1Q==",
  "genuine": "qgJJwM2whzLo4vu6SYUrJR8rgKU=.MTY0NzY0MTI4NQ==.MEYCIQCYDC9IDlnGlkBI7/1YPMSIC/31nfiFUISpWEb3Pw5vAgIhAPIcyOufL4MQPwl/dUpM4W8gi+IECx9i9m1LcSHo8Bqo"
}
```
{% endtab %}

{% tab title="401: Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="160.07195932733674">Name</th><th width="150">Type</th><th width="415.4627387593553">Description</th></tr></thead><tbody><tr><td><code>crt</code></td><td>String</td><td>Base64 encoded DER x509 device certificate.</td></tr><tr><td><code>genuine</code></td><td>String</td><td>Attestation data.</td></tr></tbody></table>

## Factory provisioning

{% hint style="info" %}
This endpoint is available only on Encedo PPA.
{% endhint %}

{% hint style="danger" %}
This endpoint is used during the manufacturing process to provision the Secure Enclave chip. After successful provisioning, all following calls to this endpoint will return a response code 406.
{% endhint %}

## Factory provisioning

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/system/config/provisioning`

On factory Secure Enclave provisioning (on Encedo PPA only).

#### Headers

| Name                                           | Type   | Description      |
| ---------------------------------------------- | ------ | ---------------- |
| Content-Type<mark style="color:red;">\*</mark> | String | application/json |

#### Request Body

| Name                                        | Type   | Description      |
| ------------------------------------------- | ------ | ---------------- |
| `crt`<mark style="color:red;">\*</mark>     | String | x509 certificate |
| `genuine`<mark style="color:red;">\*</mark> | String | Attestation data |

#### Response status code

{% tabs %}
{% tab title="200: Operation succsessful" %}

{% endtab %}

{% tab title="400: Incorrect or malformated argument(s)" %}

{% endtab %}

{% tab title="403: Device personalized" %}

{% endtab %}

{% tab title="406: Operation failed" %}

{% endtab %}
{% endtabs %}
