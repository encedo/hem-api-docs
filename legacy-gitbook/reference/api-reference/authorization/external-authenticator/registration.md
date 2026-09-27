---
description: >-
  Those endpoints allow to register a external authenticator, like Encedo Mobile
  Authenticator.
---

# Registration

#### Allowed users

{% tabs %}
{% tab title="User" %}
Allowed
{% endtab %}

{% tab title="Master" %}
Not allowed
{% endtab %}

{% tab title="ExtAuth" %}
Not allowed
{% endtab %}
{% endtabs %}

#### Required access scope

{% tabs %}
{% tab title="Main" %}
`auth:ext:pair`
{% endtab %}

{% tab title="Alternative" %}
`system:config`
{% endtab %}
{% endtabs %}

## Register a new authenticator

#### Phase 1 - challenge

## Get the registration challenge and begin the process

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/auth/ext/init`

Generate a challenge to link the device with a new external authenticator.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                    | Type   | Description                 |
| --------------------------------------- | ------ | --------------------------- |
| `epk`<mark style="color:red;">\*</mark> | String | Broker ephemeral public key |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "request": "eyJlY2RoIjoieDI1NTE5IiwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiI5cHM0WWlySDdUZTB0ZWZwanl6Q2NQNTYzRjhTK2daeGJCTVg5VExFQnZnPSIsImV4cCI6MTY0Nzk2MzUxMCwiYXVkIjoiL05HU0F2dTltNjRpQzc5d2FrR3ZMYzdSYlcrclhkcnVZUHVlOXYwbmZIST0iLCJpc3MiOiJmZjYvcnBncHJ3Nk9qY1BiZWRJQjVMYnN4alpxbW5mNDNKMXplSzF4ODJJPSJ9.M0gYXmgB9cpI1YF48SG5iI7OcMRxRC-uqlIHaiAFrUQ",
  "eid": "ff6/rpgprw6OjcPbedIB5LbsxjZqmnf43J1zeK1x82I="
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

<table><thead><tr><th width="164.59892010454817">Name</th><th width="150">Type</th><th width="410.0491373987889">Description</th></tr></thead><tbody><tr><td><code>eid</code></td><td>String</td><td>EncedoID, public key of the instance.</td></tr><tr><td><code>request</code></td><td>String</td><td>Registration data to proxy to the external authenticator.</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="321.0507089706434">Event</th><th width="195.33333333333331">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr></tbody></table>

#### Phase 2 - response

## Upload the registration reply and validate registration

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/auth/ext/validate`

Upload a registration reply data sent by an external authenticator.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                      | Type   | Description                               |
| ----------------------------------------- | ------ | ----------------------------------------- |
| `pid`<mark style="color:red;">\*</mark>   | String | Unique Pairing ID                         |
| `reply`<mark style="color:red;">\*</mark> | String | Reply data sent by external authenticator |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "kid": "42afc419dbda72636b37a2455955e095",
  "code": "3SABMB8RqE2XH2floeEqg7obeyn/TtqK1hk/hi+4N8k="
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

<table><thead><tr><th width="150">Name</th><th width="150">Type</th><th width="376.2">Description</th></tr></thead><tbody><tr><td><code>code</code></td><td>String</td><td>Confirmation code</td></tr><tr><td><code>kid</code></td><td>String</td><td>Key ID of saved authenticator public key</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="331.43398209744066">Event</th><th width="188.37439643618174">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_AUTH_PAIRED_EXTERNAL</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>

## List registered authenticators

## Get authentication data

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/auth/ext/mac`

Obtain MAC data to authenticate the device on the broker site and retrieve a list of paired authenticators.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                    | Type   | Description                 |
| --------------------------------------- | ------ | --------------------------- |
| `epk`<mark style="color:red;">\*</mark> | String | Broker ephemeral public key |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "nonce": "XJ04YiV/Mh517cV0zqG+XEeCGbGNBt2PUnWcCtV7NVg=",
  "mac": "ttyTJLTi+bguIwU9mW+5dCEy6l55YyQZZ4tq8tR8WRE=",
  "eid": "ff6/rpgprw6OjcPbedIB5LbsxjZqmnf43J1zeK1x82I="
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

<table><thead><tr><th width="151.33333333333331">Name</th><th width="150">Type</th><th width="372.40425531914894">Description</th></tr></thead><tbody><tr><td><code>eid</code></td><td>String</td><td>EncedoID, public key of the instance.</td></tr><tr><td><code>mac</code></td><td>String</td><td>Authentication data</td></tr><tr><td><code>nonce</code></td><td>String</td><td>Authentication data nonce</td></tr></tbody></table>

#### Log entries

<table><thead><tr><th width="325.26565422019877">Event</th><th width="200.2800257408793">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr></tbody></table>
