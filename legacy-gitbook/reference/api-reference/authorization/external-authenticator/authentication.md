---
description: Those endpoints allow to authenticate based by External Authenticator.
---

# Authentication

{% hint style="info" %}
These two endpoints are wide open and do not need any authorization data.
{% endhint %}

#### Phase 1 - challenge

## Get a challenge

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/auth/ext/request`

Get an authentication request data to challenge the external authenticator.

#### Headers

| Name                                           | Type   | Description      |
| ---------------------------------------------- | ------ | ---------------- |
| Content-Type<mark style="color:red;">\*</mark> | String | application/json |

#### Request Body

| Name                                      | Type   | Description                     |
| ----------------------------------------- | ------ | ------------------------------- |
| `epk`<mark style="color:red;">\*</mark>   | String | Broker ephemeral public key     |
| `scope`<mark style="color:red;">\*</mark> | String | Requested access scope          |
| `exp`<mark style="color:red;">\*</mark>   | Number | Requested lifetime of the token |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "authreq": "eyJlY2RoIjoieDI1NTE5IiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJpc3MiOiJmZjYvcnBncHJ3Nk9qY1BiZWRJQjVMYnN4alpxbW5mNDNKMXplSzF4ODJJPSIsImF1ZCI6Ik56bzNtUlpmN3YwRGhpN2dobkdPY3R0Qk42SFJqVGRhUG4vc1hhc3k3alU9IiwiaWF0IjoxNjQ3ODcxMTE3LCJleHAiOjE2NDc4NzQ3MTcsImp0aSI6ImpZUTRZdU0vUWJydEdvRElRdUNTUW1zdjdNek9sNytKM3ExRjdYM25CN2s9Iiwic2NvcGUiOnsiTC9EenNjUXJ0dGo4S0Y4QTE1WjFVbkJwaXdjTUdudXZTRy94cUlwOXI0UT0iOiJBL3loTmp2ZldFOGdOMU5FSElSR1hEVFFpeVdENlY4YzRyL0o3dCtDOE1nWUxpT3Y2SEpXUWplbmJueFU3aGZkRCJ9fQ.yiE_kG3FA4h-2MXO3r00WyS1ScbHijR6VBdNxKz1uTI",
  "epk": "Nzo3mRZf7v0Dhi7ghnGOcttBN6HRjTdaPn/sXasy7jU="
}
```
{% endtab %}

{% tab title="400: Incorrect argument(s)" %}

{% endtab %}

{% tab title="403: Clock RTC not set" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="160.46126340882006">Name</th><th width="155.80120342675414">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>authreq</code></td><td>String</td><td>Authentication request</td></tr><tr><td><code>epk</code></td><td>String</td><td>Broker ephemeral public key</td></tr></tbody></table>

#### Phase 2 - response

## Post authentication data

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/auth/ext/token`

Post authentication data signed by an external authenticator.

#### Headers

| Name                                           | Type   | Description      |
| ---------------------------------------------- | ------ | ---------------- |
| Content-Type<mark style="color:red;">\*</mark> | String | application/json |

#### Request Body

| Name                                          | Type   | Description                                       |
| --------------------------------------------- | ------ | ------------------------------------------------- |
| `authreply`<mark style="color:red;">\*</mark> | String | Authentication data to be validated by the device |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6ImtleW1nbXQ6bGlzdCIsInN1YiI6IlFxL0VHZHZhY21Ock42SkZXVlhnbFE9PSIsImlhdCI6MTY0Nzg3MTEyMiwiZXhwIjoxNjQ3ODcyMDIwLCJqdGkiOiJrb1E0WXNDZjNMNGlUcmwycHk2Zzd0M2p2Vjlwd3dzSXI2Ly9GOTZPZllJPSJ9.u7lVd5B6CZxmM3Sch9HVBa5-MRadhDlNnCaCTeBq2DY"
}
```
{% endtab %}

{% tab title="400: Incorrect argument(s)" %}

{% endtab %}

{% tab title="401: Argument authreply not authenticated" %}

{% endtab %}

{% tab title="403: Clock RTC not set" %}

{% endtab %}

{% tab title="406: Not Acceptable Issuer not found" %}

{% endtab %}

{% tab title="409: Conflict " %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="162">Name</th><th width="150">Type</th><th width="364.1875">Description</th></tr></thead><tbody><tr><td><code>token</code></td><td>String</td><td>JWT access token (refered as JWT_TOKEN)</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="358.2920937125289">Event</th><th width="157.9392252759946">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_AUTH_SUCCESS_EXTERNAL</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
