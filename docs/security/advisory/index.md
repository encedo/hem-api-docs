---
title: "Advisory"
description: "The Security Advisory section provides a persistent, chronological list of all published advisories affecting the Encedo HEM."
---

| ID | Report date | Impact | Affected -> Fix | Summary |
|---|---|---|---|---|
| ECVE-13 | 13 Jan 2026 | Medium | FW 1.2.1 -> 1.2.2 | A denial-of-service (DoS) vulnerability caused by improper handling of the `Content-Length` and `Content-Type` headers, which could trigger `malloc()` failures and drive the device into a fault state (10h), resulting in DoS. |
