import os
import sys
import json
import hashlib
from pathlib import Path
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes, serialization

def verify_manifest():
    root = Path(__file__).parent.resolve()
    manifest_path = root / "MANIFEST.json"
    sig_path = root / "MANIFEST.json.sig"
    pub_key_path = root / "public_key.pem"

    if not (manifest_path.exists() and sig_path.exists() and pub_key_path.exists()):
        print("[!] Verification failed: Missing MANIFEST.json, MANIFEST.json.sig, or public_key.pem")
        return False

    # 1. Verify RSA Digital Signature
    print("[*] Step 1: Verifying RSA-4096 Digital Signature...")
    with open(pub_key_path, "rb") as f:
        pub_key = serialization.load_pem_public_key(f.read())

    with open(manifest_path, "rb") as f:
        manifest_bytes = f.read()

    with open(sig_path, "rb") as f:
        signature = f.read()

    try:
        pub_key.verify(
            signature,
            manifest_bytes,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        print("    [SUCCESS] Digital Signature is AUTHENTIC and VALID.")
    except Exception as e:
        print(f"    [FAIL] Digital Signature verification failed: {e}")
        return False

    # 2. Verify File Integrity (SHA-256 Checksums)
    print("[*] Step 2: Verifying File Integrities (SHA-256)...")
    manifest = json.loads(manifest_bytes.decode("utf-8"))
    files = manifest.get("files", {})

    all_passed = True
    for rel_path, file_meta in files.items():
        file_path = root / rel_path
        if not file_path.exists():
            print(f"    [MISSING] File missing: {rel_path}")
            all_passed = False
            continue

        sha = hashlib.sha256()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                sha.update(chunk)
        calc_hash = sha.hexdigest()

        if calc_hash.lower() != file_meta["sha256"].lower():
            print(f"    [CORRUPTED] Hash mismatch for {rel_path}")
            print(f"      Expected: {file_meta['sha256']}")
            print(f"      Got:      {calc_hash}")
            all_passed = False
        else:
            print(f"    [OK] {rel_path}")

    if all_passed:
        print("\n[===> AUTHENTICITY & INTEGRITY VERIFIED 100% SUCCESS <===]")
        return True
    else:
        print("\n[!] INTEGRITY VERIFICATION FAILED FOR ONE OR MORE FILES.")
        return False

if __name__ == "__main__":
    success = verify_manifest()
    sys.exit(0 if success else 1)
