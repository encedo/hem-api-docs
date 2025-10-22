---
description: >-
  This operation shutdown the device, effectively stopping API and securing the
  chip in a safe state.
---

# Shutdown

#### Allowed users

{% tabs %}
{% tab title="User" %}
Allowed
{% endtab %}

{% tab title="Master" %}
Allowed
{% endtab %}

{% tab title="ExtAuth" %}
Allowed
{% endtab %}
{% endtabs %}

#### Required access scope

{% tabs %}
{% tab title="Main" %}
`system:shutdown`
{% endtab %}

{% tab title="Alternative" %}
`system:config`
{% endtab %}
{% endtabs %}

## Shutdown

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/system/shutdown`

Shut down the device and stay in a secure state.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}

{% endtab %}

{% tab title="401: Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="403: Incorrect access scope" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}
{% endtabs %}

#### Log entries

<table><thead><tr><th width="328.4946419956104">Event</th><th>Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_SHUTDOWN</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
