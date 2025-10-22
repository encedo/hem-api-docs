---
description: >-
  This operation performs an internal full self-test of the device's critical
  components, including cryptography primitives, random number generator and key
  repository integrity.
---

# Self-test

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
Any. Only a valid access token is required; the access scope is not checked.
{% endtab %}
{% endtabs %}

{% hint style="info" %}
`The Authorization` header is not required on fresh, not personalised devices.
{% endhint %}

## Get self-test status

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/system/selftest`

Retrieve the latest self-test status and rerun a new full test (only if one is not already in progress).

#### Headers

| Name          | Type   | Description       |
| ------------- | ------ | ----------------- |
| Authorization | String | Bearer JWT\_TOKEN |

#### Response status code

{% tabs %}
{% tab title="200: Operation successful" %}
```javascript
{
  "last_selftest_ts": 1647615622,
  "last_fls_state": 0,
  "last_entropytest_ts": 1647615622,
  "last_kat_ts": 1647606250,
  "kat_busy": true,
  "fls_state": 0,
  "selftest_ts": 1647615642,
  "se_state": 0
}
```
{% endtab %}

{% tab title="401: Missing or invalid JWT_TOKEN" %}

{% endtab %}

{% tab title="403: Operation failed" %}

{% endtab %}

{% tab title="409: Incorrect internal state" %}

{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="251.84226294579548">Name</th><th width="150">Type</th><th width="318.02543721107384">Description</th></tr></thead><tbody><tr><td><code>fls_state</code></td><td>Number</td><td>Fail state number, default 0 as 'no errors'.</td></tr><tr><td><code>kat_busy</code></td><td>Bool</td><td><code>True</code> is KAT is ongoing.</td></tr><tr><td><code>last_entropytest_ts</code></td><td>Number</td><td>Last entropy test timestamp.</td></tr><tr><td><code>last_fls_state</code></td><td>Number</td><td>Last <code>fls_state.</code></td></tr><tr><td><code>last_kat_ts</code></td><td>Number</td><td>Last KAT timestamp.</td></tr><tr><td><code>last_selftest_ts</code></td><td>Number</td><td>Last selftest timestamp.</td></tr><tr><td><code>selftest_ts</code></td><td>Number</td><td>Current selftest timestamp.</td></tr><tr><td><code>se_state</code></td><td>Number</td><td>(optional) Secure Enclave status (on Encedo PPA).</td></tr><tr><td><code>repo_stats</code></td><td>Object</td><td>The following items are part of this object</td></tr><tr><td><code>total</code></td><td>Number</td><td>Number of used storage slots</td></tr><tr><td><code>deleted</code></td><td>Number</td><td>Number of used storage slots</td></tr><tr><td><code>invalid</code></td><td>Number</td><td>Number of invalid slots</td></tr><tr><td><code>fragmented</code></td><td>Number</td><td>Number of deleted slots to defragment</td></tr><tr><td><code>freeslots</code></td><td>Number</td><td>Number of free slots</td></tr></tbody></table>

#### Indirectly produced log entries

<table><thead><tr><th width="327.4260581072065">Event</th><th width="188.95407900396802">Result</th><th>Source</th></tr></thead><tbody><tr><td>LOG_TYPE_TRNG_FAILED</td><td>LOG_RESULT_OK</td><td>Entropy test failed</td></tr><tr><td>LOG_TYPE_KEY_INTEGRITY_ERROR</td><td>LOG_RESULT_FAILED</td><td>Keystore integrity failed</td></tr><tr><td>LOG_TYPE_KEY_INTEGRITY_ERROR</td><td>LOG_RESULT_OK</td><td>Keystore integrity passed</td></tr><tr><td>LOG_TYPE_NON_SECURE_STATE</td><td>LOG_RESULT_OK</td><td>Enter FLS state</td></tr><tr><td>LOG_TYPE_SELFTEST_PASSED</td><td>LOG_RESULT_FAILED</td><td>Powerup self-test failed</td></tr><tr><td>LOG_TYPE_SELFTEST_PASSED</td><td>LOG_RESULT_OK</td><td>Powerup self-test passed</td></tr></tbody></table>
