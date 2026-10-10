"""End-to-end checks for the main user/theater flows.

Usage: python -I e2e/flows.py   (needs `ng serve` on :4200, the backend on :3000 and mongosh on PATH)

The booking step writes to the dev database: it books one seat of the QA show
and pays with the QA user's wallet (topped up first, then restored).
"""
import pathlib
import re
import shutil
import subprocess
import sys

from playwright.sync_api import sync_playwright

BASE = 'http://localhost:4200'
PASSWORD = 'Test@1234'
USER_EMAIL = 'qa.user.cinesnap@example.com'
THEATER_EMAIL = 'qa.theater.cinesnap@example.com'
THEATER_ID = '6ac9cfe4831c6ea7f502223f'
SHOW_ID = '6ac9d07d831c6ea7f5022298'
SHOW_SEAT_ID = '6ac9d07c831c6ea7f5022262'

BACKEND_ENV = pathlib.Path(__file__).resolve().parents[2] / 'CineSnap-BackEnd' / '.env.development'
results = []


def check(name, ok, detail=''):
    results.append(ok)
    print(f'{"OK " if ok else "ERR"} {name}' + (f'  ({detail})' if detail else ''))


def report_errors(area, errors):
    check(f'no runtime errors ({area})', not errors)
    for e in errors[:3]:
        print('      ' + e[:600].replace('\n', '\n      '))


def mongo(js):
    uri = next(line.split('=', 1)[1].strip().strip('"')
               for line in BACKEND_ENV.read_text().splitlines() if line.startswith('MONGO_URI'))
    out = subprocess.run([shutil.which('mongosh'), uri, '--quiet', '--eval', js],
                         capture_output=True, text=True, stdin=subprocess.DEVNULL, timeout=60, check=True)
    return out.stdout.strip()


def login(page, role, email):
    page.goto(f'{BASE}/{role}/login')
    page.fill('[formControlName="email"]', email)
    page.fill('[formControlName="password"]', PASSWORD)
    page.click('button[type="submit"]')
    page.wait_for_url(lambda url: '/login' not in url, timeout=15000)


def new_page(browser):
    page = browser.new_context().new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('console', lambda m: errors.append(m.text)
            if m.type == 'error' and re.search(r'NG0|NullInjector|TypeError', m.text) else None)
    return page, errors


def user_flows(browser):
    page, errors = new_page(browser)
    login(page, 'user', USER_EMAIL)

    page.goto(f'{BASE}/user/home')
    page.wait_for_timeout(2000)
    avatar = page.locator('div[routerLink="/user/profile"]').first
    check('nav shows logged-in avatar (userDetails signal)', avatar.count() > 0)
    check('home carousel renders slides (signal input)', page.locator('app-carousel img').count() > 0)

    page.goto(f'{BASE}/user/profile')
    page.wait_for_timeout(1500)
    name = page.locator('h2:has-text("Name:") span').first.inner_text().strip()
    check('profile shows user from store (effect)', name != '', name)

    page.click('text=Add to Wallet')
    page.wait_for_selector('#amount', timeout=5000)
    modal = page.locator('.cdk-overlay-container')
    modal.locator('button', has_text='500').click()
    modal.get_by_role('button', name='Add', exact=True).click()
    iframe = page.wait_for_selector('iframe.razorpay-checkout-frame', timeout=15000, state='attached')
    check('wallet modal opens Razorpay checkout', iframe is not None)
    page.goto(f'{BASE}/user/profile')

    page.goto(f'{BASE}/user/profile/edit/x')
    page.wait_for_timeout(1500)
    check('edit profile form prefilled (effect)', page.input_value('[formControlName="name"]') == name)

    # Booking: seats -> book -> coupon -> pay with wallet
    wallet_before = mongo(f'db.users.findOne({{email:"{USER_EMAIL}"}}).wallet')
    mongo(f'db.users.updateOne({{email:"{USER_EMAIL}"}}, {{$set: {{wallet: 1000}}}})')
    try:
        # Re-login so the store holds the topped-up wallet
        page.evaluate('localStorage.clear()')
        login(page, 'user', USER_EMAIL)
        # bookTicket() needs the show details, which load asynchronously
        with page.expect_response(lambda r: f'/show/get/{SHOW_ID}' in r.url, timeout=15000):
            page.goto(f'{BASE}/user/show/seats/{SHOW_SEAT_ID}?showId={SHOW_ID}&theaterId={THEATER_ID}')
        page.wait_for_selector('a > .seat', timeout=10000)
        seat = page.locator('a > .seat:not(.booked)').first
        seat_name = seat.inner_text().strip()
        seat.click()
        check('seat selection marks seat', 'selected' in (seat.get_attribute('class') or ''), seat_name)

        with page.expect_response(lambda r: '/applicable-coupons/' in r.url, timeout=15000) as coupons_res:
            page.click('button:has-text("Book")')
            page.wait_for_url(re.compile(r'/user/show/book/\w+'), timeout=15000)
        coupons = (coupons_res.value.json().get('data') or [])
        page.wait_for_timeout(500)
        page.wait_for_selector('text=Wallet', timeout=10000)
        check('booking page shows wallet from store (effect)', page.locator('text=Wallet 1000').count() > 0)

        apply_btn = page.locator('button:has-text("Apply")')
        if apply_btn.count() > 0:
            apply_btn.first.click()
            check('coupon applies', page.locator('button:has-text("Applied")').count() > 0)
        else:
            check('coupon suggestion shown', False, f'no Apply button; API returned {len(coupons)} coupon(s)')

        page.check('input[type="radio"][value="Wallet"]')
        page.click('button[type="submit"]:has-text("Pay")')
        page.wait_for_url(re.compile(r'/user/show/book/success/\w+'), timeout=15000)
        check('pay with wallet reaches success page', True, seat_name)
    finally:
        mongo(f'db.users.updateOne({{email:"{USER_EMAIL}"}}, {{$set: {{wallet: {wallet_before}}}}})')

    report_errors('user', errors)


def theater_flows(browser):
    page, errors = new_page(browser)
    login(page, 'theater', THEATER_EMAIL)

    page.goto(f'{BASE}/theater/home')
    page.wait_for_selector('canvas', timeout=10000)
    check('revenue chart renders', page.locator('canvas').count() > 0)

    page.goto(f'{BASE}/theater/screens')
    page.wait_for_timeout(1500)
    check('screens list loads for theater (one-shot store read)', page.locator('text=QA Screen').count() > 0)

    page.goto(f'{BASE}/theater/shows')
    page.wait_for_timeout(1000)
    page.click('button:has-text("+")')
    page.wait_for_selector('select#screen', timeout=5000)
    page.wait_for_timeout(1500)
    options = page.locator('select#screen option').all_inner_texts()
    check('show modal lists theater screens', any('QA Screen' in o for o in options), ', '.join(options))

    page.goto(f'{BASE}/theater/profile')
    page.wait_for_timeout(1500)
    check('theater profile shows store data (effect)', page.locator('text=QA Theater').count() > 0)

    report_errors('theater', errors)


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        print('--- user')
        user_flows(browser)
        print('--- theater')
        theater_flows(browser)
        browser.close()
    failures = results.count(False)
    print(f'\n{failures} failure(s)')
    return failures


if __name__ == '__main__':
    sys.exit(1 if run() else 0)
