---
title: "Quick Start"
description: "In order to start working with Encedo HEM, three basic steps need to be done. Here is a short guide on what and how :)"
---

## Order Encedo PPA online

Stay tuned - Order Now is scheduled to be launched soon.

Check [https://encedo.com](https://encedo.com) for details.

## Check the delivered device

:::info
The following section is derived from the "Acceptance procedures" from AGD\_PRE.1, one of the guides of the Common Criteria. Contact Encedo for more details or assistance.
:::

Due to the physical differences between the two possible configurations of the Encedo HEM (PPA or EPA, called the TOE, according to the Common Criteria terminology), the delivery and acceptance procedure is different and looks as follows:

1.  The Encedo PPA can be purchased online and is delivered via trackable delivery services, including courier delivery or postal mail. Due to the engagement of the 3rd party in the process of delivery, it is crucial to implement special security measures to guarantee correct delivery. The device (with embedded and secured TOE) is packaged into the box protected by a holographic void-type seal with a unique identification number.

    1. As part of the delivery procedure, prior to the shipment, the buyer is informed of the seal number, the order number, and the shipment/tracking number (waybill).
    2. After the delivery, the buyer can verify those numbers as part of the proof that the package has not been tampered with (opened, swapped, or misdelivered). The link to the specially-crafted website with those unique numbers is programmed into the NFC chip (the NFC is located inside the package and cannot be reprogrammed or replaced). The website itself is a single HTML file with embedded JavaScript variables holding encrypted delivery details. Access to the data is secured by a PIN code, sent to the buyer after shipment. The file is stored on a public IPFS network, a special type of peer-to-peer network where each file is addressed (handled) by content hash rather than the filename. In other words, any change to the file content will change the address. Since the user receives a link to validate the delivery offline (by scanning the NFC chip attached to the package with an ordinary smartphone), the entire validation process is also offline.
    3. If the website is correctly displayed by the web browser (which means the file is unchanged and the PIN is correct), and the website presents valid data (e.g. order number is correct, the waybill matches the one on the envelope and the package box has a valid security sticker) and the package has no signs of been tamper with (package and security sticker is intact) the user can accept the delivered TOE hardware as genuine.

2. The Encedo EPA can only be ordered from the Encedo sales team.
   1. The device case is secured by a holographic void-type seal with a unique identification number, which verifies that the metal box has not been opened after initial assembly and configuration on the Encedo side.
   2. After the initial configuration, the _Delivery Note_ is printed and placed into an envelope secured by a security sticker. The data on the _Note_ includes sensitive administrative information, such as passwords, domain names, Ethernet MAC addresses, and details about the device model. The device and the Delivery Note are packaged into a carton box secured by a void-type security tape and handed over to the other member of the Encedo team for delivery (no third-party involvement in the delivery process).
   3. On the buyer's side, the package, the _Delivery Note_, and the device's physical integrity can be verified to assure the delivered TOE hardware is genuine.

## Initiate the device

As a happy new owner of Encedo PPA, the process of initialising the device is as simple as opening your web browser and following the instructions from the device box - enter encedo.com/start to begin.

If you are a developer and want to integrate Encedo HEM on your own, follow the [API Reference](../reference/api-reference/index.mdx) section of the [Initialization ](../reference/api-reference/authorization/initialisation.mdx)to begin working with the Encedo HEM API.

## Validate configuration version

To validate the current version of the firmware and hardware, query the device API `GET /api/system/version` [endpoint ](../reference/api-reference/system/version-and-status.mdx#get-device-version)to retrieve the version information. The expected values are presented in the two tables below for each configuration.

#### Encedo PPA version:

| Object | Value | Version |
|---|---|---|
| `hwv` | "PPA rev 2.2" | 2.2 |
| `blv` | "Encedo Secure Bootloader v2.0.1" | 2.0.1 |
| `fwv` | "Encedo nGINE FW v1.2.2" | 1.2.2 |

#### Encedo EPA version:

| Object | Value | Version |
|---|---|---|
| `hwv` | "EPA rev 1.0 @_x_"<br /><br />_(‘x’ denotes the TOE index on PCB)_ | 1.0 |
| `blv` | "Encedo Secure Bootloader v2.0.1" | 2.0.1 |
| `fwv` | "Encedo nGINE FW v1.2.2" | 1.2.2 |
