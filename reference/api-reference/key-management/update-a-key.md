---
description: >-
  This key management operation allows updating the key label or description
  fields.
---

# Update a key

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
`keymgmt:upd`
{% endtab %}
{% endtabs %}

## Update a key

<mark style="color:green;">`POST`</mark> `https://my.ence.do/api/keymgmt/update`

Update a key `label` and `descr` fields.

#### Headers

| Name                                            | Type   | Description       |
| ----------------------------------------------- | ------ | ----------------- |
| Authorization<mark style="color:red;">\*</mark> | String | Bearer JWT\_TOKEN |
| Content-Type<mark style="color:red;">\*</mark>  | String | application/json  |

#### Request Body

| Name                                    | Type   | Description                           |
| --------------------------------------- | ------ | ------------------------------------- |
| `kid`<mark style="color:red;">\*</mark> | String | Key ID, 32-character hex string       |
| `label`                                 | String | Label of a key                        |
| `descr`                                 | String | Base64 encoded additional description |

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

<table><thead><tr><th width="371.0519013968733">Event</th><th width="197">Result</th><th width="150">Source</th></tr></thead><tbody><tr><td>LOG_TYPE_FAILED_SCOPE_CHECK</td><td>LOG_RESULT_FAILED</td><td>403</td></tr><tr><td>LOG_TYPE_KEY_ATTRIBUTES_CHANGED</td><td>LOG_RESULT_ERROR</td><td>400</td></tr><tr><td>LOG_TYPE_KEY_ATTRIBUTES_CHANGED</td><td>LOG_RESULT_FAILED</td><td>406</td></tr><tr><td>LOG_TYPE_KEY_ATTRIBUTES_CHANGED</td><td>LOG_RESULT_OK</td><td>200</td></tr></tbody></table>
