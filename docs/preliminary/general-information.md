---
title: "General information"
description: "This section describes basic and general information regards API references, access control, response and error codes."
---

## Operational security basics

Here are a few steps the developer should follow to achieve proper operation security of the Encedo HEM:

* First and foremost, DO NOT leave your Encedo HEM device unattended. We did our best to secure the device, but the other side may have a multi-million-dollar budget to break in. Do not make their lives easy by:
  * making the Encedo PPA a personal device, attach it to the keychain or so;
  * installing Encedo EPA in a professional data centre or server room with controlled and limited physical access.
* Always check the security of the TLS connection; do not ignore warnings or any other issues with TLS session security. This is critical to achieving the confidentiality of your data (e.g. during encryption/decryption) and of the JWT tokens. The consequences of leaked tokens can be tragic!
* If your application is using passphrase-based user authentication (user password), keep the runtime environment secure. Do not store passwords in the code (hardcoding)! For web apps, remember that some browser plugins can record keystrokes or steal your password. Use the free Encedo Mobile Authenticator instead of passwords if possible.
* Check the logs from time to time :) The logging mechanism of every security-related activity by Encedo HEM is a very powerful feature. Consider integrating the Encedo HEM logs deeply with SIEM or other automated security monitoring tools.
* Temperature Operating Range: 0 - 40 'C
* Humidity: 10-90%
* Electrical Operating Range:
  * Encedo PPA: USB 2.0 HighSpeed compliant 4,75V-5,25V, 100mA
  * Encedo EPA: 230V/3A

## How to read API references?

Encedo HEM implements a classic CRUD (create-read-update-delete) type of API, a RESTful HTTP(s) based API.

The API supports both HTTP (port 80) and HTTPS (port 443) protocols. However, some operations are limited to the HTTPS interface only. In general, all operations with access control are limited to HTTPS only.

The API parameters, sent as body parameters, are represented via JSON objects with the required `"application/json"` `Content-Type` header sent altogether. The reply (response body) is also a JSON-encoded object. The missing `Content-Type` header will cause the API call to fail.

On factory-default (so-called 'fresh', not initialised) devices, firmware and management applications can be upgraded over the HTTP interface. This is possible because the uploaded file is digitally signed, and before installation, its integrity and signature will be validated.

The API is stateless.

All API reference endpoints refer to a domain `my.ence.do`. This domain is a default domain for Encedo PPA and is used here as a reference. After personalisation, the device might be available under custom domains, according to user preferences.

## Access to the device

Depending on the version (Encedo PPA or EPA), access to the device differs slightly. In both cases, it is the same web API (EPA is missing a few endpoints, as noted in the API Reference), but the domain is different.

The Encedo PPA in the factory default state (fresh, just delivered or after wipe-out) serves API over the domain `my.ence.do` resolve to the IP address `192.168.7.1`.

The Encedo EPA (delivered for on-premises installations) in the factory default state is available under the technical domain presented in the Delivery Note. Assume the Delivery Note states in section _Setup Details_ that the technical domain is `*.e400123-a1.cloud.ence.do` for node A1, the Encedo HEM (chips) are accessible under domains `c1.e400123-a1.cloud.ence.do` to `c10.e400123-a1.cloud.ence.do`. For node B2, it will be, e.g. `c1.e400123-b2.cloud.ence.do`.

The Encedo EPA, subscribed to a SaaS model (where users can get access to just one HEM chip), will present the configuration (and domain) in the email sent to the buyer as a summary of the subscription.

After the device is initialised, it will be available under the domain selected by the user during the initialisation procedure.

## Troubleshooting

If you encounter any issues using the API, please review the API reference carefully. The response code may say a lot :)

