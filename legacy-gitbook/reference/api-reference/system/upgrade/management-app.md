---
description: >-
  These operations (on Encedo PPA only) allow the build-in management
  application to be upgraded. This includes integrity and signature validation
  allowing only a legitimate application to be installed.
---

# Management app

{% hint style="warning" %}
Embedded Flash Drive is available on Encedo PPA only. On Encedo EPA those endpoints are not available, response code 404 will be returned.
{% endhint %}

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
{% endtab %}
{% endtabs %}

{% hint style="info" %}
`The Authorization` header is not required on fresh, not personalized devices.
{% endhint %}

{% hint style="info" %}
TLS connection is not required. It is a last resort way to upload fixes. Firmware is signed anyway, no worry about the integrity or genuineness.
{% endhint %}

## Upload a file

## Upload a new file

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/system/upgrade/upload_ui`

Upload a new app image (webroot.tar) file.

#### Headers

| Name                                                  | Type   | Description                        |
| ----------------------------------------------------- | ------ | ---------------------------------- |
| Authorization                                         | String | Bearer JWT\_TOKEN                  |
| Content-Type<mark style="color:red;">\*</mark>        | String | application/octet-stream           |
| Content-Disposition<mark style="color:red;">\*</mark> | String | attachment; filename="webroot.tar" |
| Expect<mark style="color:red;">\*</mark>              | String | 100-continue                       |

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
{% endtabs %}

#### Log entries

<table><thead><tr><th width="328.544041736478">Event</th><th width="190.06305249216229">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr></tbody></table>

## Validate a file

## Check a file

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/system/upgrade/check_ui`

Check the signature and integrity of the newly uploaded app image.

#### Headers

| Name          | Type   | Description       |
| ------------- | ------ | ----------------- |
| Authorization | String | Bearer JWT\_TOKEN |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}

{% endtab %}

{% tab title="201: Process of validation started" %}

{% endtab %}

{% tab title="202: Validation ongoing" %}

{% endtab %}

{% tab title="401: Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="403: Incorrect access scope" %}

{% endtab %}

{% tab title="406: Operation failed" %}

{% endtab %}
{% endtabs %}

#### Log entries

<table><thead><tr><th width="323.6540808939655">Event</th><th width="194.6343371408091">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr></tbody></table>

## Install the new management app

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/system/upgrade/install_ui`

A new version of Encedo Manager will be installed on Encedo PPA.

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

{% tab title="406: Operation failed" %}

{% endtab %}
{% endtabs %}

#### Log entries

<table><thead><tr><th width="312.56360988427855">Event</th><th width="197.60290384511222">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_UPGRADE</td><td>LOG_RESULT_ERROR</td><td>406</td></tr><tr><td>LOG_TYPE_UPGRADE</td><td>LOG_RESULT_ERROR</td><td>409</td></tr><tr><td>LOG_TYPE_UPGRADE</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
