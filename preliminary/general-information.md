---
description: >-
  This section describes basic and general information regards API references,
  access control, response and error codes.
---

# General information

## Operational security basics

Here are a few steps the developer should follow to achieve proper operation security of the Encedo HEM:

* First and foremost, DO NOT leave your Encedo HEM device unattended. We did our best to secure the device, but the other side may have a multi-million-dollar budget to break in. Do not make their lives easy by:
  * making the Encedo PPA a personal device, attach it to the keychain or so;
  * installing Encedo EPA in a professional data centre or server room with controlled and limited physical access.
* Always check the security of the TLS connection; do not ignore warnings or any other issues with TLS session security. This is critical to achieving the confidentiality of your data (e.g. during encryption/decryption) and of the JWT tokens. The consequences of leaked tokens can be tragic!
* If your application is using passphrase-based user authentication (user password), keep the runtime environment secure. Do not store passwords in the code (hardcoding)! For web apps, remember that some browser plugins can record keystrokes or steal your password. Use the free Encedo Mobile Authenticator instead of passwords if possible.
* Check the logs from time to time :) The logging mechanism of every security-related activity by Encedo HEM is a very powerful feature. Consider integrating the Encedo HEM logs deeply with SIEM or other automated security monitoring tools.
* Temperature Operating Range: 0 - 45 'C
* Humidity: 10-90%&#x20;
* Electrical Operating Range:
  * Encedo PPA: USB 2.0 HighSpeed compliant 4,75V-5,25V, 100mA
  * Encedo EPA: 230V/3A

## How to read API references?

Encedo HEM implements a classic CRUD (create-read-update-delete) type of API, a RESTful HTTP(s) based API.&#x20;

The API supports both HTTP (port 80) and HTTPS (port 443) protocols. However, some operations are limited to the HTTPS interface only. In general, all operations with access control are limited to HTTPS only.

The API parameters, sent as body parameters, are represented via JSON objects with the required `"application/json"` `Content-Type` header sent altogether. The reply (response body) is also a JSON-encoded object. The missing `Content-Type` header will cause the API call to fail.

On factory-default (so-called 'fresh', not initialised) devices, firmware and management applications can be upgraded over the HTTP interface. This is possible because the uploaded file is digitally signed, and before installation, its integrity and signature will be validated.

The API is stateless.

All API reference endpoints refer to a domain `my.ence.do`. This domain is a default domain for Encedo PPA and is used here as a reference. After personalisation, the device might be available under custom domains, according to user preferences.

## Access to the device

Depending on the version (Encedo PPA or EPA), access to the device differs slightly. In both cases, it is the same web API (EPA is missing a few endpoints, as noted in the API Reference), but the domain is different.&#x20;

The Encedo PPA in the factory default state (fresh, just delivered or after wipe-out) serves API over the domain `my.ence.do` resolve to the IP address `192.168.7.1`.&#x20;

The Encedo EPA (delivered for on-premises installations) in the factory default state is available under the technical domain presented in the Delivery Note. Assume the Delivery Note states in section _Setup Details_ that the technical domain is `*.e400123-a1.cloud.ence.do` for node A1, the Encedo HEM (chips) are accessible under domains `c1.e400123-a1.cloud.ence.do` to `c10.e400123-a1.cloud.ence.do`. For node B2, it will be, e.g. `c1.e400123-b2.cloud.ence.do`.&#x20;

The Encedo EPA, subscribed to a SaaS model (where users can get access to just one HEM chip), will present the configuration (and domain) in the email sent to the buyer as a summary of the subscription.

After the device is initialised, it will be available under the domain selected by the user during the initialisation procedure.

## Troubleshooting

If you encounter any issues using the API, please review the API reference carefully. The response code may say a lot :)