The first stop should be the endpoint [Get Status](../reference/api-reference/system/version-and-status.mdx#get-device-status). It will say, e.g. if the RTC is set (object `ts` returned) as it is required by authentication. Also, note the value of the `fls_state` object; any non-zero value means the Encedo HEM is in a failed state. Check the reason for the failure [here](../reference/api-reference/system/version-and-status.mdx#fail-state-values-bitmasks).

The second stop should verify that the TLS server is functioning correctly. The certificate may expire if the device is not used for an extended period. The renewal process is automatic. All you need to do is perform a complete check-in procedure and reboot the HEM (called over the HTTP protocol).

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

The check-in process was designed with privacy in mind. The backend is unable to trace the device in any domain. Every transaction (`check` -> `checked`) is anonymous from the backend environment perspective.

The mechanism is able to offer enterprise-level remote management of the devices deployed in the organisation. Remote management is based on uploading the `instanceid` value uniquely identifying every instance of Encedo HEM (`instanceid` is generated as a result of [personalization](../reference/api-reference/authorization/initialisation.mdx)).

## User, rules and access scope

There are three user roles, each with different access roles and limitations:

<Tabs>
<TabItem value="user" label="User">

Local User: A regular passphrase-based authenticated user, for general usage.

</TabItem>
<TabItem value="master" label="Master">

Administrator: Master user, limited usage to rescue purposes.,

</TabItem>
<TabItem value="extauth" label="ExtAuth">

Remote User:  A user authenticated by an external authenticator (e.g. Encedo Mobile Authenticator available on Google Play and Apple App Store).

</TabItem>
</Tabs>

Refer to the API Reference section for more details on when and how user roles are introduced for each endpoint. Remember, some endpoints are wide open and lack role-based or access control.

## Access control

Access control is achieved by using JWT tokens sent via the Authorisation header with every API endpoint call. The user role is encoded in the JWT body by the object `sub`. For a Local User, it points to '`U`', for an Administrator to '`M`', and for a remote user, it points to the `KID` of the registered authenticator.

<Tabs>
<TabItem value="local-authentication" label="Local authentication">

```json
{
  "scope": "logger:get",
  "sub": "U",
  "iat": 1647871445,
  "exp": 1647900245,
  "jti": "1YU4YpnVy5rXauwxT2IXRX91hTCxaUEtGdOBK25zA40="
}
```

</TabItem>
<TabItem value="external-authentication" label="External authentication">

```json
{
  "scope": "keymgmt:list",
  "sub": "Qq/EGdvacmNrN6JFWVXglQ==",
  "iat": 1647871122,
  "exp": 1647872020,
  "jti": "koQ4YsCf3L4iTrl2py6g7t3jvV9pwwsIr6//F96OfYI="
}
```

</TabItem>
</Tabs>

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
* The whole JWT token is signed (HS256), where the secret is the result of ECDH between the `aud` (public key) and the ephemeral private key.

## Events and logs

Encedo HEM has implemented an advanced logging mechanism. Every security-related event has been logged. This includes failed access control, all key management operations and all operations of keys and secrets. The log file itself has built-in security measures against tampering or integrity violations.

#### Event type:

| Event name & value | Description |
|---|---|
| `LOG_TYPE_KEY_INIT (0)` | First entry with log unique key. |
| `LOG_TYPE_STARTUP (1)` | Indicating successful device startup. |
| `LOG_TYPE_REBOOT (2)` | Reboot performed. |
| `LOG_TYPE_SHUTDOWN (3)` | Shutdown performed. |
| `LOG_TYPE_UPGRADE (4)` | Upgrade (FW or UI) performed. |
| `LOG_TYPE_TRNG_FAILED (5)` | TRNG entropy test failed. |
| `LOG_TYPE_TLS_ERROR (6)` | TLS1.3 initialization failed. |
| `LOG_TYPE_SELFTEST_PASSED (7)` | Self-Test was successful. |
| `LOG_TYPE_NON_SECURE_STATE (8)` | Entered into the fail state. |
| `LOG_TYPE_LOGGER_LIST_LOG (9)` | Log listed. |
| `LOG_TYPE_LOGGER_DELETE_LOG (10)` | Log file deleted (not implemented). |
| `LOG_TYPE_LOGGER_READ_LOG (11)` | Log file read. |
| `LOG_TYPE_FAILED_SCOPE_CHECK (12)` | Access `scope` check failed. |
| `LOG_TYPE_AUTH_SUCCESS_INTERNAL (13)` | JWT access token issued for User or Administrator. |
| `LOG_TYPE_AUTH_SUCCESS_EXTERNAL (14)` | JWT access token issued for the external authenticator. |
| `LOG_TYPE_AUTH_PAIRED_EXTERNAL (15)` | Successfully registered an external authenticator. |
| `LOG_TYPE_CONFIG_UPDATED (18)` | Device configuration updated. |
| `LOG_TYPE_RTC_SET (19)` | RTC (time&date) updated. |
| `LOG_TYPE_KEY_GENERATION (20)` | New key generated. |
| `LOG_TYPE_KEY_DELETE (21)` | Key deleted. |
| `LOG_TYPE_KEY_IMPORT (22)` | Key imported. |
| `LOG_TYPE_KEY_USAGE_PKEY (23)` | Key (secret) was used by cryptography operation. |
| `LOG_TYPE_KEY_INTEGRITY_ERROR (24)` | Key integrity validation failed. |
| `LOG_TYPE_KEY_ATTRIBUTES_CHANGED (25)` | Key attributes (label or description) updated. |
| `LOG_TYPE_KEY_DERIVE (26)` | New key derived (generated by ECDH algorithm). |
| `LOG_TYPE_DEVICE_INITED (29)` | The device was initialized. |
| `LOG_TYPE_CRYPTO_HMAC_HASH (30)` | Cryptography operation executed: HMAC hash |
| `LOG_TYPE_CRYPTO_HMAC_VERIFY (31)` | Cryptography operation executed: HMAC verify |
| `LOG_TYPE_CRYPTO_EXDSA_SIGN (32)` | Cryptography operation executed: ExDSA sign |
| `LOG_TYPE_CRYPTO_EXDSA_VERIFY (33)` | Cryptography operation executed: ExDSA verify |
| `LOG_TYPE_CRYPTO_WRAP (34)` | Cryptography operation executed: wrap |
| `LOG_TYPE_CRYPTO_UNWRAP (35)` | Cryptography operation executed: unwrap |
| `LOG_TYPE_CRYPTO_ENCRYPT (36)` | Cryptography operation executed: encryption |
| `LOG_TYPE_CRYPTO_DECRYPT (37)` | Cryptography operation executed: decryption |
| `LOG_TYPE_CRYPTO_ECDH (38)` | Cryptography operation executed: ECDH |
| `LOG_TYPE_CRYPTO_PQC_MLKEM_ENCAPS (39)` | Cryptography operation executed: ML-KEM encapsulation |
| `LOG_TYPE_CRYPTO_PQC_MLKEM_DECAPS (40)` | Cryptography operation executed: ML-KEM decapsulation |
| `LOG_TYPE_CRYPTO_PQC_MLDSA_SIGN (41)` | Cryptography operation executed: ML-DSA signature creation |
| `LOG_TYPE_CRYPTO_PQC_MLDSA_VERIFY (42)` | Cryptography operation executed: ML-DSA signature verification |

#### Event result:

| Result name & value | Description |
|---|---|
| `LOG_RESULT_OK (0)` | All went well |
| `LOG_RESULT_FAILED (1)` | Execution failed |
| `LOG_RESULT_ERROR (2)` | Cannot execute - e.g. parameters error |

## Response codes

This is a list of all possible API response codes and their meaning:

| Code | Description |
|---|---|
| `200` | Operation successful - all done. The opposite is code 406. |
| `201` | Created - background task has been created and is running. |
| `202` | Accepted - background task still ongoing, retry later. |
| `400` | Incorrect argument(s) - a general input data validation failed, including JSON parsing. |
| `401` | Missing or invalid JWT TOKEN - the token presented is invalid (signature), expired or malformed. |
| `403` | Incorrect access scope - the access control validation failed. This error issue an audit log write of a source and result of the error. |
| `404` | Not found - the operation path (endpoint) does not exist. |
| `406` | Operation failed - the operation failed due to errors; malformed or out-of-range data cannot succeed. |
| `409` | Incorrect internal state - the operation cannot be completed due to the incorrect internal state: fails state, the disk is busy, ongoing upgrade etc. |
| `411` | Protocol error - POST requests require a `Content-Length` header. |
| `412` | Protocol error - CORS validation failed. |
| `413` | Protocol error - POST request body too big (too long). |
| `418` | TLS (HTTPS) connection required - the operation endpoint required a trusted channel aka encrypted TLS connection. |
| `500` | Internal Server error - very rare error, most a case critical. Can be raised by an endpoint anytime. |

## Examples

Let's make it straight - you need working examples, right?.

So here they are [https://github.com/encedo/hem-api-examples](https://github.com/encedo/hem-api-examples) .

Enjoy :)
