---
description: >-
  These operations allow the device firmware to be upgraded by uploading a new
  firmware image over API. This includes integrity and signature validation
  allowing only a legitimate firmware to be install
---

# Firmware

{% hint style="warning" %}
Embedded Flash Drive is available on Encedo PPA only. On Encedo EPA those endpoints are not available, and response code 404 will be returned.
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

## Upload the file

## Upload a new firmware

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/system/upgrade/upload_fw`

Upload a new firmware image (firmware.bin) file.

#### Headers

| Name                                                  | Type   | Description                         |
| ----------------------------------------------------- | ------ | ----------------------------------- |
| Authorization                                         | String | Bearer JWT\_TOKEN                   |
| Content-Type<mark style="color:red;">\*</mark>        | String | application/octet-stream            |
| Content-Disposition<mark style="color:red;">\*</mark> | String | attachment; filename="firmware.bin" |
| Expect<mark style="color:red;">\*</mark>              | String | 100-continue                        |

#### Response status code

{% tabs %}
{% tab title="200:  Operation successful" %}

{% endtab %}

{% tab title="406: Operation failed" %}

{% endtab %}

{% tab title="401: Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="403: Incorrect access scope" %}

{% endtab %}
{% endtabs %}

#### Log entries

<table><thead><tr><th width="331.54674129050574">Event</th><th>Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr></tbody></table>

## Validate the uploaded file

## Check firmware

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/system/upgrade/check_fw`

Verify that the newly uploaded firmware file is valid.

#### Headers

| Name          | Type   | Description       |
| ------------- | ------ | ----------------- |
| Authorization | String | Bearer JWT\_TOKEN |

#### Response status code

{% tabs %}
{% tab title="200: Operation succsessful" %}

{% endtab %}

{% tab title="202: Validation ongoing" %}

{% endtab %}

{% tab title="401: Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="403:  Incorrect access scope" %}

{% endtab %}

{% tab title="201: Process of validation started" %}

{% endtab %}

{% tab title="406: Operation failed" %}

{% endtab %}
{% endtabs %}

#### Log entries

<table><thead><tr><th width="327.28179436715135">Event</th><th width="194.54649110729937">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr></tbody></table>

## Install new firmware

## Install firmware

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/system/upgrade/install_fw`

Install uploaded and validated firmware (checked) in bootloader mode (the device will reboot on 200).

#### Headers

| Name          | Type   | Description       |
| ------------- | ------ | ----------------- |
| Authorization | String | Bearer JWT\_TOKEN |

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

<table><thead><tr><th width="318.4430820883553">Event</th><th width="204.71253892185243">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_UPGRADE</td><td>LOG_RESULT_ERROR</td><td>406</td></tr><tr><td>LOG_TYPE_UPGRADE</td><td>LOG_RESULT_ERROR</td><td>409</td></tr><tr><td>LOG_TYPE_UPGRADE</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
