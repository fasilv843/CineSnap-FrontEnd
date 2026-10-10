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
    avatar = page.get_by_role('button', name='Account menu')
    check('nav shows logged-in account menu (userDetails signal)', avatar.count() > 0)
    check('home hero renders featured movies (rxResource)', page.locator('section[aria-label="Featured movies"] img').count() > 0)
    avatar.click()
    menu = page.get_by_role('menuitem').all_inner_texts()
    check('account menu lists bookings and logout', 'My bookings' in menu and 'Log out' in menu)
    page.keyboard.press('Escape')

    page.goto(f'{BASE}/user/profile')
    page.wait_for_timeout(1500)
    name = page.locator('#profile-name').inner_text().strip()
    check('profile shows user from store (signal)', name != '', name)

    page.get_by_role('button', name='Add money').click()
    page.wait_for_selector('#wallet-amount', timeout=5000)
    modal = page.locator('.cdk-overlay-container')
    modal.locator('button', has_text='500').click()
    modal.get_by_role('button', name='Continue to payment').click()
    iframe = page.wait_for_selector('iframe.razorpay-checkout-frame', timeout=15000, state='attached')
    check('wallet modal opens Razorpay checkout', iframe is not None)
    page.goto(f'{BASE}/user/profile')

    page.goto(f'{BASE}/user/theaters')
    page.wait_for_timeout(2500)
    all_theaters = page.get_by_role('link', name='See shows').count()
    # Search for whichever theater is listed first; the list depends on the browser's location
    first_name = page.locator('section[aria-label="Theaters"] h2').first.inner_text().strip()
    page.get_by_placeholder('Search by name or place').fill(first_name)
    page.wait_for_timeout(1000)
    narrowed = page.get_by_role('link', name='See shows').count()
    check('theaters search narrows the list and sets ?q=', 0 < narrowed < all_theaters and 'q=' in page.url,
          f'"{first_name}": {all_theaters} -> {narrowed}')

    page.goto(f'{BASE}/user/messages/{THEATER_ID}')
    page.wait_for_timeout(2500)
    chat = page.get_by_role('region', name='Chat')
    check('messages opens a theater chat from the URL',
          chat.get_by_role('heading', name='QA Theater').count() > 0 and chat.locator('#chat-draft').count() > 0)

    page.goto(f'{BASE}/user/profile/edit/x')
    page.wait_for_timeout(1500)
    check('edit profile form prefilled (effect)', page.input_value('[formControlName="name"]') == name)

    # Theater page: the QA show is on 2026-10-11; picking its time opens the seat map
    page.goto(f'{BASE}/user/theater/{THEATER_ID}?date=2026-10-11')
    page.wait_for_timeout(2500)
    showtime = page.locator('button.showtime').first
    check('theater page lists showtimes for the chosen day', showtime.count() > 0)
    if showtime.count() > 0:
        showtime.click()
        page.wait_for_timeout(1500)
        check('showtime opens the seat page', f'/user/show/seats/{SHOW_SEAT_ID}' in page.url, page.url)

    # Bookings: client-side table with tabs, sorting and pagination in the URL
    page.goto(f'{BASE}/user/bookings/x?tab=all')
    page.wait_for_timeout(2500)
    rows = page.locator('table.data-table tbody tr').count()
    summary = page.get_by_text(re.compile(r'Showing \d+–\d+ of \d+')).first.inner_text() if rows else ''
    check('bookings table renders with a pagination summary', rows > 0 and 'of' in summary, f'{rows} rows, {summary}')
    page.locator('cs-pagination select').select_option('20')
    page.wait_for_timeout(800)
    check('rows per page updates the URL', 'limit=20' in page.url, page.url)

    # Wallet history: pages come from the server
    page.goto(f'{BASE}/user/profile/wallet-history?page=1&limit=10')
    page.wait_for_timeout(2500)
    check('wallet history table renders', page.locator('table.data-table tbody tr').count() > 0)

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
