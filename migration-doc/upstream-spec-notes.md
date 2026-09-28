# Notes for the canonical spec and firmware (encedo_firmware)

Found while reconciling the documentation with `api/hem-api-1.2.2.yaml` (M4, 2026-09-28). The firmware
repository is canonical for the spec, so these are not applied here; carry them over upstream.

## OpenAPI (`docs/openapi.yaml`)
1. `x-required-scope` of `POST /api/auth/ext/init`, `/validate`, `/mac`: add "role U only" — the handlers
   deny every `sub` other than `U` (api_auth.c:874-881, 1018-1025, 1208-1215).
2. `x-required-scope` of the `/api/storage/*` operations: add "role M denied" (intended; see firmware bug 2).

## Firmware behaviour that differs from the documentation's intent
1. `POST /api/crypto/hmac/hash` and `DELETE /api/keymgmt/delete/{kid}` answer **409** instead of 418 over
   plain HTTP: the `ssl == NULL` test is folded into the FLS check before the unreachable 418 branch
   (api_crypto.c:30-31 / 47-49; api_keymgmt.c:50-51 / 67-69). All other crypto/keymgmt handlers return 418.
2. `/api/storage/unlock`, `/unlock/rw`, `/unlock/ro`, `/lock`: the Master-role check compares an
   uninitialised `sub` pointer (api_storage.c:15, 44-46; 104, 133-134) — undefined behaviour; role M is
   not reliably denied.
3. `POST /api/crypto/pqc/mldsa/verify`: a failed verification passes the raw negative library error to
   the HTTP helper, producing a non-standard status line (e.g. `HTTP/1.1 795`) instead of 406 as
   `exdsa/verify` does (api_crypto.c:2534-2545 vs 700-704). The call at 2534 also passes 8 arguments to a
   7-argument prototype (crypto.h:30).

## Documentation claims removed because the firmware does not behave that way
- 406 on `POST /api/auth/ext/init` and `/mac`; 418 on `hmac/hash` and `keymgmt/delete`; 406 on
  `mldsa/verify`; 400 on `keymgmt/list*`; 400/406/409 on `GET /api/system/config` (they belong to POST);
  403/409 on `GET /api/system/selftest`; body field `exp` on `POST /api/auth/ext/request` (the token
  lifetime is fixed by the device: 60 min, 15 min for a crypto scope — api_auth.c:1296-1316, 1495).
