---
description: >-
  This key management operation allows the deletion of a key stored inside the
  device's secure repository.
---

# Delete a key

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
`keymgmt:del`
{% endtab %}
{% endtabs %}

## Delete a key

<mark style="color:red;">`DELETE`</mark> `https://my.ence.do/api/keymgmt/delete/:kid`

Delete a key pointed to by the KID argument.

#### Query Parameters

| Name                                  | Type   | Description           |
| ------------------------------------- | ------ | --------------------- |
| kid<mark style="color:red;">\*</mark> | String | Key ID, 32 hex chars  |

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}

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

{% tab title="418: TLS connection required" %}

{% endtab %}
{% endtabs %}

#### Log entries

<table><thead><tr><th width="332.3333333333333">Event</th><th>Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_KEY_DELETE</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_KEY_DELETE</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_KEY_DELETE</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
