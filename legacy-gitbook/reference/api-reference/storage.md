---
description: >-
  These endpoints controls two embedded Flash Drives - regular and encrypted,
  available on Encedo PPA only.
---

# Storage

{% hint style="warning" %}
Embedded Flash Drive is available on Encedo PPA only. On Encedo EPA these two endpoints are not available, response code 404 will be returned.
{% endhint %}

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
`storage:disk[0|1][:rw]`



Example:

`storage:disk0:rw` - Unlock Disk0 in read/write mode or lock Disk0

`storage:disk1` - Unlock Disk1 in read-only mode or lock Disk1
{% endtab %}
{% endtabs %}

## Unlock a disk

## Unlock a disk

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/storage/unlock`

Disk number and mode (read-only or read/write) are taken from the access `scope` from JWT\_TOKEN.

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

{% tab title="406: Operation failed" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}
{% endtabs %}

#### Log entries

<table><thead><tr><th width="332.53200237944304">Event</th><th width="190.07113912651963">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr></tbody></table>

## Lock a disk

## Lock a disk

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/storage/lock`

Disk number is taken from the access `scope` of the JWT\_TOKEN.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}

{% endtab %}

{% tab title="401: Missing or invalid access token" %}

{% endtab %}

{% tab title="403: Incorrect access scope" %}

{% endtab %}

{% tab title="406: Operation failed" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}
{% endtabs %}

#### Log entries

<table><thead><tr><th width="324.23579469560565">Event</th><th width="195.4451495920218">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr></tbody></table>
