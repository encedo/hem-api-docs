---
description: >-
  Encedo HEM needs to be initialised before it's usable. This process is called
  Personalisation, and these two API endpoints are dedicated to this operation.
---

# Initialisation

{% hint style="info" %}
These two endpoints are wide open and do not need any authorisation data. After the successful personalisation of the device, future calls will raise Error 406.
{% endhint %}

{% hint style="info" %}
The format of the initialisation data is described in _"General information"_.
{% endhint %}

## Personalization

#### Phase 1 - challenge

## Get challenge data

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/auth/init`

Get initial data (challenge) as the first step in the personalisation process.

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "exp": 1647936471,
  "spk": "dONxxYB9mq9C3UjrVCgkAw6O30JqZkFprT55fq3ZfAM=",
  "jti": "m4M5Yn6HNoyABv+W1JiIQtSP4xiq6PBD1x5b2/PlJl8=",
  "genuine": "LH8nwNPgH3PV+zfry/Savrso/Q4=.MTY0NzkzNjQ3MQ==.MEYCIQD0GFLsc0JGDo5QoWY1m/Jcw7FKpe5kPoaRop6EWvBfhQIhALMA3DwwigtCTIL5Sopa38aWZUL4AGYUVq3u1v6f2Pjn",
  "eid": "lvVc8WGbc8m95VvUVgZO7Z1maYOPdX8Pn0cveNPtYyA="
}
```
{% endtab %}

{% tab title="403: Clock RTC not set" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}

{% tab title="406: Operation failed" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="150">Name</th><th width="150">Type</th><th width="429.1610797982794">Description</th></tr></thead><tbody><tr><td><code>eid</code></td><td>String</td><td>EncedoID, public key of the instance</td></tr><tr><td><code>exp</code></td><td>String</td><td>Expire timestamp</td></tr><tr><td><code>genuine</code></td><td>String</td><td>Attestation data</td></tr><tr><td><code>jti</code></td><td>String</td><td>Token id</td></tr><tr><td><code>spk</code></td><td>String</td><td>Session public key</td></tr></tbody></table>

#### Phase 2 - response

## Upload the initial configuration

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/auth/init`

Upload a well-formatted initial configuration signed by the user's passphrase.

#### Headers

| Name                                           | Type   | Description      |
| ---------------------------------------------- | ------ | ---------------- |
| Content-Type<mark style="color:red;">\*</mark> | String | application/json |

#### Request Body

| Name                                     | Type   | Description              |
| ---------------------------------------- | ------ | ------------------------ |
| `init`<mark style="color:red;">\*</mark> | String | Initialization structure |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "instanceid": "e7aafede-76b1-c7c8-784b-c963967fe307",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZSI6InN5c3RlbTpjb25maWciLCJzdWIiOiJVIiwiaWF0IjoxNjQ3OTM2NDE2LCJleHAiOjE2NDc5NjUyMTYsImp0aSI6Im9JTTVZbElqYXYwRUdqQlpxVDdtbDZ3Q0d4WTRYcmpGR0lweWd6Q1lEbWM9In0.aAW7qaAjbD9y36VI0XVtO-f8l2kV0T4Y4kZZxpaAPEg",
  "genuine": "LH8nwNPgH3PV+zfry/Savrso/Q4=.MTY0NzkzNjQ3Ng==.MEQCIHJ2fARkMLCM3bb8wBImJWQMgCOCnt+x8idort0IVnP+AiA4hSYO3hV6K8/vZKAiAyiJxYMQyxHQo5qP1P2AEqEiRw=="
}
```
{% endtab %}

{% tab title="403: Clock RTC not set" %}

{% endtab %}

{% tab title="406: Operation failed" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}

{% tab title="400: Incorrect argument(s)" %}

{% endtab %}

{% tab title="401: Initialization structure validation failed" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="177.85896744001994">Name</th><th width="150">Type</th><th width="373.18837571291704">Description</th></tr></thead><tbody><tr><td><code>genuine</code></td><td>String</td><td>Attestation data</td></tr><tr><td><code>instanceid</code></td><td>String</td><td>Instance unique ID</td></tr><tr><td><code>token</code></td><td>String</td><td>JWT access token (referred to as JWT_TOKEN)</td></tr></tbody></table>

#### Log entries (directly and indirectly as indicated)

<table><thead><tr><th width="252.6754859340433">Event</th><th width="184.76966569258772">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_DEVICE_INITED</td><td>LOG_RESULT_OK</td><td>200</td></tr><tr><td>LOG_TYPE_STARTUP</td><td>LOG_RESULT_OK</td><td>On every powerup as second log entry (the first is <code>LOG_TYPE_KEY_INIT</code>)</td></tr></tbody></table>
