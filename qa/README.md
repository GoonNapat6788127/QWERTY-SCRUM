# QA — Sprint 1

API tests for the Sprint 1 stories. They call the running website. They do not start it.

| File | What it is |
|---|---|
| `requirements.txt` | Library list: `pytest` and `requests` |
| `api/helpers.py` | Shared library: login, demo accounts, donation payload, Bangkok time |
| `api/conftest.py` | Runs once before the suite and resets demo food-bank capacity |
| `api/test-us1a-log-donation.py` | US1a. Meeting 3 starts it. Meeting 4 reports the API suite. |
| `api/test-us1b-auto-match.py` | US1b. Meeting 5 reports this QA card. |
| `api/test-us6-pickup-window.py` | US6. Meeting 5 reports this QA card. |
| `api/test-us2a-pickup-status.py` | US2a. Meeting 6 reports this QA card. |
| `api/test-us2b-delivery-proof.py` | US2b. Meeting 6 reports this QA card. |
| `api/test-us5a-receipt.py` | US5a. Meeting 6 reports this QA card. |
| `api/test-us3a-urgent-flag.py` | US3a. Meeting 6 reports this QA card. |
| `api/test-zz-donor-edit-split.py` | US9a edit before pickup, and US9b one log split across food banks. |
| `docs/test-cases-log-donation.md` | US1a cases in words. The automated copy is `test-us1a-log-donation.py`. |
| `pytest.ini` | Puts `api/` on the Python path and collects every `test-*.py` story file |

Do not run `helpers.py` or `conftest.py` by themselves. Pytest loads them. A passing run is **26 passed**.

## 1. Start the website

From the repo root, in one terminal:

```powershell
cd web
npm install
npm run dev
```

Leave that terminal open. The tests expect `http://localhost:3000`.

## 2. Install the QA library

From the repo root, in a second terminal. Use the project virtual environment so `pytest` is the same interpreter you use in the editor:

```powershell
.\.venv\Scripts\python.exe -m pip install -r qa\requirements.txt
```

If `.venv` does not exist yet:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r qa\requirements.txt
```

## 3. Run the tests

From the repo root:

```powershell
.\.venv\Scripts\python.exe -m pytest qa\api -q
```

Or from the `qa` folder:

```powershell
cd qa
..\.venv\Scripts\python.exe -m pytest api -q
```

A full pass looks like:

```text
..........................                                               [100%]
26 passed
```

The first thing the suite does is `POST /api/test/reset`, which restores the demo food banks so matching still has capacity.

## 4. Run one file or one test

From the repo root. Donor edit and the one-log split:

```powershell
.\.venv\Scripts\python.exe -m pytest qa\api\test-zz-donor-edit-split.py -q
```

One case. `edit_before_pickup` is TC-US9a-01. `split_across_banks` is TC-US9b-04.

```powershell
.\.venv\Scripts\python.exe -m pytest qa\api\test-zz-donor-edit-split.py -q -k edit_before_pickup
.\.venv\Scripts\python.exe -m pytest qa\api\test-zz-donor-edit-split.py -q -k split_across_banks
```

Case numbers for Sprint 2 are in `docs/sprint-2-tdd-report.md`.

## Other address

If the site is not on port 3000:

```powershell
$env:BASE_URL = "http://localhost:3000"
.\.venv\Scripts\python.exe -m pytest qa\api -q
```

Demo passwords used by `helpers.py`: `donor@qwerty.test` / `donor123`, `driver@qwerty.test` / `driver123`, `foodbank@qwerty.test` / `foodbank123`, `logistics@qwerty.test` / `logistics123`.
