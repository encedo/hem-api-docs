# Low level USB mode

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
`The Authorization` header is not required on fresh, not personalised devices.
{% endhint %}

{% hint style="info" %}
TLS connection is not required. It is a last resort method for uploading fixes. Firmware is signed anyway, so there's no worry about integrity or genuineness.
{% endhint %}

## Activate USB ACM programming

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/system/upgrade/usbmode`

Switch (reboot) the device into the bootloader into USB CDC-ACM mode to allow the upload of the Intel HEX firmware image.

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

{% tab title="409: Operation failed" %}

{% endtab %}
{% endtabs %}

#### Log entries

<table><thead><tr><th width="322.1771344100629">Event</th><th width="190.506425013502">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_UPGRADE</td><td>LOG_RESULT_ERROR</td><td>409</td></tr><tr><td>LOG_TYPE_UPGRADE</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
