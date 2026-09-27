---
description: Those endpoints allow to authenticate the User or Master based on passphrase.
---

# User authentication

{% hint style="info" %}
These two endpoints are wide open and do not need any authorization data.
{% endhint %}

{% hint style="danger" %}
The authentication procedure requires a valid RTC to be set.
{% endhint %}

#### Phase 1 - challenge

## Get a challenge

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/auth/token`

Get a challenge data to perform user authentication based on it.

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "exp": 1647871504,
  "spk": "0kRmCliUQvRwfxi7T1ek2GtbSERzMFRGLeyO1r1tEXo=",
  "jti": "1IU4Yont+/lZxh+HpgBwsc2sOWybfByFI+n8vAxWQzU=",
  "lbl": "My device",
  "eid": "ff6/rpgprw6OjcPbedIB5LbsxjZqmnf43J1zeK1x82I="
}
```
{% endtab %}

{% tab title="403: Clock RTC not set" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="150">Name</th><th width="150">Type</th><th width="383.2">Description</th></tr></thead><tbody><tr><td><code>exp</code></td><td>Number</td><td>Expire timestamp</td></tr><tr><td><code>eid</code></td><td>String</td><td>EncedoID, public key of the instance.</td></tr><tr><td><code>jti</code></td><td>String</td><td>Token id</td></tr><tr><td><code>lbl</code></td><td>String</td><td>Label, username</td></tr><tr><td><code>spk</code></td><td>String</td><td>Session public key</td></tr></tbody></table>

#### Phase 2 - response

## Post authentication data

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/auth/token`

Post-authentication data is signed based on the user's passphrase.

#### Headers

| Name                                           | Type   | Description      |
| ---------------------------------------------- | ------ | ---------------- |
| Content-Type<mark style="color:red;">\*</mark> | String | application/json |

#### Request Body

| Name                                     | Type   | Description                                       |
| ---------------------------------------- | ------ | ------------------------------------------------- |
| `auth`<mark style="color:red;">\*</mark> | String | Authentication data to be validated by the device |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6ImxvZ2dlcjpnZXQiLCJzdWIiOiJVIiwiaWF0IjoxNjQ3ODcxNDQ1LCJleHAiOjE2NDc5MDAyNDUsImp0aSI6IjFZVTRZcG5WeTVyWGF1d3hUMklYUlg5MWhUQ3hhVUV0R2RPQksyNXpBNDA9In0.wlFlgdpP4bPxNZoPAGaPqqyV1yuri2-Z53l7B8CfcXU"
}
```
{% endtab %}

{% tab title="400: Incorrect argument(s)" %}

{% endtab %}

{% tab title="401: User not authenticated" %}

{% endtab %}

{% tab title="403: Clock RTC not set" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="179.33333333333331">Name</th><th width="150">Type</th><th width="353.6196473551638">Description</th></tr></thead><tbody><tr><td><code>token</code></td><td>String</td><td>JWT access token (refered as JWT_TOKEN)</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="358.89962825278815">Event</th><th width="165.83782338625448">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_AUTH_SUCCESS_INTERNAL</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
