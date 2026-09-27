---
description: >-
  This operation reboots the device, effectively invalidating all issued access
  tokens (JWT_TOKEN).
---

# Reboot

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
`system:upgrade`
{% endtab %}

{% tab title="Alternative" %}
`system:config`

`system:shutdown`
{% endtab %}
{% endtabs %}

{% hint style="info" %}
`The Authorization` header is not required on fresh, not personalised devices.
{% endhint %}

## Reboot

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/system/reboot`

Reboot the device, simulate a power cycle.

#### Headers

| Name          | Type   | Description       |
| ------------- | ------ | ----------------- |
| Authorization | String | Bearer JWT\_TOKEN |

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

<table><thead><tr><th width="332.3333333333333">Event</th><th>Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_REBOOT</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