The first stop should be the endpoint [Get Status](https://docs.encedo.com/hem-api/reference/api-reference/system/version-and-status#get-device-status). It will say, e.g. if the RTC is set (object `ts` returned) as it is required by authentication. Also, note the value of the `fls_state` object; any non-zero value means the Encedo HEM is in a failed state. Check the reason for the failure [here](https://docs.encedo.com/hem-api/reference/api-reference/system/version-and-status#fail-state-values-bitmasks).&#x20;

The second stop should verify that the TLS server is functioning correctly. The certificate may expire if the device is not used for an extended period. The renewal process is automatic. All you need to do is perform a complete check-in procedure and reboot the HEM (called over the HTTP protocol).&#x20;

Encedo PPA users can use the online wizard available here: [https://encedo.com/rescue/](https://encedo.com/rescue/) and follow the instructions.

## What is a check-in procedure?

The check-in process is a simple challenge-response protocol between the Device (issuer of the challenge message) and the Backend (issuer of the response message). The idea for this process is as follows:

* The device needs a trusted source of the real-time clock (RTC).
* The device stores (listed as trusted) the list of backend public keys, allowing it to validate the response (integrity and origin).
* The backend can send information about the availability of a new firmware version.
* An update of the TLS certificate can be sent transparently.
* It is possible to implement Remote Management.
* The process was designed with privacy in mind.

For daily usage, the primary purpose of this procedure is to set up a Real-Time Clock (RTC) inside the device. The time is unknown after every power-up (or reboot) of the device, but it is critical for authentication. Therefore, the application should check if an RTC is set; if not, the API will return a 403 error on every authentication call.



Example `check` check-in challenge string (after decoded):

```json
# header
{
  "ecdh": "x25519",
  "typ": "JWT",
  "alg": "HS256"
}
# body
{
  "jti": "kIA3YrCAbi1vCU1h8ypn2Kts1QSDOQUKNsaUIgWoSr0=",
  "iss": "0kRmCliUQvRwfxi7T1ek2GtbSERzMFRGLeyO1r1tEXo=",
  "qid": "e6PAvCZrmMc0fUT0KzmL7I3TIz6QFA4JBjYslE9f+/A=",
  "aud": "/Lbxo5MgU6ZOtVsxxG5jCQ5+4ewxoa1rV8eqMIFFnTA=",
  "fws": "Z+kAajgVVdSMQjNIvK5FGz0+9rf/JutVClNY6S7GBeQ765NMYET/XgdA61cmMk15waw08oNLuWmUygHK3xWFCA==",
  "bls": "8MwowsKkxgEWnl2k0t/eOvsjTbR70poYC2czyPIwKn/hVL68WF3QaQwZ1bxVcYv7g8WEwyzJ2PVnTFAlYQ7hBg==",
  "uis": "6Gh2cCqSJ0GULQKE1DiboY1OsC8rM5+1xPZclCnhtro=",
  "csn": "KfsaKKvNl4LvPigl0GmGBg=="
}
# signature
<base64 encoded SHA256 HMAC>
```



Example checked check-in reply string:

```json
# header
{
  "ecdh": "x25519",
  "typ": "JWT",
  "alg": "HS256"
}
# body
{
  "jti": "FBJDYuJoh+kIpLRTE1IV6/KMNBslpbbH72Jd9ZlX3C0=",
  "iat": 1648562709,
  "iss": "/Lbxo5MgU6ZOtVsxxG5jCQ5+4ewxoa1rV8eqMIFFnTA=",
  "aud": "2xwbMkO0QScPojImeHgpi3k3WhnyhdVyiL7iWkGb5kw=",
  "status": "VKn3hqKX2WR37rsvGnNYKs3FscMxw9uqVF/JhtHUen0="
}
# signature
<base64 encoded SHA256 HMAC>
```

## Privacy notes

The check-in process was designed with privacy in mind. The backend is unable to trace the device in any domain. Every transaction (`check` -> `checked`) is anonymous from the backend environment perspective.&#x20;

The mechanism is able to offer enterprise-level remote management of the devices deployed in the organisation. Remote management is based on uploading the `instanceid` value uniquely identifying every instance of Encedo HEM (`instanceid` is generated as a result of [personalization](../reference/api-reference/authorization/initialisation.md)).

## User, rules and access scope

There are three user roles, each with different access roles and limitations:

{% tabs %}
{% tab title="User" %}
Local User: A regular passphrase-based authenticated user, for general usage.
{% endtab %}

{% tab title="Master" %}
Administrator: Master user, limited usage to rescue purposes.,
{% endtab %}

{% tab title="ExtAuth" %}
Remote User:  A user authenticated by an external authenticator (e.g. Encedo Mobile Authenticator available on Google Play and Apple App Store).
{% endtab %}
{% endtabs %}

Refer to the API Reference section for more details on when and how user roles are introduced for each endpoint. Remember, some endpoints are wide open and lack role-based or access control.

## Access control

Access control is achieved by using JWT tokens sent via the Authorisation header with every API endpoint call. The user role is encoded in the JWT body by the object `sub`. For a Local User, it points to '`U`', for an Administrator to '`M`', and for a remote user, it points to the `KID` of the registered authenticator.

{% tabs %}
{% tab title="Local authentication" %}
```javascript
{
  "scope": "logger:get",
  "sub": "U",
  "iat": 1647871445,
  "exp": 1647900245,
  "jti": "1YU4YpnVy5rXauwxT2IXRX91hTCxaUEtGdOBK25zA40="
}
```
{% endtab %}

{% tab title="External authentication" %}
```json
{
  "scope": "keymgmt:list",
  "sub": "Qq/EGdvacmNrN6JFWVXglQ==",
  "iat": 1647871122,
  "exp": 1647872020,
  "jti": "koQ4YsCf3L4iTrl2py6g7t3jvV9pwwsIr6//F96OfYI="
}
```
{% endtab %}
{% endtabs %}

The general roles are as follows:

* A few endpoints are wide-open (access control relaxed),
* Most endpoints required strict access control based on access scope and user role, and finally,
* Some of them have implemented weak access control and need a valid JWT token.

## Initial configuration `init` structure format

The initialisation argument init is a slightly modified JWT token. The modification is as follows:

* The header has a new object `ecdh` indicating the JWT hash secret is a result of the ECDH algorithm, here `x25519` (curve25519).
* The arguments to the ECDH are in a body part; those are the `iss` (issuer or sender) and the `aud` (audience or receiver) objects.
* The signature is indicated by the `alg` (here `HS256` refers to SHA256, where the secret is a result of `ECDH(iss_privatekey, aud)`(Issuer private is confidential, in the body, the public key part is sent, the `aud` represents just a public key part - the receiver can be validated, if she is a legitimate receiver.

```json
# header
{
  "ecdh": "x25519",
  "alg": "HS256",
  "typ": "JWT"
}
# body
{
  "jti": "OxNDYouIDLnetwcekFRLHcU5AzwC0Al9Jj1JiNgAuMA=",
  "aud": "dMYaJwVrA/1gKj5syUyhsyerdfUT6LuoptmvKVs0oVc=",
  "exp": 1648563063,
  "iat": 1648563000,
  "iss": "WK81qE4LsYBlEuXyutOm6d9DsgYUbGz6BEOIEoNrQio=",
  "cfg": {
    "masterkey": "WK81qE4LsYBlEuXyutOm6d9DsgYUbGz6BEOIEoNrQio=",
    "userkey": "jJg5kI4ZMMWV7eG6GA1du0uJWi0SezS1cZfUgCP6r0Q=",
    "user": "John Doe",
    "email": "",
    "hostname": "my.ence.do",
    "ip": "192.168.7.1/24",
    "storage_mode": 81,
    "storage_disk0size": 8388608,
    "dnsd": true,
    "trusted_ts": true,
    "trusted_backend": true,
    "allow_keysearch": true,
    "origin": "*"
  }
}
# signature
<base64 encoded SHA256 hash>
```

A few comments are needed here:

* The objects inside the `cfg` object are common with the Configuration endpoint (the same names, meanings, and allowed values).
* The `masterkey` object, like the `userkey` object is the Administrator and User x25519 public keys, generated deterministically based on the passphrase.
* Objects `jti`, `aud` and  `exp` are a copy of the one received by Phase 1 of the Initialisation process (`spk` => `aud`);
* The `iss` object is a duplication of the `masterkey` object (a requirement of the implemented modified version of JWT, as commented above), which is a Master user public key;
* The whole JWT token is signed (HS256), where the secret is a result of ECDH between the `aud` (public key) and the ephemeral private key.

## Events and logs

Encedo HEM has implemented an advanced logging mechanism. Every security-related event has been logged. This includes failed access control, all key management operations and all operations of keys and secrets. The log file itself has built-in security measures against tampering or integrity violations.

#### Event type:

<table><thead><tr><th width="343.5517722764978">Event name &#x26; value</th><th>Description</th></tr></thead><tbody><tr><td><code>LOG_TYPE_KEY_INIT (0)</code></td><td>First entry with log unique key.</td></tr><tr><td><code>LOG_TYPE_STARTUP (1)</code></td><td>Indicating successful device startup.</td></tr><tr><td><code>LOG_TYPE_REBOOT (2)</code></td><td>Reboot performed.</td></tr><tr><td><code>LOG_TYPE_SHUTDOWN (3)</code></td><td>Shutdown performed.</td></tr><tr><td><code>LOG_TYPE_UPGRADE (4)</code></td><td>Upgrade (FW or UI) performed.</td></tr><tr><td><code>LOG_TYPE_TRNG_FAILED (5)</code></td><td>TRNG entropy test failed.</td></tr><tr><td><code>LOG_TYPE_TLS_ERROR (6)</code></td><td>TLS1.3 initialization failed.</td></tr><tr><td><code>LOG_TYPE_SELFTEST_PASSED (7)</code></td><td>Self-Test was successful.</td></tr><tr><td><code>LOG_TYPE_NON_SECURE_STATE (8)</code></td><td>Entered into the fail state.</td></tr><tr><td><code>LOG_TYPE_LOGGER_LIST_LOG (9)</code></td><td>Log listed.</td></tr><tr><td><code>LOG_TYPE_LOGGER_DELETE_LOG (10)</code></td><td>Log file deleted (not implemented).</td></tr><tr><td><code>LOG_TYPE_LOGGER_READ_LOG (11)</code></td><td>Log file read.</td></tr><tr><td><code>LOG_TYPE_FAILED_SCOPE_CHECK (12)</code></td><td>Access <code>scope</code> check failed.</td></tr><tr><td><code>LOG_TYPE_AUTH_SUCCESS_INTERNAL (13)</code></td><td>JWT access token issued for User or Administrator.</td></tr><tr><td><code>LOG_TYPE_AUTH_SUCCESS_EXTERNAL (14)</code></td><td>JWT access token issued for the external authenticator.</td></tr><tr><td><code>LOG_TYPE_AUTH_PAIRED_EXTERNAL (15)</code></td><td>Successfully registered an external authenticator.</td></tr><tr><td><code>LOG_TYPE_CONFIG_UPDATED (18)</code></td><td>Device configuration updated.</td></tr><tr><td><code>LOG_TYPE_RTC_SET (19)</code></td><td>RTC (time&#x26;date) updated.</td></tr><tr><td><code>LOG_TYPE_KEY_GENERATION (20)</code></td><td>New key generated.</td></tr><tr><td><code>LOG_TYPE_KEY_DELETE (21)</code></td><td>Key deleted.</td></tr><tr><td><code>LOG_TYPE_KEY_IMPORT (22)</code></td><td>Key imported.</td></tr><tr><td><code>LOG_TYPE_KEY_USAGE_PKEY (23)</code></td><td>Key (secret) was used by cryptography operation.</td></tr><tr><td><code>LOG_TYPE_KEY_INTEGRITY_ERROR (24)</code></td><td>Key integrity validation failed.</td></tr><tr><td><code>LOG_TYPE_KEY_ATTRIBUTES_CHANGED (25)</code></td><td>Key attributes (label or description) updated.</td></tr><tr><td><code>LOG_TYPE_KEY_DERIVE (26)</code></td><td>New key derived (generated by ECDH algorithm).</td></tr><tr><td><code>LOG_TYPE_DEVICE_INITED (29)</code></td><td>The device was initialized.</td></tr><tr><td><code>LOG_TYPE_CRYPTO_HMAC_HASH (30)</code></td><td>Cryptography operation executed: HMAC hash</td></tr><tr><td><code>LOG_TYPE_CRYPTO_HMAC_VERIFY (31)</code></td><td>Cryptography operation executed: HMAC verify</td></tr><tr><td><code>LOG_TYPE_CRYPTO_EXDSA_SIGN (32)</code></td><td>Cryptography operation executed: ExDSA sign</td></tr><tr><td><code>LOG_TYPE_CRYPTO_EXDSA_VERIFY (33)</code></td><td>Cryptography operation executed: ExDSA verify</td></tr><tr><td><code>LOG_TYPE_CRYPTO_WRAP (34)</code></td><td>Cryptography operation executed: wrap</td></tr><tr><td><code>LOG_TYPE_CRYPTO_UNWRAP (35)</code></td><td>Cryptography operation executed: unwrap</td></tr><tr><td><code>LOG_TYPE_CRYPTO_ENCRYPT (36)</code></td><td>Cryptography operation executed: encryption</td></tr><tr><td><code>LOG_TYPE_CRYPTO_DECRYPT (37)</code></td><td>Cryptography operation executed: decryption</td></tr><tr><td><code>LOG_TYPE_CRYPTO_ECDH (38)</code></td><td>Cryptography operation executed: ECDH</td></tr><tr><td><code>LOG_TYPE_CRYPTO_PQC_MLKEM_ENCAPS (39)</code></td><td>Cryptography operation executed: ML-KEM encapsulation</td></tr><tr><td><code>LOG_TYPE_CRYPTO_PQC_MLKEM_DECAPS (40)</code></td><td>Cryptography operation executed: ML-KEM decapsulation</td></tr><tr><td><code>LOG_TYPE_CRYPTO_PQC_MLDSA_SIGN (41)</code></td><td>Cryptography operation executed: ML-DSA signature creation</td></tr><tr><td><code>LOG_TYPE_CRYPTO_PQC_MLDSA_VERIFY (42)</code></td><td>Cryptography operation executed: ML-DSA signature verification</td></tr></tbody></table>

#### Event result:

<table><thead><tr><th width="236.07757491137627">Result name &#x26; value</th><th width="354.79870547437713">Description</th></tr></thead><tbody><tr><td><code>LOG_RESULT_OK (0)</code></td><td>All went well</td></tr><tr><td><code>LOG_RESULT_FAILED (1)</code></td><td>Execution failed</td></tr><tr><td><code>LOG_RESULT_ERROR (2)</code></td><td>Cannot execute - e.g. parameters error</td></tr></tbody></table>

## Response codes

This is a list of all possible API response codes and their meaning:

<table><thead><tr><th width="150">Code</th><th width="597.4285714285713">Description</th></tr></thead><tbody><tr><td><code>200</code></td><td>Operation successful - all done. The opposite is code 406.</td></tr><tr><td><code>201</code></td><td>Created - background task has been created and is running.</td></tr><tr><td><code>202</code></td><td>Accepted - background task still ongoing, retry later.</td></tr><tr><td><code>400</code></td><td>Incorrect argument(s) - a general input data validation failed, including JSON parsing.</td></tr><tr><td><code>401</code></td><td>Missing or invalid JWT TOKEN - the token presented is invalid (signature), expired or malformed.</td></tr><tr><td><code>403</code></td><td>Incorrect access scope - the access control validation failed. This error issue an audit log write of a source and result of the error.</td></tr><tr><td><code>404</code></td><td>Not found - the operation path (endpoint) does not exist.</td></tr><tr><td><code>406</code></td><td>Operation failed - the operation failed due to errors; malformed or out-of-range data cannot succeed.</td></tr><tr><td><code>409</code></td><td>Incorrect internal state - the operation cannot be completed due to the incorrect internal state: fails state, the disk is busy, ongoing upgrade etc.</td></tr><tr><td><code>411</code></td><td>Protocol error - POST requests require a <code>Content-Length</code> header.</td></tr><tr><td><code>412</code></td><td>Protocol error - CORS validation failed.</td></tr><tr><td><code>413</code></td><td>Protocol error - POST request body too big (too long).</td></tr><tr><td><code>418</code></td><td>TLS (HTTPS) connection required - the operation endpoint required a trusted channel aka encrypted TLS connection. </td></tr><tr><td><code>500</code></td><td>Internal Server error - very rare error, most a case critical. Can be raised by an endpoint anytime.</td></tr></tbody></table>

## Examples

Let's make it straight - you need working examples, right?.&#x20;

So here they are [https://github.com/encedo/hem-api-examples](https://github.com/encedo/hem-api-examples) .

Enjoy :)
