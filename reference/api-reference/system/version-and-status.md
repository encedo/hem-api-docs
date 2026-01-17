---
description: Two endpoints to gather general information about the device.
---

# Version & Status

{% hint style="info" %}
These two endpoints are wide open and do not need any authorization data, except two comments below.
{% endhint %}

## Get device version&#x20;

{% hint style="info" %}
`The Authorization` header is ONLY required to get information about microSD's card CSD and CID values.
{% endhint %}

## System version

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/system/version`

Get hardware and firmware version information.

#### Response status code

{% tabs %}
{% tab title="200: Successful operation" %}
```javascript
{
  "hwv": "PPA rev 2.2",
  "fwv": "Encedo nGINE FW v1.2.2",
  "fwk": "/7jPJUl1e7jKOQZoYR2PVYj7Z/yjWxUXr4cbOxT2yWY=",
  "fws": "+m1eRKD2C67r2zMw8n8smFwMEcCXX+aU8zlTO3ZzxBtOxy10KxzscKW2qH6eS0z2BqHgbebjFgmfsAEH+/4iBg==",
  "blv": "Encedo Secure Bootloader v2.0.1",
  "blk": "T/BAge1QXxgu9LJ+lYDrBlfupwGZsJP26lVOLEpsd44=",
  "bls": "jVI0DTN0drzmQFd60OnSrdlbE5Nt2JiiffypkXBENMXv+CtGHZSdoAVhF5YXlXGt2mZ1tPDuCn/SYwGTsxQxDQ==",
  "uis": "Ah7r6v+b7A3r5CgSa6NQfW/ZHbuPC6ZPWyXz+8gLB7w="
}
```
{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="152.70153242666552">Name</th><th width="150">Type</th><th width="428.211521739277">Description</th></tr></thead><tbody><tr><td><code>hwv</code></td><td>String</td><td>Hardware version information.</td></tr><tr><td><code>fwv</code></td><td>String</td><td>Firmware version infomation.</td></tr><tr><td><code>fwk</code></td><td>String</td><td>Firmware signing public key (base64 encoded).</td></tr><tr><td><code>fws</code></td><td>String</td><td>Firmware siganture (base64 encoded).</td></tr><tr><td><code>blv</code></td><td>String</td><td>Bootloader version information.</td></tr><tr><td><code>blk</code></td><td>String</td><td>Bootloader signing public key (base64 encoded).</td></tr><tr><td><code>bls</code></td><td>String</td><td>Bootloader siganture (base64 encoded).</td></tr><tr><td><code>sd_csd</code></td><td>String</td><td>(optional) Embedded microSD card CSD value (on Encedo PPA only, require valid token).</td></tr><tr><td><code>sd_cid</code></td><td>String</td><td>(optional) Embedded microSD card CID value (on Encedo PPA only, require valid token).</td></tr><tr><td><code>uis</code></td><td>String</td><td>(optional) Encedo Manager version hash (on Encedo PPA only).</td></tr></tbody></table>

## Get device status

{% hint style="info" %}
`The Authorization` header is ONLY required to get information about statistics of the key repository memory.
{% endhint %}

## System status

<mark style="color:blue;">`GET`</mark> `https://my.ence.do/api/system/status`

Get the device's online status information (including FLS state info).

#### Response status code

{% tabs %}
{% tab title="200: Successful operation" %}
```javascript
{
  "ctx": 0,
  "uptime": 13236,
  "ts": "2022-03-16T18:17:27Z",
  "time": 1647454647,
  "storage": ["8388607:rw", "112590844:-"],
  "temp": 31,
  "fls_state": 0
}
```
{% endtab %}
{% endtabs %}

#### Response data for successful operation

<table><thead><tr><th width="150">Name</th><th width="155.4178925247673">Type</th><th width="366.2"></th></tr></thead><tbody><tr><td><code>ctx</code></td><td>Number</td><td>Context number.</td></tr><tr><td><code>fls_state</code></td><td>Number</td><td>Fail state value, default 0 as 'no errors'.</td></tr><tr><td><code>format</code></td><td>String</td><td>(optional) Return during personalization, indicating embedded disk formatting state (on Encedo PPA only).</td></tr><tr><td><code>fw_upgrade</code></td><td>Bool</td><td>(optional) <code>True</code> if successfully rebooted after the firmware upgrade.</td></tr><tr><td><code>inited</code></td><td>Bool</td><td>(optional) <code>False</code> if the device is not personalized.</td></tr><tr><td><code>https</code></td><td>Bool</td><td>(optional) <code>True</code> or <code>False</code> to indicate if HTTPS mode is available, returned only if called by HTTP endpoint.</td></tr><tr><td><code>hostname</code></td><td>String</td><td>(optional) Return the device hostname if the request <code>Host</code> header is different.</td></tr><tr><td><code>repo_stats</code></td><td>Object</td><td>Statistics of the key repository memory (next five data).</td></tr><tr><td><code>deleted</code></td><td>Number</td><td>Number of deleted slots</td></tr><tr><td><code>fragmentation</code></td><td>Number</td><td>Fragmentation (in %, ratio deleted to occupied)</td></tr><tr><td><code>freeespace</code></td><td>Number</td><td>Total number of free slots</td></tr><tr><td><code>invalid</code></td><td>Number</td><td>Number of invalid slots</td></tr><tr><td><code>total</code></td><td>Number</td><td>Total used slots</td></tr><tr><td><code>storage</code></td><td>Array of strings</td><td>Capacity and status of each embedded disks (on Encedo PPA only). </td></tr><tr><td><code>temp</code></td><td>Number</td><td>Chip temperature in Celsius.</td></tr><tr><td><code>time</code></td><td>Number</td><td>optional) Current Unix timestamp, returned if RTC is set.</td></tr><tr><td><code>ts</code></td><td>String</td><td>(optional) Current time &#x26; date in ISO8601, returned if RTC is set.</td></tr><tr><td><code>tts</code></td><td>Bool</td><td>(optional) Return <code>False</code> is option 'TrustedTime' is set to false.</td></tr><tr><td><code>uptime</code></td><td>Number</td><td>Number of seconds since the device boots.</td></tr></tbody></table>

#### Fail state values (bitmasks)

* 00h - no errors
* 01h - KAT failure
* 02h - Entropy failure
* 04h - Temperature out of range
* 08h - Data integrity failure
* 10h - out of memory, malloc() failure detected
* 20h - stack overflow detected
* 40h - failure after check-in (locked)
* 80h - failure after check-in (shutdown)

#### Storage status (on Encedo PPA)

The `storage` object is an array of two string elements, the first for Disk 0 (regular drive) and the second for Disk 1 (secure drive). Those strings are a concatenation of the disk size, which is the number of sectors (an integer), and the lock/unlock mode.

Example: `["8388607:rw", "112590844:-"]` means:

* Disk 0 size is 8388607 sectors (every 512 bytes long) and the disk is unlocked in RW mode (read & write).
* Disk 1 size is 112590844 sectors and is locked ('-' means unavailable/locked, 'rw' means unlocked for read & write, and 'ro' means unlocked in read-only mode.

